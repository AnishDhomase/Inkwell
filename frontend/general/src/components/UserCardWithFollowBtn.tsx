import styled from "styled-components";
import UserCard from "./UserCard";
import { useEffect, useState } from "react";
import { followUser, getSelfDetails, unfollowUser } from "../apis/api";
import { useUserDetails } from "../context/UserDetailContext";

const Row = styled.div`
  display: flex;
  justify-content: space-between;
  gap: 20px;
  button {
    height: 30px;
    padding: 0 8px;
    background-color: #3856ff;
    color: white;
    border: none;
    border-radius: 5px;
    cursor: pointer;
  }
`;

export default function UserCardWithFollowBtn({
  user,
  selfDetails,
}: {
  user: object;
  selfDetails: object;
}) {
  const { setSelfDetails, setNotifications } = useUserDetails();
  const [follow, setFollow] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);

  // Pre-fill Follow and Unfollow status
  useEffect(() => {
    const result = selfDetails?.following?.some(
      (aUser: object) => aUser.id === user.id
    );
    setFollow(result);
  }, [selfDetails, user]);

  // Handle Follow and Unfollow
  async function handleFollow(
    event: React.MouseEvent<HTMLDivElement, MouseEvent>
  ) {
    event.preventDefault();
    setLoading(true);
    if (follow) {
      // Unfollow
      const res = await unfollowUser({ followId: user.id });
      if (res) {
        setFollow(false);
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
        // Fetch self details again to update following list
        const details = await getSelfDetails();
        setSelfDetails(details);
        setNotifications(details?.notifications);
      }
    }
    setLoading(false);
  }
  return (
    <Row>
      <UserCard
        userId={user.id}
        username={user.username}
        profilePicURL={user.profilePicURL}
      />
      <button onClick={handleFollow} disabled={loading}>
        {follow ? "UnFollow" : "Follow"}
      </button>
    </Row>
  );
}
