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
        return { type: "Price", amount: "Free" };

      case "payFull":
        return { type: "Full Price", amount: story.price };

      case "payByChapter":
        return { type: "Pay By Chapter", amount: story.price };

      default:
        return { type: "Price", amount: "Free" };
    }
  };

  return (
    <div className="bg-gray-100 rounded-lg mx-1">
      <div className="flex gap-2 p-1 m-1">
        {/* Left flex - Image */}
        <div className=" flex-1 ">
          <Link href={`/story/${story._id}`}>
            <div className="w-24 h-36 rounded-lg md:w-32 md:h-44 bg-blue-500 drop-shadow-lg shadow-sm hover:shadow-lg shadow-blue-600 cursor-pointer"></div>
          </Link>
        </div>

        {/* Right Flex - title, username, description */}
        <div className="flex-2 self-start w-full">
          {/* Title & Username */}
          <div className="flex gap-2 text-md md:text-lg">
            <Link href={`/story/${story._id}`}>
              <h1 className="underline hover:text-blue-600">{story.title}</h1>
            </Link>
            <Link
              className="flex gap-1"
              href={`/profile/${story.userId.username}`}
            >
              <p>By:</p>
              <p className="text-blue-700">{story.userId.username}</p>
            </Link>
          </div>

          {/* Description */}
          <div className="max-h-32 overflow-scroll md:overflow-hidden md:max-h-[500px]">
            <p className="text-xs md:text-base md:leading-4">
              {story.description}
            </p>
          </div>
        </div>
      </div>

      {/* Bottom flex - Information */}
      <div className="bg-gray-200 rounded-lg text-gray-800 p-1 text-xs md:text-sm flex flex-wrap gap-[.4rem] leading-3">
        {/* Status */}
        <p>
          Status:
          <span> {story.status}</span>
        </p>
        <Breaker type="between" />

        {/* Bookmark Amount  */}
        <p>
          Bookmarks:
          <span> {story.bookmarkAmount.total}</span>
        </p>
        <Breaker type="between" />

        {/* Category */}
        <p>
          Category:
          <span> {getCategoryName(story.category.name)}</span>
        </p>
        <Breaker type="between" />

        {/* Genre */}
        <p>
          Genre:
          <span> {story.genre.name}</span>
        </p>
        <Breaker type="between" />

        {/* Language */}
        <p>
          Language:
          <span> {story.languageName.name}</span>
        </p>
        <Breaker type="between" />

        {/* Chapter Amount */}
        <p>
          Chapters:
          <span> {story.chapterAmount}</span>
        </p>
        <Breaker type="between" />

        {/* Comment Amount */}
        <p>
          Comments:
          <span> {story.commentAmount}</span>
        </p>
        <Breaker type="between" />

        {/* Created At */}
        <p>
          Created:
          {/*@ts-ignore*/}
          <span> {story.createdAt}</span>
        </p>
        <Breaker type="between" />

        {/* Updated At */}
        <p>
          Updated:
          {/*@ts-ignore*/}
          <span> {story.updatedAt}</span>
        </p>
        <Breaker type="between" />

        {/* Favorites */}
        <p>
          Favorites:
          <span> {story.favoriteAmount.total}</span>
        </p>
        <Breaker type="between" />

        {/* Price */}
        <p>
          {getStoryPrice(story.readerAccess).type}:
          <span> {getStoryPrice(story.readerAccess).amount}</span>
        </p>
        <Breaker type="between" />

        {/* Rating */}
        <p>
          Rating:
          <span> {story.ratingsAverage.total}</span>
        </p>
        <Breaker type="between" />

        {/* WordCount */}
        <p>
          Wordcount:
          <span> {story.wordAmount}</span>
        </p>
      </div>
    </div>
  );
}

export default Card;
