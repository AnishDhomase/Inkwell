import { keyframes } from "styled-components";
import styled from "styled-components";

const BlogCard = styled.div`
  width: 100%;
  /* border-radius: 10px; */
  display: flex;
  gap: 15px;
  border-bottom: 1px solid #efe9e9;
  padding-bottom: 35px;
  &:hover {
    cursor: pointer;
  }
  &:hover h3 {
    color: #0c1a6b;
    text-decoration: underline;
  }
`;
interface LeftBlogSecProps {
  imageURL: string;
}
const RightBlogSec = styled.div`
  width: 60%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 10px;
  h3 {
    font-size: 20px;
    font-weight: 700;
    color: #333;
  }
  section {
    display: flex;
    align-items: center;
    gap: 10px;
    font-size: 18px;
    color: #a38d8d;
  }
`;

const shimmer = keyframes`
  0% {
    background-position: -468px 0;
  }
  100% {
    background-position: 468px 0;
  }
`;
const ThickRowSkeleton = styled.div`
  height: 24px;
  width: 80%;
  background: #f6f7f8;
  background-image: linear-gradient(
    to right,
    #f6f7f8 0%,
    #edeef1 20%,
    #f6f7f8 40%,
    #f6f7f8 100%
  );
  background-repeat: no-repeat;
  background-size: 800px 104px;
  animation: ${shimmer} 1.5s linear infinite;
`;
const RowSkeleton = styled.div`
  height: 16px;
  width: 100%;
  background: #f6f7f8;
  background-image: linear-gradient(
    to right,
    #f6f7f8 0%,
    #edeef1 20%,
    #f6f7f8 40%,
    #f6f7f8 100%
  );
  background-repeat: no-repeat;
  background-size: 800px 104px;
  animation: ${shimmer} 1.5s linear infinite;
`;
const LeftBlogSecSkeleton = styled.div<LeftBlogSecProps>`
  width: 40%;
  min-height: 160px;
  border-radius: 10px;
  position: relative;
  background-image: linear-gradient(
    to right,
    #f6f7f8 0%,
    #edeef1 20%,
    #f6f7f8 40%,
    #f6f7f8 100%
  );
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  span {
    position: absolute;
    left: 10px;
    border-radius: 50px;
    padding: 5px;
    display: flex;
    cursor: pointer;
    background-color: #f9f9f9;
    border: 1px solid #333;
  }
`;

export default function BlogCardSkeletonLoader() {
  const n = 5;
  return (
    <>
      {Array(n)
        .fill(0)
        .map((_, ind) => (
          <BlogCardSkeleton key={ind} />
        ))}
    </>
  );
}

export function BlogCardSkeleton() {
  return (
    <BlogCard>
      <LeftBlogSecSkeleton imageURL="../../../public/placeholderBlogImage.webp" />
      <RightBlogSec>
        <RowSkeleton />
        <ThickRowSkeleton />
        <RowSkeleton />
      </RightBlogSec>
    </BlogCard>
  );
}
