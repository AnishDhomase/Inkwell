import { Link } from "react-router-dom";
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
  color: ${({ theme }) => theme.rightPanelTitle};
  display: flex;
  flex-direction: column;
  gap: 2px;
  span {
    font-size: 12px;
    font-weight: 500;
    /* color: #989494; */
    color: ${({ theme }) => theme.userCardPartialTxt};
  }
`;

export default function UserCard({
  children,
  userId,
  username,
  profilePicURL,
}: {
  children?: React.ReactNode;
  userId: number | undefined;
  username: string | undefined;
  profilePicURL: string | undefined;
}) {
  return (
    <Link to={`/app/user/${userId}`}>
      <UserBox>
        <UserProfile
          imageURL={
            profilePicURL ||
            "https://res.cloudinary.com/dwfvgrn9g/image/upload/v1725806791/placeholderBlogImage_iugz3d.webp"
          }
        />
        <UserDetails>
          <p>{username}</p>
          <span>{children}</span>
        </UserDetails>
      </UserBox>
    </Link>
  );
}
