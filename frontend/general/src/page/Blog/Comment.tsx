import ModeEditIcon from "@mui/icons-material/ModeEdit";
import DeleteIcon from "@mui/icons-material/Delete";
import UserCard from "../../components/UserCard";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { getTimeAgo } from "../../utils/helpers";
import styled from "styled-components";
import { getUser } from "../../apis/api";

const ButtonSmall = styled.button`
  padding: 2px 5px;
  background-color: #ff7738;
  color: #fff;
  font-size: 16px;
  border: none;
  border-radius: 5px;
  display: flex;
  align-items: center;
  justify-content: center;
  &:hover {
    cursor: pointer;
    scale: 1.02;
  }
`;
interface CommentContentProps {
  overlay: boolean;
}
const CommentContent = styled.div<CommentContentProps>`
  opacity: ${(props) => (props.overlay ? 0.5 : 1)};
  /* border-bottom: 1px solid #dfdbdb; */
  color: ${(props) => props.theme.text};
  border-bottom: 1px solid ${(props) => props.theme.bottomBorder};
  padding: 25px 0;
  display: flex;
  flex-direction: column;
  gap: 10px;
  font-size: 17px;
  & header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 10px;
  }
  & textarea {
    color: ${(props) => props.theme.text};
    font-size: 17px;
    border: none;
    outline: none;
    background-color: transparent;
    resize: none;
    min-height: 50px;
  }
`;
const ToolBox = styled.div`
  display: flex;
  gap: 5px;
  color: #c4b9b4;
  cursor: pointer;
`;
const Tool = styled.button`
  padding: 0 5px;
  display: flex;
  align-items: center;
  background-color: transparent;
  border: none;
  color: #c4b9b4;
  cursor: pointer;
  &:hover {
    color: #636161;
  }
`;

export default function Comment({
  comment,
  myUserId,
  handleDeleteComment,
  handleEditComment,
  editing,
  setEditing,
}: {
  comment: object;
  myUserId: number;
  handleDeleteComment: (commentId: number) => Promise<void>;
  handleEditComment: (commentId: number, content: string) => Promise<void>;
  editing: number;
  setEditing: (id: number) => void;
}) {
  const [authorDetails, setAuthorDetails] = useState<object>({});
  const [loading, setLoading] = useState<boolean>(false);
  const [commentContent, setCommentContent] = useState<string>(comment.content);

  // Fetch comment author details
  useEffect(() => {
    async function fetchAuthor() {
      const res = await getUser(Number(comment.authorId));
      setAuthorDetails(res);
    }
    fetchAuthor();
  }, []);
  async function handleDeleteCmmt() {
    if (!myUserId) {
      toast.error("Login/Signup to delete the comment");
      return;
    }
    setLoading(() => true);
    await handleDeleteComment(comment.id);
    setLoading(() => false);
  }
  async function handleEditCmmt() {
    if (!myUserId) {
      toast.error("Login/Signup to edit the comment");
      return;
    }
    setLoading(() => true);
    await handleEditComment(comment.id, commentContent);
    setLoading(() => false);
  }

  return (
    <CommentContent overlay={loading}>
      <header>
        <UserCard
          userId={comment.authorId}
          username={authorDetails?.username}
          profilePicURL={authorDetails?.profilePicURL}
        />
        <p>{getTimeAgo(comment.createdAt)}</p>
      </header>
      {editing !== comment.id ? (
        <footer>{comment.content}</footer>
      ) : (
        <textarea
          value={commentContent}
          onChange={(e) => setCommentContent(e.target.value)}
          disabled={loading}
        />
      )}
      {myUserId && myUserId === comment.authorId && (
        <ToolBox>
          {editing !== comment.id ? (
            <Tool onClick={() => setEditing(comment.id)} disabled={loading}>
              <ModeEditIcon />
            </Tool>
          ) : (
            <ButtonSmall onClick={handleEditCmmt} disabled={loading}>
              {!loading ? "Save" : "Saving..."}
            </ButtonSmall>
          )}
          <Tool onClick={handleDeleteCmmt} disabled={loading}>
            <DeleteIcon />
          </Tool>
        </ToolBox>
      )}
    </CommentContent>
  );
}
