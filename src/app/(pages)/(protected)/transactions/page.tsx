"use client";

import React, { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";

const statusColors = {
  success: "bg-green-100 text-green-700",
  failed: "bg-red-100 text-red-700",
  pending: "bg-yellow-100 text-yellow-700",
};

type PaystackTransaction = {
  id: number;
  reference: string;
  amount: number;
  status: string;
  customer: { email: string; first_name?: string; last_name?: string };
  channel: string;
  paid_at: string;
};

export default function TransactionsPage() {
  const [transactions, setTransactions] = useState<PaystackTransaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 20;

  useEffect(() => {
    const fetchTransactions = async () => {
      setLoading(true);
      setError("");
      try {
        const res = await fetch("/api/paystack/transactions");
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }
        const data = await res.json();
        
        if (data.status && data.data) {
          setTransactions(data.data);
        } else if (data.error) {
          setError(data.error);
        } else {
          setError("Failed to fetch transactions.");
        }
      } catch (error) {
        console.error('Error fetching transactions:', error);
        setError("Failed to fetch transactions. Please check your Paystack configuration.");
      } finally {
        setLoading(false);
      }
    };
    fetchTransactions();
  }, []);

  // Pagination logic
  const totalPages = Math.ceil(transactions.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentTransactions = transactions.slice(startIndex, endIndex);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

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
            <h1 className="text-3xl font-bold text-gray-900 mb-1">Transactions</h1>
            <p className="text-gray-600">View all Paystack transactions.</p>
          </div>
        </div>

        {/* Table */}
        <div className="bg-white rounded-2xl shadow-lg overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-2 py-2 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Reference</th>
                <th className="px-2 py-2 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Amount</th>
                <th className="px-2 py-2 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-2 py-2 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Customer</th>
                <th className="px-2 py-2 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Channel</th>
                <th className="px-2 py-2 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Paid At</th>
                <th className="px-2 py-2 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-100">
              {loading ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-gray-400">
                    Loading transactions...
                  </td>
                </tr>
              ) : error ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-red-400">
                    {error}
                  </td>
                </tr>
              ) : transactions.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-gray-400">
                    No transactions found.
                  </td>
                </tr>
              ) : (
                currentTransactions.map((t) => (
                  <tr key={t.id} className="hover:bg-gray-50 transition">
                    <td className="px-2 py-1 text-xs text-gray-700 font-mono">{t.reference}</td>
                    <td className="px-2 py-1 text-xs text-gray-700">₦{(t.amount / 100).toLocaleString()}</td>
                    <td className="px-2 py-1 text-xs">
                      <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-semibold ${statusColors[t.status as keyof typeof statusColors] || 'bg-gray-100 text-gray-500'}`}>{t.status}</span>
                    </td>
                    <td className="px-2 py-1 text-xs text-gray-700">{t.customer?.email || "-"}</td>
                    <td className="px-2 py-1 text-xs text-gray-700">{t.channel}</td>
                    <td className="px-2 py-1 text-xs text-gray-700">{t.paid_at ? new Date(t.paid_at).toLocaleString() : '-'}</td>
                    <td className="px-2 py-1 text-right text-xs">
                      <a
                        href={`https://dashboard.paystack.com/#/transaction/${t.id}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline font-medium"
                      >
                        View
                      </a>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Controls */}
        {transactions.length > 0 && (
          <div className="mt-6 flex items-center justify-between">
            <div className="text-sm text-gray-700">
              Showing {startIndex + 1} to {Math.min(endIndex, transactions.length)} of {transactions.length} transactions
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="px-3 py-1 text-sm border border-gray-300 rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
              >
                Previous
              </button>
              <span className="text-sm text-gray-700">
                Page {currentPage} of {totalPages}
              </span>
              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="px-3 py-1 text-sm border border-gray-300 rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

