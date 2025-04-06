"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";

export default function UsersPage() {
  const [users, setUsers] = useState<{ id: string; username: string }[]>([]);
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [editingUserId, setEditingUserId] = useState<string | null>(null);
  const [editUsername, setEditUsername] = useState("");
  const [seedWords, setSeedWords] = useState<{ id: string; word: string }[]>(
    []
  );
  const [newUsername, setNewUsername] = useState("");
  const router = useRouter();

  useEffect(() => {
    async function fetchUsers() {
      try {
        const response = await axios.get("/api/users");
        setUsers(response.data);
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    }
    fetchUsers();
  }, []);

  useEffect(() => {
    async function fetchSeedWords() {
      try {
        const response = await axios.get("/api/seedwords");
        setSeedWords(response.data);
      } catch (error) {
        console.error("Error fetching seed words:", error);
      }
    }
    fetchSeedWords();
  }, []);

  const handleAddUser = async () => {
    if (!newUsername.trim()) return;
    try {
      const response = await axios.post("/api/users", {
        username: newUsername,
      });
      setUsers([...users, { id: response.data.id, username: newUsername }]);
      setNewUsername("");
    } catch (error) {
      console.error("Error adding user:", error);
    }
  };

  const handleDeleteUser = async (userId: string) => {
    if (confirm("정말 이 사용자를 삭제하시겠습니까?")) {
      try {
        await axios.delete(`/api/users/${userId}`);
        setUsers(users.filter((user) => user.id !== userId));
        if (selectedUserId === userId) setSelectedUserId(null);
      } catch (error) {
        console.error("Error deleting user:", error);
      }
    }
  };

  const handleUserClick = (userId: string) => {
    setSelectedUserId(userId);
  };

  const handleStartExperiment = async (seedWordId: string) => {
    if (!selectedUserId) return;
    try {
      const response = await axios.post("/api/experiments", {
        userId: selectedUserId,
        seedWordId,
      });
      router.push(`/experiments/outside-fmri/${response.data.id}`);
    } catch (error) {
      console.error("Error starting experiment:", error);
    }
  };

  const handleEditClick = (userId: string, currentUsername: string) => {
    setEditingUserId(userId);
    setEditUsername(currentUsername);
  };

  const handleEditSave = async (userId: string) => {
    if (!editUsername.trim()) return;
    try {
      const res = await axios.patch(`/api/users/${userId}`, {
        username: editUsername,
      });
      setUsers(
        users.map((user) =>
          user.id === userId ? { ...user, username: res.data.username } : user
        )
      );
      setEditingUserId(null);
      setEditUsername("");
    } catch (error) {
      console.error("Error updating user:", error);
    }
  };

  return (
    <div className="flex flex-col items-center p-6 bg-gray-100 min-h-screen">
      <h1 className="text-2xl font-bold text-gray-800 mb-4">User Management</h1>
      <div className="flex gap-2 mb-6">
        <input
          type="text"
          placeholder="Enter new username"
          value={newUsername}
          onChange={(e) => setNewUsername(e.target.value)}
          className="p-2 border border-gray-300 rounded-lg text-black"
        />
        <button
          onClick={handleAddUser}
          className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-700"
        >
          Add User
        </button>
      </div>
      <ul className="w-full max-w-md bg-white shadow-md rounded-lg p-4">
        {users.map((user) => (
          <li
            key={user.id}
            className="flex justify-between items-center py-2 border-b last:border-none"
          >
            {editingUserId === user.id ? (
              <>
                <input
                  type="text"
                  value={editUsername}
                  onChange={(e) => setEditUsername(e.target.value)}
                  className="p-1 border rounded text-black"
                />
                <button
                  onClick={() => handleEditSave(user.id)}
                  className="ml-2 px-2 py-1 bg-green-500 text-white rounded hover:bg-green-700"
                >
                  저장
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={() => handleUserClick(user.id)}
                  className="text-lg font-medium text-blue-600 hover:underline"
                >
                  {user.username}
                </button>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleEditClick(user.id, user.username)}
                    className="ml-4 px-2 py-1 bg-yellow-500 text-white rounded hover:bg-yellow-700"
                  >
                    수정
                  </button>
                  <button
                    onClick={() => handleDeleteUser(user.id)}
                    className="px-2 py-1 bg-red-500 text-white rounded hover:bg-red-700"
                  >
                    삭제
                  </button>
                </div>
              </>
            )}
          </li>
        ))}
      </ul>
      {selectedUserId && (
        <div className="mt-6 w-full max-w-md bg-white shadow-md rounded-lg p-4">
          <h2 className="text-lg font-semibold text-gray-800 mb-2">
            Select a Seed Word to Start an Experiment
          </h2>
          <ul>
            {seedWords.map((seed) => (
              <li key={seed.id} className="py-2">
                <button
                  onClick={() => handleStartExperiment(seed.id)}
                  className="w-full px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-700"
                >
                  Start Experiment with {decodeURIComponent(seed.word)}
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
