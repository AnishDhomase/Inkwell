import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";
import {
  followUser,
  getSelfDetails,
  getUserDetails,
  unfollowUser,
} from "../apis/api";
import toast from "react-hot-toast";

interface UserBoxProps {
  imageURL: string;
}
const UserProfile = styled.div<UserBoxProps>`
  width: 80px;
  height: 80px;
  border-radius: 50%;
  position: relative;
  background-image: url(${(props) => props.imageURL});
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  border: 1px solid #393939;
  @media (max-width: 360px) {
    width: 60px;
    height: 60px;
  }
  @media (max-width: 345px) {
    width: 80px;
    height: 80px;
    transform: translateY(15px);
  }
  &:hover {
    cursor: pointer;
    border: 2px solid #3856ff;
  }
`;
const UserBox = styled.div`
  font-size: 18px;
  font-weight: 500;
  display: flex;
  justify-content: space-between;
  align-items: center;
  cursor: pointer;
  display: flex;
  gap: 20px;
  padding-bottom: 30px;
  border-bottom: 1px solid #e8e5e5;
  @media (max-width: 400px) {
    gap: 10px;
  }
  @media (max-width: 345px) {
    flex-direction: column;
    align-items: flex-start;
  }
`;
const UserDetails = styled.div`
  display: flex;
  flex-direction: column;
  &:hover h1 {
    text-decoration: underline;
  }
  h1 {
    font-size: 22px;
  }
  h2 {
    font-size: 16px;
    font-weight: 400;
    color: #a09d9d;
  }
  & > p {
    font-size: 16px;
    font-weight: 400;
  }
  footer {
    display: flex;
    gap: 10px;

    div {
      display: flex;
      gap: 5px;
      font-size: 16px;
      p {
        color: #a09d9d;
      }
    }
  }
`;
const Left = styled.div`
  display: flex;
  gap: 20px;
  align-items: center;
  @media (max-width: 400px) {
    gap: 10px;
  }
  @media (max-width: 345px) {
    gap: 20px;
  }
`;
const Right = styled.div`
  @media (max-width: 345px) {
    padding-left: 100px;
    margin-top: -20px;
  }
`;
const FollowBtn = styled.button`
  padding: 5px 10px;
  background-color: #3856ff;
  color: #fff;
  border: none;
  border-radius: 5px;
  &:hover {
    cursor: pointer;
    scale: 1.02;
  }
`;

export default function UserSearchCard({
  user,
  selfDetails,
  setSelfDetails,
  setNotifications,
}: {
  user: object;
  selfDetails: object;
  setSelfDetails: (details: object) => void;
  setNotifications: (notifications: string[]) => void;
}) {
  const [follow, setFollow] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [followersCnt, setFollowersCnt] = useState<number>(
    user._count.followers
  );
  // Pre-fill Follow and Unfollow status
  useEffect(() => {
    if (!selfDetails?.id) return;
    const result = selfDetails.following?.some(
      (aUser: object) => aUser.id === user.id
    );
    setFollow(result);
  }, [selfDetails, user]);

  // Handle Follow and Unfollow
  async function handleFollow(
    event: React.MouseEvent<HTMLDivElement, MouseEvent>
  ) {
    event.preventDefault();
    if (!selfDetails?.id) {
      toast.error("Login/Signup to follow the user");
      return;
    }
    setLoading(true);
    if (follow) {
      // Unfollow
      const res = await unfollowUser({ followId: user.id });
      if (res) {
        setFollow(false);
        setFollowersCnt(followersCnt - 1);

        // Fetch self details again to update following list
        const details = await getSelfDetails();
        setSelfDetails(details);
        setNotifications(details?.notifications);
      }
    } else {
      // Follow
      const res = await followUser({ followId: user.id });
      if (res) {
        setFollow(true);
        setFollowersCnt(followersCnt + 1);

        // Fetch self details again to update following list
        const details = await getSelfDetails();
        setSelfDetails(details);
        setNotifications(details?.notifications);
      }
    }
    setLoading(false);
  }
  return (
    <Link to={`/app/user/${user.id}`}>
      <UserBox>
        <Left>
          <UserProfile
            imageURL={
              user.profilePicURL || "../../../public/placeholderBlogImage.webp"
            }
          />
          <UserDetails>
            <h1>{user.name}</h1>
            <footer>
              <div>
                <span>{followersCnt}</span>
                <p>{user._count.followers === 1 ? "Follower" : "Followers"}</p>
              </div>
              <div>
                <span>{user._count.blogs}</span>
                <p>{user._count.blogs === 1 ? "Blog" : "Blogs"}</p>
              </div>
            </footer>
          </UserDetails>
        </Left>
        {selfDetails?.id !== user.id && (
          <Right>
            <FollowBtn onClick={handleFollow} disabled={loading}>
              {follow ? "Following" : "Follow"}
            </FollowBtn>
          </Right>
        )}
      </UserBox>
    </Link>
  );
}
