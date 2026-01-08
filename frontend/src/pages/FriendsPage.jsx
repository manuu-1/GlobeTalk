import React, { useEffect, useState } from "react";
import FriendCard from "../components/FriendCard";
import { axiosInstance } from "../lib/axios";

const FriendsPage = () => {
  const [friends, setFriends] = useState([]);

  useEffect(() => {
    const fetchFriends = async () => {
      try {
        const res = await axiosInstance.get("/users/friends");
        console.log("Friends API:", res.data);
        setFriends(res.data || []);
      } catch (error) {
        console.error("Error fetching friends:", error);
      }
    };

    fetchFriends();
  }, []);

  return (
    <div className="p-4">
      <h2 className="text-3xl font-bold mb-4">Your Friends</h2>

      {friends.length === 0 ? (
        <p className="text-gray-500">No friends yet.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {friends.map((friend) => (
            <FriendCard key={friend._id} friend={friend} />
          ))}
        </div>
      )}
    </div>
  );
};

export default FriendsPage;
