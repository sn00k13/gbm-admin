"use client";

import React, { useState, useEffect } from "react";
import { collection, getDocs, doc, getDoc } from "firebase/firestore";
import { db } from "../../../../firebase";
import Navbar from "@/components/Navbar";

const statusColors = {
  Completed: "bg-green-100 text-green-700",
  Pending: "bg-yellow-100 text-yellow-700",
  Cancelled: "bg-red-100 text-red-700",
  Processing: "bg-blue-100 text-blue-700",
};

type OrderStatus = keyof typeof statusColors;

type Order = {
  id: string;
  customerName?: string;
  customerEmail?: string;
  storeId?: string;
  restaurantId?: string;
  total?: number;
  status: string;
  createdAt?: string;
  modifiedBy?: string;
  modifiedAt?: string;
};

export default function OrdersPage() {
  const [search, setSearch] = useState("");
  const [orders, setOrders] = useState<Order[]>([]);
  const [storeNames, setStoreNames] = useState<{ [id: string]: string }>({});
  const [restaurantNames, setRestaurantNames] = useState<{ [id: string]: string }>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchOrdersAndNames = async () => {
      setLoading(true);
      setError("");
      try {
        const querySnapshot = await getDocs(collection(db, "orders"));
        const data: Order[] = querySnapshot.docs.map((doc) => {
          const d = doc.data();
          return {
            id: doc.id,
            customerName: d.customerName || "",
            customerEmail: d.customerEmail || "",
            storeId: d.storeId || undefined,
            restaurantId: d.restaurantId || undefined,
            total: d.total || 0,
            status: d.status || "Pending",
            createdAt: d.createdAt
              ? (typeof d.createdAt.toDate === 'function'
                  ? d.createdAt.toDate().toLocaleString()
                  : d.createdAt)
              : "",
            modifiedBy: d.modifiedBy || "",
            modifiedAt: d.modifiedAt
              ? (typeof d.modifiedAt.toDate === 'function'
                  ? d.modifiedAt.toDate().toLocaleString()
                  : d.modifiedAt)
              : "",
          };
        });
        setOrders(data);

        // Collect unique store and restaurant IDs
        const storeIds = Array.from(new Set(data.map(o => o.storeId).filter(Boolean)));
        const restaurantIds = Array.from(new Set(data.map(o => o.restaurantId).filter(Boolean)));

        // Fetch store names
        const storeNameMap: { [id: string]: string } = {};
        await Promise.all(storeIds.map(async (id) => {
          const ref = doc(db, "stores", id!);
          const snap = await getDoc(ref);
          if (snap.exists()) {
            storeNameMap[id!] = snap.data().name || "Store";
          } else {
            storeNameMap[id!] = "Store";
          }
        }));
        setStoreNames(storeNameMap);

        // Fetch restaurant names
        const restaurantNameMap: { [id: string]: string } = {};
        await Promise.all(restaurantIds.map(async (id) => {
          const ref = doc(db, "restaurants", id!);
          const snap = await getDoc(ref);
          if (snap.exists()) {
            restaurantNameMap[id!] = snap.data().name || "Restaurant";
          } else {
            restaurantNameMap[id!] = "Restaurant";
          }
        }));
        setRestaurantNames(restaurantNameMap);
      } catch {
        setError("Failed to fetch orders.");
      } finally {
        setLoading(false);
      }
    };
    fetchOrdersAndNames();
  }, []);

  // Filter orders by search
  const filteredOrders = orders.filter(
    (o) =>
      o.id.toLowerCase().includes(search.toLowerCase()) ||
      (o.customerName && o.customerName.toLowerCase().includes(search.toLowerCase())) ||
      (o.customerEmail && o.customerEmail.toLowerCase().includes(search.toLowerCase())) ||
      (o.storeId && storeNames[o.storeId]?.toLowerCase().includes(search.toLowerCase())) ||
      (o.restaurantId && restaurantNames[o.restaurantId]?.toLowerCase().includes(search.toLowerCase()))
  );

  function getStoreOrRestaurantName(order: Order) {
    if (order.storeId) return storeNames[order.storeId] || "Store";
    if (order.restaurantId) return restaurantNames[order.restaurantId] || "Restaurant";
    return "-";
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
            <h1 className="text-3xl font-bold text-gray-900 mb-1">Orders</h1>
            <p className="text-gray-600">Manage all orders in your application.</p>
          </div>
          <div className="flex gap-2 items-center">
            <input
              type="text"
              placeholder="Search orders..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-200 bg-white shadow-sm"
            />
            <button className="bg-[#0B3948] text-white px-5 py-2 rounded-xl font-semibold hover:bg-[#1a5a6b] transition-all shadow-sm">
              + Add Order
            </button>
          </div>
        </div>

        {/* Table */}
        <div className="bg-white rounded-2xl shadow-lg overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Order ID</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Customer</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Customer Email</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Store/Restaurant</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Total</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Created At</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Modified By</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Modified At</th>
                <th className="px-6 py-4 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-100">
              {loading ? (
                <tr>
                  <td colSpan={10} className="py-12 text-center text-gray-400">
                    Loading orders...
                  </td>
                </tr>
              ) : error ? (
                <tr>
                  <td colSpan={10} className="py-12 text-center text-red-400">
                    {error}
                  </td>
                </tr>
              ) : filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan={10} className="py-12 text-center text-gray-400">
                    No orders found.
                  </td>
                </tr>
              ) : (
                filteredOrders.map((o) => (
                  <tr key={o.id} className="hover:bg-gray-50 transition">
                    <td className="px-2 py-1 font-mono text-xs text-gray-700">{o.id}</td>
                    <td className="px-2 py-1 text-gray-900 font-medium text-xs">{o.customerName}</td>
                    <td className="px-2 py-1 text-gray-700 text-xs">{o.customerEmail}</td>
                    <td className="px-2 py-1 text-gray-700 text-xs">{getStoreOrRestaurantName(o)}</td>
                    <td className="px-2 py-1 text-gray-700 text-xs">${o.total?.toFixed(2)}</td>
                    <td className="px-2 py-1 text-xs">
                      <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-semibold ${statusColors[o.status as OrderStatus] || statusColors.Pending}`}>{o.status}</span>
                    </td>
                    <td className="px-2 py-1 text-gray-700 text-xs">{o.createdAt}</td>
                    <td className="px-2 py-1 text-gray-700 text-xs">{o.modifiedBy}</td>
                    <td className="px-2 py-1 text-gray-700 text-xs">{o.modifiedAt}</td>
                    <td className="px-2 py-1 text-right text-xs">
                      <button className="text-blue-600 hover:underline font-medium mr-2">Edit</button>
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
          <span className="text-sm text-gray-600">Showing 1 to {filteredOrders.length} of {filteredOrders.length} orders</span>
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
