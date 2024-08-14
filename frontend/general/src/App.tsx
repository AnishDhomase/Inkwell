import { BrowserRouter, Routes, Route } from "react-router-dom";
import Auth from "./page/Auth/Auth";
import { UserDetailsProvider } from "./context/UserDetailContext";
import CreateBlog from "./page/CreateBlog/CreateBlog";
import Home from "./page/Home/Home";
function App() {
  return (
    <UserDetailsProvider>
      <BrowserRouter>
        <Routes>
          <Route index element={<Home />} />
          <Route path="authorization" element={<Auth />} />
          <Route path="blog/create" element={<CreateBlog />} />
        </Routes>
      </BrowserRouter>
    </UserDetailsProvider>
  );
}

export default App;
