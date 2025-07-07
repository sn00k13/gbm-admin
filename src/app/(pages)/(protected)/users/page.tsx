"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../../../firebase";
import Navbar from "@/components/Navbar";

const statusColors = {
  Active: "bg-green-100 text-green-700",
  Pending: "bg-yellow-100 text-yellow-700",
  Inactive: "bg-gray-100 text-gray-500",
};

type UserStatus = keyof typeof statusColors;

type User = {
  id: string;
  name: string;
  email: string;
  role: string;
  status: string;
  avatar?: string;
};

export default function UsersPage() {
  const [search, setSearch] = useState("");
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      setError("");
      try {
        const querySnapshot = await getDocs(collection(db, "users"));
        const usersData: User[] = querySnapshot.docs.map((doc) => {
          const data = doc.data();
          return {
            id: doc.id,
            name: data.name || "No Name",
            email: data.email || "No Email",
            role: data.role || "User",
            status: data.status || "Active",
            avatar: data.avatar || undefined,
          };
        });
        setUsers(usersData);
      } catch {
        setError("Failed to fetch users.");
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);

  // Filter users by search
  const filteredUsers = users.filter(
    (user) =>
      user.name.toLowerCase().includes(search.toLowerCase()) ||
      user.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex">
			{/* Left Sidebar - Navbar */}
			<div className="w-64 bg-white shadow-lg border-r border-gray-200">
				<Navbar />
			</div>
			
			{/* Main Content Area */}
			<div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-8 w-full">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-1">Users</h1>
          <p className="text-gray-600">Manage all users in your application.</p>
        </div>
        <div className="flex gap-2 items-center">
          <input
            type="text"
            placeholder="Search users..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-200 bg-white shadow-sm"
          />
          <button className="bg-[#0B3948] text-white px-5 py-2 rounded-xl font-semibold hover:bg-[#1a5a6b] transition-all shadow-sm">
            + Add User
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl shadow-lg overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">User</th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Email</th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Role</th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
              <th className="px-6 py-4 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-100">
            {loading ? (
              <tr>
                <td colSpan={5} className="py-12 text-center text-gray-400">
                  Loading users...
                </td>
              </tr>
            ) : error ? (
              <tr>
                <td colSpan={5} className="py-12 text-center text-red-400">
                  {error}
                </td>
              </tr>
            ) : filteredUsers.length === 0 ? (
              <tr>
                <td colSpan={5} className="py-12 text-center text-gray-400">
                  No users found.
                </td>
              </tr>
            ) : (
              filteredUsers.map((user) => (
                <tr key={user.id} className="hover:bg-gray-50 transition">
                  <td className="px-6 py-4 flex items-center gap-3">
                    {user.avatar ? (
                      <Image
                        src={user.avatar}
                        alt={user.name}
                        width={40}
                        height={40}
                        className="rounded-full object-cover border border-gray-200"
                      />
                    ) : (
                      <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-500 font-bold">
                        {user.name.charAt(0)}
                      </div>
                    )}
                    <span className="font-medium text-gray-900">{user.name}</span>
                  </td>
                  <td className="px-6 py-4 text-gray-700">{user.email}</td>
                  <td className="px-6 py-4">
                    <span className="inline-block px-3 py-1 rounded-full bg-blue-100 text-blue-700 text-xs font-semibold">
                      {user.role}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${statusColors[user.status as UserStatus] || statusColors.Active}`}>
                      {user.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button className="text-blue-600 hover:underline font-medium mr-3">Edit</button>
                    <button className="text-red-500 hover:underline font-medium">Delete</button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination (UI only) */}
      <div className="flex justify-between items-center mt-6">
        <span className="text-sm text-gray-600">Showing 1 to {filteredUsers.length} of {filteredUsers.length} users</span>
        <div className="flex gap-2">
          <button className="px-3 py-1 rounded-lg bg-gray-100 text-gray-500 hover:bg-gray-200" disabled>
            Previous
          </button>
          <button className="px-3 py-1 rounded-lg bg-gray-100 text-gray-700 hover:bg-gray-200 font-semibold">
            1
          </button>
          <button className="px-3 py-1 rounded-lg bg-gray-100 text-gray-500 hover:bg-gray-200" disabled>
            Next
          </button>
        </div>
      </div>
    </div>
	</div>
    
  );
}
