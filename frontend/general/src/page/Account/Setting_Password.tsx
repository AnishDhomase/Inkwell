import { useEffect, useState } from "react";
import { SectionProps } from "./Account";
import { updateUserPasswordInfo } from "../../apis/api";
import styled from "styled-components";
import { CircularProgress } from "@mui/material";

/* eslint-disable react-refresh/only-export-components */
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
    background-color: transparent;
    color: ${({ theme }) => theme.text};
    font-size: 18px;
    outline: none;
    /* resize: none; */
    &:focus {
      border-bottom: 2px solid #a2b0ff;
    }
  }
  textarea {
    /* min-height: 100px; */
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

export default function Setting_Password({ selfDetails }: SectionProps) {
  const [password, setPassword] = useState<string>("");
  const [loading, setLoading] = useState(false);

  // Pre-fill the form with the password
  useEffect(() => {
    setPassword(selfDetails?.password || "");
  }, [selfDetails]);

  // Save changes
  async function handleSave() {
    setLoading(() => true);
    await updateUserPasswordInfo({
      password,
    });
    setLoading(() => false);
  }
  return (
    <>
      <InputBox
        style={{
          marginTop: "50px",
        }}
      >
        <div>
          <label>Password</label>
          <input
            type="text"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
      </InputBox>
      <SaveAll onClick={handleSave} disabled={loading}>
        {!loading ? (
          "Save Password"
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
