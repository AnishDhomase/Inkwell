import { useState } from "react";
import styled from "styled-components";

interface BallProps {
  on: boolean;
}
const Toggle = styled.div<BallProps>`
  height: 28px;
  width: 42px;
  background-color: ${(props) => (props.on ? "#3856ff" : "#ddd")};
  border-radius: 50px;
  display: flex;
  align-items: center;
  justify-content: ${(props) => (props.on ? "flex-end" : "flex-start")};
  padding: 0 5px;
`;
const Ball = styled.span`
  height: 20px;
  width: 20px;
  background-color: #fff;
  border-radius: 50%;
  display: inline-block;
`;
export function ToggleButton() {
  const [darkModeOn, setDarkModeOn] = useState(false);
  return (
    <Toggle on={darkModeOn} onClick={() => setDarkModeOn(!darkModeOn)}>
      <Ball />
    </Toggle>
  );
}
