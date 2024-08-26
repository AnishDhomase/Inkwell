import KeyboardBackspaceIcon from "@mui/icons-material/KeyboardBackspace";
import { useEffect, useMemo, useState } from "react";
import { Link, Navigate, useNavigate, useParams } from "react-router-dom";
import styled from "styled-components";
import {
  Blog,
  commentOnBlog,
  deleteCommentOnBlog,
  editCommentOnBlog,
  followUser,
  getBlog,
  getUser,
  getUserDetails,
  likeBlog,
  saveBlog,
  unfollowUser,
  unlikeBlog,
  unsaveBlog,
} from "../../apis/api";
import Blogs, { formatDate } from "../../components/Blogs";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import BookmarkBorderIcon from "@mui/icons-material/BookmarkBorder";
import FavoriteIcon from "@mui/icons-material/Favorite";
import BookmarkIcon from "@mui/icons-material/Bookmark";
import toast from "react-hot-toast";
import { CircularProgress } from "@mui/material";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import MailOutlineIcon from "@mui/icons-material/MailOutline";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";

const Container = styled.div`
  padding: 0 20%;
  @media (max-width: 900px) {
    padding: 0 5%;
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
const BackgroundBanner = styled.div`
  width: 100%;
  height: 250px;
  border-radius: 10px;
  background-color: #ffe0d6;
  background-image: linear-gradient(160deg, #ffc8ab 0%, #ffe0d6 100%);
  /* background-image: linear-gradient(to left, #ffecd2 0%, #fcb69f 100%); */
  padding: 20px;
  color: #333;
  span {
    display: flex;
    align-items: center;
    gap: 15px;
    font-size: 20px;
    font-weight: 500;
  }
`;
const BackButton = styled.span`
  cursor: pointer;
  &:hover {
    scale: 1.05;
  }
`;
const UserProfilePhoto = styled.img`
  background-color: #f9f9f9;
  margin-top: -90px;
  margin-left: 50px;
  width: 180px;
  height: 180px;
  border-radius: 50%;
  object-fit: cover;
  border: 3px solid #ff7738;
  @media (max-width: 600px) {
    margin: 0 auto;
    margin-top: -90px;
  }
`;
const UserInfoCard = styled.div`
  width: 100%;
  margin-top: 20px;
  padding: 0 50px;
  @media (max-width: 600px) {
    padding: 0;
  }
  header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    @media (max-width: 600px) {
      flex-direction: column;
      text-align: center;
      gap: 10px;
    }
  }
  button {
    padding: 5px 10px;
    background-color: #3856ff;
    color: #fff;
    border: none;
    border-radius: 5px;
    &:hover {
      cursor: pointer;
      scale: 1.02;
    }
  }
  main {
    margin-top: 20px;
    display: flex;
    gap: 20px;
    @media (max-width: 600px) {
      justify-content: center;
    }
    @media (max-width: 400px) {
      gap: 5px;
    }
  }
  & > section {
    margin-top: 30px;
  }
  footer {
    user-select: none;
    margin-top: 20px;
    font-size: 18px;
    font-weight: 500;
    display: flex;
    align-items: center;
    gap: 5px;
    color: #a09d9d;
  }
  footer:hover {
    text-decoration: underline;
    cursor: pointer;
  }
`;
const StatCard = styled.div`
  min-width: 100px;
  display: flex;
  flex-direction: column;
  /* align-items: center; */
  border-radius: 10px;
  border: 1px solid #e3e0e0;
  padding: 10px;
  @media (max-width: 335px) {
    padding: 5px;
    min-width: 0px;
  }
  h2 {
    font-size: 20px;
    font-weight: 700;
  }
  span {
    font-size: 18px;
    font-weight: 500;
    color: #a09d9d;
  }
  &:hover h2 {
    color: #3856ff;
  }
`;
const ContactCard = styled.div`
  margin-top: 5px;
  div {
    display: flex;
    align-items: center;
    gap: 10px;
    font-size: 18px;
    font-weight: 500;
    color: #333;
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
  background-color: #6d1717;
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
  font-size: 22px;
  font-weight: 700;
  color: #333;
  margin-top: 50px;
  margin-bottom: -15px;
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

export default function SpecificUser({ selfDetails }: { selfDetails: object }) {
  const navigate = useNavigate();
  const { userId } = useParams();
  const [userDetails, setUserDetails] = useState<object>({});
  const [follow, setFollow] = useState<boolean>(false);
  const [isContactInfoOpen, setContactInfoOpen] = useState<boolean>(false);

  const [loading, setLoading] = useState<boolean>(false);

  // Fetch user details
  useEffect(() => {
    async function fetchUser() {
      const res = await getUserDetails(Number(userId));
      setUserDetails(res);
    }
    fetchUser();
  }, [userId]);
  console.log(userDetails);

  // Pre-fill Follow and Unfollow status
  useEffect(() => {
    const result = selfDetails.following?.some(
      (user: object) => user.id === Number(userId)
    );
    setFollow(result);
  }, [userId, selfDetails]);

  // Handle Follow and Unfollow
  async function handleFollow() {
    setLoading(true);
    if (follow) {
      // Unfollow
      const res = await unfollowUser({ followId: Number(userId) });
      if (res) {
        setFollow(false);
        const res = await getUserDetails(Number(userId));
        setUserDetails(res);
      }
    } else {
      // Follow
      const res = await followUser({ followId: Number(userId) });
      if (res) {
        setFollow(true);
        const res = await getUserDetails(Number(userId));
        setUserDetails(res);
      }
    }
    setLoading(false);
  }

  const userBlogs = {
    liked: selfDetails?.likedBlogs?.map((blog: Blog) => blog.id) || [],
    saved: selfDetails?.savedBlogs?.map((blog: Blog) => blog.id) || [],
  };

  return (
    <Container>
      <BackgroundBanner>
        <span>
          <BackBtn />
          <>{userDetails.username}</>
        </span>
      </BackgroundBanner>
      <UserProfilePhoto src={userDetails.profilePicURL} alt="profile" />
      <UserInfoCard>
        <header>
          <h1>{userDetails.name}</h1>
          {selfDetails.id !== Number(userId) ? (
            <button onClick={handleFollow}>
              {follow ? "Following" : "Follow"}
            </button>
          ) : (
            <Link to="/app/account">
              <button>Edit Profile</button>
            </Link>
          )}
        </header>
        <main>
          <StatCard>
            <h2>{userDetails._count?.followers}</h2>
            <span>Followers</span>
          </StatCard>
          <StatCard>
            <h2>{userDetails._count?.following}</h2>
            <span>Following</span>
          </StatCard>
          <StatCard>
            <h2>{userDetails.blogs?.length}</h2>
            <span>Blogs</span>
          </StatCard>
        </main>
        <section>
          {userDetails.description} Lorem ipsum, dolor sit amet consectetur
          adipisicing elit. Esse officia reprehenderit, quibusdam iure error
          facere ipsam, facilis dolor velit earum odit, deserunt non reiciendis
          a incidunt. Fugiat a repellendus officiis!
        </section>
        <footer onClick={() => setContactInfoOpen(!isContactInfoOpen)}>
          <span>Contact Info</span>
          {!isContactInfoOpen ? (
            <KeyboardArrowDownIcon />
          ) : (
            <KeyboardArrowUpIcon />
          )}
        </footer>
        {isContactInfoOpen && (
          <ContactCard>
            <div>
              <MailOutlineIcon />
              <span>{userDetails.email}</span>
            </div>
          </ContactCard>
        )}

        <Title>
          Blogs by{" "}
          {Number(userId) === selfDetails.id
            ? "you"
            : userDetails?.name?.split(" ")[0]}
        </Title>
        <Blogs blogs={userDetails.blogs} userBlogs={userBlogs} />
      </UserInfoCard>
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

import UserCard from "../../components/UserCard";
import BackBtn from "../../components/BackBtn";
