import React, { useEffect, useRef, useState } from "react";
import {
  Blog,
  getAllBlogs,
  getAllTopics,
  getBlogsOfTopic,
  getQueriedBlogs,
  likeBlog,
  saveBlog,
  Topic,
  unlikeBlog,
  unsaveBlog,
} from "../../apis/api";
import styled from "styled-components";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import BookmarkBorderIcon from "@mui/icons-material/BookmarkBorder";
import FavoriteIcon from "@mui/icons-material/Favorite";
import BookmarkIcon from "@mui/icons-material/Bookmark";
import CommentIcon from "@mui/icons-material/Comment";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardDoubleArrowDownIcon from "@mui/icons-material/KeyboardDoubleArrowDown";

const SearchBox = styled.div`
  margin: 0 auto;
  position: relative;
  gap: 10px;
  width: 100%;
  max-width: 450px;
`;

const SearchBtn = styled.button`
  background-color: #ff7738;
  color: white;
  padding: 10px 13px;
  right: 0;
  top: 0;
  bottom: 0;
  margin: auto 0;
  position: absolute;
  font-size: 18px;
  border: none;
  border-radius: 50px;
  display: flex;
  align-items: center;
  justify-content: center;
  &:hover {
    cursor: pointer;
    scale: 1.015;
  }
  &:active {
    opacity: 0.8;
  }
`;
const Input = styled.input`
  font-weight: 500;
  border-radius: 50px;
  padding: 12px 18px;
  padding-right: 60px;
  width: 100%;
  background-color: transparent;
  background-color: #f5f2f2;

  border: 1px solid gray;
  outline: none;

  font-size: 18px;
  &:focus {
    border: 1px solid #ff7738;
  }
  @media (min-width: 1250px) {
    & {
      font-size: 25px;
    }
  }
`;
const ScrollContainer = styled.div`
  display: flex;
  justify-content: center;
  width: 100%;
  overflow-x: auto;
  overflow-y: hidden;
  white-space: nowrap;
  -webkit-overflow-scrolling: touch;
  &::-webkit-scrollbar {
    display: none;
  }
  scrollbar-width: none;
  position: relative;
  @media (max-width: 450px) {
    display: block;
  }
`;
const TopicBtnWrapper = styled.div`
  display: inline-flex;
  flex-wrap: nowrap;
  width: max-content;
`;
const Sort = styled.div`
  display: flex;
  gap: 10px;
  padding-top: 10px;
`;
interface SortOptionProps {
  active: boolean;
}
const SortOption = styled.button<SortOptionProps>`
  padding: 3px 10px;
  background-color: #f9f9f9;
  color: ${(props) => (props.active ? "#3856ff" : "#333")};
  font-size: 18px;
  border: 1px solid ${(props) => (props.active ? "#3856ff" : "#333")};
  border-radius: 10px;
  margin-right: 10px;
  &:hover {
    cursor: pointer;
    scale: 1.015;
  }
  &:active {
    opacity: 0.8;
  }
`;
const BlogBox = styled.div`
  display: flex;
  flex-direction: column;
  gap: 35px;
  padding: 45px 0;
`;
const BlogCard = styled.div`
  width: 100%;
  /* border-radius: 10px; */
  display: flex;
  gap: 15px;
  border-bottom: 1px solid #efe9e9;
  padding-bottom: 35px;
  &:hover {
    cursor: pointer;
  }
  &:hover h3 {
    color: #0c1a6b;
    text-decoration: underline;
  }
`;
interface LeftBlogSecProps {
  imageURL: string;
}
const LeftBlogSec = styled.div<LeftBlogSecProps>`
  width: 40%;
  min-height: 160px;
  border-radius: 10px;
  position: relative;
  background-image: url(${(props) => props.imageURL});
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  border: 1px solid #393939;
  span {
    position: absolute;
    left: 10px;
    border-radius: 50px;
    padding: 5px;
    display: flex;
    cursor: pointer;
    background-color: #f9f9f9;
    border: 1px solid #333;
  }
`;
const Like = styled.span`
  top: 10px;
`;
const Save = styled.span`
  top: 50px;
`;
const RightBlogSec = styled.div`
  width: 60%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 10px;
  h3 {
    font-size: 20px;
    font-weight: 700;
    color: #333;
  }
  section {
    display: flex;
    align-items: center;
    gap: 10px;
    font-size: 18px;
    color: #a38d8d;
  }
`;
const StatChip = styled.div`
  color: #000000;
  display: flex;
  align-items: center;
  gap: 5px;
  span {
    font-size: 18px;
  }
`;
const TextButton = styled.button`
  display: flex;
  flex-direction: column;
  align-items: center;
  color: #ff7738;
  width: auto;
  margin: 0 auto;
  margin-top: 20px;
  font-size: 18px;
  border: none;
  background-color: transparent;
  b {
    transform: translateY(-5px);
  }
  &:hover {
    cursor: pointer;
    color: #3856ff;
  }
  &:hover b {
    transform: translateY(0px);
  }
`;
type SortOption = "newest" | "oldest" | "popular";
import { RiSearchLine } from "react-icons/ri";
import Blogs from "../../components/Blogs";
import BlogCardSkeletonLoader from "../../components/BlogCardSkeleton";

export default function Search({ selfDetails }: { selfDetails: object }) {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [topics, setTopics] = useState<Topic[]>([]);
  const [query, setQuery] = useState<string>("");
  const [sortBy, setSortBy] = useState<SortOption>("newest");
  const [activePageNumber, setActivePageNumber] = useState<number>(1);
  const [totalAvlBlogsCount, setTotalAvlBlogsCount] = useState<number>(0);
  const [mouseOnReadmore, setMouseOnReadmore] = useState<boolean>(false);
  const [loadingBlogs, setLoadingBlogs] = useState<boolean>(false);

  const isThereMoreBlogsToLoad = totalAvlBlogsCount > blogs?.length;

  // When sortBy/query changes, reset activePageNumber to 1
  useEffect(() => {
    setActivePageNumber(1);
  }, [sortBy, query]);

  // Fetching all topics
  useEffect(() => {
    async function fetchAllTopics() {
      const topicArr = await getAllTopics();
      setTopics(topicArr);
    }
    fetchAllTopics();
  }, []);
  // Fetching all blogs again when sortBy changes
  useEffect(() => {
    async function fetchAllBlogs() {
      if (!query) return;
      let blogArray = [],
        countOfAvlBlogs = 0;
      const { blogArr, totalBlogsCount } = await getQueriedBlogs({
        currentPage: 1,
        sortBy,
        query,
      });
      blogArray = blogArr;
      countOfAvlBlogs = totalBlogsCount;

      setBlogs(blogArray);
      setTotalAvlBlogsCount(countOfAvlBlogs);
    }
    fetchAllBlogs();
  }, [sortBy]);

  // handle search
  async function handleSearch() {
    if (!query) {
      toast.error("Please enter a search query");
      return;
    }
    let blogArray = [],
      countOfAvlBlogs = 0;
    const { blogArr, totalBlogsCount } = await getQueriedBlogs({
      currentPage: 1,
      sortBy,
      query,
    });
    blogArray = blogArr;
    countOfAvlBlogs = totalBlogsCount;

    setBlogs(blogArray);
    setTotalAvlBlogsCount(countOfAvlBlogs);
  }

  // Horizontal scroll when mouse wheel is used in ScrollContainer
  const scrollContainerRef1 = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const container = scrollContainerRef1.current;
    if (container) {
      const handleWheel = (event: WheelEvent) => {
        event.preventDefault();
        const scrollSpeed = 0.8;
        container.scrollLeft += event.deltaY * scrollSpeed;
      };

      container.addEventListener("wheel", handleWheel, { passive: false });

      return () => {
        container.removeEventListener("wheel", handleWheel);
      };
    }
  }, []);

  //  Read more button
  async function handleReadMore() {
    setLoadingBlogs(() => true);
    let blogArray = [];

    const { blogArr } = await getQueriedBlogs({
      currentPage: activePageNumber + 1,
      sortBy,
      query,
    });
    blogArray = blogArr;

    setBlogs((prev) => [...prev, ...blogArray]);
    setLoadingBlogs(() => false);
    setActivePageNumber((prev) => prev + 1);
  }

  const userBlogs = {
    liked: selfDetails?.likedBlogs?.map((blog: Blog) => blog.id) || [],
    saved: selfDetails?.savedBlogs?.map((blog: Blog) => blog.id) || [],
  };

  return (
    <div>
      <>
        <SearchBox>
          <Input
            type="text"
            placeholder="Search for blogs"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <SearchBtn onClick={handleSearch}>
            <RiSearchLine />
          </SearchBtn>
        </SearchBox>
        <Sort>
          <ScrollContainer ref={scrollContainerRef1}>
            <TopicBtnWrapper>
              <SortOption
                onClick={() => setSortBy("newest")}
                active={sortBy === "newest"}
              >
                Newest First
              </SortOption>
              <SortOption
                onClick={() => setSortBy("oldest")}
                active={sortBy === "oldest"}
              >
                Oldest First
              </SortOption>
              <SortOption
                onClick={() => setSortBy("popular")}
                active={sortBy === "popular"}
              >
                Most Popular
              </SortOption>
            </TopicBtnWrapper>
          </ScrollContainer>
        </Sort>

        {blogs.length > 0 && (
          <>
            <Blogs blogs={blogs} userBlogs={userBlogs} />
            {loadingBlogs && <BlogCardSkeletonLoader />}
            {isThereMoreBlogsToLoad && (
              <TextButton
                onMouseEnter={() => setMouseOnReadmore(true)}
                onMouseLeave={() => setMouseOnReadmore(false)}
                onClick={handleReadMore}
              >
                <span>Read More</span>
                <b>
                  {mouseOnReadmore ? (
                    <KeyboardDoubleArrowDownIcon />
                  ) : (
                    <KeyboardArrowDownIcon />
                  )}
                </b>
              </TextButton>
            )}
          </>
        )}
      </>
    </div>
  );
}
