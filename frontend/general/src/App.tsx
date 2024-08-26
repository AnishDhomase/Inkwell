import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Auth from "./page/Auth/Auth";
import { UserDetailsProvider } from "./context/UserDetailContext";
import Home from "./page/Home/Home";
import Layout from "./page/Layout/Layout";
import { useEffect, useState } from "react";
import { getSelfDetails } from "./apis/api";
import CreateBlog from "./page/CreateBlog/CreateBlog";
import Search from "./page/Search/Search";
import SpecificBlog from "./page/Blog/SpecificBlog";
import SpecificUser from "./page/User/SpecificUser";
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
          <Route path="authorization" element={<Auth />} />
          <Route
            path="app"
            element={
              <Layout selfDetails={selfDetails} notifications={notifications} />
            }
          >
            <Route index element={<Home selfDetails={selfDetails} />} />
            <Route path="search">
              <Route index element={<Navigate replace to="blogs" />} />
              <Route
                path="blogs"
                element={<Search selfDetails={selfDetails} />}
              />
              <Route
                path="users"
                element={<Search selfDetails={selfDetails} />}
              />
              <Route path="*" element={<Navigate replace to="blogs" />} />
            </Route>
            <Route path="create" element={<CreateBlog />} />
            <Route path="account" element={<p>Account</p>} />
            <Route
              path="blog/:blogId"
              element={<SpecificBlog selfDetails={selfDetails} />}
            />
            <Route
              path="user/:userId"
              element={<SpecificUser selfDetails={selfDetails} />}
            />
          </Route>
        </Routes>
      </BrowserRouter>
    </UserDetailsProvider>
  );
}

export default App;
