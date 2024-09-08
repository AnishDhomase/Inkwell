import { lazy, Suspense, useEffect, useState } from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import { getSelfDetails } from "../../apis/api";
import PageLoader from "../../components/PageLoader";
import { useUserDetails } from "../../hooks";
const LoginSignup = lazy(() => import("./LoginSignup"));
const Description = lazy(() => import("./Description"));
const FavTopic = lazy(() => import("./FavTopic"));
const ProfilePhoto = lazy(() => import("./ProfilePhoto"));

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
  /* & img {
    display: none;
  } */
  & b {
    margin-left: 5px;
  }
  @media (min-width: 820px) {
    & button {
      display: none;
    }
    /* & img {
      display: block;
    } */
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
interface StepperBoxProps {
  heightAdjust: boolean;
}
const StepperBox = styled.div<StepperBoxProps>`
  width: 100%;
  position: absolute;
  top: 5%;
  left: 0;
  right: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  @media (max-height: 800px) {
    position: ${(props) => (props.heightAdjust ? "relative" : "absolute")};
    margin-bottom: 60px;
  }
`;
const Stepper = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  max-width: 400px;
  position: relative;

  @media (min-width: 1250px) {
    & {
      max-width: 600px;
    }
  }
  @media (max-width: 420px) {
    & {
      margin: 0 5px;
    }
  }
`;
interface StepBoxProps {
  bgClr: string;
  txtClr: string;
  borderClr: string;
}
const StepBox = styled.span<StepBoxProps>`
  height: 40px;
  width: 40px;
  border-radius: 50%;
  background-color: ${(props) => props.bgClr};
  border: 1px solid ${(props) => props.borderClr};
  display: flex;
  justify-content: center;
  align-items: center;
  color: ${(props) => props.txtClr};
  font-size: 20px;
  font-weight: 900;
`;
const ProgressBar = styled.div`
  position: absolute;
  z-index: -1;
  top: 0;
  bottom: 0;
  margin: auto;
  left: 0;
  height: 5px;
  width: 100%;
  background-color: #e6dddd;
`;
interface ProgressProps {
  width?: string;
}
const Progress = styled.div<ProgressProps>`
  height: 100%;
  width: ${(props) => props.width || "0%"};
  background-color: #57bb8d;
`;
interface SkipProps {
  heightAdjust: boolean;
}
const Skip = styled.div<SkipProps>`
  width: 100%;
  position: absolute;
  bottom: 5%;
  left: 0;
  right: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 0 5px;
  @media (min-width: 820px) {
    & {
      display: none;
    }
  }
  @media (max-height: 800px) {
    position: ${(props) => (props.heightAdjust ? "relative" : "absolute")};
  }
`;

export default function Auth() {
  const { setSelfDetails, setNotifications } = useUserDetails();
  const [step, setStep] = useState<number>(1);
  const pageMap = [
    { Component: <LoginSignup setStep={setStep} /> },
    { Component: <ProfilePhoto setStep={setStep} /> },
    { Component: <Description setStep={setStep} /> },
    { Component: <FavTopic /> },
  ];
  const navigate = useNavigate();

  //  Refetch self details on every step change
  useEffect(() => {
    if (step === 1) return;
    async function fetchSelfDetails() {
      const details = await getSelfDetails();
      setSelfDetails(details);
      setNotifications(details?.notifications || []);
    }
    fetchSelfDetails();
  }, [step, setSelfDetails, setNotifications]);

  function getProgressWidth(): string {
    return `${((step - 1) / (pageMap.length - 1)) * 100}%`;
  }
  function getBgClr(index: number) {
    if (index + 1 < step) return "#57bb8d";
    if (index + 1 === step) return "#ff7738";
    return "white";
  }
  function getTxtClr(index: number) {
    if (index + 1 <= step || index + 1 === step) return "white";
    return "#ff7738";
  }
  function getBorderClr(index: number) {
    if (index + 1 < step) return "#57bb8d";
    return "#ff7738";
  }
  return (
    <Suspense fallback={<PageLoader />}>
      <OuterBox>
        <LeftBox>
          <Row>
            <Logo
              width="60px"
              alt="logo"
              src="https://res.cloudinary.com/dwfvgrn9g/image/upload/v1725807341/logoWhite_vnzsqg.png"
            />
          </Row>

          <Heading mt="30px">Start Your Learning Journey With Inkwell.</Heading>
          <Text fontSz="20px">
            Discover the world's best community of freelancers and phylosophers
          </Text>
          <Button width="1000px" onClick={() => navigate("/")}>
            Skip
          </Button>
        </LeftBox>
        <RightBox>
          <StepperBox heightAdjust={step === 4}>
            <Stepper>
              {pageMap.map((_, index) => (
                <StepBox
                  key={index}
                  bgClr={getBgClr(index)}
                  txtClr={getTxtClr(index)}
                  borderClr={getBorderClr(index)}
                >
                  {index + 1}
                </StepBox>
              ))}

              <ProgressBar>
                <Progress width={getProgressWidth()} />
              </ProgressBar>
            </Stepper>
          </StepperBox>

          {pageMap[step - 1].Component}

          <Skip heightAdjust={step === 4}>
            <Button width="400px" mt="10px" onClick={() => navigate("/")}>
              Skip
            </Button>
          </Skip>
        </RightBox>
      </OuterBox>
    </Suspense>
  );
}
