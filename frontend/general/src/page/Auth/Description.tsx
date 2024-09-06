import CircularProgress from "@mui/material/CircularProgress";
import { useState } from "react";
import styled from "styled-components";
import { postSelfBio } from "../../apis/api";

interface HeadingProps {
  wt?: string;
  sz?: string;
  mt?: string;
  align?: string;
  color?: string;
}
const Heading = styled.h1<HeadingProps>`
  font-weight: ${(props) => props.wt || "900"};
  font-size: ${(props) => props.sz || "38px"};
  color: ${(props) => props.color || "white"};
  margin-top: ${(props) => props.mt || "0px"};
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
  margin-top: ${(props) => props.mt || "0px"};
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
const TextArea = styled.textarea`
  width: 100%;
  max-width: 400px;
  height: 40vh;
  max-height: 350px;
  padding: 15px;
  border-radius: 10px;
  outline: none;
  border: 1px solid gray;
  font-size: 18px;
  color: #ff7738;
  background-color: transparent;
  margin: 15px 0;
  margin-top: 25px;
  &:focus {
    border: 1px solid #ff7738;
  }
  @media (min-width: 1250px) {
    & {
      max-width: 600px;
      font-size: 25px;
      padding: 20px;
    }
  }
`;

export default function Description({
  setStep,
}: {
  setStep: (step: number) => void;
}) {
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleBioSubmit() {
    setLoading(() => true);
    const success = await postSelfBio({ description });
    //@ts-expect-error number/function input problem
    if (success) setStep((step) => step + 1);
    setLoading(() => false);
  }
  return (
    <>
      <Heading align="center" sz="32px" mt="30px">
        Your Bio
      </Heading>
      <TextArea
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        placeholder="Write a short description about yourself..."
      ></TextArea>
      <Button
        color="#ff7738"
        textColor="white"
        width="400px"
        disabled={loading}
        onClick={handleBioSubmit}
      >
        {!loading ? "Next" : <CircularProgress size={20} thickness={6} />}
      </Button>
    </>
  );
}
