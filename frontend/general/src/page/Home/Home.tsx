import React, { useEffect, useState } from "react";
import { Blog, getAllBlogs, getAllTopics, Topic } from "../../apis/api";
import PersonIcon from "@mui/icons-material/Person";
import NotificationsIcon from "@mui/icons-material/Notifications";
import Badge from "@mui/material/Badge";
import IconButton from "@mui/material/IconButton";
import styled from "styled-components";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import BookmarkBorderIcon from "@mui/icons-material/BookmarkBorder";
import FavoriteIcon from "@mui/icons-material/Favorite";
import BookmarkIcon from "@mui/icons-material/Bookmark";
import CommentIcon from "@mui/icons-material/Comment";

const Nav = styled.nav`
  padding: 10px 20px;
  display: flex;
  justify-content: space-between;
  background-color: #f9f9f9;
  @media (max-width: 480px) {
    padding: 10px 10px;
  }
`;
const Logo = styled.h1`
  font-size: 30px;
  font-weight: 800;
  color: #ff7738;
  font-family: cursive;
`;
const RightBox = styled.div`
  display: flex;
  gap: 10px;
`;
const CircleBorder = styled.div`
  border: 1px solid #dcdbdb;
  border-radius: 50%;
`;
const Main = styled.main`
  display: flex;
  justify-content: space-between;
`;
const LeftSec = styled.div`
  width: 65%;
  padding: 20px;
  @media (max-width: 1020px) {
    width: 100%;
  }
  @media (max-width: 480px) {
    padding: 20px 10px;
  }
`;
const RightSec = styled.div`
  width: 35%;
  padding: 20px;
  border-left: 2px solid #f8f5f5;
  @media (max-width: 1020px) {
    display: none;
  }
`;
const Explore = styled.div`
  padding-right: 10px;
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
  -webkit-overflow-scrolling: touch;
  &::-webkit-scrollbar {
    display: none;
  }
  scrollbar-width: none;
`;
const TopicBtnWrapper = styled.div`
  display: inline-flex;
  flex-wrap: nowrap;
`;
const Sort = styled.div`
  /* padding: 5px 20px; */
  margin-right: 10px;
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
const BlogBox = styled.div`
  display: flex;
  flex-direction: column;
  gap: 15px;
  padding: 35px 0;
`;
const BlogCard = styled.div`
  width: 100%;
  border-radius: 10px;
  display: flex;
  gap: 15px;
  &:hover {
    cursor: pointer;
    background-color: #f9f9f9;
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

export default function Home() {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [topics, setTopics] = useState<Topic[]>([]);
  const [activeTopic, setActiveTopic] = useState<number>(-1);
  const [sortBy, setSortBy] = useState<"newest" | "oldest">("newest");
  useEffect(() => {
    async function fetchTopics() {
      const topicsArr = await getAllTopics();
      setTopics(topicsArr);
    }
    fetchTopics();
  }, []);
  useEffect(() => {
    async function fetchAllBlogs() {
      const blogArr = await getAllBlogs({ currentPage: 1 });
      console.log("blogArr", blogArr);
      setBlogs(blogArr);
    }
    fetchAllBlogs();
  }, []);
  const handleWheel = (event: React.WheelEvent<HTMLDivElement>) => {
    const container = event.currentTarget;
    const scrollSpeed = 4;
    const scrollAmount = event.deltaY * scrollSpeed;
    container.scrollTo({
      left: container.scrollLeft + scrollAmount,
      behavior: "smooth",
    });
    event.preventDefault();
  };
  return (
    <div>
      <Nav>
        <Logo>Inkwell</Logo>
        <RightBox>
          <CircleBorder>
            <IconButton aria-label="delete">
              <Badge badgeContent={1} max={9} color="primary">
                <PersonIcon color="action" />
              </Badge>
            </IconButton>
          </CircleBorder>
          <CircleBorder>
            <IconButton aria-label="delete">
              <Badge badgeContent={10} max={9} color="primary">
                <NotificationsIcon color="action" />
              </Badge>
            </IconButton>
          </CircleBorder>
        </RightBox>
      </Nav>
      <Main>
        <LeftSec>
          <Explore>
            <h1>Explore</h1>
            <ScrollContainer onWheel={handleWheel}>
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
          </Sort>
          <Blogs blogs={blogs} />
        </LeftSec>
        <RightSec>ewfwef</RightSec>
      </Main>
    </div>
  );
}

function Blogs({ blogs }: { blogs: Blog[] }) {
  return (
    <BlogBox>
      {blogs.map((blog) => (
        <Card key={blog.id} blog={blog} />
      ))}
    </BlogBox>
  );
}

function Card({ blog }: { blog: Blog }) {
  const [liked, setLiked] = useState<boolean>(false);
  const [saved, setSaved] = useState<boolean>(false);
  //   const { width } = useViewportWidth();
  //   const getShortTitle = (title: string) => {
  //     if (width > 1250)
  //       return title.length > 70 ? title.slice(0, 30) + "..." : title;
  //     else if (width > 1020)
  //       return title.length > 50 ? title.slice(0, 30) + "..." : title;
  //     else if (width > 480)
  //       return title.length > 30 ? title.slice(0, 30) + "..." : title;
  //     else return title.length > 20 ? title.slice(0, 30) + "..." : title;
  //   };
  //   const shortTitle =
  //     blog.title.length > 120 ? blog.title.slice(0, 0) + "..." : blog.title;
  return (
    <BlogCard key={blog.id}>
      <LeftBlogSec
        imageURL={
          blog.blogImageURL || "../../../public/placeholderBlogImage.webp"
        }
      >
        {/* <img src={blog.blogImageURL} alt="blog" /> */}
        <Like onClick={() => setLiked(!liked)}>
          {!liked ? (
            <FavoriteBorderIcon color="action" />
          ) : (
            <FavoriteIcon color="error" />
          )}
        </Like>
        <Save onClick={() => setSaved(!saved)}>
          {!saved ? (
            <BookmarkBorderIcon color="action" />
          ) : (
            <BookmarkIcon color="primary" />
          )}
        </Save>
      </LeftBlogSec>
      <RightBlogSec>
        <section>
          <span>5 min</span>
          <span>2 July</span>
        </section>
        <h3>{blog.title}</h3>

        <section>
          <StatChip>
            <span>123</span>
            <FavoriteIcon style={{ color: "#E74C4F" }} />
          </StatChip>
          <StatChip>
            <span>12</span>
            <CommentIcon style={{ color: "#dab777" }} />
          </StatChip>
        </section>
      </RightBlogSec>
    </BlogCard>
  );
}

// export function useViewportWidth(): number {
//   const [viewportWidth, setViewportWidth] = useState<number>(window.innerWidth);

//   useEffect(() => {
//     const handleResize = () => {
//       setViewportWidth(window.innerWidth);
//     };

//     window.addEventListener("resize", handleResize);

//     return () => {
//       window.removeEventListener("resize", handleResize);
//     };
//   }, []);
//   return viewportWidth;
// }
