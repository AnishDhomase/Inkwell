import { useEffect, useState } from "react";
import { getAllTopics, setFavouriteTopics, Topic } from "../../apis/api";
import styled from "styled-components";
import CancelIcon from "@mui/icons-material/Cancel";
import CircularProgress from "@mui/material/CircularProgress";
import { useNavigate } from "react-router-dom";

interface HeadingProps {
  wt?: string;
  sz?: string;
  align?: string;
  color?: string;
}
const Heading = styled.h1<HeadingProps>`
  font-weight: ${(props) => props.wt || "900"};
  font-size: ${(props) => props.sz || "38px"};
  color: ${(props) => props.color || "white"};
  margin-bottom: 20px;
  text-align: ${(props) => props.align || "left"};
  @media (min-width: 1250px) {
    & {
      font-size: 55px;
    }
  }
`;
const TopicBox = styled.span`
  padding: 12px 18px;
  background-color: #c3b5b5;
  color: white;
  font-size: 18px;
  border-radius: 50px;
  &:hover {
    cursor: pointer;
    scale: 1.015;
  }
  &:active {
    opacity: 0.8;
  }
  @media (min-width: 1250px) {
    & {
      font-size: 25px;
      padding: 15px 20px;
    }
  }
`;
const SelectedTopicBox = styled.span`
  padding: 12px 12px 12px 18px;
  background-color: #ff7738;
  color: white;
  font-size: 18px;
  border-radius: 50px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  &:hover {
    cursor: pointer;
    scale: 1.015;
  }
  &:active {
    opacity: 0.8;
  }
  @media (min-width: 1250px) {
    & {
      font-size: 25px;
      padding: 15px 20px;
    }
  }
`;
interface TopicsWrapperProps {
  blog?: boolean;
}
const TopicsWrapper = styled.div<TopicsWrapperProps>`
  width: 100%;
  max-width: ${(props) => (props.blog ? "none" : "400px")};
  display: flex;
  gap: 10px;
  justify-content: center;
  flex-wrap: wrap;
  padding: ${(props) => (props.blog ? "0" : "35px 0")};
  @media (min-width: 1250px) {
    & {
      max-width: ${(props) => (props.blog ? "none" : "400px")};
      font-size: 25px;
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
  margin-top: ${(props) => props.mt || "20px"};
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

export default function FavTopic({ setStep }: { setStep: any }) {
  const [topics, setTopics] = useState<Topic[]>([]);
  const [selectedTopics, setSelectedTopics] = useState<Topic[]>([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  useEffect(() => {
    async function fetchTopics() {
      const topicsArr = await getAllTopics();
      setTopics(topicsArr);
    }
    fetchTopics();
  }, []);
  async function handleTopicsSubmit() {
    setLoading(() => true);
    const favoriteTopics = selectedTopics.map((topic) => topic.id);
    const success = await setFavouriteTopics({ favoriteTopics });
    setLoading(() => false);
    if (success) navigate("/");
  }
  return (
    <>
      <Heading align="center" sz="30px">
        Select Your Favorite Topics
      </Heading>
      <TopicSelector
        setSelectedTopics={setSelectedTopics}
        selectedTopics={selectedTopics}
        topics={topics}
        setTopics={setTopics}
        blog={false}
      />
      {/* <TopicsWrapper>
        {selectedTopics.map((topic) => (
          <SelectedTopicBox key={topic.name} onClick={() => removeTopic(topic)}>
            <span>{topic.name}</span>
            <CancelIcon />
          </SelectedTopicBox>
        ))}
      </TopicsWrapper>
      <TopicsWrapper>
        {topics.map((topic) => (
          <TopicBox key={topic.name} onClick={() => addTopic(topic)}>
            {topic.name}
          </TopicBox>
        ))}
      </TopicsWrapper> */}
      <Button
        color="#ff7738"
        textColor="white"
        width="400px"
        disabled={loading}
        onClick={handleTopicsSubmit}
      >
        {!loading ? "Next" : <CircularProgress size={20} thickness={6} />}
      </Button>
    </>
  );
}

export function TopicSelector({
  setSelectedTopics,
  selectedTopics,
  topics,
  setTopics,
  blog,
}: {
  setSelectedTopics: any;
  selectedTopics: Topic[];
  topics: Topic[];
  setTopics: any;
  blog?: boolean;
}) {
  function addTopic(topic: Topic) {
    setSelectedTopics([...selectedTopics, topic]);
    setTopics(topics.filter((t) => t.id !== topic.id));
  }
  function removeTopic(topic: Topic) {
    setTopics([...topics, topic]);
    setSelectedTopics(selectedTopics.filter((t) => t.id !== topic.id));
  }
  return (
    <>
      <TopicsWrapper blog={blog}>
        {selectedTopics.map((topic) => (
          <SelectedTopicBox key={topic.name} onClick={() => removeTopic(topic)}>
            <span>{topic.name}</span>
            <CancelIcon />
          </SelectedTopicBox>
        ))}
      </TopicsWrapper>
      <TopicsWrapper blog={blog}>
        {topics.map((topic) => (
          <TopicBox key={topic.name} onClick={() => addTopic(topic)}>
            {topic.name}
          </TopicBox>
        ))}
      </TopicsWrapper>
    </>
  );
}
