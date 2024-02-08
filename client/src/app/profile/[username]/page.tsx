"use client";
import LoadingPulse from "@/components/loading/LoadingSpinner";
import ProfileStories from "@/components/profile/profileStories";
import ProfileTopCard from "@/components/profile/profileTopCard";
import { UserI } from "@/typings";
import axios from "axios";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

function Profile() {
  const [user, setUser] = useState<UserI | null>();
  const [isLoading, setIsLoading] = useState(true);
  const params = useParams();

  const getUser = async (username: string) => {
    const userData = await axios.get(
      `http://localhost:8080/api/v1/users/username/${username}`
    );
    setUser(userData.data.data.user);
    setIsLoading(false);
  };

  useEffect(() => {
    getUser(params.username as string);
  }, [params.username]);

  if (isLoading) return <LoadingPulse />;

  return (
    <div className="flex flex-col">
      <ProfileTopCard user={user!} />
      <ProfileStories user={user!} />
    </div>
  );
}

export default Profile;
