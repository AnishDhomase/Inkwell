import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import styled from "styled-components";
import {
  Blog,
  followUser,
  getSelfDetails,
  getUserDetails,
  unfollowUser,
} from "../../apis/api";
import Blogs from "../../components/Blogs";
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
    color: ${({ theme }) => theme.rightPanelTitle};
    @media (max-width: 600px) {
      flex-direction: column;
      text-align: center;
      gap: 10px;
    }
  }
  button {
    min-width: 80px;
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
    color: ${({ theme }) => theme.rightPanelTitle};
  }
  footer {
    user-select: none;
    margin-top: 20px;
    font-size: 18px;
    font-weight: 500;
    display: flex;
    align-items: center;
    gap: 5px;
    /* color: #a09d9d; */
    color: ${({ theme }) => theme.rightPanelTitle};
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
  /* border: 1px solid #e3e0e0; */
  border: 1px solid ${({ theme }) => theme.borderColor};

  padding: 10px;
  @media (max-width: 335px) {
    padding: 5px;
    min-width: 0px;
  }
  h2 {
    font-size: 20px;
    font-weight: 700;
    color: ${({ theme }) => theme.rightPanelTitle};
  }
  span {
    font-size: 18px;
    font-weight: 500;
    color: #a09d9d;
  }
`;
const ContactCard = styled.div`
  margin-top: 5px;

  div {
    display: flex;
    align-items: center;
    gap: 10px;
    font-size: 18px;
    font-weight: 300;
    /* color: #333; */
    color: ${({ theme }) => theme.rightPanelTitle};
  }
`;

const Title = styled.h1`
  font-size: 22px;
  font-weight: 700;
  /* color: #333; */
  color: ${({ theme }) => theme.rightPanelTitle};
  margin-top: 50px;
  margin-bottom: -15px;
  @media (max-width: 550px) {
    font-size: 25px;
  }
`;

export default function SpecificUser() {
  const { selfDetails, setSelfDetails, setNotifications } = useUserDetails();
  const { userId } = useParams();
  const [userDetails, setUserDetails] = useState<object>({});
  const [follow, setFollow] = useState<boolean>(false);
  const [isContactInfoOpen, setContactInfoOpen] = useState<boolean>(false);

  const [loading, setLoading] = useState<boolean>(false);

  // Fetch author details
  useEffect(() => {
    async function fetchUser() {
      const res = await getUserDetails(Number(userId));
      setUserDetails(res);
    }
    fetchUser();
  }, [userId]);

  // Pre-fill Follow and Unfollow status
  useEffect(() => {
    if (!selfDetails?.id) {
      return;
    }
    const result = selfDetails.following?.some(
      (user: object) => user.id === Number(userId)
    );
    setFollow(result);
  }, [userId, selfDetails]);

  // Handle Follow and Unfollow
  async function handleFollow() {
    if (!selfDetails?.id) {
      toast.error("Login/Signup to follow the user");
      return;
    }
    setLoading(true);
    if (follow) {
      // Unfollow
      const res = await unfollowUser({ followId: Number(userId) });
      if (res) {
        setFollow(false);
        const res = await getUserDetails(Number(userId));
        setUserDetails(res);
        // Fetch self details again to update follow status
        const details = await getSelfDetails();
        setSelfDetails(details);
        setNotifications(details?.notifications);
      }
    } else {
      // Follow
      const res = await followUser({ followId: Number(userId) });
      if (res) {
        setFollow(true);
        const res = await getUserDetails(Number(userId));
        setUserDetails(res);

        // Fetch self details again to update follow status
        const details = await getSelfDetails();
        setSelfDetails(details);
        setNotifications(details?.notifications);
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
          <>{userDetails?.username}</>
        </span>
      </BackgroundBanner>
      <UserProfilePhoto
        src={
          userDetails?.profilePicURL ||
          "../../../public/placeholderBlogImage.webp"
        }
        alt="profile"
      />
      <UserInfoCard>
        <header>
          <h1>{userDetails?.name}</h1>
          {selfDetails?.id !== Number(userId) ? (
            <button onClick={handleFollow}>
              {!loading ? (
                follow ? (
                  "Following"
                ) : (
                  "Follow"
                )
              ) : (
                <CircularProgress
                  size={20}
                  thickness={6}
                  style={{ color: "white" }}
                />
              )}
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
        <section>{userDetails?.description}</section>
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
              <span>{userDetails?.email}</span>
            </div>
          </ContactCard>
        )}

        <Title>
          Blogs by{" "}
          {Number(userId) === selfDetails?.id
            ? "you"
            : userDetails?.name?.split(" ")[0]}
        </Title>
        <Blogs blogs={userDetails?.blogs} userBlogs={userBlogs} />
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
import toast from "react-hot-toast";
import { useUserDetails } from "../../context/UserDetailContext";
import { CircularProgress } from "@mui/material";
