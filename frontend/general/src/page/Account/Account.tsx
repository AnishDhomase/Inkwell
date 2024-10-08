import styled from "styled-components";
import ChevronRightIcon from "@mui/icons-material/ChevronRight"; //small
import { lazy, Suspense, useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import SettingsIcon from "@mui/icons-material/Settings";
import { IconButton } from "@mui/material";

import { getSelfDetails } from "../../apis/api";
import PageLoader from "../../components/PageLoader";
import { ToggleButton } from "../../components/ToggleBtn";
import { useUserDetails } from "../../hooks";
import { SelfDetailsType } from "../../utils/types";

const Setting_General = lazy(() => import("./Setting_General"));
const Setting_Home = lazy(() => import("./Setting_Home"));
const Setting_Password = lazy(() => import("./Setting_Password"));
const Setting_LikedBlogs = lazy(() => import("./Setting_LikedBlogs"));
const Setting_SavedBlogs = lazy(() => import("./Setting_SavedBlogs"));
const Setting_FavouriteTopics = lazy(() => import("./Setting_FavouriteTopics"));
const Setting_YourBlogs = lazy(() => import("./Setting_YourBlogs"));

const Container = styled.div`
  /* margin-top: -20px; */
  display: flex;
  justify-content: space-between;
  min-height: 100vh;
  gap: 20px;
`;
const NavigationPanel = styled.nav`
  margin-top: -20px;
  width: 25%;
  color: ${({ theme }) => theme.text};
  /* background-color: #f6f5f5; */
  background-color: ${({ theme }) => theme.bodySecondary};
  /* height: 100vh; */
  /* padding: 0 20px; */
  & > a {
    cursor: pointer;
    h1 {
      font-size: 33px;
      font-weight: 700;
      padding: 30px 20px;
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
    margin-top: -0;
    width: 100%;
    min-height: 100vh;
    position: fixed;
    top: 0;
    left: 0;
    z-index: 11111;
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
    /* background-color: #3f3d3d; */
    background-color: ${({ theme }) => theme.accountNavPanelSecBg};

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

    background-color: ${(props) =>
      props.active ? props.theme.bodySecondary : "transparent"};
    //rotate  by 45deg
    clip-path: polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%);
  }
  span {
    visibility: ${(props) => (props.active ? "hidden" : "visible")};
    color: #a09d9d;
  }
`;
const StyledToggleButton = styled.div`
  margin-right: 5px;
`;
const PagePath = styled.div`
  font-size: 20px;
  font-weight: 700;
  /* color: #3856ff; */
  color: ${({ theme }) => theme.rightPanelTxtBtn};
  margin-bottom: 20px;
  display: flex;
  align-items: center;
  @media (max-width: 810px) {
    margin-bottom: 40px;
    margin-top: -25px;
  }
  /* @media (max-width: 450px) {
    margin-bottom: 40px;
    transform: translateY(-20px);
  } */
`;
export const Msg = styled.div`
  /* margin-top: 50px; */
  font-size: 20px;
  font-weight: 500;
  color: #a09d9d;
  text-align: center;
`;
interface NavPanelTogglerProps {
  open: boolean;
}
const NavPanelToggler = styled.button<NavPanelTogglerProps>`
  position: fixed;
  top: ${(props) => (props.open ? "20px" : "70px")};
  right: 20px;
  border: none;
  background-color: #f6f5f5;
  border: 1px solid #dcdbdb;
  border-radius: 50%;
  z-index: 111111;
  @media (min-width: 810px) {
    display: none;
  }
  @media (max-width: 480px) {
    right: 10px;
  }
`;
const UnAuthenticated = styled.div`
  min-height: 100vh;
  /* color my orange */
  color: #ff8848;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  /* font-size: 30px; */
  h1 {
    font-size: 35px;
    text-align: center;
    @media (max-width: 400px) {
      font-size: 30px;
    }
    @media (max-width: 340px) {
      font-size: 25px;
    }
  }
  p {
    font-size: 18px;
    color: #a09d9d;
    text-align: center;
    @media (max-width: 400px) {
      font-size: 16px;
    }
  }
`;

// Page Types and Logic
export enum Section {
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
  [Section.yourBlogs]: Setting_YourBlogs,
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
export interface SectionProps {
  selfDetails: SelfDetailsType | undefined;
  setActiveSection: (section: Section) => void;
}

function isPortraitDevice() {
  const viewportWidth = window.innerWidth;
  return viewportWidth < 810;
}

export default function Account() {
  const { selfDetails, setSelfDetails, setNotifications } = useUserDetails();

  // Syncing the active section with the URL
  const categoryOfSettings = useLocation().pathname.split("/")[3];
  const sec = getActivePage(categoryOfSettings);
  const [activeSection, setActiveSection] = useState<Section>(sec);
  const [isNavPanelOpen, setIsNavPanelOpen] = useState(true);

  // Function to Render the active section
  function renderActiveSection() {
    const ActiveComponent = SectionComponents[activeSection];
    return (
      <ActiveComponent
        selfDetails={selfDetails}
        setActiveSection={setActiveSection}
      />
    );
  }

  // Fetch self details again to update self details
  useEffect(() => {
    async function fetchSelfDetails() {
      const details = await getSelfDetails();
      setSelfDetails(details);
      setNotifications(details?.notifications || []);
    }
    fetchSelfDetails();
  }, []);
  if (!selfDetails?.id)
    return (
      <UnAuthenticated>
        <h1>You have not Loged In!</h1>
        <p>Try Login/Signup to See your Account!</p>
      </UnAuthenticated>
    );

  return (
    <Suspense fallback={<PageLoader />}>
      <Container>
        <NavPanelToggler
          onClick={() => setIsNavPanelOpen(!isNavPanelOpen)}
          open={isNavPanelOpen}
        >
          <IconButton aria-label="delete">
            <SettingsIcon />
          </IconButton>
        </NavPanelToggler>
        {isNavPanelOpen && (
          <NavigationPanel>
            <Link to="/app/account/home">
              <h1
                onClick={() => {
                  setActiveSection(Section.home);
                  if (isPortraitDevice()) setIsNavPanelOpen(false);
                }}
              >
                Settings
              </h1>
            </Link>
            <div>
              <SettingSection>
                <header>EDIT PROFILE</header>
                <main>
                  <Link to="/app/account/general">
                    <Row
                      onClick={() => {
                        setActiveSection(Section.general);
                        if (isPortraitDevice()) setIsNavPanelOpen(false);
                      }}
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
                      onClick={() => {
                        setActiveSection(Section.password);
                        if (isPortraitDevice()) setIsNavPanelOpen(false);
                      }}
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
                      onClick={() => {
                        setActiveSection(Section.yourBlogs);
                        if (isPortraitDevice()) setIsNavPanelOpen(false);
                      }}
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
                      onClick={() => {
                        setActiveSection(Section.likedBlogs);
                        if (isPortraitDevice()) setIsNavPanelOpen(false);
                      }}
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
                      onClick={() => {
                        setActiveSection(Section.savedBlogs);
                        if (isPortraitDevice()) setIsNavPanelOpen(false);
                      }}
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
                      onClick={() => {
                        setActiveSection(Section.favouriteTopics);
                        if (isPortraitDevice()) setIsNavPanelOpen(false);
                      }}
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
        )}
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
    </Suspense>
  );
}
