import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

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
  return (
    <UserDetailsProvider>
      <BrowserRouter>
        <Routes>
          <Route index element={<Navigate replace to="app" />} />
          <Route path="authorization" element={<Auth />} />
          <Route path="app" element={<Layout />}>
            {/* Home Page */}
            <Route index element={<Home />} />

            {/* Search Page */}
            <Route path="search">
              <Route index element={<Navigate replace to="blogs" />} />
              <Route path="blogs" element={<Search />} />
              <Route path="users" element={<Search />} />
              <Route path="*" element={<Navigate replace to="blogs" />} />
            </Route>

            {/* Create Blog Page */}
            <Route path="create" element={<CreateBlog />} />

            {/* Account Page */}
            <Route path="account">
              <Route index element={<Navigate replace to="home" />} />
              <Route path="home" element={<Account />} />
              <Route path="general" element={<Account />} />
              <Route path="password" element={<Account />} />
              <Route path="your-blogs" element={<Account />} />
              <Route path="liked-blogs" element={<Account />} />
              <Route path="saved-blogs" element={<Account />} />
              <Route path="favourite-topics" element={<Account />} />
              <Route path="*" element={<Navigate replace to="home" />} />
            </Route>

            {/* Specific Blog Page */}
            <Route path="blog/:blogId" element={<SpecificBlog />} />

            {/* Specific User Page */}
            <Route path="user/:userId" element={<SpecificUser />} />
          </Route>
          <Route path="*" element={<Navigate replace to="app" />} />
        </Routes>
      </BrowserRouter>
    </UserDetailsProvider>
  );
}

export default App;
