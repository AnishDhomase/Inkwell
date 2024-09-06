import { BlogsSaved } from "../../components/Blogs";
import { Msg, SectionProps } from "./Account";

export default function Setting_SavedBlogs({ selfDetails }: SectionProps) {
  return (
    <>
      {selfDetails &&
      selfDetails.savedBlogs &&
      selfDetails?.savedBlogs?.length > 0 ? (
        <BlogsSaved blogs={selfDetails.savedBlogs} />
      ) : (
        <Msg>No Saved blogs found!</Msg>
      )}
    </>
  );
}
