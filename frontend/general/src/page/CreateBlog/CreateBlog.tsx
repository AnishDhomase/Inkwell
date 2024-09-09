import React, { useEffect, useRef, useState } from "react";
import styled from "styled-components";
import { TopicSelector } from "../Auth/FavTopic";
import { createPost, getAllTopics, getCloudinaryFileURL } from "../../apis/api";
import CircularProgress from "@mui/material/CircularProgress";
import KeyboardBackspaceIcon from "@mui/icons-material/KeyboardBackspace";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { useUserDetails } from "../../hooks";
import { Topic } from "../../utils/types";

const OuterBox = styled.div`
  min-height: 100vh;
  width: 100vw;
  /* padding: 10px; */
  display: flex;
  justify-content: center;
  @media (max-width: 700px) {
    & {
      padding: 0;
    }
  }
`;
const InnerBox = styled.div`
  /* background-color: #fbfafa; */
  background-color: ${({ theme }) => theme.bodySecondary};
  width: 100%;
  overflow-x: hidden;
  max-width: 1000px;
  padding: 40px;
  border-radius: 10px;
  /* border: 1px solid #ff7738; */
  border: 1px solid ${({ theme }) => theme.borderColor};
  display: flex;
  flex-direction: column;
  gap: 20px;
  @media (max-width: 1000px) {
    border: none;
  }
  @media (max-width: 800px) {
    & {
      padding: 20px;
    }
  }
  @media (max-width: 700px) {
    & {
      padding: 10px;
      border-radius: 0;
    }
  }
  @media (max-width: 450px) {
    & {
      padding: 5px;
    }
  }
`;

const Button = styled.button`
  background-color: #ff7738;
  color: white;
  font-size: 18px;
  padding: 10px 20px;
  border-radius: 10px;
  outline: none;
  border: none;
  cursor: pointer;
  &:hover {
    scale: 1.005;
  }
  &:active {
    opacity: 0.8;
  }
  @media (min-width: 1250px) {
    & {
      font-size: 25px;
    }
  }
`;

const Input = styled.input`
  font-weight: 700;
  border-radius: 10px;
  padding: 12px 18px;
  width: 100%;
  /* background-color: transparent; */
  /* background-color: #f5f2f2; */
  background-color: ${({ theme }) => theme.bodyPrimary};
  color: ${({ theme }) => theme.text};
  border: 1px solid gray;
  outline: none;

  font-size: 18px;
  &:focus {
    border: 1px solid #ff7738;
  }
  @media (min-width: 1250px) {
    & {
      font-size: 25px;
    }
  }
`;
const TextArea = styled.textarea`
  /* background-color: #f5f2f2; */
  /* background-color: transparent; */
  background-color: ${({ theme }) => theme.bodyPrimary};

  color: ${({ theme }) => theme.text};

  border-radius: 10px;
  padding: 12px 18px;
  width: 100%;
  min-height: 300px;
  border: 1px solid gray;
  outline: none;
  resize: none;

  font-size: 18px;
  &:focus {
    border: 1px solid #ff7738;
  }
  @media (min-width: 1250px) {
    & {
      font-size: 25px;
    }
  }
`;

const ProfilePhotoBox = styled.div`
  width: 100%;
  overflow-x: hidden;
  border-radius: 10px;
  border: 2px solid #2c1a12;
  overflow: hidden;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #f5f2f2;
`;
const Img = styled.img`
  width: 100%;
  overflow-x: hidden;
`;
const FileInputBox = styled.div`
  border: 2px dashed #ff7738;
  background-color: ${({ theme }) => theme.bodySecondary};

  display: flex;
  justify-content: center;
  padding: 10px;
  border-radius: 10px;
  cursor: pointer;
  @media (min-width: 1250px) {
    & {
      border: 3px dashed #ff7738;
      font-size: 25px;
    }
  }
`;
const Row = styled.div`
  display: flex;
  gap: 20px;
  justify-content: space-between;
  align-items: start;
  @media (max-width: 1000px) {
    flex-direction: column;
  }
`;
const LeftBox = styled.div`
  border: 1px solid gray;

  padding: 10px;
  /* background-color: #f5f2f2; */
  background-color: ${({ theme }) => theme.bodyPrimary};

  border-radius: 20px;
  width: 50%;
  display: flex;
  flex-direction: column;
  gap: 20px;

  @media (max-width: 1000px) {
    width: 100%;
  }
  @media (max-width: 480px) {
    width: 100%;
    border-radius: 15px;
    padding: 5px;
    gap: 10px;
  }
`;
const RightBox = styled.div`
  border: 1px solid gray;

  border-radius: 20px;
  padding: 10px;
  /* background-color: #f5f2f2; */
  background-color: ${({ theme }) => theme.bodyPrimary};

  width: 50%;
  & div {
    width: 100%;
  }
  @media (max-width: 1000px) {
    width: 100%;
  }
  @media (max-width: 480px) {
    border-radius: 15px;
    padding: 5px;
  }
`;
const H1 = styled.h1`
  color: #ff7738;
  font-size: 35px;
  text-align: center;
  @media (min-width: 1250px) {
    & {
      font-size: 50px;
    }
  }
`;
const H3 = styled.h3`
  color: #ffa176;
  font-size: 25px;
  margin-bottom: 20px;
  text-align: center;
  padding: 10px 0px;
  @media (min-width: 1250px) {
    & {
      font-size: 30px;
    }
  }
`;
const BackButton = styled.span`
  border: 1px solid #ff7738;
  position: absolute;
  top: 0px;
  bottom: 0px;
  left: 0px;
  z-index: 1;
  color: white;
  margin: auto 0;
  background-color: #ff7738;
  padding: 5px 8px;
  border-radius: 50px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  &:hover {
    scale: 1.05;
  }
  /* @media (min-width: 1250px) {
    & {
      top: 20px;
      scale: 1.5;
    }
  }
  @media (max-width: 1130px) and (min-width: 1070px) {
    top: 53px;
    left: 90px;
    border: 1px solid #ff7738;
  }
  @media (max-width: 1070px) {
    top: 53px;
    left: 50px;
    border: 1px solid #ff7738;
  }
  @media (max-width: 800px) {
    top: 33px;
    left: 30px;
    border: 1px solid #ff7738;
  }
  @media (max-width: 700px) {
    top: 13px;
    left: 10px;
    border: 1px solid #ff7738;
  }
  @media (max-width: 450px) {
    top: 8px;
    left: 5px;
    border: 1px solid #ff7738;
  } */
`;
const NavBar = styled.div`
  position: relative;
  margin-bottom: 20px;
`;

export default function CreateBlog() {
  const { selfDetails } = useUserDetails();
  const [preview, setPreview] = useState<string | null>();
  const [topics, setTopics] = useState<Topic[]>([]);
  const [file, setFile] = useState<File | null>(null);
  const [selectedTopics, setSelectedTopics] = useState<Topic[]>([]);
  const [title, setTitle] = useState<string>("");
  const [content, setContent] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const ref = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFile(e.target.files[0]);
      setPreview(URL.createObjectURL(e.target.files[0]));
    }
  };
  useEffect(() => {
    async function fetchTopics() {
      const topicsArr = await getAllTopics();
      setTopics(topicsArr);
    }
    fetchTopics();
  }, []);
  async function handleBlogSubmit() {
    if (!selfDetails?.id) {
      toast.error("Login/Signup to create a blog");
      return;
    }
    if (!content || !title)
      return toast.error("Title and Content are required");
    setLoading(() => true);
    const topics = selectedTopics.map((topic) => topic.id);
    let imageURL;
    if (file) {
      imageURL = await getCloudinaryFileURL(file);
      if (!imageURL) return;
    }
    const success = await createPost({
      topics,
      title,
      content,
      imageURL,
    });
    if (success) {
      setTitle("");
      setContent("");
      setSelectedTopics([]);
      setPreview(null);
      setFile(null);
      const topicsArr = await getAllTopics();
      setTopics(topicsArr);
    }
    setLoading(() => false);
  }
  const handleFileInputBtnClick = () => {
    ref.current?.click();
  };
  return (
    <OuterBox>
      <InnerBox>
        <NavBar>
          <BackButton onClick={() => navigate("/app")}>
            <KeyboardBackspaceIcon />
          </BackButton>
          <H1>Create Blog</H1>
        </NavBar>
        <Row>
          <LeftBox>
            <ProfilePhotoBox>
              <Img
                src={
                  preview ||
                  "https://res.cloudinary.com/dwfvgrn9g/image/upload/v1725806791/placeholderBlogImage_iugz3d.webp"
                }
                alt="preview"
              />
            </ProfilePhotoBox>

            <FileInputBox onClick={handleFileInputBtnClick}>
              <input
                ref={ref}
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                hidden
              />
              Select Image
            </FileInputBox>
          </LeftBox>
          <RightBox>
            <H3>
              {!selectedTopics.length
                ? "Select Topics from below"
                : "Selected Topic(s)"}
            </H3>

            <div
              style={{
                display: "flex",
                gap: "20px",
                flexDirection: "column",
                alignItems: "center",
              }}
            >
              {topics.length || selectedTopics.length ? (
                <TopicSelector
                  setSelectedTopics={setSelectedTopics}
                  selectedTopics={selectedTopics}
                  topics={topics}
                  setTopics={setTopics}
                  blog={true}
                />
              ) : (
                <CircularProgress
                  size={60}
                  thickness={2}
                  style={{ margin: "50px 0" }}
                />
              )}
            </div>
          </RightBox>
        </Row>
        <Input
          type="text"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        <TextArea
          placeholder="Content"
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />
        <Button onClick={handleBlogSubmit} disabled={loading}>
          {!loading ? "Post" : <CircularProgress size={20} thickness={6} />}
        </Button>
      </InnerBox>
    </OuterBox>
  );
}
