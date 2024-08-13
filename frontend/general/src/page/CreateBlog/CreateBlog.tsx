import React, { useEffect, useRef, useState } from "react";
import styled from "styled-components";
import { TopicSelector } from "../Auth/FavTopic";
import {
  createPost,
  getAllTopics,
  getCloudinaryFileURL,
  Topic,
} from "../../apis/api";
import CircularProgress from "@mui/material/CircularProgress";
import KeyboardBackspaceIcon from "@mui/icons-material/KeyboardBackspace";
import { useNavigate } from "react-router-dom";

const OuterBox = styled.div`
  background-color: #ada8a8;
  min-height: 100vh;
  width: 100vw;
  padding: 10px;
  display: flex;
  justify-content: center;
  @media (max-width: 480px) {
    & {
      padding: 0;
    }
  }
`;
const InnerBox = styled.div`
  background-color: white;
  width: 100%;
  max-width: 1000px;
  padding: 40px;
  border-radius: 10px;
  /* border: 1px solid #ff7738; */
  display: flex;
  flex-direction: column;
  gap: 20px;
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
`;

const Input = styled.input`
  border-radius: 10px;
  padding: 12px 18px;
  width: 100%;
  background-color: transparent;
  background-color: #f5f2f2;

  border: 1px solid gray;
  outline: none;

  font-size: 18px;
  &:focus {
    border: 1px solid #ff7738;
  }
`;
const TextArea = styled.textarea`
  background-color: #f5f2f2;

  border-radius: 10px;
  padding: 12px 18px;
  width: 100%;
  min-height: 300px;
  /* background-color: transparent; */
  border: 1px solid gray;
  outline: none;
  resize: none;

  font-size: 18px;
  &:focus {
    border: 1px solid #ff7738;
  }
`;

const ProfilePhotoBox = styled.div`
  width: 100%;
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
`;
const FileInputBox = styled.div`
  border: 2px dashed #ff7738;
  display: flex;
  justify-content: center;
  padding: 10px;
  border-radius: 10px;
  cursor: pointer;
`;
const Row = styled.div`
  display: flex;
  gap: 20px;
  justify-content: space-between;
  align-items: stretch;
`;
const LeftBox = styled.div`
  border: 1px solid gray;

  padding: 10px;
  background-color: #f5f2f2;
  border-radius: 20px;
  width: 50%;
  display: flex;
  flex-direction: column;
  gap: 20px;
`;
const RightBox = styled.div`
  border: 1px solid gray;

  border-radius: 20px;
  padding: 10px;
  background-color: #f5f2f2;

  width: 50%;
  & div {
    width: 100%;
  }
`;
const H1 = styled.h1`
  color: #ff7738;
  font-size: 35px;
  margin-bottom: 20px;
  text-align: center;
`;
const H3 = styled.h3`
  color: #ffa176;
  font-size: 25px;
  margin-bottom: 20px;
  text-align: center;
`;
const BackButton = styled.span`
  position: absolute;
  top: 10px;
  left: 20px;
  z-index: 1;
  color: #ff7738;
  background-color: white;
  padding: 5px 5px;
  border-radius: 50px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  &:hover {
    scale: 1.05;
  }
`;

export default function CreateBlog() {
  const [preview, setPreview] = useState<string | null>();
  const [topics, setTopics] = useState<Topic[]>([]);
  const [file, setFile] = useState<File | null>(null);
  const [selectedTopics, setSelectedTopics] = useState<Topic[]>([]);
  const [title, setTitle] = useState<string>("");
  const [content, setContent] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const ref = useRef(null);

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
    }
    setLoading(() => false);
  }
  return (
    <OuterBox>
      <BackButton onClick={() => navigate("/")}>
        <KeyboardBackspaceIcon />
      </BackButton>
      <InnerBox>
        <H1>Create Blog</H1>
        <Row>
          <LeftBox>
            <ProfilePhotoBox>
              <Img
                src={preview || "../../../public/placeholderBlogImage.webp"}
                alt="preview"
              />
            </ProfilePhotoBox>
            <FileInputBox onClick={() => ref?.current?.click()}>
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
              }}
            >
              <TopicSelector
                setSelectedTopics={setSelectedTopics}
                selectedTopics={selectedTopics}
                topics={topics}
                setTopics={setTopics}
                blog={true}
              />
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
