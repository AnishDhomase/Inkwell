import styled from "styled-components";
import { Section, SectionProps } from "./Account";
import ChevronRightIcon from "@mui/icons-material/ChevronRight"; //small
import { Link } from "react-router-dom";

/* eslint-disable react-refresh/only-export-components */
const ImageBox = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
  /* margin-top: -90px; */
  background-color: transparent;
`;
const UserProfilePhoto = styled.img`
  background-color: #e9e5e5;

  width: 180px;
  height: 180px;
  border-radius: 50%;
  object-fit: cover;
  border: 3px solid #ff7738;
  border: 2px solid black;
`;
const UserInfoCard = styled.div`
  width: 100%;
  margin-top: 5px;
  padding: 0 50px;
  @media (max-width: 600px) {
    padding: 0;
  }
  header {
    display: flex;
    justify-content: center;
    flex-direction: column;
    align-items: center;
    gap: 5px;
    h1 {
      font-size: 28px;
      text-transform: capitalize;
      text-align: center;
    }
    p {
      font-size: 20px;
      color: #a09d9d;
      text-align: center;
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
const Button = styled.button`
  min-width: 100px;
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

export default function Setting_Home({
  selfDetails,
  setActiveSection,
}: SectionProps) {
  return (
    <>
      <ImageBox>
        <UserProfilePhoto
          src={
            selfDetails?.profilePicURL ||
            "../../../public/placeholderBlogImage.webp"
          }
          alt="profile"
        />
      </ImageBox>
      <UserInfoCard>
        <header>
          <h1>{selfDetails?.name}</h1>
          <p>{selfDetails?.username}</p>
        </header>
        <main>
          <StatCard>
            <h2>{selfDetails?.followers?.length}</h2>
            <span>Followers</span>
          </StatCard>
          <StatCard>
            <h2>{selfDetails?.following?.length}</h2>
            <span>Following</span>
          </StatCard>
          <StatCard>
            <h2>{selfDetails?.blogs?.length}</h2>
            <span>Blogs</span>
          </StatCard>
        </main>
      </UserInfoCard>
      <Link to="/app/account/general">
        <Button>
          <p onClick={() => setActiveSection(Section.general)}>Edit Profile</p>
          <span>
            <ChevronRightIcon />
          </span>
        </Button>
      </Link>
    </>
  );
}
