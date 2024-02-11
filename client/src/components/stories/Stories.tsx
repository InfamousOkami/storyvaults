"use client";

import { StoryI } from "@/typings";
import SimpleCard from "../card/SimpleCard";
import LoadingPulse from "../loading/LoadingSpinner";
import { useEffect, useState } from "react";
import axios from "axios";
import { useSearchParams } from "next/navigation";
import Pagination from "../pagination/Pagination";

function AllStories() {
  const [stories, setStories] = useState([]);
  const [pageTotal, setPageTotal] = useState(1);
  const [isLoading, setIsLoading] = useState(true);

  const searchParams = useSearchParams();

  const getStories = async (params: any) => {
    const stories = await axios.get(`http://localhost:8080/api/v1/stories`, {
      params: Object.fromEntries(params),
    });

    setPageTotal(stories.data.pagination.pages);
    setStories(stories.data.data);
    setIsLoading(false);
  };

  useEffect(() => {
    getStories(searchParams);
  }, [searchParams]);

  if (isLoading) return <LoadingPulse />;

  return (
    <div
      className="flex flex-col gap-5 items-center pb-5 
    "
    >
      <div className="flex flex-col w-[98%] md:flex-row md:flex-wrap gap-2 md:justify-center ">
        {stories.length === 0 && (
          <p className="font-bold text-3xl text-gray-800">
            No Stories for: {searchParams.get("keywords")}
          </p>
        )}
        {stories.map((story: StoryI) => (
          <SimpleCard key={story._id} story={story} />
        ))}
      </div>
      <Pagination pageTotal={pageTotal} />
    </div>
  );
}

export default AllStories;
