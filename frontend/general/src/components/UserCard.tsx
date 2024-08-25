import styled from "styled-components";

interface UserBoxProps {
  size?: string;
  imageURL: string;
}
const UserProfile = styled.div<UserBoxProps>`
  height: ${(props) => (props.size ? props.size : "35px")};
  width: ${(props) => (props.size ? props.size : "35px")};
  border-radius: 50%;
  position: relative;
  background-image: url(${(props) => props.imageURL});
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  border: 1px solid #393939;
`;
const UserBox = styled.div`
  font-size: 18px;
  font-weight: 500;
  display: flex;
  gap: 5px;
  align-items: center;
  cursor: pointer;
  &:hover p {
    text-decoration: underline;
  }
`;
const UserDetails = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2px;
  span {
    font-size: 12px;
    font-weight: 500;
    color: #909090;
  }
`;

export default function UserCard({
  children,
  username,
  profilePicURL,
}: {
  children?: React.ReactNode;
  username: string;
  profilePicURL: string;
}) {
  return (
    <UserBox>
      <UserProfile
        imageURL={profilePicURL || "../../../public/placeholderBlogImage.webp"}
      />
      <UserDetails>
        <p>{username}</p>
        <span>{children}</span>
      </UserDetails>
    </UserBox>
  );
}
