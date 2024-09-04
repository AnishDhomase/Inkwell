import { Comment } from "react-loader-spinner";
import styled from "styled-components";

const Container = styled.div`
  background-color: ${({ theme }) => theme.bodyPrimary};
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  width: 100vw;
`;

export default function PageLoader() {
  return (
    <Container>
      <Comment
        visible={true}
        height="80"
        width="80"
        ariaLabel="comment-loading"
        wrapperStyle={{}}
        wrapperClass="comment-wrapper"
        color="#fff"
        backgroundColor="#ff7738"
      />
    </Container>
  );
}
