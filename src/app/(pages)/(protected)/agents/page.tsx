"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../../../firebase";
import Navbar from "@/components/Navbar";

const statusColors = {
  Verified: "bg-green-100 text-green-700",
  Pending: "bg-yellow-100 text-yellow-700",
  Rejected: "bg-red-100 text-red-700",
};

type AgentStatus = keyof typeof statusColors;

type Agent = {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  isVerified?: boolean;
  avatar?: string;
};

export default function AgentsPage() {
  const [search, setSearch] = useState("");
  const [agents, setAgents] = useState<Agent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchAgents = async () => {
      setLoading(true);
      setError("");
      try {
        const querySnapshot = await getDocs(collection(db, "agents"));
        const data: Agent[] = querySnapshot.docs.map((doc) => {
          const d = doc.data();
          return {
            id: doc.id,
            name: d.name || "No Name",
            email: d.email || "",
            phone: d.phone || "",
            isVerified: d.isVerified,
            avatar: d.avatar || undefined,
          };
        });
        setAgents(data);
      } catch {
        setError("Failed to fetch agents.");
      } finally {
        setLoading(false);
      }
    };
    fetchAgents();
  }, []);

  // Filter agents by search
  const filteredAgents = agents.filter(
    (a) =>
      a.name.toLowerCase().includes(search.toLowerCase()) ||
      (a.email && a.email.toLowerCase().includes(search.toLowerCase())) ||
      (a.phone && a.phone.toLowerCase().includes(search.toLowerCase()))
  );

  // Map isVerified to status string
  function getStatus(agent: Agent): AgentStatus {
    if (agent.isVerified === true) return "Verified";
    if (agent.isVerified === false) return "Rejected";
    return "Pending";
  }

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
            <h1 className="text-3xl font-bold text-gray-900 mb-1">Agents</h1>
            <p className="text-gray-600">Manage all agents in your application.</p>
          </div>
          <div className="flex gap-2 items-center">
            <input
              type="text"
              placeholder="Search agents..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-200 bg-white shadow-sm"
            />
            <button className="bg-[#0B3948] text-white px-5 py-2 rounded-xl font-semibold hover:bg-[#1a5a6b] transition-all shadow-sm">
              + Add Agent
            </button>
          </div>
        </div>

        {/* Table */}
        <div className="bg-white rounded-2xl shadow-lg overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Avatar</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Name</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Email</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Phone</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-100">
              {loading ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-gray-400">
                    Loading agents...
                  </td>
                </tr>
              ) : error ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-red-400">
                    {error}
                  </td>
                </tr>
              ) : filteredAgents.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-gray-400">
                    No agents found.
                  </td>
                </tr>
              ) : (
                filteredAgents.map((a) => (
                  <tr key={a.id} className="hover:bg-gray-50 transition">
                    <td className="px-6 py-4">
                      {a.avatar ? (
                        <Image
                          src={a.avatar}
                          alt={a.name}
                          width={40}
                          height={40}
                          className="rounded-full object-cover border border-gray-200"
                        />
                      ) : (
                        <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-500 font-bold">
                          {a.name.charAt(0)}
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 font-medium text-gray-900">{a.name}</td>
                    <td className="px-6 py-4 text-gray-700">{a.email}</td>
                    <td className="px-6 py-4 text-gray-700">{a.phone}</td>
                    <td className="px-6 py-4">
                      <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${statusColors[getStatus(a)]}`}>
                        {getStatus(a)}
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
          <span className="text-sm text-gray-600">Showing 1 to {filteredAgents.length} of {filteredAgents.length} agents</span>
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
