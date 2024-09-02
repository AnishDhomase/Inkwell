import { useEffect, useRef, useState } from "react";
import {
  Blog,
  getAllTopics,
  getQueriedBlogs,
  getQueriedUsers,
  Topic,
} from "../../apis/api";
import styled from "styled-components";
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
const SearchForBox = styled.div`
  display: flex;
  justify-content: center;
  gap: 8px;
  font-size: 16px;
  color: #7b7a7a;
  margin-bottom: 25px;
`;
interface TopicBtnProps {
  active?: boolean;
}
const TextBtn = styled.button<TopicBtnProps>`
  color: ${(props) => (props.active ? "#3856ff" : "#2c2828")};
  text-decoration: ${(props) => (props.active ? "underline" : "none")};
  border: none;
  background-color: transparent;
  font-size: 18px;
  font-weight: 700;
  cursor: pointer;
  &:active {
    opacity: 0.8;
  }
`;
const SearchStatusBox = styled.div`
  display: flex;
  justify-content: center;
  font-size: 20px;
  color: #ff7738;
  margin-top: 100px;
`;

type SortOption = "newest" | "oldest" | "popular";
const SortOptionsArr: SortOption[] = ["newest", "oldest", "popular"];
enum SearchStatus {
  noSearchYet,
  noResultFound,
  resultFound,
}

import { RiSearchLine } from "react-icons/ri";
import Blogs from "../../components/Blogs";
import { Link, useLocation } from "react-router-dom";
import toast from "react-hot-toast";
import UserSearchCard from "../../components/UserSearchCard";
import { useUserDetails } from "../../context/UserDetailContext";

export default function Search() {
  const { selfDetails, setSelfDetails, setNotifications } = useUserDetails();
  const categoryOfSearch = useLocation().pathname.split("/")[3];
  const [searchFor, setSearchFor] = useState<string>(categoryOfSearch);
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [topics, setTopics] = useState<Topic[]>([]);
  const [query, setQuery] = useState<string>("");
  const [sortBy, setSortBy] = useState<SortOption>("newest");
  const [activePageNumber, setActivePageNumber] = useState<number>(1);
  const [totalAvlBlogsCount, setTotalAvlBlogsCount] = useState<number>(0);
  const [mouseOnReadmore, setMouseOnReadmore] = useState<boolean>(false);
  const [loadingBlogs, setLoadingBlogs] = useState<boolean>(false);
  const [searchFeedback, setSearchFeedback] = useState<SearchStatus>(
    SearchStatus.noSearchYet
  );
  const [users, setUsers] = useState([]);
  const [totalAvlUsersCount, setTotalAvlsetUsersCount] = useState<number>(0);
  console.log(users, totalAvlUsersCount);

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

  // Reset searchFeedback when searchFor changes
  useEffect(() => {
    setSearchFeedback(SearchStatus.noSearchYet);
  }, [searchFor]);

  // handle search
  async function handleSearch() {
    if (!query.trim()) {
      toast.error("Please enter a search query");
      return;
    }
    if (searchFor === "blogs") {
      let blogArray = [],
        countOfAvlBlogs = 0;
      const { blogArr, totalBlogsCount } = await getQueriedBlogs({
        currentPage: 1,
        sortBy,
        query,
      });
      blogArray = blogArr;
      countOfAvlBlogs = totalBlogsCount;
      if (!blogArray.length) setSearchFeedback(SearchStatus.noResultFound);
      else setSearchFeedback(SearchStatus.resultFound);

      setBlogs(blogArray);
      setTotalAvlBlogsCount(countOfAvlBlogs);
    } else {
      let userArray = [],
        countOfAvlUsers = 0;
      const { userArr, totalUsersCount } = await getQueriedUsers({
        currentPage: 1,
        query,
      });
      userArray = userArr;
      countOfAvlUsers = totalUsersCount;
      if (!userArr.length) setSearchFeedback(SearchStatus.noResultFound);
      else setSearchFeedback(SearchStatus.resultFound);

      setUsers(userArray);
      setTotalAvlsetUsersCount(countOfAvlUsers);
    }
  }
  useEffect(() => {
    if (searchFor === "blogs" && query === "" && blogs.length === 0)
      setSearchFeedback(SearchStatus.noSearchYet);
    else if (searchFor === "users" && query === "" && users.length === 0)
      setSearchFeedback(SearchStatus.noSearchYet);
  }, [query, searchFor, blogs, users]);
  function getSearchStatus() {
    if (searchFeedback === SearchStatus.noSearchYet) {
      return `Start Searching for ${searchFor}!`;
    } else if (searchFeedback === SearchStatus.noResultFound) {
      return `No results found!`;
    }
    return "";
  }
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
        <SearchForBox>
          <p>Search for</p>
          <Link to="/app/search/blogs" onClick={() => setSearchFor("blogs")}>
            <TextBtn active={searchFor === "blogs"}>Blogs</TextBtn>
          </Link>
          <Link to="/app/search/users" onClick={() => setSearchFor("users")}>
            <TextBtn active={searchFor === "users"}>Users</TextBtn>
          </Link>
        </SearchForBox>
        <SearchBox>
          <Input
            type="text"
            placeholder="Search here . . ."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <SearchBtn onClick={handleSearch}>
            <RiSearchLine />
          </SearchBtn>
        </SearchBox>
        {searchFor === "blogs" && (
          <Sort>
            <ScrollContainer ref={scrollContainerRef1}>
              <TopicBtnWrapper>
                {SortOptionsArr.map((option) => (
                  <SortOption
                    onClick={() => setSortBy(option)}
                    active={sortBy === option}
                  >
                    {option === "popular"
                      ? "Most Popular"
                      : option.charAt(0).toUpperCase() +
                        option.slice(1) +
                        " First"}
                  </SortOption>
                ))}
              </TopicBtnWrapper>
            </ScrollContainer>
          </Sort>
        )}

        {/* blogs */}
        <>
          {searchFor === "blogs" &&
            searchFeedback === SearchStatus.resultFound && (
              <Blogs blogs={blogs} userBlogs={userBlogs} />
            )}

          {isThereMoreBlogsToLoad && searchFor === "blogs" && (
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

        {/* users */}
        <>
          {searchFor === "users" &&
            searchFeedback === SearchStatus.resultFound && (
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "30px",
                  width: "100%",
                  maxWidth: "450px",
                  margin: "0 auto",
                  marginTop: "50px",
                }}
              >
                {users.map((user) => (
                  <UserSearchCard
                    selfDetails={selfDetails}
                    user={user}
                    setSelfDetails={setSelfDetails}
                    setNotifications={setNotifications}
                  />
                ))}
              </div>
            )}
        </>

        {searchFeedback !== SearchStatus.resultFound && (
          <SearchStatusBox>{getSearchStatus()}</SearchStatusBox>
        )}
      </>
    </div>
  );
}
