import { StoryI } from "@/typings";
import Link from "next/link";
import Breaker from "../breaker/Breaker";
import { useState } from "react";

const getCategoryName = (type: string) => {
  switch (type) {
    case "oneShot":
      return "One-Shots";

    case "book":
      return "Books";

    case "lightNovel":
      return "Light Novels";

    default:
      return "Unidentified";
  }
};

const getCategoryColor = (type: string) => {
  switch (type) {
    case "oneShot":
      return "bg-purple-400";

    case "book":
      return "bg-blue-400";

    case "lightNovel":
      return "bg-teal-400";

    default:
      return "bg-blue-400";
  }
};

function SimpleCard({ story }: { story: StoryI }) {
  const [active, setActive] = useState(false);

  const getStoryPrice = (accessType: string) => {
    switch (accessType) {
      case "free":
        return { type: "Price", amount: "Free" };

      case "payFull":
        return { type: "Full Price", amount: "$" + story.price };

      case "payByChapter":
        return { type: "Pay By Chapter", amount: "$" + story.price };

      default:
        return { type: "Price", amount: "Free" };
    }
  };

  return (
    <div
      className={`transition ease-in-out delay-0 duration-300 ${
        active ? `${getCategoryColor(story.category.name)}` : "bg-white"
      } rounded-lg md:mx-0 m-auto w-full lg:w-[49%] xl:w-[32%]  relative shadow-md shadow-gray-300 h-36 md:h-44 border border-gray-300`}
      onMouseEnter={() => setActive(true)}
      onMouseLeave={() => setActive(false)}
    >
      <div className="flex gap-2 h-full ">
        {/* Left flex - Image */}
        <div className="flex-1">
          <Link href={`/story/${story._id}`}>
            {/* TODO: Change Div to Image For Story Picture */}
            <div className="w-24 h-full rounded-lg md:w-32 p-1 bg-blue-500 drop-shadow-lg shadow-sm hover:shadow-lg shadow-blue-600 cursor-pointer"></div>
          </Link>
        </div>

        {/* Right Flex  */}
        <div className="flex-2 self-start h-full w-full relative flex flex-col">
          {/* Username & Title, Genre, category, Language */}
          <div className="flex justify-between flex-col h-full">
            {/* Title & Username */}
            <div className="flex gap-2 text-md md:text-lg items-center h-fit">
              <Link href={`/story/${story._id}`}>
                <h1
                  className={`font-bold text-xl hover:text-blue-600 ${
                    active ? "text-white" : ""
                  }`}
                >
                  {story.title}
                </h1>
              </Link>
              <Link
                className="flex gap-1"
                href={`/profile/${story.userId.username}`}
              >
                <p>By:</p>
                <p className="text-blue-600 font-medium">
                  {story.userId.username}
                </p>
              </Link>

              <div className="">
                {/* Status */}
                <p
                  className={`text-xs absolute right-2 top-1 font-medium  ${
                    story.status == "Incomplete"
                      ? "text-red-600"
                      : "text-green-700"
                  }`}
                >
                  {story.status}
                </p>
                {/* Price */}
                <p
                  className={`text-2xl absolute right-2 top-6 font-bold  ${
                    active
                      ? "transition ease-in-out delay-0 duration-300 bg-white px-1 rounded-lg right-[3px] top-[22px] drop-shadow-lg border border-gray-300"
                      : ""
                  } text-green-500`}
                >
                  {getStoryPrice(story.readerAccess).amount}
                </p>
              </div>
            </div>

            <div className={`font-medium ${active ? "text-white" : ""}`}>
              {/* Genre, category, Language */}
              <div className="flex gap-1 text-gray-500 text-xs">
                {/* Genre */}
                <p>{story.genre.name}</p>

                <Breaker type="between" />

                {/* Category */}
                <p>{getCategoryName(story.category.name)}</p>

                <Breaker type="between" />

                {/* Language */}
                <p>{story.languageName.name}</p>
              </div>

              {/* Chapters */}
              <div className="text-sm leading-[18px]">
                {/* Chapter Amount */}
                <p>
                  {story.chapterAmount}
                  <span>
                    {" "}
                    {story.chapterAmount === 1 ? "Chapter" : "Chapters"}
                  </span>
                </p>

                {/* WordCount */}
                <p>
                  {story.wordAmount}
                  <span> {story.wordAmount === 1 ? "Word" : "Words"}</span>
                </p>

                {/* Rating */}
                <p>
                  Rating:
                  <span> {story.ratingsAverage.total}</span>
                </p>
              </div>
            </div>
          </div>

          {/* Bottom flex - Information */}
          <div className="text-gray-800 text-xs md:text-sm h-full">
            {/* Dates */}
            <div
              className={`flex flex-col leading-4 absolute bottom-1 left-0 ${
                active ? "text-white" : ""
              }`}
            >
              {/* Updated At */}
              <p>
                Updated:
                {/* @ts-ignore */}
                <span> {story.updatedAt}</span>
              </p>

              {/* Created At */}
              <p>
                Created:
                {/*@ts-ignore*/}
                <span> {story.createdAt}</span>
              </p>
            </div>

            {/* Bottom Right: Favoites & Bookmarks */}
            <div
              className={`absolute bottom-1 right-2 ${
                active ? "text-white" : ""
              }`}
            >
              {/* Bookmark Amount  */}
              <p className="flex gap-1 items-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="icon icon-tabler icon-tabler-bookmark-filled text-blue-500"
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  strokeWidth="1.5"
                  stroke="currentColor"
                  fill="none"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                  <path
                    d="M14 2a5 5 0 0 1 5 5v14a1 1 0 0 1 -1.555 .832l-5.445 -3.63l-5.444 3.63a1 1 0 0 1 -1.55 -.72l-.006 -.112v-14a5 5 0 0 1 5 -5h4z"
                    strokeWidth="0"
                    fill="currentColor"
                  />
                </svg>
                <span> {story.bookmarkAmount.total}</span>
              </p>

              {/* Favorites */}
              <p className={`flex gap-1 items-center `}>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="icon icon-tabler icon-tabler-star-filled text-yellow-300"
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  strokeWidth="1.5"
                  stroke="currentColor"
                  fill="none"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                  <path
                    d="M8.243 7.34l-6.38 .925l-.113 .023a1 1 0 0 0 -.44 1.684l4.622 4.499l-1.09 6.355l-.013 .11a1 1 0 0 0 1.464 .944l5.706 -3l5.693 3l.1 .046a1 1 0 0 0 1.352 -1.1l-1.091 -6.355l4.624 -4.5l.078 -.085a1 1 0 0 0 -.633 -1.62l-6.38 -.926l-2.852 -5.78a1 1 0 0 0 -1.794 0l-2.853 5.78z"
                    strokeWidth="0"
                    fill="currentColor"
                  />
                </svg>
                <span> {story.favoriteAmount.total}</span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SimpleCard;
