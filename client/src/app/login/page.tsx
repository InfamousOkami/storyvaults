"use client";

import { logIn } from "@/lib/redux/features/auth-slice";
import { AppDispatch } from "@/lib/redux/store";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useDispatch } from "react-redux";

export default function LogIn() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();

  const onSubmit = async () => {
    try {
      const userResponse = await axios.post(
        "http://localhost:8080/api/v1/auth/login",
        {
          username: username,
          password: password,
        }
      );

      const user = userResponse.data.data.user;
      const token = userResponse.data.token;

      dispatch(logIn({ user, token }));

      router.push("/");
    } catch (err) {
      console.log("No User", err);
    }
  };

  return (
    <div className="flex flex-col gap-5  items-center">
      <h1 className="text-3xl font-bold">Log In</h1>
      <div className="flex gap-3">
        <label htmlFor="username"> Username</label>
        <input
          type="text"
          name="username"
          id="username"
          value={username}
          className="w-72 border-2 border-gray-800"
          onChange={(e) => setUsername(e.target.value)}
        />
      </div>

      <div className="flex gap-3">
        <label htmlFor="password"> Password</label>
        <input
          type="text"
          name="password"
          id="password"
          value={password}
          className="w-72 border-2 border-gray-800"
          onChange={(e) => setPassword(e.target.value)}
        />
      </div>

      <button onClick={onSubmit}>Submit</button>
    </div>
  );
}
