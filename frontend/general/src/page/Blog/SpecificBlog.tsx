import KeyboardBackspaceIcon from "@mui/icons-material/KeyboardBackspace";
import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import styled from "styled-components";
import {
  Blog,
  commentOnBlog,
  deleteCommentOnBlog,
  editCommentOnBlog,
  getBlog,
  getUser,
  likeBlog,
  saveBlog,
  unlikeBlog,
  unsaveBlog,
} from "../../apis/api";
import { formatDate } from "../../components/Blogs";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import BookmarkBorderIcon from "@mui/icons-material/BookmarkBorder";
import FavoriteIcon from "@mui/icons-material/Favorite";
import BookmarkIcon from "@mui/icons-material/Bookmark";
import toast from "react-hot-toast";
import { CircularProgress } from "@mui/material";

const Container = styled.div`
  @media (min-width: 1000px) {
    padding: 0 20%;
  }
  @media (min-width: 800px) {
    padding: 0 15%;
  }
  @media (max-width: 800px) {
    padding: 0 10%;
  }
  @media (max-width: 600px) {
    padding: 0 20px;
  }
  @media (max-width: 480px) {
    padding: 0;
  }
  display: flex;
  flex-direction: column;
  align-items: start;
`;
const BackButton = styled.span`
  align-items: start;
  color: #ff7738;
  border-radius: 50px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 30px;
  cursor: pointer;
  &:hover {
    scale: 1.05;
  }
`;
// interface PhotoProps {
//   imageURL: string;
// }
const ImageBox = styled.div`
  width: 100%;
  border-radius: 10px;
  position: relative;
  border: 1px solid #333;
  background-color: #ffffff;
  display: flex;
  img {
    border-radius: 10px;
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
  span {
    position: absolute;
    border-radius: 50px;
    padding: 5px;
    display: flex;
    cursor: pointer;
    background-color: #f9f9f9;
    border: 1px solid #333;
    bottom: 10px;
  }
`;
const Like = styled.span`
  right: 10px;
`;
const Save = styled.span`
  right: 50px;
`;

const Header = styled.div`
  font-size: 18px;
  font-weight: 500;
  margin-top: 15px;
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  color: #333;
`;

const Title = styled.h1`
  font-size: 30px;
  font-weight: 700;
  color: #333;
  margin-top: 30px;
  @media (max-width: 550px) {
    font-size: 25px;
  }
`;
const Content = styled.p`
  font-size: 20px;
  font-weight: 400;
  color: #333;
  margin-top: 15px;
  line-height: 1.5;
  white-space: pre-wrap;
  @media (max-width: 550px) {
    font-size: 18px;
  }
`;
const Topics = styled.div`
  display: flex;
  gap: 10px;
  margin-top: 25px;
`;
const Topic = styled.span`
  padding: 5px 10px;
  background-color: #e4e4e4;
  color: #333;
  font-size: 18px;
  border-radius: 50px;
  border: 1px solid #333;
  /* &:hover {
    cursor: pointer;
  } */
`;
const CommentBox = styled.div`
  margin-top: 20px;
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 15px;
  & h1 {
    font-size: 25px;
  }
`;
const WriteComment = styled.div`
  display: flex;
  flex-direction: column;
  align-items: end;
  gap: 10px;
  border: 1px solid #333;
  border-radius: 15px;
  overflow: hidden;
  padding: 15px;
  @media (max-width: 475px) {
    padding: 10px;
  }
  &:hover {
    border: 1px solid #ff7738;
  }
  textarea {
    resize: none;
    border: none;
    width: 100%;
    height: 100px;
    font-size: 18px;
    color: #333;
    outline: none;
  }
  textarea:disabled {
    background-color: transparent;
  }
  div {
    display: flex;
    gap: 10px;
  }
`;
const OutlinedButton = styled.button`
  padding: 5px 10px;
  color: #ff7738;
  border: 1px solid #ff7738;
  font-size: 18px;
  border-radius: 10px;
  background-color: transparent;
  &:hover {
    cursor: pointer;
    scale: 1.02;
  }
`;
const Button = styled.button`
  padding: 5px 10px;
  background-color: #ff7738;
  color: #fff;
  font-size: 18px;
  border: none;
  border-radius: 10px;
  &:hover {
    cursor: pointer;
    scale: 1.02;
  }
`;
const ButtonSmall = styled.button`
  padding: 2px 5px;
  background-color: #ff7738;
  color: #fff;
  font-size: 16px;
  border: none;
  border-radius: 5px;
  display: flex;
  align-items: center;
  justify-content: center;
  &:hover {
    cursor: pointer;
    scale: 1.02;
  }
`;
const PreviousComments = styled.div`
  margin-top: -20px;
  display: flex;
  flex-direction: column;
  /* gap: 15px; */
`;
interface CommentContentProps {
  overlay: boolean;
}
const CommentContent = styled.div<CommentContentProps>`
  opacity: ${(props) => (props.overlay ? 0.5 : 1)};
  border-bottom: 1px solid #dfdbdb;
  padding: 25px 0;
  display: flex;
  flex-direction: column;
  gap: 10px;
  font-size: 17px;
  & header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 10px;
  }
  & textarea {
    font-size: 17px;
    border: none;
    outline: none;

    resize: none;
    min-height: 50px;
  }
`;
const ToolBox = styled.div`
  display: flex;
  gap: 5px;
  color: #c4b9b4;
  cursor: pointer;
`;
const Tool = styled.button`
  padding: 0 5px;
  display: flex;
  align-items: center;
  background-color: transparent;
  border: none;
  color: #c4b9b4;
  cursor: pointer;
  &:hover {
    color: #636161;
  }
`;

export default function SpecificBlog({ selfDetails }: { selfDetails: object }) {
  const navigate = useNavigate();
  const { blogId } = useParams();
  const [blogDetails, setBlogDetails] = useState<object>({});
  const [authorDetails, setAuthorDetails] = useState<object>({});
  const [commentText, setCommentText] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [editing, setEditing] = useState<number>(-1);
  const [liked, setLiked] = useState<boolean>(false);
  const [saved, setSaved] = useState<boolean>(false);

  // Fetch blog details
  useEffect(() => {
    async function fetchBlog() {
      const res = await getBlog(Number(blogId));
      setBlogDetails(res);
    }
    fetchBlog();
  }, [blogId]);
  // Fetch author details
  useEffect(() => {
    if (!blogDetails.authorId) return;
    async function fetchAuthor() {
      const res = await getUser(Number(blogDetails.authorId));
      setAuthorDetails(res);
    }
    fetchAuthor();
  }, [blogDetails]);

  // User all Liked and Saved blogs
  const userBlogs = useMemo(() => {
    return {
      liked: selfDetails?.likedBlogs?.map((blog: Blog) => blog.id) || [],
      saved: selfDetails?.savedBlogs?.map((blog: Blog) => blog.id) || [],
    };
  }, [selfDetails]);

  // Pre-fill liked and saved status
  useEffect(() => {
    let liked = false;
    let saved = false;
    if (userBlogs?.liked?.includes(blogDetails?.id)) {
      liked = true;
    }
    if (userBlogs?.saved?.includes(blogDetails?.id)) {
      saved = true;
    }
    setLiked(liked);
    setSaved(saved);
  }, [userBlogs, blogDetails]);

  // Handle like and save
  async function handleBlogLike(
    event: React.MouseEvent<HTMLDivElement, MouseEvent>
  ) {
    event.stopPropagation();
    if (liked) {
      // unlike
      const success = await unlikeBlog({ blogId: blogDetails.id });
      if (success) {
        setLiked(false);
      }
    } else {
      // like
      const success = await likeBlog({ blogId: blogDetails.id });
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
      const success = await unsaveBlog({ blogId: blogDetails.id });
      if (success) {
        setSaved(false);
      }
    } else {
      // save
      const success = await saveBlog({ blogId: blogDetails.id });
      if (success) {
        setSaved(true);
      }
    }
  }

  // Handle comment
  async function handleCommentPost() {
    if (!commentText) {
      toast.error("Comment cannot be empty");
      return;
    }
    setLoading(() => true);
    const success = await commentOnBlog({
      blogId: blogDetails.id,
      content: commentText,
    });
    if (success) {
      setCommentText("");
      const res = await getBlog(Number(blogId));
      setBlogDetails(res);
    }
    setLoading(() => false);
  }
  async function handleDeleteComment(commentId: number) {
    setLoading(() => true);
    const success = await deleteCommentOnBlog({ commentId });
    if (success) {
      const res = await getBlog(Number(blogId));
      setBlogDetails(res);
    }
    setLoading(() => false);
  }
  async function handleEditComment(commentId: number, content: string) {
    setLoading(() => true);
    const success = await editCommentOnBlog({ commentId, content });
    if (success) {
      const res = await getBlog(Number(blogId));
      setBlogDetails(res);
      setEditing(() => -1);
    }
    setLoading(() => false);
  }

  return (
    <Container>
      <BackBtn />

      <ImageBox>
        <img
          src={
            blogDetails?.blogImageURL ||
            "../../../public/placeholderBlogImage.webp"
          }
          alt="blog"
        />
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
      </ImageBox>

      <Header>
        <UserCard
          userId={authorDetails?.id}
          username={authorDetails?.username}
          profilePicURL={authorDetails?.profilePicURL}
        />

        <p>{blogDetails?.createdAt && formatDate(blogDetails?.createdAt)}</p>
      </Header>
      <Title>{blogDetails?.title}</Title>
      <Content>{blogDetails?.content}</Content>
      <Topics>
        {blogDetails?.topics?.map((topic: any) => (
          <Topic key={topic.id}>{topic.name}</Topic>
        ))}
      </Topics>

      <CommentBox>
        <Title>Comments</Title>
        <WriteComment>
          <textarea
            placeholder="Write a comment"
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
            disabled={loading || editing !== -1}
          ></textarea>
          <div>
            <OutlinedButton
              onClick={() => setCommentText("")}
              disabled={loading}
            >
              Clear
            </OutlinedButton>
            <Button onClick={handleCommentPost} disabled={loading}>
              {!loading || editing !== -1 ? (
                "Post"
              ) : (
                <CircularProgress size={20} thickness={6} />
              )}
            </Button>
          </div>
        </WriteComment>
        <PreviousComments>
          {blogDetails?.comments?.map((comment) => (
            <Comment
              key={comment.id}
              comment={comment}
              myUserId={selfDetails.id}
              handleDeleteComment={handleDeleteComment}
              handleEditComment={handleEditComment}
              editing={editing}
              setEditing={setEditing}
            />
          ))}
        </PreviousComments>
      </CommentBox>
    </Container>
  );
}

function getTimeAgo(dateString: string): string {
  const now = new Date();
  const past = new Date(dateString);
  const diffInSeconds = Math.floor((now.getTime() - past.getTime()) / 1000);

  const intervals = [
    { label: "year", seconds: 31536000 },
    { label: "month", seconds: 2592000 },
    { label: "week", seconds: 604800 },
    { label: "day", seconds: 86400 },
    { label: "hour", seconds: 3600 },
    { label: "minute", seconds: 60 },
  ];

  for (const interval of intervals) {
    const count = Math.floor(diffInSeconds / interval.seconds);
    if (count >= 1) {
      return count === 1
        ? `1 ${interval.label} ago`
        : `${count} ${interval.label}s ago`;
    }
  }

  return "just now";
}

import ModeEditIcon from "@mui/icons-material/ModeEdit";
import DeleteIcon from "@mui/icons-material/Delete";
import UserCard from "../../components/UserCard";
import BackBtn from "../../components/BackBtn";
function Comment({
  comment,
  myUserId,
  handleDeleteComment,
  handleEditComment,
  editing,
  setEditing,
}: {
  comment: object;
  myUserId: number;
  handleDeleteComment: (commentId: number) => Promise<void>;
  handleEditComment: (commentId: number, content: string) => Promise<void>;
  editing: number;
  setEditing: (id: number) => void;
}) {
  const [authorDetails, setAuthorDetails] = useState<object>({});
  const [loading, setLoading] = useState<boolean>(false);
  const [commentContent, setCommentContent] = useState<string>(comment.content);

  useEffect(() => {
    async function fetchAuthor() {
      const res = await getUser(Number(comment.authorId));
      setAuthorDetails(res);
    }
    fetchAuthor();
  }, []);
  async function handleDeleteCmmt() {
    setLoading(() => true);
    await handleDeleteComment(comment.id);
    setLoading(() => false);
  }
  async function handleEditCmmt() {
    setLoading(() => true);
    await handleEditComment(comment.id, commentContent);
    setLoading(() => false);
  }

  return (
    <CommentContent overlay={loading}>
      <header>
        <UserCard
          userId={comment.authorId}
          username={authorDetails?.username}
          profilePicURL={authorDetails?.profilePicURL}
        />
        <p>{getTimeAgo(comment.createdAt)}</p>
      </header>
      {editing !== comment.id ? (
        <footer>{comment.content}</footer>
      ) : (
        <textarea
          value={commentContent}
          onChange={(e) => setCommentContent(e.target.value)}
          disabled={loading}
        />
      )}
      {myUserId === comment.authorId && (
        <ToolBox>
          {editing !== comment.id ? (
            <Tool onClick={() => setEditing(comment.id)} disabled={loading}>
              <ModeEditIcon />
            </Tool>
          ) : (
            <ButtonSmall onClick={handleEditCmmt} disabled={loading}>
              {!loading ? "Save" : "Saving..."}
            </ButtonSmall>
          )}
          <Tool onClick={handleDeleteCmmt} disabled={loading}>
            <DeleteIcon />
          </Tool>
        </ToolBox>
      )}
    </CommentContent>
  );
}
