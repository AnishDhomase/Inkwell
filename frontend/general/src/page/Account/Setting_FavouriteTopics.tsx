import { useEffect, useState } from "react";
import { SectionProps } from "./Account";
import { getAllTopics, setFavouriteTopics, Topic } from "../../apis/api";
import { useNavigate } from "react-router-dom";
import { TopicSelector } from "../Auth/FavTopic";
import { CircularProgress } from "@mui/material";
import styled from "styled-components";

const SelectorBox = styled.div`
  width: 100%;
  margin-top: 40px;
  display: flex;
  flex-direction: column;
  align-items: center;
`;
const Button = styled.button`
  min-width: 100px;
  margin: 0 auto;
  font-size: 18px;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 8px 12px;
  background-color: #3856ff;
  color: #fff;
  border: none;
  border-radius: 5px;
  margin-top: 35px;
  cursor: pointer;
  & > span {
    display: flex;
    align-items: center;
    gap: 5px;
  }
  &:hover span {
    transform: translateX(4px);
  }
`;

export default function Setting_FavouriteTopics({
  selfDetails,
  setActiveSection,
}: SectionProps) {
  const [topics, setTopics] = useState<Topic[]>([]);
  const [selectedTopics, setSelectedTopics] = useState<Topic[]>([]);
  const [loading, setLoading] = useState(false);

  // Fetch topics and categories them into selected and not selected
  useEffect(() => {
    async function fetchTopics() {
      const topicsArr = await getAllTopics();
      const favTopics = selfDetails.favoriteTopics;
      const restTopicsArr = topicsArr.filter((topic) => {
        for (const favTopic of favTopics) {
          if (favTopic.id === topic.id) {
            return false;
          }
        }
        return true;
      });
      console.log(favTopics, restTopicsArr);
      setTopics(restTopicsArr);
      setSelectedTopics(favTopics);
    }
    fetchTopics();
  }, [selfDetails]);

  //  Handle topics update
  async function handleTopicsSubmit() {
    setLoading(() => true);
    const favoriteTopics = selectedTopics.map((topic) => topic.id);
    await setFavouriteTopics({ favoriteTopics });
    setLoading(() => false);
  }

  return (
    <SelectorBox>
      <TopicSelector
        setSelectedTopics={setSelectedTopics}
        selectedTopics={selectedTopics}
        topics={topics}
        setTopics={setTopics}
        blog={false}
      />
      <Button disabled={loading} onClick={handleTopicsSubmit}>
        {!loading ? (
          "Save Changes"
        ) : (
          <CircularProgress
            size={20}
            thickness={6}
            sx={{
              color: "white",
            }}
          />
        )}
      </Button>
    </SelectorBox>
  );
}