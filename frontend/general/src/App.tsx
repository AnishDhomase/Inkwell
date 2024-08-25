import { BrowserRouter, Routes, Route } from "react-router-dom";
import Auth from "./page/Auth/Auth";
import { UserDetailsProvider } from "./context/UserDetailContext";
import Home from "./page/Home/Home";
import Layout from "./page/Layout/Layout";
import { useEffect, useState } from "react";
import { getSelfDetails } from "./apis/api";
import CreateBlog from "./page/CreateBlog/CreateBlog";
import Search from "./page/Search/Search";
import SpecificBlog from "./page/Blog/SpecificBlog";
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
            <Route
              path="search"
              element={<Search selfDetails={selfDetails} />}
            />
            <Route path="create" element={<CreateBlog />} />
            <Route path="account" element={<p>Account</p>} />
            <Route
              path="blog/:blogId"
              element={<SpecificBlog selfDetails={selfDetails} />}
            />
            {/* <Route path="liked-Blogs" element={<p>liked-Blogs</p>} /> */}
            {/* <Route path="saved-Blogs" element={<p>saved-Blogs</p>} /> */}
          </Route>
        </Routes>
      </BrowserRouter>
    </UserDetailsProvider>
  );
}

export default App;
