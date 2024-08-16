import React, { useEffect, useRef, useState } from "react";
import {
  Blog,
  clearNotifications,
  getAllBlogs,
  getAllTopics,
  getBlogsOfTopic,
  getSelfDetails,
  likeBlog,
  saveBlog,
  Topic,
  unlikeBlog,
  unsaveBlog,
} from "../../apis/api";
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
import { motion, AnimatePresence } from "framer-motion";
import CircularProgress from "@mui/material/CircularProgress";

import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardDoubleArrowDownIcon from "@mui/icons-material/KeyboardDoubleArrowDown";

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
interface NotificationPanelProps {
  noNotifactions: boolean;
}
const NotificationPanel = styled(motion.div)<NotificationPanelProps>`
  min-width: ${(props) => (props.noNotifactions ? "160px" : "300px")};
  position: absolute;
  border: 1px solid #c4bfbf;
  right: 20px;
  border-radius: 10px;
  padding: 10px;
  background-color: #f9f9f9;
  display: flex;
  flex-direction: column;
  align-items: ${(props) => (props.noNotifactions ? "center" : "flex-start")};
  gap: 10px;
`;
const Button = styled.button`
  width: 100%;
  padding: 5px 10px;
  background-color: #ff7738;
  color: white;
  border: none;
  border-radius: 5px;
  &:hover {
    cursor: pointer;
    scale: 1.015;
  }
  &:active {
    opacity: 0.8;
  }
`;
const Notification = styled.div`
  width: 100%;
  border-bottom: 1px solid #e9e2e2;
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
// function sortBlogsBy(sortBy: SortOption, blogs: Blog[]): Blog[] {
//   if (sortBy === "newest") {
//     return blogs.sort((a, b) => {
//       return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
//     });
//   } else if (sortBy === "oldest") {
//     return blogs.sort((a, b) => {
//       return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
//     });
//   } else {
//     return blogs.sort((a, b) => {
//       return b._count.likedByUsers - a._count.likedByUsers;
//     });
//   }
// }

export default function Home() {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [topics, setTopics] = useState<Topic[]>([]);
  const [activeTopic, setActiveTopic] = useState<number>(-1);
  const [sortBy, setSortBy] = useState<SortOption>("newest");
  const [selfDetails, setSelfDetails] = useState<object>({});
  const [isNotificationOpen, setIsNotificationOpen] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [notifications, setNotifications] = useState<string[]>([]);
  const [activePageNumber, setActivePageNumber] = useState<number>(1);
  const [totalAvlBlogsCount, setTotalAvlBlogsCount] = useState<number>(0);
  const [mouseOnReadmore, setMouseOnReadmore] = useState<boolean>(false);

  // const sortBlogs = sortBlogsBy(sortBy, blogs);
  const isThereMoreBlogsToLoad = totalAvlBlogsCount > blogs.length;

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
  //   Fetch self details
  useEffect(() => {
    async function fetchSelfDetails() {
      const details = await getSelfDetails();
      setSelfDetails(details);
      setNotifications(details.notifications);
    }
    fetchSelfDetails();
  }, []);

  // Horizontal scroll when mouse wheel is used in ScrollContainer
  const scrollContainerRef = useRef<HTMLDivElement>(null);
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

  //  Read more button
  async function handleReadMore() {
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
    setActivePageNumber((prev) => prev + 1);
  }

  //   Clear notifications
  async function handleClearNotifications() {
    setLoading(() => true);
    const success = await clearNotifications();
    setLoading(() => false);
    if (success) {
      setTimeout(() => {
        setNotifications([]);
      }, 1000);
    }
  }
  const userBlogs = {
    liked: selfDetails?.likedBlogs?.map((blog: Blog) => blog.id) || [],
    saved: selfDetails?.savedBlogs?.map((blog: Blog) => blog.id) || [],
  };

  return (
    <div>
      <Nav>
        <Logo>Inkwell</Logo>
        <RightBox>
          <CircleBorder>
            <IconButton aria-label="delete">
              <Badge badgeContent={0} max={9} color="primary">
                <PersonIcon color="action" />
              </Badge>
            </IconButton>
          </CircleBorder>
          <CircleBorder
            onClick={() => setIsNotificationOpen(!isNotificationOpen)}
          >
            <IconButton aria-label="delete">
              <Badge
                badgeContent={notifications.length}
                max={9}
                color="primary"
              >
                <NotificationsIcon color="action" />
              </Badge>
            </IconButton>
          </CircleBorder>
          <AnimatePresence mode="popLayout">
            {isNotificationOpen && (
              <NotificationPanel
                initial={{
                  opacity: 0,
                  scale: 0,
                  y: -50,
                  x: 130,
                }}
                animate={{
                  opacity: 1,
                  scale: 1,
                  y: 60,
                  x: 0,
                }}
                exit={{
                  opacity: 0,
                  scale: 0,
                  y: -50,
                  x: 130,
                }}
                transition={{
                  duration: 1,
                  ease: "backInOut",
                }}
                noNotifactions={notifications.length == 0}
              >
                {notifications.length ? (
                  <>
                    {notifications.map((content, ind) => (
                      <Notification>{content}</Notification>
                    ))}
                    <Button
                      disabled={loading}
                      onClick={handleClearNotifications}
                    >
                      {!loading ? (
                        "Clear All"
                      ) : (
                        <CircularProgress size={20} thickness={6} />
                      )}
                    </Button>
                  </>
                ) : (
                  "No notifications!"
                )}
              </NotificationPanel>
            )}
          </AnimatePresence>
        </RightBox>
      </Nav>
      <Main>
        <LeftSec>
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
          </Sort>
          <Blogs blogs={blogs} userBlogs={userBlogs} />

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
        </LeftSec>
        <RightSec>ewfwef</RightSec>
      </Main>
    </div>
  );
}
function Blogs({ blogs, userBlogs }: { blogs: Blog[]; userBlogs: any }) {
  return (
    <BlogBox>
      {blogs.map((blog) => {
        let liked = false;
        let saved = false;
        if (userBlogs?.liked?.includes(blog.id)) {
          liked = true;
        }
        if (userBlogs?.saved?.includes(blog.id)) {
          saved = true;
        }
        return (
          <Card
            key={blog.id}
            blog={blog}
            // userBlogs={userBlogs}
            isLikedByUser={liked}
            isSavedByUser={saved}
          />
        );
      })}
    </BlogBox>
  );
}

function Card({
  blog,
  isLikedByUser,
  isSavedByUser,
}: {
  blog: Blog;
  isLikedByUser: boolean;
  isSavedByUser: boolean;
}) {
  const [liked, setLiked] = useState<boolean>(false);
  const [saved, setSaved] = useState<boolean>(false);
  useEffect(() => {
    setLiked(isLikedByUser);
    setSaved(isSavedByUser);
  }, [isLikedByUser, isSavedByUser]);
  async function handleBlogLike(
    event: React.MouseEvent<HTMLDivElement, MouseEvent>
  ) {
    event.stopPropagation();
    if (liked) {
      // unlike
      const success = await unlikeBlog({ blogId: blog.id });
      if (success) {
        setLiked(false);
      }
    } else {
      // like
      const success = await likeBlog({ blogId: blog.id });
      if (success) {
        setLiked(true);
      }
    }
  }
  async function handleBlogSave(
    event: React.MouseEvent<HTMLDivElement, MouseEvent>
  ) {
    event.stopPropagation();
    if (saved) {
      // unsave
      const success = await unsaveBlog({ blogId: blog.id });
      if (success) {
        setSaved(false);
      }
    } else {
      // save
      const success = await saveBlog({ blogId: blog.id });
      if (success) {
        setSaved(true);
      }
    }
  }

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
        <Like onClick={handleBlogLike}>
          {!liked ? (
            <FavoriteBorderIcon color="action" />
          ) : (
            <FavoriteIcon color="error" />
          )}
        </Like>
        <Save onClick={handleBlogSave}>
          {!saved ? (
            <BookmarkBorderIcon color="action" />
          ) : (
            <BookmarkIcon color="primary" />
          )}
        </Save>
      </LeftBlogSec>
      <RightBlogSec>
        <section>
          <span>{getMinutesToRead(blog.content)} min</span>
          <span>{formatDate(blog.createdAt)}</span>
        </section>
        <h3>{blog.title}</h3>

        <section>
          <StatChip>
            <span>{blog._count.likedByUsers}</span>
            <FavoriteIcon style={{ color: "#E74C4F" }} />
          </StatChip>
          <StatChip>
            <span>{blog.comments?.length}</span>
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
function formatDate(dateString: string): string {
  const date = new Date(dateString);
  const formatter = new Intl.DateTimeFormat("en-GB", {
    day: "numeric",
    month: "long",
  });
  return formatter.format(date);
}
function getMinutesToRead(content: string): number {
  const words = content.split(" ");
  return Math.ceil(words.length / 200);
}
