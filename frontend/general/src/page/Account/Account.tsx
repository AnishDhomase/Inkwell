import styled from "styled-components";

const Container = styled.div`
  /* margin-top: -20px; */
  display: flex;
  justify-content: space-between;
  min-height: 100vh;
  gap: 20px;
`;
const NavigationPanel = styled.nav`
  width: 25%;
  background-color: #f6f5f5;
  /* height: 100vh; */
  /* padding: 0 20px; */
  & > a {
    cursor: pointer;
    h1 {
      font-size: 33px;
      font-weight: 700;
      padding: 20px 20px;
      cursor: pointer;
    }
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
interface RowProps {
  active?: boolean;
}
const Row = styled.div<RowProps>`
  position: relative;
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
  &::before {
    position: absolute;
    right: -10px;
    content: "";
    width: 20px;
    height: 20px;
    background-color: ${(props) => (props.active ? "#f6f5f5" : "transparent")};
    //rotate  by 45deg
    clip-path: polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%);
  }
  span {
    visibility: ${(props) => (props.active ? "hidden" : "visible")};
    color: #a09d9d;
  }
`;

import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos"; //big
import ChevronRightIcon from "@mui/icons-material/ChevronRight"; //small

import KeyboardBackspaceIcon from "@mui/icons-material/KeyboardBackspace";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  Link,
  Navigate,
  useLocation,
  useNavigate,
  useParams,
} from "react-router-dom";
import {
  Blog,
  commentOnBlog,
  deleteCommentOnBlog,
  editCommentOnBlog,
  followUser,
  getAllTopics,
  getBlog,
  getUser,
  getUserDetails,
  likeBlog,
  saveBlog,
  setFavouriteTopics,
  setProfilePhoto,
  Topic,
  unfollowUser,
  unlikeBlog,
  unsaveBlog,
  updateUserGeneralInfo,
  updateUserPasswordInfo,
} from "../../apis/api";
import Blogs, {
  BlogsLiked,
  BlogsSaved,
  formatDate,
} from "../../components/Blogs";
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
import { color } from "framer-motion";

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
// const BackgroundBanner = styled.div`
//   width: 100%;
//   height: 200px;
//   border-radius: 10px;
//   background-color: #ffe0d6;
//   background-image: linear-gradient(160deg, #ffc8ab 0%, #ffe0d6 100%);
//   /* background-image: linear-gradient(to left, #ffecd2 0%, #fcb69f 100%); */
//   padding: 20px;
//   color: #333;
//   span {
//     display: flex;
//     align-items: center;
//     gap: 15px;
//     font-size: 20px;
//     font-weight: 500;
//   }
// `;
const ImageBox = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
  /* margin-top: -90px; */
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
    display: flex;
    justify-content: center;
    flex-direction: column;
    align-items: center;
    gap: 5px;
    h1 {
      font-size: 28px;
      text-transform: capitalize;
    }
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
const PagePath = styled.div`
  font-size: 20px;
  font-weight: 700;
  color: #3856ff;
  margin-bottom: 20px;
  display: flex;
  align-items: center;
  @media (max-width: 450px) {
    margin-bottom: 40px;
    transform: translateY(-20px);
  }
`;

enum Section {
  home,
  general,
  password,
  yourBlogs,
  likedBlogs,
  savedBlogs,
  favouriteTopics,
}
const SectionArr = [
  "Home",
  "General",
  "Password",
  "Your-Blogs",
  "Liked-Blogs",
  "Saved-Blogs",
  "Favourite-Topics",
];
const SectionComponents: Record<Section, React.FC<SectionProps>> = {
  [Section.home]: Setting_Home,
  [Section.general]: Setting_General,
  [Section.password]: Setting_Password,
  [Section.likedBlogs]: Setting_LikedBlogs,
  [Section.savedBlogs]: Setting_SavedBlogs,
  [Section.favouriteTopics]: Setting_FavouriteTopics,
};

function getActivePage(categoryOfSettings: string): Section {
  switch (categoryOfSettings) {
    case "home":
      return Section.home;
    case "general":
      return Section.general;
    case "password":
      return Section.password;
    case "your-blogs":
      return Section.yourBlogs;
    case "liked-blogs":
      return Section.likedBlogs;
    case "saved-blogs":
      return Section.savedBlogs;
    case "favourite-topics":
      return Section.favouriteTopics;
    default:
      return Section.home;
  }
}

export default function Account({ selfDetails }: { selfDetails: object }) {
  const categoryOfSettings = useLocation().pathname.split("/")[3];
  const page = getActivePage(categoryOfSettings);

  const [activeSection, setActiveSection] = useState<Section>(page);

  function renderActiveSection() {
    const ActiveComponent = SectionComponents[activeSection];
    return (
      <ActiveComponent
        selfDetails={selfDetails}
        setActiveSection={setActiveSection}
      />
    );
  }
  console.log(selfDetails);
  return (
    <Container>
      <NavigationPanel>
        <Link to="/app/account/home">
          <h1 onClick={() => setActiveSection(Section.home)}>Settings</h1>
        </Link>
        <div>
          <SettingSection>
            <header>EDIT PROFILE</header>
            <main>
              <Link to="/app/account/general">
                <Row
                  onClick={() => setActiveSection(Section.general)}
                  active={activeSection === Section.general}
                >
                  <p>General</p>
                  <span>
                    <ChevronRightIcon />
                  </span>
                </Row>
              </Link>
              <Link to="/app/account/password">
                <Row
                  onClick={() => setActiveSection(Section.password)}
                  active={activeSection === Section.password}
                >
                  <p>Password</p>
                  <span>
                    <ChevronRightIcon />
                  </span>
                </Row>
              </Link>
            </main>
          </SettingSection>
          <SettingSection>
            <header>CONTENT</header>
            <main>
              <Link to="/app/account/your-blogs">
                <Row
                  onClick={() => setActiveSection(Section.yourBlogs)}
                  active={activeSection === Section.yourBlogs}
                >
                  <p>Your Blogs</p>
                  <span>
                    <ChevronRightIcon />
                  </span>
                </Row>
              </Link>
              <Link to="/app/account/liked-blogs">
                <Row
                  onClick={() => setActiveSection(Section.likedBlogs)}
                  active={activeSection === Section.likedBlogs}
                >
                  <p>Liked Blogs</p>
                  <span>
                    <ChevronRightIcon />
                  </span>
                </Row>
              </Link>
              <Link to="/app/account/saved-blogs">
                <Row
                  onClick={() => setActiveSection(Section.savedBlogs)}
                  active={activeSection === Section.savedBlogs}
                >
                  <p>Saved Blogs</p>
                  <span>
                    <ChevronRightIcon />
                  </span>
                </Row>
              </Link>
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
              <Link to="/app/account/favourite-topics">
                <Row
                  onClick={() => setActiveSection(Section.favouriteTopics)}
                  active={activeSection === Section.favouriteTopics}
                >
                  <p>Favourite Topics</p>
                  <span>
                    <ChevronRightIcon />
                  </span>
                </Row>
              </Link>
            </main>
          </SettingSection>
        </div>
      </NavigationPanel>
      <OutputPanel>
        <PagePath>
          <span
            onClick={() => setActiveSection(Section.home)}
            style={{ cursor: "pointer" }}
          >
            Settings
          </span>
          <ChevronRightIcon
            style={{
              color: "#9baaff",
            }}
          />
          {SectionArr[activeSection]}
        </PagePath>
        {renderActiveSection()}
        {/* {SectionComponent[activeSection]({ selfDetails, setActiveSection })} */}
      </OutputPanel>
    </Container>
  );
}

const ProfilePhotoBox = styled.div`
  width: 150px;
  height: 150px;
  border-radius: 50%;
  /* border: 2px solid #ff7738; */
  border: 2px solid black;
  overflow: hidden;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #e3dede;
  margin: 0 auto;
  @media (max-width: 450px) {
    width: 200px;
    height: 200px;
  }
`;
const Img = styled.img`
  height: 100%;
  width: 100%;
`;
const FileInputBox = styled.div`
  height: 25px;
  width: 25px;
  position: absolute;
  z-index: 100;
  bottom: 0;
  right: 0;
  left: 0;
  background-color: black;
  color: white;
  padding: 5px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  margin: 0 auto;
  transform: translate(55px, -15px);
  @media (max-width: 450px) {
    height: 30px;
    width: 30px;
    transform: translate(65px, -15px);
  }
  svg {
    font-size: 16px;
  }
  &:hover {
    background-color: #3856ff;
  }
`;
interface ProfilePhotoBoxProps {
  uploading: boolean;
}
const EditPhoto = styled.div<ProfilePhotoBoxProps>`
  position: relative;
  // uploading overlay
  main {
    position: absolute;
    right: 0;
    left: 0;
    bottom: 0;
    margin: 0 auto;
    width: 150px;
    height: 150px;
    background-color: ${(props) =>
      props.uploading ? "rgba(0,0,0,0.5)" : "transparent"};
    border-radius: 50%;
    display: ${(props) => (props.uploading ? "flex" : "none")};
    justify-content: center;
    align-items: center;
    @media (max-width: 450px) {
      width: 200px;
      height: 200px;
    }
  }
`;
// const SavePhoto = styled.button`
//   padding: 5px 10px;
//   background-color: #3856ff;
//   color: white;
//   border: none;
//   border-radius: 5px;
//   margin: 0 auto;
//   display: block;
//   margin-top: 10px;
//   font-size: 18px;
//   cursor: pointer;
//   &:hover {
//   }
// `;
const InputBox = styled.div`
  width: 60%;
  min-width: 400px;
  display: flex;
  flex-direction: column;
  gap: 20px;
  margin: 0 auto;
  margin-top: 20px;
  @media (max-width: 450px) {
    width: 100%;
    min-width: 0;
  }
  div {
    display: flex;
    flex-direction: column;
    gap: 0px;

    label {
      font-size: 18px;
      font-weight: 500;
      color: #3856ff;
    }
  }
  input,
  textarea {
    width: 100%;
    padding: 10px 0;
    border: none;
    border-bottom: 2px solid #e9e5e5;
    font-size: 18px;
    outline: none;
    /* resize: none; */
    &:focus {
      border-bottom: 2px solid #a2b0ff;
    }
  }
  textarea {
    /* min-height: 100px; */
  }
`;
const FollowBox = styled.section`
  width: 60%;
  min-width: 400px;
  margin: 0 auto;
  margin-top: 40px;
  @media (max-width: 450px) {
    width: 100%;
    min-width: 0;
  }
  header {
    display: flex;
    gap: 20px;
    align-items: center;
  }
  main {
    display: flex;
    flex-direction: column;
    gap: 20px;
    margin-top: 20px;
  }
`;
interface FollowTabProps {
  active: boolean;
}
const FollowTab = styled.button<FollowTabProps>`
  font-size: 18px;
  font-weight: 600;
  padding: 5px 0px;
  background-color: transparent;
  color: ${(props) => (props.active ? "#3856ff" : "#a09d9d")};
  border: none;
  border-bottom: 2px solid transparent;
  cursor: pointer;
  &:hover {
    border-bottom: 2px solid
      ${(props) => (props.active ? "#3856ff" : "#a09d9d")};
  }
`;
const SaveAll = styled.button`
  padding: 10px 15px;
  background-color: #3856ff;
  color: white;
  border: none;
  border-radius: 5px;
  margin: 0 auto;
  display: block;
  margin-top: 80px;
  font-size: 18px;
  cursor: pointer;
  margin-bottom: 20px;
  &:hover {
  }
`;
const Msg = styled.div`
  /* margin-top: 50px; */
  font-size: 20px;
  font-weight: 500;
  color: #a09d9d;
  text-align: center;
`;
const SelectorBox = styled.div`
  width: 100%;
  margin-top: 40px;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

interface SectionProps {
  selfDetails: object;
  setActiveSection: (section: Section) => void;
}
import ModeEditOutlineIcon from "@mui/icons-material/ModeEditOutline";
import UserCard from "../../components/UserCard";
import UserFollowCard from "../../components/UserCardWithFollowBtn";
import UserCardWithFollowBtn from "../../components/UserCardWithFollowBtn";
import { TopicSelector } from "../Auth/FavTopic";
function Setting_General({ selfDetails, setActiveSection }: SectionProps) {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [uploading, setUploading] = useState(true);
  const [name, setName] = useState(selfDetails?.name);
  const [description, setDescription] = useState(selfDetails?.description);
  const [followTab, setFollowTab] = useState<"following" | "followers">(
    "following"
  );

  const ref = useRef(null);
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFile(e.target.files[0]);
      setPreview(URL.createObjectURL(e.target.files[0]));
    }
  };

  // Pre-fill the form with the name, description and profilePicURL
  useEffect(() => {
    setUploading(() => true);
    setPreview(selfDetails?.profilePicURL);
    setName(selfDetails?.name);
    setDescription(selfDetails?.description);
    setUploading(() => false);
  }, [selfDetails]);

  // Auto resize the textarea
  const textareaRef = useRef(null);
  useEffect(() => {
    const textarea = textareaRef.current;
    if (!textarea) return;
    textarea.style.height = "auto";
    textarea.style.height = `${textarea.scrollHeight}px`;
  }, [description]);

  // Save all changes
  async function handleSave() {
    setUploading(() => true);
    const success = await updateUserGeneralInfo(
      {
        name,
        description,
      },
      file
    );
    setUploading(() => false);
  }
  return (
    <>
      <EditPhoto uploading={uploading}>
        <ProfilePhotoBox>
          {preview && (
            <Img src={preview || "../../../public/user.png"} alt="preview" />
          )}
        </ProfilePhotoBox>
        <FileInputBox onClick={() => ref?.current?.click()}>
          <input
            ref={ref}
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            hidden
          />
          <ModeEditOutlineIcon />
        </FileInputBox>
        <main>
          <CircularProgress
            size={20}
            thickness={6}
            sx={{
              color: "white",
            }}
          />
        </main>
      </EditPhoto>
      {/* <SavePhoto onClick={handleUpload} disabled={uploading}>
        {!uploading ? (
          "Update"
        ) : (
          <CircularProgress
            size={20}
            thickness={6}
            sx={{
              color: "white",
            }}
          />
        )}
      </SavePhoto> */}
      <InputBox>
        <div>
          <label>Name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>
        <div>
          <label>Description</label>

          <AutoResizingTextarea
            value={description}
            handleOnChange={(e) => setDescription(e.target.value)}
          />
        </div>
      </InputBox>
      <FollowBox>
        <header>
          <FollowTab
            onClick={() => setFollowTab("following")}
            active={followTab === "following"}
          >
            Following
          </FollowTab>
          <FollowTab
            onClick={() => setFollowTab("followers")}
            active={followTab === "followers"}
          >
            Followers
          </FollowTab>
        </header>
        <main>
          {selfDetails[followTab]?.map((user: object) => (
            <UserCardWithFollowBtn user={user} selfDetails={selfDetails} />
          ))}
        </main>
      </FollowBox>

      <SaveAll onClick={handleSave} disabled={uploading}>
        {" "}
        {!uploading ? (
          "Save Changes"
        ) : (
          <CircularProgress
            size={20}
            thickness={6}
            sx={{
              color: "white",
            }}
          />
        )}
      </SaveAll>
    </>
  );
}
function Setting_Home({ selfDetails, setActiveSection }: SectionProps) {
  return (
    <>
      {/* <BackgroundBanner>
        <span>
          <BackBtn />
        </span>
      </BackgroundBanner> */}
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
        <p onClick={() => setActiveSection(Section.general)}>Edit Profile</p>
        <span>
          <ChevronRightIcon />
        </span>
      </Button>
    </>
  );
}
function Setting_Password({ selfDetails, setActiveSection }: SectionProps) {
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  // Pre-fill the form with the password
  useEffect(() => {
    setPassword(selfDetails?.password);
  }, [selfDetails]);

  // Save changes
  async function handleSave() {
    setLoading(() => true);
    await updateUserPasswordInfo({
      password,
    });
    setLoading(() => false);
  }
  return (
    <>
      <InputBox
        style={{
          marginTop: "50px",
        }}
      >
        <div>
          <label>Password</label>
          <input
            type="text"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
      </InputBox>
      <SaveAll onClick={handleSave} disabled={loading}>
        {!loading ? (
          "Save Password"
        ) : (
          <CircularProgress
            size={20}
            thickness={6}
            sx={{
              color: "white",
            }}
          />
        )}
      </SaveAll>
    </>
  );
}
function Setting_LikedBlogs({ selfDetails, setActiveSection }: SectionProps) {
  return (
    <>
      {selfDetails?.likedBlogs?.length > 0 ? (
        <BlogsLiked blogs={selfDetails.likedBlogs} />
      ) : (
        <Msg>No liked blogs found!</Msg>
      )}
    </>
  );
}
function Setting_SavedBlogs({ selfDetails, setActiveSection }: SectionProps) {
  return (
    <>
      {selfDetails?.savedBlogs?.length > 0 ? (
        <BlogsSaved blogs={selfDetails.savedBlogs} />
      ) : (
        <Msg>No Saved blogs found!</Msg>
      )}
    </>
  );
}
function Setting_FavouriteTopics({
  selfDetails,
  setActiveSection,
}: SectionProps) {
  const [topics, setTopics] = useState<Topic[]>([]);
  const [selectedTopics, setSelectedTopics] = useState<Topic[]>([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  useEffect(() => {
    async function fetchTopics() {
      const topicsArr = await getAllTopics();
      const favTopics = selfDetails.favoriteTopics;
      const restTopicsArr = topicsArr.filter((topic) => {
        for (const favTopic of favTopics) {
          if (favTopic.id === topic.id) {
            return false;
          }
        }
        return true;
      });
      console.log(favTopics, restTopicsArr);
      setTopics(restTopicsArr);
      setSelectedTopics(favTopics);
    }
    fetchTopics();
  }, [selfDetails]);
  async function handleTopicsSubmit() {
    setLoading(() => true);
    const favoriteTopics = selectedTopics.map((topic) => topic.id);
    await setFavouriteTopics({ favoriteTopics });
    setLoading(() => false);
  }
  return (
    <SelectorBox>
      <TopicSelector
        setSelectedTopics={setSelectedTopics}
        selectedTopics={selectedTopics}
        topics={topics}
        setTopics={setTopics}
        blog={false}
      />
      <Button disabled={loading} onClick={handleTopicsSubmit}>
        {!loading ? (
          "Save Changes"
        ) : (
          <CircularProgress
            size={20}
            thickness={6}
            sx={{
              color: "white",
            }}
          />
        )}
      </Button>
    </SelectorBox>
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

const StyledTextarea = styled.textarea`
  /* min-height: 50px; */
  resize: none;
  overflow-y: hidden;
`;
export function AutoResizingTextarea({
  value,
  handleOnChange,
}: {
  value: string;
  handleOnChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
}) {
  const textareaRef = useRef(null);

  useEffect(() => {
    const textarea = textareaRef.current;
    if (!textarea) return;
    textarea.style.height = "auto";
    textarea.style.height = `${textarea.scrollHeight}px`;
  }, [value]);

  return (
    <StyledTextarea ref={textareaRef} value={value} onChange={handleOnChange} />
  );
}
