"use client";

import axios from "axios";
import { useEffect, useState } from "react";
import TopStories from "./TopStories";
import LoadingSpinner from "../loading/LoadingSpinner";

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

function AllCategories() {
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const getAllCategories = async () => {
    const data = await axios.get(`http://localhost:8080/api/v1/category`);
    setCategories(data.data.data);
    setIsLoading(false);
  };

  useEffect(() => {
    getAllCategories();
  }, []);

  if (isLoading) return <LoadingSpinner />;

  return (
    <div className="flex flex-col items-center gap-10  w-full">
      {categories
        .filter((cat: any) => cat.storyAmount > 0)
        .map((cat: any) => (
          <div key={cat._id} className="w-full">
            <h1 className="font-bold text-2xl text-gray-700 text-center underline mb-3">
              Top 5 {getCategoryName(cat.name)}
            </h1>
            <TopStories categoryId={cat._id} />
          </div>
        ))}
    </div>
  );
}

export default AllCategories;
