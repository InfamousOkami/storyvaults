"use client";

import { StoryI, UserI } from "@/typings";
import axios from "axios";
import React, { useEffect, useState } from "react";
import LoadingPulse from "../loading/LoadingSpinner";
import Breaker from "../breaker/Breaker";
import Card from "../card/Card";

enum StorySortOption {
  CREATED_AT = "createdAt",
  UPDATED_AT = "updatedAt",
  WORD_AMOUNT = "wordAmount",
  GENRE = "genre",
  CHAPTER_AMOUNT = "chapterAmount",
  RATING = "ratingsAverage.total",
}

const sortButtons = [
  {
    name: "Created At",
    option: StorySortOption.CREATED_AT,
  },
  {
    name: "Updated At",
    option: StorySortOption.UPDATED_AT,
  },
  {
    name: "Word Count",
    option: StorySortOption.WORD_AMOUNT,
  },
  {
    name: "Genre",
    option: StorySortOption.GENRE,
  },
  {
    name: "Chapters",
    option: StorySortOption.CHAPTER_AMOUNT,
  },
  {
    name: "Rating",
    option: StorySortOption.RATING,
  },
];

function ProfileStories({ user }: { user: UserI }) {
  const [isLoading, setIsLoading] = useState(true);
  const [stories, setStories] = useState([]);
  const [sortBy, setSortBy] = useState<StorySortOption>(
    StorySortOption.CREATED_AT
  );
  const getStories = async (userId: string) => {
    const stories = await axios.get(
      `http://localhost:8080/api/v1/stories/user/${userId}`
    );

    setStories(stories.data.data);
    setIsLoading(false);
  };

  const sortByField = (field: StorySortOption) => {
    return (a: StoryI, b: StoryI) => {
      // Access the field value of each story
      const fieldA =
        field === StorySortOption.RATING ? a.ratingsAverage.total : a[field];
      const fieldB =
        field === StorySortOption.RATING ? b.ratingsAverage.total : b[field];

      if (
        field === StorySortOption.WORD_AMOUNT ||
        field === StorySortOption.CHAPTER_AMOUNT ||
        field === StorySortOption.RATING
      ) {
        if (fieldA > fieldB) {
          // Compare the fields
          return -1;
        }
        if (fieldA < fieldB) {
          return 1;
        }
        return 0;
      } else {
        if (fieldA < fieldB) {
          // Compare the fields
          return -1;
        }
        if (fieldA > fieldB) {
          return 1;
        }
        return 0;
      }
    };
  };

  useEffect(() => {
    getStories(user._id);
  }, [user]);

  if (isLoading) return <LoadingPulse />;

  return (
    <div className="bg-gray-50">
      <h1 className="text-lg font-medium underline text-gray-900 text-center ">
        {user.username}
        {"'"}s Stories
      </h1>
      <div className="text-center">
        <p className="text-lg underline mb-1">Sort By</p>
        <div className="flex gap-3 justify-center mb-2 flex-wrap">
          {sortButtons.map((button) => (
            <div
              key={button.name}
              className={`cursor-pointer text-white px-3 py-2 rounded-lg hover:bg-blue-600 ${
                sortBy === button.option ? "bg-blue-600" : "bg-blue-400"
              }`}
              onClick={() => setSortBy(button.option)}
            >
              {button.name}
            </div>
          ))}
        </div>
      </div>
      <div
        className="flex flex-col gap-3 justify-center w-full
      "
      >
        {stories.sort(sortByField(sortBy)).map((story: StoryI) => (
          <React.Fragment key={story._id}>
            <Card story={story} />
            <Breaker type="under" />
          </React.Fragment>
        ))}
      </div>
    </div>
  );
}

export default ProfileStories;
