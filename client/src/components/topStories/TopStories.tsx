"use client";

import axios from "axios";
import React, { useEffect, useState } from "react";
import Card from "../card/Card";
import { StoryI } from "@/typings";
import Breaker from "../breaker/Breaker";

function TopStories({ categoryId }: { categoryId: string }) {
  const [stories, setStories] = useState([]);

  const getTopStories = async (categoryId: string) => {
    const data = await axios.get(
      `http://localhost:8080/api/v1/stories/top/${categoryId}`
    );
    setStories(data.data.data);
  };

  useEffect(() => {
    getTopStories(categoryId);
  }, [categoryId]);

  return (
    <div className="flex flex-col gap-2">
      {stories.map((story: StoryI) => (
        <React.Fragment key={story._id}>
          <Card story={story} />
          {/* <Breaker type="under" /> */}
        </React.Fragment>
      ))}
    </div>
  );
}

export default TopStories;
