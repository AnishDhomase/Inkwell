import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import KeyboardBackspaceIcon from "@mui/icons-material/KeyboardBackspace";

const BackButton = styled.span`
  margin: 10px 0 20px 0;
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
