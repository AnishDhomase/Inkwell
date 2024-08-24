import { useEffect, useRef, useState } from "react";
import {
  Blog,
  getAllBlogs,
  getAllTopics,
  getBlogsOfTopic,
  Topic,
} from "../../apis/api";
import styled from "styled-components";

import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardDoubleArrowDownIcon from "@mui/icons-material/KeyboardDoubleArrowDown";
import BlogCardSkeletonLoader from "../../components/BlogCardSkeleton";
import Blogs from "../../components/Blogs";

const Explore = styled.div`
  user-select: none;
  width: 100%;
  /* padding: 20px; */
  padding-bottom: 10px;
  display: flex;
  flex-direction: column;
  gap: 10px;
  overflow: visible;
  h1 {
    font-size: 25px;
    font-weight: 900;
    color: #333;
  }
  /* main {
    display: flex;
    gap: 10px;
  } */
`;
interface TopicBtnProps {
  active: boolean;
}
const TopicBtn = styled.button<TopicBtnProps>`
  flex: 0 0 auto;
  margin-right: 10px;
  margin-bottom: 10px;
  padding: 8px 15px;
  white-space: nowrap;
  background-color: ${(props) => (props.active ? "#ff7738" : "#f9f9f9")};
  color: ${(props) => (props.active ? "white" : "#333")};
  font-size: 18px;
  border: 1px solid ${(props) => (props.active ? "#ff7738" : "#333")};
  border-radius: 50px;
  &:hover {
    cursor: pointer;
    scale: 1.015;
  }
  &:active {
    opacity: 0.8;
  }
`;
const ScrollContainer = styled.div`
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
`;
const TopicBtnWrapper = styled.div`
  display: inline-flex;
  flex-wrap: nowrap;
  width: max-content;
`;
const Sort = styled.div`
  /* padding: 5px 20px; */
  display: flex;
  gap: 10px;
  /* background-color: #f9f9f9; */
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

export default function Home({ selfDetails }: { selfDetails: object }) {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [topics, setTopics] = useState<Topic[]>([]);
  const [activeTopic, setActiveTopic] = useState<number>(-1);
  const [sortBy, setSortBy] = useState<SortOption>("newest");
  const [activePageNumber, setActivePageNumber] = useState<number>(1);
  const [totalAvlBlogsCount, setTotalAvlBlogsCount] = useState<number>(0);
  const [mouseOnReadmore, setMouseOnReadmore] = useState<boolean>(false);
  const [loadingBlogs, setLoadingBlogs] = useState<boolean>(false);

  // const sortBlogs = sortBlogsBy(sortBy, blogs);
  const isThereMoreBlogsToLoad = totalAvlBlogsCount > blogs?.length;

  // When sortBy/activeTopic changes, reset activePageNumber to 1
  useEffect(() => {
    setActivePageNumber(1);
  }, [sortBy, activeTopic]);

  // Fetching all topics and blogs
  useEffect(() => {
    async function fetchBlogs() {
      let blogArray = [],
        countOfAvlBlogs = 0;
      if (activeTopic === -1) {
        const { blogArr, totalBlogsCount } = await getAllBlogs({
          currentPage: 1,
          sortBy,
        });
        blogArray = blogArr;
        countOfAvlBlogs = totalBlogsCount;
      } else {
        const { blogArr, totalBlogsCount } = await getBlogsOfTopic(
          {
            currentPage: 1,
            sortBy,
          },
          topics[activeTopic].name
        );
        blogArray = blogArr;
        countOfAvlBlogs = totalBlogsCount;
      }
      setBlogs(blogArray);
      setTotalAvlBlogsCount(countOfAvlBlogs);
    }
    fetchBlogs();
  }, [activeTopic, topics, sortBy]);
  useEffect(() => {
    async function fetchAllTopics() {
      const topicArr = await getAllTopics();
      setTopics(topicArr);
    }
    fetchAllTopics();
  }, []);

  // Horizontal scroll when mouse wheel is used in ScrollContainer
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const scrollContainerRef1 = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const container = scrollContainerRef.current;
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
    if (activeTopic === -1) {
      const { blogArr } = await getAllBlogs({
        currentPage: activePageNumber + 1,
        sortBy,
      });
      blogArray = blogArr;
    } else {
      const { blogArr } = await getBlogsOfTopic(
        {
          currentPage: 1,
          sortBy,
        },
        topics[activeTopic].name
      );
      blogArray = blogArr;
    }
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
        <Explore>
          <h1>Explore</h1>
          <ScrollContainer ref={scrollContainerRef}>
            <TopicBtnWrapper>
              <TopicBtn
                active={activeTopic === -1}
                onClick={() => setActiveTopic(-1)}
              >
                All
              </TopicBtn>
              {topics.map((topic, ind) => (
                <TopicBtn
                  key={topic.id}
                  active={activeTopic === ind}
                  onClick={() => setActiveTopic(ind)}
                >
                  {topic.name}
                </TopicBtn>
              ))}
            </TopicBtnWrapper>
          </ScrollContainer>
        </Explore>
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
    </div>
  );
}
