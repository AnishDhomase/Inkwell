import { useEffect, useRef } from "react";
import styled from "styled-components";

const StyledTextarea = styled.textarea`
  /* min-height: 50px; */
  resize: none;
  overflow-y: hidden;
`;
export function AutoResizingTextarea({
  value,
  handleOnChange,
}: {
  value: string;
  handleOnChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
}) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    const textarea = textareaRef.current;
    if (!textarea) return;
    textarea.style.height = "auto";
    textarea.style.height = `${textarea.scrollHeight}px`;
  }, [value]);

  return (
    <StyledTextarea ref={textareaRef} value={value} onChange={handleOnChange} />
  );
}
