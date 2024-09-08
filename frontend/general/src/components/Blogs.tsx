import styled from "styled-components";
import {
  getSelfDetails,
  likeBlog,
  saveBlog,
  unlikeBlog,
  unsaveBlog,
} from "../apis/api";
import BlogCardSkeletonLoader from "./BlogCardSkeleton";
import { useEffect, useState } from "react";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import BookmarkBorderIcon from "@mui/icons-material/BookmarkBorder";
import FavoriteIcon from "@mui/icons-material/Favorite";
import BookmarkIcon from "@mui/icons-material/Bookmark";
import CommentIcon from "@mui/icons-material/Comment";
import { Link } from "react-router-dom";

const BlogBoxLiked = styled.div`
  display: flex;
  flex-direction: column;
  gap: 35px;
  padding: 45px 0;
  width: 70%;
  min-width: 500px;
  margin: 0 auto;
  @media (max-width: 550px) {
    min-width: 0;
    width: 100%;
  }
  @media (max-width: 450px) {
    min-width: 0;
    width: 100%;
    margin-top: -50px;
  }
`;
const BlogCardLiked = styled.div`
  position: relative;
  border-bottom: 1px solid ${({ theme }) => theme.bottomBorder};
  padding-bottom: 30px;
  width: 100%;
  display: flex;
  gap: 15px;
  justify-content: space-between;
  align-items: center;
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
  /* border-bottom: 1px solid #626161; */
  border-bottom: 1px solid ${({ theme }) => theme.bottomBorder};
  padding-bottom: 35px;
  &:hover {
    cursor: pointer;
  }
  &:hover h3 {
    color: #5079da;
    /* color: ${({ theme }) => theme.blogCardHoverTxt}; */
    text-decoration: underline;
  }
`;
const LHS = styled.div`
  display: flex;
  gap: 15px;
  width: 100%;
  background-color: "red";
`;
const RHS = styled.div`
  display: flex;
  gap: 15px;
  /* width: 100%; */
  button {
    cursor: pointer;
    border: none;
    color: red;
    border: 1px solid red;
    border-radius: 50px;
    padding: 5px;
    display: flex;
    align-items: center;
    justify-content: center;
    /* background-color: white; */
    background-color: ${({ theme }) => theme.likeSaveBtnBg};
  }
  button:hover {
    background-color: red;
    color: white;
  }
  @media (max-width: 450px) {
    position: absolute;
    top: 10px;
    left: 10px;
  }
`;
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import { CircularProgress } from "@mui/material";
import { Msg } from "../page/Account/Account";
import { formatDate, getMinutesToRead } from "../utils/helpers";
import { useUserDetails } from "../hooks";
import { Blog, UserBlogsType } from "../utils/types";

interface LeftBlogSecProps {
  imageURL: string;
}
const LeftBlogSec = styled.div<LeftBlogSecProps>`
  width: 40%;
  min-height: 160px;
  border-radius: 10px;
  position: relative;
  background-color: ${({ theme }) => theme.text};
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
    background-color: ${({ theme }) => theme.likeSaveBtnBg};
    border: 1px solid #333;
  }
`;
const Like = styled.span`
  top: 10px;
  background-color: #ffffff;
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
    /* color: #333; */
    color: ${({ theme }) => theme.rightPanelTitle};
  }
  section {
    display: flex;
    align-items: center;
    gap: 10px;
    font-size: 18px;
    /* color: #a38d8d; */
    color: ${({ theme }) => theme.userCardPartialTxt};
  }
`;
const StatChip = styled.div`
  /* color: #000000; */
  color: ${({ theme }) => theme.text};
  display: flex;
  align-items: center;
  gap: 5px;
  span {
    font-size: 18px;
  }
`;

export default function Blogs({
  blogs,
  userBlogs,
}: {
  blogs: Blog[] | undefined;
  userBlogs: UserBlogsType;
}) {
  const [noResults, setNoResults] = useState<boolean>(false);
  useEffect(() => {
    const timer = setTimeout(() => {
      if (blogs?.length === 0) setNoResults(() => true);
    }, 3000);
    return () => clearTimeout(timer);
  }, [blogs?.length]);
  return (
    <BlogBox>
      {blogs?.length ? (
        blogs.map((blog) => {
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
              isLikedByUser={liked}
              isSavedByUser={saved}
            />
          );
        })
      ) : (
        <>
          {noResults ? <Msg>No Blogs Found! </Msg> : <BlogCardSkeletonLoader />}
        </>
      )}
    </BlogBox>
  );
}
export function BlogsLiked({ blogs }: { blogs: Blog[] }) {
  const [noResults, setNoResults] = useState<boolean>(false);
  useEffect(() => {
    const timer = setTimeout(() => {
      if (blogs?.length === 0) setNoResults(() => true);
    }, 3000);
    return () => clearTimeout(timer);
  }, [blogs.length]);
  return (
    <BlogBoxLiked>
      {blogs?.length ? (
        blogs.map((blog) => {
          return <CardLiked key={blog.id} blog={blog} />;
        })
      ) : (
        <>
          {noResults ? <Msg>No Blogs Found! </Msg> : <BlogCardSkeletonLoader />}
        </>
      )}
    </BlogBoxLiked>
  );
}
export function CardLiked({ blog }: { blog: Blog }) {
  const [loading, setLoading] = useState<boolean>(false);
  const { setSelfDetails, setNotifications } = useUserDetails();

  async function handleBlogLike(
    event: React.MouseEvent<HTMLDivElement | HTMLButtonElement, MouseEvent>
  ) {
    event.stopPropagation();
    event.preventDefault();
    setLoading(() => true);
    const success = await unlikeBlog({ blogId: blog.id });
    if (success) {
      // Fetch self details again to update self details
      const details = await getSelfDetails();
      setSelfDetails(details);
      setNotifications(details?.notifications || []);
      setLoading(() => false);
    }
  }
  return (
    <Link to={`/app/blog/${blog.id}`}>
      <BlogCardLiked key={blog.id}>
        <LHS>
          <LeftBlogSec
            imageURL={
              blog.blogImageURL ||
              "https://res.cloudinary.com/dwfvgrn9g/image/upload/v1725806791/placeholderBlogImage_iugz3d.webp"
            }
          ></LeftBlogSec>
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
        </LHS>
        <RHS>
          <button onClick={handleBlogLike}>
            {!loading ? (
              <DeleteOutlineIcon />
            ) : (
              <CircularProgress size={20} thickness={6} />
            )}
          </button>
        </RHS>
      </BlogCardLiked>
    </Link>
  );
}
export function BlogsSaved({ blogs }: { blogs: Blog[] }) {
  const [noResults, setNoResults] = useState<boolean>(false);
  useEffect(() => {
    const timer = setTimeout(() => {
      if (blogs?.length === 0) setNoResults(() => true);
    }, 2000);
    return () => clearTimeout(timer);
  }, [blogs.length]);
  return (
    <BlogBoxLiked>
      {blogs?.length ? (
        blogs.map((blog) => {
          return <CardSaved key={blog.id} blog={blog} />;
        })
      ) : (
        <>
          {noResults ? <Msg>No Blogs Found! </Msg> : <BlogCardSkeletonLoader />}
        </>
      )}
    </BlogBoxLiked>
  );
}
export function CardSaved({ blog }: { blog: Blog }) {
  const [loading, setLoading] = useState<boolean>(false);
  const { setSelfDetails, setNotifications } = useUserDetails();

  async function handleBlogSave(
    event: React.MouseEvent<HTMLDivElement | HTMLButtonElement, MouseEvent>
  ) {
    event.stopPropagation();
    event.preventDefault();
    setLoading(() => true);
    const success = await unsaveBlog({ blogId: blog.id });
    if (success) {
      // Fetch self details again to update self details
      const details = await getSelfDetails();
      setSelfDetails(details);
      setNotifications(details?.notifications || []);
      setLoading(() => false);
    }
    setLoading(() => false);
  }
  return (
    <Link to={`/app/blog/${blog.id}`}>
      <BlogCardLiked>
        <LHS>
          <LeftBlogSec
            imageURL={
              blog.blogImageURL ||
              "https://res.cloudinary.com/dwfvgrn9g/image/upload/v1725806791/placeholderBlogImage_iugz3d.webp"
            }
          ></LeftBlogSec>
          <RightBlogSec>
            <section>
              <span>{getMinutesToRead(blog.content)} min</span>
              <span>{formatDate(blog.createdAt)}</span>
            </section>
            <h3>{blog.title}</h3>

            <section>
              <StatChip>
                <span>{blog._count.savedByUsers}</span>
                <FavoriteIcon style={{ color: "#E74C4F" }} />
              </StatChip>
              <StatChip>
                <span>{blog.comments?.length}</span>
                <CommentIcon style={{ color: "#dab777" }} />
              </StatChip>
            </section>
          </RightBlogSec>
        </LHS>
        <RHS>
          <button onClick={handleBlogSave}>
            {!loading ? (
              <DeleteOutlineIcon />
            ) : (
              <CircularProgress size={20} thickness={6} />
            )}
          </button>
        </RHS>
      </BlogCardLiked>
    </Link>
  );
}
export function Card({
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

  // Pre-fill liked and saved status
  useEffect(() => {
    setLiked(isLikedByUser);
    setSaved(isSavedByUser);
  }, [isLikedByUser, isSavedByUser]);

  async function handleBlogLike(
    event: React.MouseEvent<HTMLDivElement, MouseEvent>
  ) {
    event.stopPropagation();
    event.preventDefault();
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
    event.preventDefault();
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
  return (
    <Link to={`/app/blog/${blog.id}`}>
      <BlogCard key={blog.id}>
        <LeftBlogSec
          imageURL={
            blog.blogImageURL ||
            "https://res.cloudinary.com/dwfvgrn9g/image/upload/v1725806791/placeholderBlogImage_iugz3d.webp"
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
              <span>{blog?._count?.likedByUsers}</span>
              <FavoriteIcon style={{ color: "#E74C4F" }} />
            </StatChip>
            <StatChip>
              <span>{blog?.comments?.length}</span>
              <CommentIcon style={{ color: "#dab777" }} />
            </StatChip>
          </section>
        </RightBlogSec>
      </BlogCard>
    </Link>
  );
}
