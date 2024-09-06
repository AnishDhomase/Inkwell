import { setProfilePhoto } from "../../apis/api";
import styled from "styled-components";
import CircularProgress from "@mui/material/CircularProgress";
import { useRef, useState } from "react";

interface HeadingProps {
  wt?: string;
  sz?: string;
  align?: string;
  color?: string;
}
const Heading = styled.h1<HeadingProps>`
  font-weight: ${(props) => props.wt || "900"};
  font-size: ${(props) => props.sz || "38px"};
  color: ${(props) => props.color || "white"};
  margin-bottom: 20px;
  text-align: ${(props) => props.align || "left"};
  @media (min-width: 1250px) {
    & {
      font-size: 55px;
    }
  }
`;
interface ButtonProps {
  width?: string;
  sz?: string;
  mt?: string;
  textColor?: string;
  color?: string;
}
const Button = styled.button<ButtonProps>`
  width: 100%;
  background-color: ${(props) => props.color || "white"};
  color: ${(props) => props.textColor || "#ff7738"};
  max-width: ${(props) => props.width || "250px"};
  font-size: ${(props) => props.sz || "18px"};
  padding: 10px 20px;
  border-radius: 10px;
  outline: none;
  border: none;
  margin-top: ${(props) => props.mt || "20px"};
  cursor: pointer;
  &:hover {
    scale: 1.005;
  }
  &:active {
    opacity: 0.8;
  }
  @media (min-width: 1250px) {
    & {
      max-width: ${(props) => (props.width === "1000px" ? "1000px" : "600px")};
      padding: 15px 20px;
      font-size: 28px;
    }
  }
`;
const ProfilePhotoBox = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
`;
const Img = styled.img`
  width: 120px;
  height: 120px;
  border-radius: 50%;
  border: 2px solid #ff7738;
  overflow: hidden;
`;
// const PlaceholderImg = styled.img`
//   width: 70%;
//   height: 70%;
// `;
const FileInputBox = styled.div`
  border: 2px dashed #ff7738;
  display: flex;
  justify-content: center;
  padding: 10px;
  border-radius: 10px;
  cursor: pointer;
  margin-bottom: 30px;
`;

export default function ProfilePhoto({
  setStep,
}: {
  setStep: (step: number) => void;
}) {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(
    "../../../public/placeholderBlogImage.webp"
  );
  const [uploading, setUploading] = useState(false);
  const ref = useRef<HTMLInputElement>(null);
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFile(e.target.files[0]);
      setPreview(URL.createObjectURL(e.target.files[0]));
    }
  };
  async function handleUpload() {
    setUploading(true);
    const success = await setProfilePhoto(file);
    // @ts-expect-error number/function input error
    if (success) setStep((step: number) => step + 1);
    setUploading(false);
  }
  return (
    <>
      <Heading align="center" sz="30px">
        Select Profile Photo
      </Heading>
      <ProfilePhotoBox>
        {preview && (
          <Img
            src={preview || "../../../public/placeholderBlogImage.webp"}
            alt="preview"
          />
        )}
        {/* {!preview && (
          <PlaceholderImg src="../../../public/user.png" alt="preview" />
        )} */}
      </ProfilePhotoBox>
      <Heading align="center" sz="20px" color="#ff7738">
        username
      </Heading>

      <FileInputBox onClick={() => ref?.current?.click()}>
        <input
          ref={ref}
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          hidden
        />
        Choose File
      </FileInputBox>
      <Button
        color="#ff7738"
        textColor="white"
        width="400px"
        onClick={handleUpload}
        disabled={uploading}
      >
        {!uploading ? "Next" : <CircularProgress size={20} thickness={6} />}
      </Button>
    </>
  );
}
