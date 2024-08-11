import { SigninType } from "@anishdhomase/blog_app";
import axios from "axios";
import toast from "react-hot-toast";

const BASE_URL = "http://127.0.0.1:8787";

const headers = {
  authorization: `Bearer ${localStorage.getItem("tokenOfBlogApp")}`,
};

export async function signIn(payload: SigninType) {
  try {
    const res = await axios.post(`${BASE_URL}/user/signin`, payload, {
      headers,
    });
    if (res.data.success) {
      localStorage.setItem("tokenOfBlogApp", res.data.data.token);
      toast.success("Successfully Signed In");
      return true;
    }
    return false;
  } catch (e) {
    if (!axios.isAxiosError(e)) toast.error("Something went wrong, Try Again");
    else toast.error(e.response?.data?.error);
    return false;
  }
}
