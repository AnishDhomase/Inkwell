import { useEffect, useState } from "react";
import { clearNotifications, getMostFollowedUsers } from "../../apis/api";
import PersonIcon from "@mui/icons-material/Person";
import NotificationsIcon from "@mui/icons-material/Notifications";
import Badge from "@mui/material/Badge";
import IconButton from "@mui/material/IconButton";
import styled, { keyframes } from "styled-components";
// import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
// import BookmarkBorderIcon from "@mui/icons-material/BookmarkBorder";
// import FavoriteIcon from "@mui/icons-material/Favorite";
// import BookmarkIcon from "@mui/icons-material/Bookmark";
import { motion, AnimatePresence } from "framer-motion";
import CircularProgress from "@mui/material/CircularProgress";
import BookmarkBorderIcon from "@mui/icons-material/BookmarkBorder";
import ChevronRightIcon from "@mui/icons-material/ChevronRight"; //small

import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";

const Nav = styled.nav`
  padding: 10px 20px;
  display: flex;
  justify-content: space-between;
  background-color: #f9f9f9;
  @media (max-width: 480px) {
    padding: 10px 10px;
  }
`;
const Logo = styled.h1`
  font-size: 30px;
  font-weight: 800;
  color: #ff7738;
  font-family: cursive;
`;
const RightBox = styled.div`
  display: flex;
  gap: 10px;
`;
const CircleBorder = styled.div`
  border: 1px solid #dcdbdb;
  border-radius: 50%;
`;
const Main = styled.main`
  display: flex;
  justify-content: space-between;
  padding-bottom: 0;
  @media (max-width: 800px) {
    padding-bottom: 70px;
  }
`;
interface LeftSecProps {
  fullWidth: boolean;
}
const LeftSec = styled.div<LeftSecProps>`
  width: ${(props) => (props.fullWidth ? "100%" : "70%")};
  /* padding: 20px ${(props) => (props.fullWidth ? "0" : "20px")}; */
  padding: 0 ${(props) => (props.fullWidth ? "0" : "20px")};
  padding-top: 20px;
  @media (max-width: 1020px) {
    width: 100%;
  }
  @media (max-width: 480px) {
    padding: 20px 10px;
  }
`;
const RightSec = styled.div`
  /* max-height: 100vh;
  overflow-x: hidden;
  overflow-y: auto; */
  position: sticky;
  max-height: 103vh;
  top: 0;
  display: flex;
  flex-direction: column;
  gap: 40px;
  width: 30%;
  padding: 20px;
  padding-left: 0;
  /* border-left: 2px solid #f8f5f5; */
  h4 {
    font-size: 20px;
    font-weight: 700;
    color: #333;
  }
  @media (max-width: 1020px) {
    display: none;
  }
`;
const Banner = styled.div`
  width: 100%;
  min-height: 200px;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 10px;
  font-size: 20px;
  background: #f0f1f3;
`;
const Info = styled.div`
  p {
    margin-top: 10px;
    font-size: 15px;
    color: #908e8e;
  }
`;
const FollowSuggestions = styled.div``;
const Users = styled.div`
  padding-top: 15px;
  display: flex;
  flex-direction: column;
  gap: 10px;
`;
const Row = styled.div`
  gap: 10px;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;
const FollowButton = styled.button`
  font-size: 17px;
  padding: 2px 5px;
  background-color: transparent;
  border: 1px solid #3856ff;
  color: #3856ff;
  border-radius: 5px;
  &:hover {
    cursor: pointer;
    scale: 1.015;

    background-color: #3856ff;
    border: 1px solid transparent;
    color: white;
  }
  &:active {
    opacity: 0.8;
  }
`;
const TextBtn = styled.button`
  background-color: transparent;
  border: none;
  margin-top: 15px;
  font-weight: 400;
  font-size: 15px;
  color: #3856ff;
  &:hover {
    cursor: pointer;
    text-decoration: underline;
  }
`;

interface NotificationPanelProps {
  noNotifactions: boolean;
}
const NotificationPanel = styled(motion.div)<NotificationPanelProps>`
  min-width: ${(props) => (props.noNotifactions ? "160px" : "300px")};
  position: absolute;
  border: 1px solid #c4bfbf;
  right: 20px;
  border-radius: 10px;
  padding: 10px;
  background-color: #f9f9f9;
  display: flex;
  flex-direction: column;
  align-items: ${(props) => (props.noNotifactions ? "center" : "flex-start")};
  gap: 10px;
  z-index: 100;
`;
const Button = styled.button`
  width: 100%;
  font-size: 17px;
  padding: 8px 20px;
  background-color: #ff7738;
  color: white;
  border: none;
  border-radius: 5px;
  &:hover {
    cursor: pointer;
    scale: 1.015;
  }
  &:active {
    opacity: 0.8;
  }
`;
const Notification = styled.div`
  width: 100%;
  border-bottom: 1px solid #e9e2e2;
`;

// type activePage = "home" | "search" | "add" | "liked" | "saved";
type activePage = "home" | "search" | "add" | "account";

export default function Layout({
  selfDetails,
  notifications,
}: {
  selfDetails: any;
  notifications: string[];
}) {
  const [isNotificationOpen, setIsNotificationOpen] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [activePage, setActivePage] = useState<activePage>("home");
  const [mostFollowedUsers, setMostFollowedUsers] = useState<object[]>([]);

  const navigate = useNavigate();
  const location = useLocation();

  // When Route changes update active page
  useEffect(() => {
    if (location.pathname.startsWith("/app/search")) {
      setActivePage("search");
    } else if (location.pathname === "/app/create") {
      setActivePage("add");
    } else if (location.pathname.startsWith("/app/account")) {
      setActivePage("account");
    } else if (location.pathname.startsWith("/app")) {
      setActivePage("home");
    }
  }, [location]);

  //  Fetch most followed users
  useEffect(() => {
    async function fetchMostFollowedUsers() {
      const users = await getMostFollowedUsers();
      setMostFollowedUsers(users);
    }
    fetchMostFollowedUsers();
  }, []);
  console.log(mostFollowedUsers);

  //   Clear notifications
  async function handleClearNotifications() {
    setLoading(() => true);
    const success = await clearNotifications();
    setLoading(() => false);
    if (success) {
      setTimeout(() => {
        setNotifications([]);
      }, 1000);
    }
  }

  return (
    <div>
      <Nav>
        <Link to="/app">
          <Logo>Inkwell</Logo>
        </Link>
        <RightBox>
          {selfDetails?.id ? (
            <>
              {/* <CircleBorder>
                <IconButton aria-label="delete">
                  <Badge badgeContent={0} max={9} color="primary">
                    <PersonIcon color="action" />
                  </Badge>
                </IconButton>
              </CircleBorder> */}

              <CircleBorder
                onClick={() => setIsNotificationOpen(!isNotificationOpen)}
              >
                <IconButton aria-label="delete">
                  <Badge
                    badgeContent={notifications.length}
                    max={9}
                    color="primary"
                  >
                    <NotificationsIcon color="action" />
                  </Badge>
                </IconButton>
              </CircleBorder>
            </>
          ) : (
            <Button onClick={() => navigate("/authorization")}>Login</Button>
          )}
          <AnimatePresence mode="popLayout">
            {isNotificationOpen && (
              <NotificationPanel
                initial={{
                  opacity: 0,
                  scale: 0,
                  y: -50,
                  x: 130,
                }}
                animate={{
                  opacity: 1,
                  scale: 1,
                  y: 60,
                  x: 0,
                }}
                exit={{
                  opacity: 0,
                  scale: 0,
                  y: -50,
                  x: 130,
                }}
                transition={{
                  duration: 1,
                  ease: "backInOut",
                }}
                noNotifactions={notifications.length == 0}
              >
                {notifications.length ? (
                  <>
                    {notifications.map((content, ind) => (
                      <Notification>{content}</Notification>
                    ))}
                    <Button
                      disabled={loading}
                      onClick={handleClearNotifications}
                    >
                      {!loading ? (
                        "Clear All"
                      ) : (
                        <CircularProgress size={20} thickness={6} />
                      )}
                    </Button>
                  </>
                ) : (
                  "No notifications!"
                )}
              </NotificationPanel>
            )}
          </AnimatePresence>
        </RightBox>
      </Nav>
      <Main>
        <LeftSec
          fullWidth={
            !(
              location.pathname.startsWith("/app/search") ||
              location.pathname === "/app"
            )
          }
        >
          <Outlet />
        </LeftSec>
        {(location.pathname.startsWith("/app/search") ||
          location.pathname === "/app") && (
          <RightSec>
            <Banner>Inkwell Plus is coming soon!</Banner>
            {location.pathname !== "/app/search/users" && (
              <>
                <FollowSuggestions>
                  <h4>Who to Follow</h4>
                  <Users>
                    {mostFollowedUsers?.map((user) => (
                      <Row key={user.id}>
                        <UserCard
                          userId={user.id}
                          username={user.username}
                          profilePicURL={user.profilePicURL}
                        >
                          {`${user._count.followers} Follower${
                            user._count.followers === 1 ? "" : "s"
                          }`}
                        </UserCard>
                        <Link to={`/app/user/${user.id}`}>
                          <ChevronRightIcon />
                        </Link>
                      </Row>
                    ))}
                  </Users>
                  <Link to="/app/search/users">
                    <TextBtn>See more suggestions</TextBtn>
                  </Link>
                </FollowSuggestions>

                <Info>
                  <h4>Reading list</h4>
                  <p>
                    Click the
                    <BookmarkBorderIcon
                      style={{
                        verticalAlign: "middle",
                        color: "#c3bfbd",
                      }}
                    />{" "}
                    on any story to easily add it to your reading list.
                  </p>
                </Info>
              </>
            )}
          </RightSec>
        )}
      </Main>
      {/* <Footer></Footer> */}
      <Navbar activePage={activePage} setActivePage={setActivePage} />
    </div>
  );
}

const StyledNav = styled.nav`
  position: fixed;
  bottom: 0;
  top: 0;
  right: 5px;
  margin: auto 0;
  padding: 5px;
  background-color: #ff7738;
  max-height: 200px;
  border-radius: 50px;
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  align-items: center;
  @media (max-width: 800px) {
    max-width: 200px;
    max-height: none;
    flex-direction: row;
    top: auto;
    bottom: 8px;
    right: 0;
    left: 0;
    margin: 0 auto;
  }
`;
const Rod = styled.div`
  position: fixed;
  bottom: 0;
  top: 0;
  right: 5px;
  margin: auto 0;
  padding: 5px;
  background-color: #ff7738;
  max-height: 50px;
  border-radius: 50px;
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  align-items: center;
  cursor: pointer;
  @media (max-width: 1020px) {
    max-height: 70px;
  }
  @media (max-width: 800px) {
    position: fixed;
    top: auto;
    bottom: 8px;
    right: 0;
    left: 0;
    margin: 0 auto;
    max-width: 80px;
    padding: 7px;
  }
`;

import CottageOutlinedIcon from "@mui/icons-material/CottageOutlined";
import CottageIcon from "@mui/icons-material/Cottage";
import { RiSearchFill } from "react-icons/ri";
import { RiSearchLine } from "react-icons/ri";
import PermIdentityOutlinedIcon from "@mui/icons-material/PermIdentityOutlined";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import UserCard from "../../components/UserCard";

function Navbar({
  activePage,
  setActivePage,
}: {
  activePage: activePage;
  setActivePage: (page: activePage) => void;
}) {
  const [showNav, setShowNav] = useState<boolean>(false);
  return (
    <>
      {showNav ? (
        <AnimatePresence mode="popLayout">
          <motion.span
            initial={{
              opacity: 0,
              height: 0,
              x: 330,
            }}
            animate={{
              opacity: 1,
              height: 300,
              x: 0,
            }}
            exit={{
              opacity: 0,
              height: 0,
              x: 330,
            }}
            transition={{
              duration: 0.5,
              ease: "backInOut",
            }}
          >
            <StyledNav onMouseLeave={() => setShowNav(false)}>
              <Link to="/app">
                <IconButton
                  aria-label="delete"
                  sx={{ color: "white" }}
                  onClick={() => {
                    setActivePage("home");
                    setShowNav(false);
                  }}
                >
                  {activePage === "home" ? (
                    <CottageIcon />
                  ) : (
                    <CottageOutlinedIcon />
                  )}
                </IconButton>
              </Link>
              <Link to="/app/search">
                <IconButton
                  aria-label="delete"
                  sx={{ color: "white" }}
                  onClick={() => {
                    setActivePage("search");
                    setShowNav(false);
                  }}
                >
                  {activePage === "search" ? (
                    <RiSearchFill />
                  ) : (
                    <RiSearchLine />
                  )}
                </IconButton>
              </Link>
              <Link to="/app/create">
                <IconButton
                  aria-label="delete"
                  sx={{ color: "white" }}
                  onClick={() => {
                    setActivePage("add");
                    setShowNav(false);
                  }}
                >
                  {activePage === "add" ? (
                    <AddCircleIcon />
                  ) : (
                    <AddCircleOutlineIcon />
                  )}
                </IconButton>
              </Link>
              <Link to="/app/account">
                <IconButton
                  aria-label="delete"
                  sx={{ color: "white" }}
                  onClick={() => {
                    setActivePage("account");
                    setShowNav(false);
                  }}
                >
                  {activePage === "account" ? (
                    <PersonIcon />
                  ) : (
                    <PermIdentityOutlinedIcon />
                  )}
                </IconButton>
              </Link>
              {/* <Link to="/app/create">
                <AddButton
                  active={activePage == "add"}
                  onClick={() => {
                    setActivePage("add");
                    setShowNav(false);
                  }}
                >
                  <IoAddOutline />
                </AddButton>
              </Link> */}
              {/* <Link to="/app/liked-Blogs">
                <IconButton
                  aria-label="delete"
                  sx={{ color: "white" }}
                  onClick={() => {
                    setActivePage("liked");
                    setShowNav(false);
                  }}
                >
                  {activePage === "liked" ? (
                    <FavoriteIcon />
                  ) : (
                    <FavoriteBorderIcon />
                  )}
                </IconButton>
              </Link>
              <Link to="/app/saved-Blogs">
                <IconButton
                  aria-label="delete"
                  sx={{ color: "white" }}
                  onClick={() => {
                    setActivePage("saved");
                    setShowNav(false);
                  }}
                >
                  {activePage === "saved" ? (
                    <BookmarkIcon />
                  ) : (
                    <BookmarkBorderIcon />
                  )}
                </IconButton>
              </Link> */}
            </StyledNav>
          </motion.span>
        </AnimatePresence>
      ) : (
        <Rod onMouseEnter={() => setShowNav(true)} />
      )}
    </>
  );
}
