"use client";

import React, { useState, useEffect } from "react";
import { collection, getDocs, doc, getDoc } from "firebase/firestore";
import { db } from "../../../../firebase";
import Navbar from "@/components/Navbar";

const statusColors = {
  Delivered: "bg-green-100 text-green-700",
  Pending: "bg-yellow-100 text-yellow-700",
  "Available for Pickup": "bg-blue-100 text-blue-700",
  "On Transit": "bg-purple-100 text-purple-700",
  Cancelled: "bg-red-100 text-red-700",
  Processing: "bg-orange-100 text-orange-700",
};

type OrderStatus = keyof typeof statusColors;

type OrderItem = {
  id: string;
  name: string;
  quantity: number;
  price: number;
  imageUrl?: string | null;
};

type Order = {
  id: string;
  customerName?: string;
  customerEmail?: string;
  storeId?: string;
  restaurantId?: string;
  totalAmount?: number;
  discountAmount?: number;
  discountApplied?: boolean;
  status: string;
  createdAt?: string;
  modifiedBy?: string;
  modifiedAt?: string;
  items?: OrderItem[];
};

export default function OrdersPage() {
  const [search, setSearch] = useState("");
  const [orders, setOrders] = useState<Order[]>([]);
  const [storeNames, setStoreNames] = useState<{ [id: string]: string }>({});
  const [restaurantNames, setRestaurantNames] = useState<{ [id: string]: string }>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

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
            totalAmount: d.totalAmount || 0,
            discountAmount: d.discountAmount || 0,
            discountApplied: d.discountApplied || false,
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
            items: d.items || [],
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

  // Sort orders by creation date
  const sortedOrders = [...filteredOrders].sort((a, b) => {
    const dateA = new Date(a.createdAt || 0);
    const dateB = new Date(b.createdAt || 0);
    return sortOrder === 'asc' ? dateA.getTime() - dateB.getTime() : dateB.getTime() - dateA.getTime();
  });

  const handleSortToggle = () => {
    setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
  };

  function getStoreOrRestaurantName(order: Order) {
    if (order.storeId) return storeNames[order.storeId] || "Store";
    if (order.restaurantId) return restaurantNames[order.restaurantId] || "Restaurant";
    return "-";
  }

  const handleViewOrder = (order: Order) => {
    setSelectedOrder(order);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedOrder(null);
  };

  const handlePrintReceipt = () => {
    if (!selectedOrder) return;
    
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;

    const currentDate = new Date().toLocaleDateString();
    const currentTime = new Date().toLocaleTimeString();

    const receiptContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>Sales Receipt - ${selectedOrder.id}</title>
          <style>
            body { 
              font-family: 'Calibri', Arial, sans-serif; 
              margin: 20px; 
              font-size: 13px;
              line-height: 1.4;
            }
            .receipt { 
              max-width: 400px; 
              margin: 0 auto; 
              border: 1px solid #ccc;
              padding: 20px;
              display: flex;
              flex-direction: column;
            }
            .header { 
              text-align: center; 
              margin-bottom: 20px; 
            }
            .logo {
              font-size: 18px;
              font-weight: bold;
              margin-bottom: 10px;
            }
            .title {
              font-size: 25px;
              font-weight: bold;
              margin-bottom: 15px;
            }
            .table-header {
              font-size: 13px;
              font-weight: bold;
              border-bottom: 1px solid #000;
              padding-bottom: 5px;
              margin-bottom: 10px;
            }
            .table-row {
              display: flex;
              justify-content: space-between;
              margin-bottom: 5px;
            }
            .qty { width: 25px; }
            .description { width: 196px; }
            .price { width: 45px; text-align: right; }
            .total-section {
              border-top: 1px solid #000;
              padding-top: 10px;
              margin-top: 15px;
            }
            .total-row {
              display: flex;
              justify-content: space-between;
              font-weight: bold;
              margin-bottom: 5px;
            }
            .grand-total {
              font-size: 22px;
              font-weight: bold;
              border-top: 2px solid #000;
              padding-top: 10px;
              margin-top: 15px;
            }
            .footer {
              text-align: center;
              margin-top: 30px;
              padding-top: 20px;
              border-top: 1px solid #000;
              font-size: 15px;
            }
            .receipt-info {
              font-size: 15px;
              font-weight: bold;
              text-align: center;
              margin-top: 20px;
            }
            .receipt-table {
              display: flex;
              flex-direction: column;
              align-items: flex-start;
              justify-content: space-between;
              font-size: 15px;
              font-weight: bold;
              margin-top: 10px;
            }
            .thank-you {
              font-size: 15px;
              font-weight: bold;
              text-align: center;
              margin: 20px 0;
            }
              .logoText {
              font-size: 25px;
              font-weight: bold;
              text-align: center;
            }
          </style>
        </head>
        <body>
                      <div class="receipt">
              <div class="header">
                <div class="logo">
                  <img src="/logo.png" alt="GoBuyMe Logo" style="max-width: 120px; height: auto; margin-bottom: 10px;">
                  <div class="logoText">GoBuyMe</div>
                </div>
                <div class="title">SALES RECEIPT</div>
              </div>
            
            <div class="table-header">
              <div class="table-row">
                <div class="qty">Qty</div>
                <div class="description">Item Description</div>
                <div class="price">Price</div>
              </div>
            </div>
            
            ${selectedOrder.items && selectedOrder.items.length > 0 
              ? selectedOrder.items.map(item => `
                <div class="table-row">
                  <div class="qty">${item.quantity}x</div>
                  <div class="description">${item.name}</div>
                  <div class="price">₦${((item.price || 0) * (item.quantity || 1)).toFixed(2)}</div>
                </div>
              `).join('')
              : `
                <div class="table-row">
                  <div class="qty">1x</div>
                  <div class="description">Order ${selectedOrder.id}</div>
                  <div class="price">₦${selectedOrder.totalAmount?.toFixed(2) || '0.00'}</div>
                </div>
              `
            }
            
            <div class="total-section">
              <div class="total-row">
                <div>Sub Total:</div>
                <div>₦${selectedOrder.items?.reduce((sum, item) => sum + ((item.price || 0) * (item.quantity || 1)), 0).toFixed(2) || '0.00'}</div>
              </div>
              ${selectedOrder.discountApplied && selectedOrder.discountAmount && selectedOrder.discountAmount > 0 ? `
              <div class="total-row">
                <div>Discount:</div>
                <div>-₦${selectedOrder.discountAmount.toFixed(2)}</div>
              </div>
              ` : ''}
            </div>
            
            <div class="grand-total">
              <div class="total-row">
                <div>Total:</div>
                <div>₦${selectedOrder.totalAmount?.toFixed(2) || '0.00'}</div>
              </div>
            </div>
            
            <div class="receipt-info">
              <div class="receipt-table">
                <div>${selectedOrder.id}</div>
                <div>${currentDate}</div>
                <div>${currentTime}</div>
                <div>${selectedOrder.modifiedBy || 'Admin'}</div>
              </div>
            </div>
            
            <div class="thank-you">THANK YOU</div>
            
            <div class="footer">
              Bubble Barrel Commerce Nigeria Limited
            </div>
          </div>
        </body>
      </html>
    `;

    printWindow.document.write(receiptContent);
    printWindow.document.close();
    printWindow.print();
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
            <h1 className="text-3xl font-bold text-gray-900 mb-1">Orders</h1>
            <p className="text-gray-600">Manage all orders in your application.</p>
          </div>
          <div className="flex gap-2 items-center">
            <input
              type="text"
              placeholder="Search orders..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-200 bg-white shadow-sm"
            />
            <button
              onClick={handleSortToggle}
              className="px-4 py-2 border border-gray-300 rounded bg-white hover:bg-gray-50 transition-colors flex items-center gap-2"
            >
              <span>Sort by Date</span>
              <span className="text-sm">
                {sortOrder === 'desc' ? '↓' : '↑'}
              </span>
            </button>
            <button className="bg-[#0B3948] text-white px-5 py-2 rounded font-semibold hover:bg-[#1a5a6b] transition-all shadow-sm">
              + Add Order
            </button>
          </div>
        </div>

        {/* Table */}
        <div className="bg-white rounded shadow-lg overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Order ID</th>
                <th className="px-4 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Customer</th>
                <th className="px-4 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Email</th>
                <th className="px-4 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Store/Restaurant</th>
                <th className="px-4 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Total</th>
                <th className="px-4 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-4 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Created At</th>
                <th className="px-4 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider w-32">Modified By</th>
                <th className="px-4 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider w-32">Modified At</th>
                <th className="px-4 py-4 text-center text-xs font-semibold text-gray-500 uppercase tracking-wider w-48">Actions</th>
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
              ) : sortedOrders.length === 0 ? (
                <tr>
                  <td colSpan={10} className="py-12 text-center text-gray-400">
                    No orders found.
                  </td>
                </tr>
              ) : (
                sortedOrders.map((o) => (
                  <tr key={o.id} className="hover:bg-gray-50 transition">
                    <td className="px-2 py-1 font-mono text-xs text-gray-700">{o.id}</td>
                    <td className="px-2 py-1 text-gray-900 font-medium text-xs">{o.customerName}</td>
                    <td className="px-2 py-1 text-gray-700 text-xs">{o.customerEmail}</td>
                    <td className="px-2 py-1 text-gray-700 text-xs">{getStoreOrRestaurantName(o)}</td>
                    <td className="px-2 py-1 text-gray-700 text-xs">₦{o.totalAmount?.toFixed(2)}</td>
                    <td className="px-2 py-1 text-xs">
                      <span className={`inline-block px-2 py-0.5 rounded text-xs font-semibold ${statusColors[o.status as OrderStatus] || statusColors.Pending}`}>{o.status}</span>
                    </td>
                    <td className="px-2 py-1 text-gray-700 text-xs">{o.createdAt}</td>
                    <td className="px-2 py-1 text-gray-700 text-xs truncate max-w-28" title={o.modifiedBy}>{o.modifiedBy}</td>
                    <td className="px-2 py-1 text-gray-700 text-xs">{o.modifiedAt}</td>
                    <td className="px-2 py-1 text-center text-xs">
                      <div className="flex justify-center items-center space-x-2">
                        <button 
                          onClick={() => handleViewOrder(o)}
                          className="text-green-600 hover:underline font-medium"
                        >
                          View
                        </button>
                        <button className="text-blue-600 hover:underline font-medium">Edit</button>
                        <button className="text-red-500 hover:underline font-medium">Delete</button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination (UI only) */}
        <div className="flex justify-between items-center mt-6">
          <span className="text-sm text-gray-600">Showing 1 to {sortedOrders.length} of {sortedOrders.length} orders</span>
          <div className="flex gap-2">
            <button className="px-3 py-1 rounded bg-gray-100 text-gray-500 hover:bg-gray-200" disabled>
              Previous
            </button>
            <button className="px-3 py-1 rounded bg-gray-100 text-gray-700 hover:bg-gray-200 font-semibold">
              1
            </button>
            <button className="px-3 py-1 rounded bg-gray-100 text-gray-500 hover:bg-gray-200" disabled>
              Next
            </button>
          </div>
        </div>
      </div>

      {/* Order Details Modal */}
      {showModal && selectedOrder && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded p-8 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Order Details</h2>
              <button
                onClick={handleCloseModal}
                className="text-gray-400 hover:text-gray-600 text-2xl"
              >
                ×
              </button>
            </div>
            
            <div className="space-y-6">
              {/* Order Information */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Order Information</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Order ID</label>
                    <p className="mt-1 text-sm text-gray-900 font-mono">{selectedOrder.id}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Status</label>
                    <p className="mt-1">
                      <span className={`inline-block px-2 py-1 rounded text-xs font-semibold ${statusColors[selectedOrder.status as OrderStatus] || statusColors.Pending}`}>
                        {selectedOrder.status}
                      </span>
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Customer Name</label>
                    <p className="mt-1 text-sm text-gray-900">{selectedOrder.customerName || 'N/A'}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Customer Email</label>
                    <p className="mt-1 text-sm text-gray-900">{selectedOrder.customerEmail || 'N/A'}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Store/Restaurant</label>
                    <p className="mt-1 text-sm text-gray-900">{getStoreOrRestaurantName(selectedOrder)}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Total Amount</label>
                    <p className="mt-1 text-sm text-gray-900 font-semibold">₦{selectedOrder.totalAmount?.toFixed(2) || '0.00'}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Discount</label>
                    <p className="mt-1 text-sm text-gray-900">
                      {selectedOrder.discountApplied ? `₦${selectedOrder.discountAmount?.toFixed(2) || '0.00'}` : 'Not Applied'}
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Created At</label>
                    <p className="mt-1 text-sm text-gray-900">{selectedOrder.createdAt || 'N/A'}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Modified By</label>
                    <p className="mt-1 text-sm text-gray-900">{selectedOrder.modifiedBy || 'N/A'}</p>
                  </div>
                  <div className="col-span-2">
                    <label className="block text-sm font-medium text-gray-700">Modified At</label>
                    <p className="mt-1 text-sm text-gray-900">{selectedOrder.modifiedAt || 'N/A'}</p>
                  </div>
                </div>
              </div>

              {/* Order Items */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Order Items</h3>
                {selectedOrder.items && selectedOrder.items.length > 0 ? (
                  <div className="bg-gray-50 rounded p-4">
                    <div className="space-y-3">
                      {selectedOrder.items.map((item, index) => (
                        <div key={index} className="flex justify-between items-start border-b border-gray-200 pb-3 last:border-b-0">
                          <div className="flex-1">
                            <div className="flex items-center gap-2">
                              <span className="text-sm font-medium text-gray-900">{item.name}</span>
                              <span className="text-xs text-gray-500">x{item.quantity}</span>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="text-sm font-medium text-gray-900">₦{item.price?.toFixed(2) || '0.00'}</div>
                            <div className="text-xs text-gray-500">Total: ₦{((item.price || 0) * (item.quantity || 1)).toFixed(2)}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                    <div className="mt-4 pt-3 border-t border-gray-300">
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium text-gray-700">Subtotal:</span>
                        <span className="text-sm font-medium text-gray-900">
                        ₦{selectedOrder.items?.reduce((sum, item) => sum + ((item.price || 0) * (item.quantity || 1)), 0).toFixed(2) || '0.00'}
                        </span>
                      </div>
                      {selectedOrder.discountApplied && selectedOrder.discountAmount && selectedOrder.discountAmount > 0 && (
                        <div className="flex justify-between items-center mt-2">
                          <span className="text-sm font-medium text-gray-700">Discount:</span>
                          <span className="text-sm font-medium text-red-600">-₦{selectedOrder.discountAmount.toFixed(2)}</span>
                        </div>
                      )}
                      <div className="flex justify-between items-center mt-2">
                        <span className="text-lg font-bold text-gray-900">Total:</span>
                        <span className="text-lg font-bold text-gray-900">₦{selectedOrder.totalAmount?.toFixed(2) || '0.00'}</span>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="bg-gray-50 rounded p-4 text-center">
                    <p className="text-sm text-gray-500">No items found for this order</p>
                  </div>
                )}
              </div>
            </div>
            
            <div className="flex justify-end space-x-3 mt-8 pt-6 border-t border-gray-200">
              <button
                onClick={handleCloseModal}
                className="px-4 py-2 text-gray-700 bg-gray-100 rounded hover:bg-gray-200 transition-colors"
              >
                Close
              </button>
              <button
                onClick={handlePrintReceipt}
                className="px-4 py-2 bg-[#0B3948] text-white rounded hover:bg-[#1a5a6b] transition-colors"
              >
                Print Receipt
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
