"use client";
import LoadingPulse from "@/components/loading/LoadingSpinner";
import axios from "axios";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

function Profile() {
  const [user, setUser] = useState();
  const [isLoading, setIsLoading] = useState(true);
  const params = useParams();

  const getUser = async (username: string) => {
    const userData = await axios.get(
      `http://localhost:8080/api/v1/users/username/${params.username}`
    );
    console.log(userData.data.data.user);
    setUser(userData.data.data.user);
    setIsLoading(false);
  };

  useEffect(() => {
    getUser(params.username as string);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params.username]);

  if (isLoading) return <LoadingPulse />;

  return <div>{params.username}</div>;
}

export default Profile;
