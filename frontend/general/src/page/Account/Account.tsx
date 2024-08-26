import styled from "styled-components";

const Container = styled.div`
  margin-top: -20px;
  display: flex;
  justify-content: space-between;
  min-height: 100vh;
  gap: 20px;
`;
const NavigationPanel = styled.nav`
  width: 25%;
  background-color: #a4a4a431;
  min-height: 100vh;
  /* padding: 0 20px; */
  & > h1 {
    font-size: 30px;
    font-weight: 700;
    padding: 30px 20px;
  }
  & > div {
    display: flex;
    flex-direction: column;
    gap: 20px;
  }
  @media (max-width: 950px) {
    width: 30%;
  }
  @media (max-width: 810px) {
    display: none;
  }
`;
const OutputPanel = styled.main`
  width: 75%;
  min-height: 100vh;
  /* padding: 0 20px; */
  padding-right: 30px;
  margin-top: 20px;
  @media (max-width: 950px) {
    width: 70%;
  }
  @media (max-width: 810px) {
    width: 100%;
    padding: 0 20px;
  }
  @media (max-width: 475px) {
    width: 100%;
    padding: 0;
  }
`;
const SettingSection = styled.section`
  header {
    font-size: 18px;
    font-weight: 500;
    padding: 5px 20px;
    background-color: #b7b6b6;
    color: white;
  }
  main {
    display: flex;
    flex-direction: column;
    margin-top: 5px;
  }
`;
const Row = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 5px 0;
  padding-left: 20px;
  /* padding-right: -10px; */
  /* border-bottom: 1px solid #333; */
  font-size: 18px;
  cursor: pointer;
  &:hover > span {
    transform: translateX(2px);
  }
`;

import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos"; //big
import ChevronRightIcon from "@mui/icons-material/ChevronRight"; //small

import KeyboardBackspaceIcon from "@mui/icons-material/KeyboardBackspace";
import { useEffect, useMemo, useState } from "react";
import { Link, Navigate, useNavigate, useParams } from "react-router-dom";
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
import BackBtn from "../../components/BackBtn";

// const Container = styled.div`
//   padding: 0 20%;
//   @media (max-width: 900px) {
//     padding: 0 5%;
//   }
//   @media (max-width: 600px) {
//     padding: 0 20px;
//   }
//   @media (max-width: 480px) {
//     padding: 0;
//   }
//   display: flex;
//   flex-direction: column;
//   align-items: start;
// `;
const BackgroundBanner = styled.div`
  width: 100%;
  height: 200px;
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
const ImageBox = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
  margin-top: -90px;
  background-color: transparent;
`;
const UserProfilePhoto = styled.img`
  background-color: #807c7c;

  width: 180px;
  height: 180px;
  border-radius: 50%;
  object-fit: cover;
  border: 3px solid #ff7738;
  border: 5px solid white;
`;
const UserInfoCard = styled.div`
  width: 100%;
  margin-top: 5px;
  padding: 0 50px;
  @media (max-width: 600px) {
    padding: 0;
  }
  header {
    font-size: 23px;
    display: flex;
    justify-content: center;
    flex-direction: column;
    align-items: center;
    gap: 5px;
    p {
      font-size: 20px;
      color: #a09d9d;
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
    justify-content: center;
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
  align-items: center;
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
  &:hover {
    border: 1px solid #3856ff;
  }
`;
const StyledToggleButton = styled.div`
  margin-right: 5px;
`;
const Button = styled.button`
  margin: 0 auto;
  font-size: 18px;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 8px 12px;
  background-color: #3856ff;
  color: #fff;
  border: none;
  border-radius: 5px;
  margin-top: 35px;
  cursor: pointer;
  & > span {
    display: flex;
    align-items: center;
    gap: 5px;
  }
  &:hover span {
    transform: translateX(4px);
  }
`;

enum sectionsOfAccountPage {
  general,
  password,
  yourBlogs,
  likedBlogs,
  savedBlogs,
  favouriteTopics,
}

export default function Account({ selfDetails }: { selfDetails: object }) {
  const [activeSection, setActiveSection] = useState<sectionsOfAccountPage>();
  return (
    <Container>
      <NavigationPanel>
        <h1>Settings</h1>
        <div>
          <SettingSection>
            <header>EDIT PROFILE</header>
            <main>
              <Row>
                <p>General</p>
                <span>
                  <ChevronRightIcon />
                </span>
              </Row>
              <Row>
                <p>Password</p>
                <span>
                  <ChevronRightIcon />
                </span>
              </Row>
            </main>
          </SettingSection>
          <SettingSection>
            <header>CONTENT</header>
            <main>
              <Row>
                <p>Your Blogs</p>
                <span>
                  <ChevronRightIcon />
                </span>
              </Row>
              <Row>
                <p>Liked Blogs</p>
                <span>
                  <ChevronRightIcon />
                </span>
              </Row>
              <Row>
                <p>Saved Blogs</p>
                <span>
                  <ChevronRightIcon />
                </span>
              </Row>
            </main>
          </SettingSection>
          <SettingSection>
            <header>PREFERENCES</header>
            <main>
              <Row>
                <p>Dark Mode</p>
                <StyledToggleButton>
                  <ToggleButton />
                </StyledToggleButton>
              </Row>
              <Row>
                <p>Favourite Topics</p>
                <span>
                  <ChevronRightIcon />
                </span>
              </Row>
            </main>
          </SettingSection>
        </div>
      </NavigationPanel>
      <OutputPanel>
        <BackgroundBanner>
          <span>
            <BackBtn />
          </span>
        </BackgroundBanner>
        <ImageBox>
          <UserProfilePhoto src={selfDetails.profilePicURL} alt="profile" />
        </ImageBox>
        <UserInfoCard>
          <header>
            <h1>{selfDetails.name}</h1>
            <p>{selfDetails.username}</p>
          </header>
          <main>
            <StatCard>
              <h2>{selfDetails.followers?.length}</h2>
              <span>Followers</span>
            </StatCard>
            <StatCard>
              <h2>{selfDetails.following?.length}</h2>
              <span>Following</span>
            </StatCard>
            <StatCard>
              <h2>{selfDetails.blogs?.length}</h2>
              <span>Blogs</span>
            </StatCard>
          </main>
        </UserInfoCard>
        <Button>
          <p>Edit Profile</p>
          <span>
            <ChevronRightIcon />
          </span>
        </Button>
      </OutputPanel>
    </Container>
  );
}

interface BallProps {
  on: boolean;
}
const Toggle = styled.div<BallProps>`
  height: 28px;
  width: 42px;
  background-color: ${(props) => (props.on ? "#3856ff" : "#ddd")};
  border-radius: 50px;
  display: flex;
  align-items: center;
  justify-content: ${(props) => (props.on ? "flex-end" : "flex-start")};
  padding: 0 5px;
`;
const Ball = styled.span`
  height: 20px;
  width: 20px;
  background-color: #fff;
  border-radius: 50%;
  display: inline-block;
`;
export function ToggleButton() {
  const [darkModeOn, setDarkModeOn] = useState(false);
  return (
    <Toggle on={darkModeOn} onClick={() => setDarkModeOn(!darkModeOn)}>
      <Ball />
    </Toggle>
  );
}
