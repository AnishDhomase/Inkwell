import { BlogsLiked } from "../../components/Blogs";
import { Msg, SectionProps } from "./Account";

export default function Setting_LikedBlogs({ selfDetails }: SectionProps) {
  return (
    <>
      {selfDetails &&
      selfDetails.likedBlogs &&
      selfDetails?.likedBlogs?.length > 0 ? (
        <BlogsLiked blogs={selfDetails.likedBlogs} />
      ) : (
        <Msg>No liked blogs found!</Msg>
      )}
    </>
  );
}
