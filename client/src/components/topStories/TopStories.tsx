"use client";

import axios from "axios";
import React, { useEffect, useState } from "react";
import Card from "../card/DetailedCard";
import { StoryI } from "@/typings";
import Breaker from "../breaker/Breaker";
import SimpleCard from "../card/SimpleCard";

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
    <div className="flex flex-col md:flex-row md:flex-wrap gap-2">
      {stories.map((story: StoryI) => (
        <React.Fragment key={story._id}>
          <SimpleCard story={story} />
        </React.Fragment>
      ))}
    </div>
  );
}

export default TopStories;
