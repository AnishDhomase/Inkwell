import styled from "styled-components";
import { Blog, likeBlog, saveBlog, unlikeBlog, unsaveBlog } from "../apis/api";
import BlogCardSkeletonLoader from "./BlogCardSkeleton";
import { useEffect, useState } from "react";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import BookmarkBorderIcon from "@mui/icons-material/BookmarkBorder";
import FavoriteIcon from "@mui/icons-material/Favorite";
import BookmarkIcon from "@mui/icons-material/Bookmark";
import CommentIcon from "@mui/icons-material/Comment";
import { Link } from "react-router-dom";

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

export default function Blogs({
  blogs,
  userBlogs,
}: {
  blogs: Blog[];
  userBlogs: any;
}) {
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
              // userBlogs={userBlogs}
              isLikedByUser={liked}
              isSavedByUser={saved}
            />
          );
        })
      ) : (
        <BlogCardSkeletonLoader />
      )}
    </BlogBox>
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
    </Link>
  );
}
export function formatDate(dateString: string): string {
  const date = new Date(dateString);
  const formatter = new Intl.DateTimeFormat("en-GB", {
    day: "numeric",
    month: "short",
  });
  return formatter.format(date);
}
export function getMinutesToRead(content: string): number {
  const words = content.split(" ");
  return Math.ceil(words?.length / 200);
}
