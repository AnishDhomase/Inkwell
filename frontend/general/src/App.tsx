import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useEffect, useState } from "react";

import { getSelfDetails } from "./apis/api";
import { UserDetailsProvider } from "./context/UserDetailContext";
import Auth from "./page/Auth/Auth";
import Home from "./page/Home/Home";
import Layout from "./page/Layout/Layout";
import CreateBlog from "./page/CreateBlog/CreateBlog";
import Search from "./page/Search/Search";
import SpecificBlog from "./page/Blog/SpecificBlog";
import SpecificUser from "./page/User/SpecificUser";
import Account from "./page/Account/Account";

function App() {
  const [selfDetails, setSelfDetails] = useState<object>({});
  const [notifications, setNotifications] = useState<string[]>([]);

  //   Fetch self details
  useEffect(() => {
    async function fetchSelfDetails() {
      const details = await getSelfDetails();
      setSelfDetails(details);
      setNotifications(details?.notifications);
    }
    fetchSelfDetails();
  }, []);

  return (
    <UserDetailsProvider>
      <BrowserRouter>
        <Routes>
          <Route index element={<Navigate replace to="app" />} />
          <Route path="authorization" element={<Auth />} />
          <Route
            path="app"
            element={
              <Layout selfDetails={selfDetails} notifications={notifications} />
            }
          >
            {/* Home Page */}
            <Route index element={<Home selfDetails={selfDetails} />} />

            {/* Search Page */}
            <Route path="search">
              <Route index element={<Navigate replace to="blogs" />} />
              <Route
                path="blogs"
                element={
                  <Search
                    selfDetails={selfDetails}
                    setSelfDetails={setSelfDetails}
                    setNotifications={setNotifications}
                  />
                }
              />
              <Route
                path="users"
                element={
                  <Search
                    selfDetails={selfDetails}
                    setSelfDetails={setSelfDetails}
                    setNotifications={setNotifications}
                  />
                }
              />
              <Route path="*" element={<Navigate replace to="blogs" />} />
            </Route>

            {/* Create Blog Page */}
            <Route path="create" element={<CreateBlog />} />

            {/* Account Page */}
            <Route path="account">
              <Route index element={<Navigate replace to="home" />} />
              <Route
                path="home"
                element={<Account selfDetails={selfDetails} />}
              />
              <Route
                path="general"
                element={<Account selfDetails={selfDetails} />}
              />
              <Route
                path="password"
                element={<Account selfDetails={selfDetails} />}
              />
              <Route
                path="your-blogs"
                element={<Account selfDetails={selfDetails} />}
              />
              <Route
                path="liked-blogs"
                element={<Account selfDetails={selfDetails} />}
              />
              <Route
                path="saved-blogs"
                element={<Account selfDetails={selfDetails} />}
              />
              <Route
                path="favourite-topics"
                element={<Account selfDetails={selfDetails} />}
              />
              <Route path="*" element={<Navigate replace to="home" />} />
            </Route>

            {/* Specific Blog Page */}
            <Route
              path="blog/:blogId"
              element={<SpecificBlog selfDetails={selfDetails} />}
            />

            {/* Specific User Page */}
            <Route
              path="user/:userId"
              element={<SpecificUser selfDetails={selfDetails} />}
            />
          </Route>
          <Route path="*" element={<Navigate replace to="app" />} />
        </Routes>
      </BrowserRouter>
    </UserDetailsProvider>
  );
}

export default App;
