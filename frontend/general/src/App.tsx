import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { lazy, Suspense } from "react";

import {
  Theme,
  UserDetailsProvider,
  useUserDetails,
} from "./context/UserDetailContext";
import PageLoader from "./components/PageLoader";
import { ThemeProvider } from "styled-components";
import GlobalStyles, { darkTheme, lightTheme } from "./utils/GlobalStyle";

const Auth = lazy(() => import("./page/Auth/Auth"));
const Home = lazy(() => import("./page/Home/Home"));
const Layout = lazy(() => import("./page/Layout/Layout"));
const CreateBlog = lazy(() => import("./page/CreateBlog/CreateBlog"));
const Search = lazy(() => import("./page/Search/Search"));
const SpecificBlog = lazy(() => import("./page/Blog/SpecificBlog"));
const SpecificUser = lazy(() => import("./page/User/SpecificUser"));
const Account = lazy(() => import("./page/Account/Account"));

function App() {
  const { theme } = useUserDetails();
  return (
    <ThemeProvider theme={theme === Theme.LIGHT ? lightTheme : darkTheme}>
      <Suspense fallback={<PageLoader />}>
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
      </Suspense>
    </ThemeProvider>
  );
}

export default App;
