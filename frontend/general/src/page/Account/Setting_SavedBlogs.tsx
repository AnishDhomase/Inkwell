import { BlogsSaved } from "../../components/Blogs";
import { Msg, SectionProps } from "./Account";

export default function Setting_SavedBlogs({
  selfDetails,
  setActiveSection,
}: SectionProps) {
  return (
    <>
      {selfDetails?.savedBlogs?.length > 0 ? (
        <BlogsSaved blogs={selfDetails.savedBlogs} />
      ) : (
        <Msg>No Saved blogs found!</Msg>
      )}
    </>
  );
}
