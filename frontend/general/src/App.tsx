import { BrowserRouter, Routes, Route } from "react-router-dom";
import Auth from "./page/Auth/Auth";
function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="authorization" element={<Auth />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
