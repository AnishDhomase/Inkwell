import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import KeyboardBackspaceIcon from "@mui/icons-material/KeyboardBackspace";

const BackButton = styled.span`
  cursor: pointer;
  &:hover {
    transform: translateX(-3px);
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
