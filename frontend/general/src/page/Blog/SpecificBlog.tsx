import KeyboardBackspaceIcon from "@mui/icons-material/KeyboardBackspace";
import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import {
  Blog,
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
  margin-bottom: 15px;
  cursor: pointer;
  &:hover {
    scale: 1.05;
  }
`;
interface PhotoProps {
  imageURL: string;
}
const ImageBox = styled.div`
  width: 100%;
  border-radius: 10px;
  position: relative;
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
    bottom: 15px;
  }
`;
const Like = styled.span`
  right: 10px;
`;
const Save = styled.span`
  right: 50px;
`;
const UserProfile = styled.div<PhotoProps>`
  height: 35px;
  width: 35px;
  border-radius: 50%;
  position: relative;
  background-image: url(${(props) => props.imageURL});
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  border: 1px solid #393939;
`;
const Header = styled.div`
  font-size: 18px;
  font-weight: 500;
  padding-top: 8px;
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  color: #333;
`;
const UserBox = styled.div`
  font-size: 18px;
  font-weight: 500;
  display: flex;
  gap: 5px;
  align-items: center;
  cursor: pointer;
  &:hover p {
    text-decoration: underline;
  }
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
  margin-top: 15px;
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
  /* gap: 15px; */
`;
const CommentContent = styled.div`
  border-bottom: 1px solid #dfdbdb;
  padding: 25px 0;
  display: flex;
  flex-direction: column;
  gap: 10px;
  & header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 10px;
  }
`;

export default function SpecificBlog({ selfDetails }: { selfDetails: object }) {
  const navigate = useNavigate();
  const [blogDetails, setBlogDetails] = useState<object>({});
  const [authorDetails, setAuthorDetails] = useState<object>({});
  const [commentText, setCommentText] = useState<string>("");

  // Fetch blog details and author details
  useEffect(() => {
    async function fetchBlog() {
      const res = await getBlog(18);
      setBlogDetails(res);
    }
    async function fetchAuthor() {
      const res = await getUser(66);
      setAuthorDetails(res);
    }
    fetchBlog();
    fetchAuthor();
  }, []);

  const [liked, setLiked] = useState<boolean>(false);
  const [saved, setSaved] = useState<boolean>(false);

  const userBlogs = useMemo(() => {
    return {
      liked: selfDetails?.likedBlogs?.map((blog: Blog) => blog.id) || [],
      saved: selfDetails?.savedBlogs?.map((blog: Blog) => blog.id) || [],
    };
  }, [selfDetails]);

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
  console.log(blogDetails);
  return (
    <Container>
      <BackButton onClick={() => navigate("/app")}>
        <KeyboardBackspaceIcon />
      </BackButton>
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
        <UserBox>
          <UserProfile
            imageURL={
              authorDetails?.profilePicURL ||
              "../../../public/placeholderBlogImage.webp"
            }
          />
          <p>{authorDetails?.username}</p>
        </UserBox>

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
          ></textarea>
          <div>
            <OutlinedButton onClick={() => setCommentText("")}>
              Clear
            </OutlinedButton>
            <Button>Post</Button>
          </div>
        </WriteComment>
        <PreviousComments>
          {blogDetails?.comments.map((comment) => (
            <CommentContent key={comment.id}>
              <header>
                <UserBox>
                  <UserProfile
                    imageURL={"../../../public/placeholderBlogImage.webp"}
                  />
                  <p>{"username"}</p>
                </UserBox>
                <p>{getTimeAgo(comment.createdAt)}</p>
              </header>
              <footer>
                Lorem ipsum dolor sit amet consectetur, adipisicing elit. Quae,
                fuga delectus tempora, dolorum quos ex deserunt temporibus,
                officiis atque quaerat aut ullam veritatis nobis doloribus
                repudiandae nostrum debitis dolores accusantium?
              </footer>
            </CommentContent>
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
