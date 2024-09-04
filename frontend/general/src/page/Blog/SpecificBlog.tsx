import { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
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
import { formatDate } from "../../utils/helpers";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import BookmarkBorderIcon from "@mui/icons-material/BookmarkBorder";
import FavoriteIcon from "@mui/icons-material/Favorite";
import BookmarkIcon from "@mui/icons-material/Bookmark";
import toast from "react-hot-toast";
import { CircularProgress } from "@mui/material";
import { useUserDetails } from "../../context/UserDetailContext";
import BackBtn from "../../components/BackBtn";
import Comment from "./Comment";
import UserCard from "../../components/UserCard";

const Container = styled.div`
  color: ${({ theme }) => theme.text};
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
const ImageBox = styled.div`
  width: 100%;
  border-radius: 20px;
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
    /* background-color: #f9f9f9; */
    background-color: ${({ theme }) => theme.likeSaveBtnBg};
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
  /* color: #333; */
  color: ${({ theme }) => theme.rightPanelTitle};
`;

const Title = styled.h1`
  font-size: 30px;
  font-weight: 700;
  /* color: #333; */
  color: ${({ theme }) => theme.rightPanelTitle};
  margin-top: 30px;
  @media (max-width: 550px) {
    font-size: 25px;
  }
`;
const Content = styled.p`
  font-size: 20px;
  font-weight: 300;
  color: #333;
  color: ${({ theme }) => theme.rightPanelTitle};
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
  /* border: 1px solid #333; */
  border: 1px solid ${({ theme }) => theme.rightPanelTitle};
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
    /* color: #333; */
    color: ${({ theme }) => theme.rightPanelTitle};
    outline: none;
    background-color: transparent;
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
const PreviousComments = styled.div`
  margin-top: -20px;
  display: flex;
  flex-direction: column;
  margin-bottom: 100px;
  /* gap: 15px; */
`;

export default function SpecificBlog() {
  const { selfDetails } = useUserDetails();

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
    if (!selfDetails?.id)
      return {
        liked: [],
        saved: [],
      };
    return {
      liked: selfDetails?.likedBlogs?.map((blog: Blog) => blog.id) || [],
      saved: selfDetails?.savedBlogs?.map((blog: Blog) => blog.id) || [],
    };
  }, [selfDetails]);

  // Pre-fill liked and saved status
  useEffect(() => {
    if (!selfDetails?.id) return;
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
  }, [userBlogs, blogDetails, selfDetails]);

  // Handle like and save
  async function handleBlogLike(
    event: React.MouseEvent<HTMLDivElement, MouseEvent>
  ) {
    event.stopPropagation();
    if (!selfDetails?.id) {
      toast.error("Login/Signup to like the blog");
      return;
    }
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
    if (!selfDetails?.id) {
      toast.error("Login/Signup to save the blog");
      return;
    }
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
    if (!selfDetails?.id) {
      toast.error("Login/Signup to comment on the blog");
      return;
    }
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
    if (!selfDetails?.id) {
      toast.error("Login/Signup to delete the comment");
      return;
    }
    setLoading(() => true);
    const success = await deleteCommentOnBlog({ commentId });
    if (success) {
      const res = await getBlog(Number(blogId));
      setBlogDetails(res);
    }
    setLoading(() => false);
  }
  async function handleEditComment(commentId: number, content: string) {
    if (!selfDetails?.id) {
      toast.error("Login/Signup to edit the comment");
      return;
    }
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
              myUserId={selfDetails?.id}
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
