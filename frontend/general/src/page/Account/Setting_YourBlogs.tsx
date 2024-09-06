import styled from "styled-components";
import Blogs from "../../components/Blogs";
import { Msg, SectionProps } from "./Account";

/* eslint-disable react-refresh/only-export-components */
const YourBlogs = styled.div`
  width: 70%;
  min-width: 500px;
  margin: 0 auto;
  @media (max-width: 550px) {
    min-width: 0;
    width: 100%;
  }
  @media (max-width: 450px) {
    min-width: 0;
    width: 100%;
    margin-top: -50px;
  }
`;
export default function Setting_YourBlogs({ selfDetails }: SectionProps) {
  return (
    <YourBlogs>
      {selfDetails && selfDetails?.blogs && selfDetails?.blogs?.length > 0 ? (
        <Blogs
          blogs={selfDetails?.blogs}
          userBlogs={{
            likedBlogs: [],
            savedBlogs: [],
          }}
        />
      ) : (
        <Msg>No blogs found!</Msg>
      )}
    </YourBlogs>
  );
}
