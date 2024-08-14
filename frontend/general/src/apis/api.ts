import {
  SigninType,
  SignupType,
  userDescriptionInputType,
  profileTopicsType,
  photoInputType,
  blogInputType,
  pageInputType,
} from "@anishdhomase/blog_app";
import axios from "axios";
import toast from "react-hot-toast";

const BASE_URL = "http://127.0.0.1:8787";

// const headers = {
//   authorization: `${localStorage.getItem("tokenOfBlogApp")}`,
// };
function getHeaders() {
  return {
    authorization: `${localStorage.getItem("tokenOfBlogApp")}`,
  };
}

export async function signIn(payload: SigninType) {
  try {
    const res = await axios.post(`${BASE_URL}/user/signin`, payload);
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
export async function signUp(payload: SignupType) {
  try {
    const res = await axios.post(`${BASE_URL}/user/signup`, payload);
    if (res.data.success) {
      localStorage.setItem("tokenOfBlogApp", res.data.data.token);
      toast.success("Successfully Signed Up");
      return true;
    }
    return false;
  } catch (e) {
    if (!axios.isAxiosError(e)) toast.error("Something went wrong, Try Again");
    else toast.error(e.response?.data?.error);
    return false;
  }
}
export async function postSelfBio(payload: userDescriptionInputType) {
  try {
    const res = await axios.post(`${BASE_URL}/user/description`, payload, {
      headers: getHeaders(),
    });
    if (res.data.success) {
      toast.success("Successfully Added Bio");
      return true;
    } else {
      toast.error("Something went wrong, Try Again 1");
      return false;
    }
  } catch (e) {
    if (!axios.isAxiosError(e)) toast.error("Something went wrong, Try Again");
    else toast.error(e.response?.data?.error);
    return false;
  }
}
export interface Topic {
  id: number;
  name: string;
}
export async function getAllTopics(): Promise<Topic[]> {
  try {
    const res = await axios.get(`${BASE_URL}/topic`);
    if (res.data.success) {
      return res.data.data;
    } else {
      toast.error("Something went wrong, Try Again");
      return [];
    }
  } catch (e) {
    if (!axios.isAxiosError(e)) toast.error("Something went wrong, Try Again");
    else toast.error(e.response?.data?.error);
    return [];
  }
}
export async function setFavouriteTopics(payload: profileTopicsType) {
  try {
    const res = await axios.post(`${BASE_URL}/user/topics`, payload, {
      headers: getHeaders(),
    });
    if (res.data.success) {
      toast.success("Successfully Added Favourite Topics");
      return true;
    } else {
      toast.error("Something went wrong, Try Again");
      return false;
    }
  } catch (e) {
    if (!axios.isAxiosError(e)) toast.error("Something went wrong, Try Again");
    else toast.error(e.response?.data?.error);
    return false;
  }
}
export async function getCloudinaryFileURL(file: File | null) {
  if (!file) {
    toast.error("Please select a file");
    return "";
  }
  try {
    const formData = new FormData();
    formData.append("file", file);
    formData.append(
      "upload_preset",
      import.meta.env.VITE_CLOUDINARY_upload_preset as string
    );
    const response = await axios.post(
      import.meta.env.VITE_CLOUDINARY_url as string,
      formData
    );
    return response.data.secure_url;
  } catch {
    toast.error("Error in uploading file");
    return "";
  }
}
export async function setProfilePhoto(file: File | null) {
  try {
    const fileUrl = await getCloudinaryFileURL(file);
    if (!fileUrl) return false;
    const payload = { url: fileUrl } as photoInputType;
    const res = await axios.post(`${BASE_URL}/user/photo`, payload, {
      headers: getHeaders(),
    });
    if (res.data.success) {
      toast.success("Successfully Uploaded Profile Photo");
      return true;
    } else {
      toast.error("Something went wrong, Try Again");
      return false;
    }
  } catch (e) {
    if (!axios.isAxiosError(e)) toast.error("Something went wrong, Try Again");
    else toast.error(e.response?.data?.error);
    return false;
  }
}
export async function createPost(payload: blogInputType) {
  try {
    const res = await axios.post(`${BASE_URL}/user/blog`, payload, {
      headers: getHeaders(),
    });
    if (res.data.success) {
      toast.success("Successfully Posted Blog");
      return true;
    } else {
      toast.error("Something went wrong, Try Again");
      return false;
    }
  } catch (e) {
    if (!axios.isAxiosError(e)) toast.error("Something went wrong, Try Again");
    else toast.error(e.response?.data?.error);
    return false;
  }
}
export interface Blog {
  id: number;
  title: string;
  content: string;
  authorId: number;
  blogImageURL: string;
  createdAt: string;
  active: boolean;
}
export async function getAllBlogs(payload: pageInputType): Promise<Blog[]> {
  try {
    const res = await axios.post(`${BASE_URL}/blog`, payload);
    if (res.data.success) {
      return res.data.data;
    } else {
      toast.error("Something went wrong, Try Again");
      return [];
    }
  } catch (e) {
    if (!axios.isAxiosError(e)) toast.error("Something went wrong, Try Again");
    else toast.error(e.response?.data?.error);
    return [];
  }
}
