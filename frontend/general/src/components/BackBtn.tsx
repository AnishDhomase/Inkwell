import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import KeyboardBackspaceIcon from "@mui/icons-material/KeyboardBackspace";

const BackButton = styled.span`
  cursor: pointer;
  &:hover {
    scale: 1.05;
  }
`;

export default function BackBtn() {
  const navigate = useNavigate();
  return (
    <BackButton onClick={() => navigate(-1)}>
      <KeyboardBackspaceIcon />
    </BackButton>
  );
}
