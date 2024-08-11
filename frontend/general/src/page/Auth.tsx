import { useEffect, useState } from "react";
import styled from "styled-components";

const OuterBox = styled.div`
  min-height: 100vh;
  width: 100vw;
  padding: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  @media (max-width: 480px) {
    & {
      padding: 0;
    }
  }
`;
const LeftBox = styled.div`
  position: relative;
  min-height: 100vh;
  width: 40%;
  background-color: #ff7738;
  padding: 30px 40px;
  border-radius: 10px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 20px;
  @media (min-width: 1250px) {
    & {
      width: 50%;
      padding: 40px;
    }
  }
  @media (max-width: 980px) {
    & {
      padding: 30px 25px;
    }
  }
  @media (max-width: 920px) {
    & {
      width: 45%;
    }
  }
  @media (max-width: 820px) {
    & {
      display: none;
    }
  }
`;
const RightBox = styled.div`
  min-height: 100vh;
  width: 60%;
  padding: 20px;
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  & img {
    display: none;
  }
  & h1,
  & h6 {
    color: #ffab72;
  }
  @media (min-width: 1250px) {
    & {
      width: 50%;
    }
  }
  @media (max-width: 920px) {
    & {
      width: 55%;
    }
  }
  @media (max-width: 820px) {
    & {
      width: 100%;
    }
    & img {
      display: block;
    }
    & h1,
    & h6 {
      color: #ff7738;
    }
    &::before {
      content: "";
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      height: 100%;
      width: 100%;
      z-index: -1;
      border-radius: 10px;
      background-image: radial-gradient(
        circle at top center,
        #ffab72 1px,
        whitesmoke 55%
      );
    }
  }
  @media (max-width: 480px) {
    &::before {
      content: "";
      border-radius: 0px;
      padding: 0;
    }
    & {
      padding: 5px;
    }
  }
`;
interface RowProps {
  fontSz?: string;
  pad?: string;
}
const Row = styled.div<RowProps>`
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: ${(props) => props.fontSz || "18px"};
  padding: ${(props) => props.pad || "0px"};
  & b {
    margin-left: 5px;
  }
  @media (min-width: 820px) {
    & button {
      display: none;
    }
  }
`;
interface LogoProps {
  width?: string;
}
const Logo = styled.img<LogoProps>`
  width: ${(props) => props.width};
  margin: 0 auto;
  @media (min-width: 1250px) {
    & {
      width: 80px;
    }
  }
`;
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
interface TextProps {
  fontSz?: string;
  align?: string;
}
const Text = styled.h6<TextProps>`
  font-weight: 100;
  font-size: ${(props) => props.fontSz || "18px"};
  color: white;
  margin-bottom: 30px;
  text-align: ${(props) => props.align || "left"};
  @media (min-width: 1250px) {
    & {
      font-size: 28px;
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
const InputBox = styled.div`
  position: relative;
  border-radius: 10px;
  width: 100%;
  max-width: 400px;
  background-color: transparent;
  display: flex;
  align-items: center;
  justify-content: space-between;
  @media (min-width: 1250px) {
    & {
      max-width: 600px;
    }
  }
`;
const Input = styled.input`
  border-radius: 10px;
  padding: 12px 18px;
  width: 100%;
  max-width: 400px;
  background-color: transparent;
  border: 1px solid gray;
  outline: none;
  color: #ff7738;
  font-size: 18px;
  &:focus {
    border: 1px solid #ff7738;
  }
  @media (min-width: 1250px) {
    & {
      max-width: 600px;
      font-size: 25px;
      padding: 15px 20px;
    }
  }
`;
const Form = styled.form`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
  margin: 30px 0;
`;
const B = styled.b`
  cursor: pointer;
`;
const EyeIcon = styled.div`
  position: absolute;
  top: 0;
  bottom: 0;
  margin: auto;
  right: 12px;
  display: flex;
  align-items: center;
  cursor: pointer;
  color: gray;
`;

export default function Auth() {
  const [step, setStep] = useState(1);
  return (
    <OuterBox>
      <LeftBox>
        <Row>
          <Logo width="60px" alt="logo" src="../../public/logoWhite.png" />
        </Row>
        <Heading mt="30px">Start Your Learning Journey With Inkwell.</Heading>
        <Text fontSz="20px">
          Discover the world's best community of freelancers and phylosophers
        </Text>
        <Button width="1000px">Skip</Button>
      </LeftBox>
      <RightBox>
        <Row>
          <Logo width="45px" alt="logo" src="../../public/logoWhite.png" />
        </Row>
        {step === 1 && <LoginSignup />}
        <Row>
          <Button width="400px" mt="10px">
            Skip
          </Button>
        </Row>
      </RightBox>
    </OuterBox>
  );
}
import RemoveRedEyeIcon from "@mui/icons-material/RemoveRedEye";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import { signIn } from "../apis/api";
export function LoginSignup() {
  const [login, setLogin] = useState(true);
  const [seePassword, setSeePassword] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    name: "",
    username: "",
  });
  async function handleSubmit() {
    if (login) {
      const success = await signIn({
        email: formData.email,
        password: formData.password,
      });
      console.log(success ? "success" : "error");
    } else {
      // signup
    }
  }
  return (
    <>
      <Heading mt="20px" sz="32px" align="center">
        Welcome {login && "back"}
      </Heading>
      <Text align="center" fontSz="18px">
        Please enter your details to sign {login ? "in" : "up"}.
      </Text>
      {/* Progress Bar */}
      <Form onSubmit={handleSubmit}>
        {!login && (
          <>
            <Input
              type="text"
              placeholder="Name"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
            />
            <Input
              type="text"
              placeholder="Username"
              value={formData.username}
              onChange={(e) =>
                setFormData({ ...formData, username: e.target.value })
              }
            />
          </>
        )}
        <Input
          type="email"
          placeholder="Email"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
        />
        <InputBox>
          <Input
            type={seePassword ? `text` : "password"}
            placeholder="Password"
            maxLength={25}
            value={formData.password}
            onChange={(e) =>
              setFormData({ ...formData, password: e.target.value })
            }
          />
          <EyeIcon onClick={() => setSeePassword(!seePassword)}>
            {!seePassword ? <RemoveRedEyeIcon /> : <VisibilityOffIcon />}
          </EyeIcon>
        </InputBox>
      </Form>
      <Button
        color="#ff7738"
        textColor="white"
        width="400px"
        onClick={handleSubmit}
      >
        Sign {login ? "In" : "Up"}
      </Button>
      <Row pad="15px" fontSz="18px">
        <p>
          {login ? `Don't have an account yet?` : `Already have an account?`}{" "}
        </p>
        <B onClick={() => setLogin(!login)}>Sign {!login ? "In" : "Up"}</B>
      </Row>
    </>
  );
}
