"use client";

import { StoryI, UserI } from "@/typings";
import axios from "axios";
import React, { useEffect, useState } from "react";
import LoadingPulse from "../loading/LoadingSpinner";
import Breaker from "../breaker/Breaker";
import Card from "../card/Card";

function ProfileStories({ user }: { user: UserI }) {
  const [isLoading, setIsLoading] = useState(true);
  const [stories, setStories] = useState([]);

  const getStories = async (userId: string) => {
    const stories = await axios.get(
      `http://localhost:8080/api/v1/stories/user/${userId}`
    );
    console.log(stories.data.data);
    setStories(stories.data.data);
    setIsLoading(false);
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
      <div
        className="flex flex-col gap-3 justify-center w-full
      "
      >
        {stories.map((story: StoryI) => (
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
