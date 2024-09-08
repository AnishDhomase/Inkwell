import ModeEditOutlineIcon from "@mui/icons-material/ModeEditOutline";
import UserCardWithFollowBtn from "../../components/UserCardWithFollowBtn";
import { SectionProps } from "./Account";
import { useEffect, useRef, useState } from "react";
import { updateUserGeneralInfo } from "../../apis/api";
import styled from "styled-components";
import { CircularProgress } from "@mui/material";
import { AutoResizingTextarea } from "../../components/AutoResizingTextarea";

/* eslint-disable react-refresh/only-export-components */
const ProfilePhotoBox = styled.div`
  width: 150px;
  height: 150px;
  border-radius: 50%;
  /* border: 2px solid #ff7738; */
  border: 2px solid black;
  overflow: hidden;
  display: flex;
  justify-content: center;
  align-items: center;
  /* background-color: #e3dede; */
  background-color: ${({ theme }) => theme.bodySecondary};
  margin: 0 auto;
  @media (max-width: 450px) {
    width: 200px;
    height: 200px;
  }
`;
const Img = styled.img`
  height: 100%;
  width: 100%;
`;
const FileInputBox = styled.div`
  height: 25px;
  width: 25px;
  position: absolute;
  z-index: 100;
  bottom: 0;
  right: 0;
  left: 0;
  background-color: black;
  border: 2px solid white;
  color: white;
  padding: 5px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  margin: 0 auto;
  transform: translate(55px, -15px);
  @media (max-width: 450px) {
    height: 30px;
    width: 30px;
    transform: translate(65px, -15px);
  }
  svg {
    font-size: 16px;
  }
  &:hover {
    background-color: #3856ff;
  }
`;
interface ProfilePhotoBoxProps {
  uploading: boolean;
}
const EditPhoto = styled.div<ProfilePhotoBoxProps>`
  position: relative;
  // uploading overlay
  main {
    position: absolute;
    right: 0;
    left: 0;
    bottom: 0;
    margin: 0 auto;
    width: 150px;
    height: 150px;
    background-color: ${(props) =>
      props.uploading ? "rgba(0,0,0,0.5)" : "transparent"};
    border-radius: 50%;
    display: ${(props) => (props.uploading ? "flex" : "none")};
    justify-content: center;
    align-items: center;
    @media (max-width: 450px) {
      width: 200px;
      height: 200px;
    }
  }
`;
const InputBox = styled.div`
  width: 60%;
  min-width: 400px;
  display: flex;
  flex-direction: column;
  gap: 20px;
  margin: 0 auto;
  margin-top: 20px;
  @media (max-width: 450px) {
    width: 100%;
    min-width: 0;
  }
  div {
    display: flex;
    flex-direction: column;
    gap: 0px;

    label {
      font-size: 18px;
      font-weight: 500;
      /* color: #3856ff; */
      color: ${({ theme }) => theme.rightPanelTxtBtn};
    }
  }
  input,
  textarea {
    width: 100%;
    padding: 10px 0;
    border: none;
    border-bottom: 2px solid #e9e5e5;
    font-size: 18px;
    outline: none;
    background-color: transparent;
    /* resize: none; */
    color: ${({ theme }) => theme.text};
    &:focus {
      border-bottom: 2px solid #a2b0ff;
    }
  }
  textarea {
    /* min-height: 100px; */
  }
`;
const FollowBox = styled.section`
  width: 60%;
  min-width: 400px;
  margin: 0 auto;
  margin-top: 40px;
  @media (max-width: 450px) {
    width: 100%;
    min-width: 0;
  }
  header {
    display: flex;
    gap: 20px;
    align-items: center;
  }
  main {
    display: flex;
    flex-direction: column;
    gap: 20px;
    margin-top: 20px;
  }
`;
interface FollowTabProps {
  active: boolean;
}
const FollowTab = styled.button<FollowTabProps>`
  font-size: 18px;
  font-weight: 600;
  padding: 5px 0px;
  background-color: transparent;
  color: ${(props) =>
    props.active ? props.theme.rightPanelTxtBtn : "#a09d9d"};
  border: none;
  border-bottom: 2px solid transparent;
  cursor: pointer;
  &:hover {
    border-bottom: 2px solid
      ${(props) => (props.active ? "#3856ff" : "#a09d9d")};
  }
`;
const SaveAll = styled.button`
  padding: 10px 15px;
  background-color: #3856ff;
  color: white;
  border: none;
  border-radius: 5px;
  margin: 0 auto;
  display: block;
  margin-top: 80px;
  font-size: 18px;
  cursor: pointer;
  margin-bottom: 20px;
  &:hover {
  }
`;

export default function Setting_General({ selfDetails }: SectionProps) {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [uploading, setUploading] = useState(true);
  const [name, setName] = useState(selfDetails?.name);
  const [description, setDescription] = useState(selfDetails?.description);
  const [followTab, setFollowTab] = useState<"following" | "followers">(
    "following"
  );
  const ref = useRef<HTMLInputElement>(null);

  // Handle file change
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFile(e.target.files[0]);
      setPreview(URL.createObjectURL(e.target.files[0]));
    }
  };

  // Pre-fill the form with the name, description and profilePicURL
  useEffect(() => {
    setUploading(() => true);
    setPreview(
      selfDetails?.profilePicURL ||
        "https://res.cloudinary.com/dwfvgrn9g/image/upload/v1725806791/placeholderBlogImage_iugz3d.webp"
    );
    setName(selfDetails?.name);
    setDescription(selfDetails?.description);
    setUploading(() => false);
  }, [selfDetails]);

  // Auto resize the textarea
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  useEffect(() => {
    const textarea = textareaRef.current;
    if (!textarea) return;
    textarea.style.height = "auto";
    textarea.style.height = `${textarea.scrollHeight}px`;
  }, [description]);

  // Save all changes
  async function handleSave() {
    setUploading(() => true);
    await updateUserGeneralInfo(
      {
        name,
        description,
      },
      file
    );
    setUploading(() => false);
  }
  return (
    <>
      <EditPhoto uploading={uploading}>
        <ProfilePhotoBox>
          {preview && (
            <Img
              src={
                preview ||
                "https://res.cloudinary.com/dwfvgrn9g/image/upload/v1725806791/placeholderBlogImage_iugz3d.webp"
              }
              alt="preview"
            />
          )}
        </ProfilePhotoBox>
        <FileInputBox onClick={() => ref?.current?.click()}>
          <input
            ref={ref}
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            hidden
          />
          <ModeEditOutlineIcon />
        </FileInputBox>
        <main>
          <CircularProgress
            size={20}
            thickness={6}
            sx={{
              color: "white",
            }}
          />
        </main>
      </EditPhoto>
      <InputBox>
        <div>
          <label>Name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>
        <div>
          <label>Description</label>

          <AutoResizingTextarea
            value={description || ""}
            handleOnChange={(e) => setDescription(e.target.value)}
          />
        </div>
      </InputBox>
      <FollowBox>
        <header>
          <FollowTab
            onClick={() => setFollowTab("following")}
            active={followTab === "following"}
          >
            Following
          </FollowTab>
          <FollowTab
            onClick={() => setFollowTab("followers")}
            active={followTab === "followers"}
          >
            Followers
          </FollowTab>
        </header>
        <main>
          {selfDetails &&
            selfDetails[followTab]?.map((user) => (
              <UserCardWithFollowBtn user={user} selfDetails={selfDetails} />
            ))}
        </main>
      </FollowBox>

      <SaveAll onClick={handleSave} disabled={uploading}>
        {!uploading ? (
          "Save Changes"
        ) : (
          <CircularProgress
            size={20}
            thickness={6}
            sx={{
              color: "white",
            }}
          />
        )}
      </SaveAll>
    </>
  );
}
