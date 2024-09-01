import {
  SigninType,
  SignupType,
  userDescriptionInputType,
  profileTopicsType,
  photoInputType,
  blogInputType,
  pageInputType,
  deleteBlogInputType,
  blogSearchInputType,
  commentInputType,
  commentDeleteInputType,
  commentEditInputType,
  userFollowInputType,
  userSearchInputType,
  updateGeneralDetailsInputType,
  updatePasswordDetailsInputType,
} from "@anishdhomase/blog_app";
import axios from "axios";
import toast from "react-hot-toast";

const BASE_URL = "http://127.0.0.1:8787";

// Get JWT Token from Local Storage
function getHeaders() {
  return {
    authorization: `${localStorage.getItem("tokenOfBlogApp")}`,
  };
}

export interface Topic {
  id: number;
  name: string;
}
export interface Blog {
  id: number;
  title: string;
  content: string;
  authorId: number;
  blogImageURL: string;
  createdAt: string;
  active: boolean;
  _count: {
    likedByUsers: number;
  };
}

// Auth
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

// User Signup Process
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

// Post Blog
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

// Get Blogs
export async function getAllBlogs(payload: pageInputType) {
  try {
    const res = await axios.post(`${BASE_URL}/blog`, payload);
    if (res.data.success) {
      return {
        blogArr: res.data.data.allBlogs,
        totalBlogsCount: res.data.data.totalBlogs,
      };
    } else {
      toast.error("Something went wrong, Try Again");
      return {};
    }
  } catch (e) {
    if (!axios.isAxiosError(e)) toast.error("Something went wrong, Try Again");
    else toast.error(e.response?.data?.error);
    return {};
  }
}
export async function getBlogsOfTopic(
  payload: pageInputType,
  topicName: string
) {
  try {
    const res = await axios.post(
      `${BASE_URL}/blog/search/${topicName}`,
      payload
    );
    if (res.data.success) {
      return {
        blogArr: res.data.data.allBlogs,
        totalBlogsCount: res.data.data.totalBlogs,
      };
    } else {
      toast.error("Something went wrong, Try Again");
      return {};
    }
  } catch (e) {
    if (!axios.isAxiosError(e)) toast.error("Something went wrong, Try Again");
    else toast.error(e.response?.data?.error);
    return {};
  }
}
export async function getQueriedBlogs(payload: blogSearchInputType) {
  try {
    const res = await axios.post(`${BASE_URL}/blog/search`, payload);
    if (res.data.success) {
      return {
        blogArr: res.data.data.allBlogs,
        totalBlogsCount: res.data.data.totalBlogs,
      };
    } else {
      toast.error("Something went wrong, Try Again");
      return {};
    }
  } catch (e) {
    if (!axios.isAxiosError(e)) toast.error("Something went wrong, Try Again");
    else toast.error(e.response?.data?.error);
    return {};
  }
}
export async function getBlog(payload: number) {
  try {
    const res = await axios.get(`${BASE_URL}/blog/${payload}`);
    if (res.data.success) {
      return res.data.data;
    } else {
      toast.error("Something went wrong, Try Again");
      return {};
    }
  } catch (e) {
    if (!axios.isAxiosError(e)) toast.error("Something went wrong, Try Again");
    else toast.error(e.response?.data?.error);
    return {};
  }
}

// Blog Actions
export async function likeBlog(payload: deleteBlogInputType): Promise<boolean> {
  try {
    const res = await axios.post(`${BASE_URL}/user/blog/like`, payload, {
      headers: getHeaders(),
    });
    if (res.data.success) {
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
export async function unlikeBlog(
  payload: deleteBlogInputType
): Promise<boolean> {
  try {
    const res = await axios.post(`${BASE_URL}/user/blog/unlike`, payload, {
      headers: getHeaders(),
    });
    if (res.data.success) {
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
export async function saveBlog(payload: deleteBlogInputType): Promise<boolean> {
  try {
    const res = await axios.post(`${BASE_URL}/user/blog/save`, payload, {
      headers: getHeaders(),
    });
    if (res.data.success) {
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
export async function unsaveBlog(
  payload: deleteBlogInputType
): Promise<boolean> {
  try {
    const res = await axios.post(`${BASE_URL}/user/blog/unsave`, payload, {
      headers: getHeaders(),
    });
    if (res.data.success) {
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
export async function commentOnBlog(
  payload: commentInputType
): Promise<boolean> {
  try {
    const res = await axios.post(`${BASE_URL}/user/blog/comment`, payload, {
      headers: getHeaders(),
    });
    if (res.data.success) {
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
export async function deleteCommentOnBlog(
  payload: commentDeleteInputType
): Promise<boolean> {
  try {
    const res = await axios.delete(
      `${BASE_URL}/user/blog/comment/${payload.commentId}`,
      {
        headers: getHeaders(),
      }
    );
    if (res.data.success) {
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
export async function editCommentOnBlog(
  payload: commentEditInputType
): Promise<boolean> {
  try {
    const res = await axios.put(`${BASE_URL}/user/blog/comment`, payload, {
      headers: getHeaders(),
    });
    if (res.data.success) {
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

// User Details
export async function clearNotifications() {
  try {
    const res = await axios.delete(`${BASE_URL}/user/notifications`, {
      headers: getHeaders(),
    });
    if (res.data.success) {
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
export async function getSelfDetails() {
  try {
    const res = await axios.get(`${BASE_URL}/user/details`, {
      headers: getHeaders(),
    });
    if (res.data.success) {
      return res.data.data;
    } else {
      toast.error("Something went wrong, Try Again 1");
      return null;
    }
  } catch (e) {
    if (!axios.isAxiosError(e))
      toast.error("Something went wrong, Try Again 2");
    else toast.error(e.response?.data?.error);
    return null;
  }
}

// Get User
export async function getUser(payload: number): Promise<object> {
  try {
    const res = await axios.get(`${BASE_URL}/user/userDetails/${payload}`);
    if (res.data.success) {
      return res.data.data;
    } else {
      toast.error("Something went wrong, Try Again");
      return {};
    }
  } catch (e) {
    if (!axios.isAxiosError(e)) toast.error("Something went wrong, Try Again");
    else toast.error(e.response?.data?.error);
    return {};
  }
}
export async function getUserDetails(payload: number): Promise<object> {
  try {
    const res = await axios.get(`${BASE_URL}/user/details/${payload}`);
    if (res.data.success) {
      return res.data.data;
    } else {
      toast.error("Something went wrong, Try Again");
      return {};
    }
  } catch (e) {
    if (!axios.isAxiosError(e)) toast.error("Something went wrong, Try Again");
    else toast.error(e.response?.data?.error);
    return {};
  }
}
export async function getMostFollowedUsers(): Promise<object[]> {
  try {
    const res = await axios.get(`${BASE_URL}/user/mostFollowed`, {
      headers: getHeaders(),
    });
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
export async function getQueriedUsers(payload: userSearchInputType) {
  try {
    const res = await axios.post(`${BASE_URL}/user/search`, payload);
    if (res.data.success) {
      return {
        userArr: res.data.data.allUsers,
        totalUsersCount: res.data.data.totalUsers,
      };
    } else {
      toast.error("Something went wrong, Try Again");
      return {};
    }
  } catch (e) {
    if (!axios.isAxiosError(e)) toast.error("Something went wrong, Try Again");
    else toast.error(e.response?.data?.error);
    return {};
  }
}

// User Actions
export async function followUser(
  payload: userFollowInputType
): Promise<boolean> {
  try {
    const res = await axios.post(`${BASE_URL}/user/follow`, payload, {
      headers: getHeaders(),
    });
    if (res.data.success) {
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
export async function unfollowUser(
  payload: userFollowInputType
): Promise<boolean> {
  try {
    const res = await axios.post(`${BASE_URL}/user/unfollow`, payload, {
      headers: getHeaders(),
    });
    console.log(res);
    if (res.data.success) {
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

// User Settings Actions
export async function updateUserGeneralInfo(
  payload: updateGeneralDetailsInputType,
  file: File | null
): Promise<boolean> {
  try {
    let fileUrl;
    if (file) {
      fileUrl = await getCloudinaryFileURL(file);
      if (!fileUrl) {
        toast.error("Something went wrong, Try Again");
        return false;
      }
    }
    if (fileUrl) {
      const payload1 = { url: fileUrl } as photoInputType;
      const res = await axios.post(`${BASE_URL}/user/photo`, payload1, {
        headers: getHeaders(),
      });
      if (!res.data.success) {
        toast.error("Something went wrong, Try Again");
        return false;
      }
    }
    const res2 = await axios.put(`${BASE_URL}/user/details/general`, payload, {
      headers: getHeaders(),
    });
    if (res2.data.success) {
      toast.success("Successfully Updated your Information");
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
export async function updateUserPasswordInfo(
  payload: updatePasswordDetailsInputType
): Promise<boolean> {
  try {
    const res = await axios.put(`${BASE_URL}/user/details/password`, payload, {
      headers: getHeaders(),
    });
    if (res.data.success) {
      toast.success("Successfully Updated your Password");
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
