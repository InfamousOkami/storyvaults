import { StoryI } from "@/typings";
import Link from "next/link";
import Breaker from "../breaker/Breaker";

const getCategoryName = (type: string) => {
  switch (type) {
    case "oneShot":
      return "One-Shots";

    case "book":
      return "Books";

    case "lightNovel":
      return "Light Novels";

    default:
      return "Books";
  }
};

function Card({ story }: { story: StoryI }) {
  const getStoryPrice = (accessType: string) => {
    switch (accessType) {
      case "free":
        return { type: "Free", amount: "0.00" };

      case "payFull":
        return { type: "Full Price", amount: story.price };

      case "payByChapter":
        return { type: "Pay By Chapter", amount: story.price };

      default:
        return { type: "Free", amount: "0.00" };
    }
  };

  return (
    <>
      <div className="flex gap-2  p-1">
        {/* Left flex - Image */}
        <div className=" flex-1">
          <div className="w-16 h-24 md:w-32 md:h-44 bg-blue-500"></div>
        </div>

        {/* Right Flex - title, username, description */}
        <div className="flex-2 self-start w-full">
          {/* Title & Username */}
          <div className="flex gap-2 text-sm md:text-lg">
            <Link href={`/story/${story._id}`}>
              <h1 className="underline">{story.title}</h1>
            </Link>
            <Link
              className="flex gap-1"
              href={`profile/${story.userId.username}`}
            >
              <p>By:</p>
              <p className="text-blue-700">{story.userId.username}</p>
            </Link>
          </div>

          {/* Description */}
          <div>
            <p className="text-xs md:text-base md:leading-4">
              {story.description}
            </p>
          </div>
        </div>
      </div>

      {/* Bottom flex - Information */}
      <div className="bg-blue-50 p-1 text-sm flex flex-wrap gap-[.4rem] leading-3">
        <p>
          Status:
          <span> {story.status}</span>
        </p>
        <Breaker type="between" />
        <p>
          Bookmarks:
          <span> {story.bookmarkAmount.total}</span>
        </p>
        <Breaker type="between" />

        <p>
          Category:
          <span> {getCategoryName(story.category.name)}</span>
        </p>
        <Breaker type="between" />

        <p>
          Genre:
          <span> {story.genre.name}</span>
        </p>
        <Breaker type="between" />

        <p>
          Language:
          <span> {story.languageName.name}</span>
        </p>
        <Breaker type="between" />

        <p>
          Chapters:
          <span> {story.chapterAmount}</span>
        </p>
        <Breaker type="between" />

        <p>
          Comments:
          <span> {story.commentAmount}</span>
        </p>
        <Breaker type="between" />

        <p>
          Created:
          {/*@ts-ignore*/}
          <span> {story.createdAt}</span>
        </p>
        <Breaker type="between" />

        <p>
          Updated:
          {/*@ts-ignore*/}
          <span> {story.updatedAt}</span>
        </p>
        <Breaker type="between" />

        <p>
          Favorites:
          <span> {story.favoriteAmount.total}</span>
        </p>
        <Breaker type="between" />

        <p>
          {getStoryPrice(story.readerAccess).type}:
          <span> {getStoryPrice(story.readerAccess).amount}</span>
        </p>
        <Breaker type="between" />

        <p>
          Rating:
          <span> {story.ratingsAverage}</span>
        </p>
        <Breaker type="between" />

        <p>
          Word Count:
          <span> {story.wordAmount}</span>
        </p>
      </div>
    </>
  );
}

export default Card;
