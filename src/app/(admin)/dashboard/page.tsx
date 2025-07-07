'use client';

import React, { useEffect, useState } from 'react';
import Navbar from '../../../components/Navbar';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
	faMagnifyingGlass,
	faBell,
	faUser,
	faArrowTrendUp,
	faUsers,
	faStore,
	faBox,
	faShoppingCart,
	faUserTie,
	faCheckCircle,
	faClock,
} from '@fortawesome/free-solid-svg-icons';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../../../firebase';

function AdminDashboard() {
    const [userCount, setUserCount] = useState<number | null>(null);
    const [restaurantCount, setRestaurantCount] = useState<number | null>(null);
    const [orderCount, setOrderCount] = useState<number | null>(null);
    const [agentCounts, setAgentCounts] = useState<{ total: number | null; pending: number | null; approved: number | null }>({ total: null, pending: null, approved: null });

    useEffect(() => {
        const fetchCounts = async () => {
            const usersSnapshot = await getDocs(collection(db, 'users'));
            setUserCount(usersSnapshot.size);

            const restaurantsSnapshot = await getDocs(collection(db, 'restaurants'));
            setRestaurantCount(restaurantsSnapshot.size);

            const ordersSnapshot = await getDocs(collection(db, 'orders'));
            setOrderCount(ordersSnapshot.size);

            // Fetch agents and count total, pending, and approved
            const agentsSnapshot = await getDocs(collection(db, 'agents'));
            let total = 0, pending = 0, approved = 0;
            agentsSnapshot.forEach(doc => {
                total++;
                const data = doc.data();
                if (data.isVerified === true) approved++;
                else pending++;
            });
            setAgentCounts({ total, pending, approved });
        };
        fetchCounts();
    }, []);

	return (
		<div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex">
			{/* Left Sidebar - Navbar */}
			<div className="w-64 bg-white shadow-lg border-r border-gray-200">
				<Navbar />
			</div>
			
			{/* Main Content Area */}
			<div className="flex-1 flex flex-col">
				{/* Header Section */}
				<div className="bg-white/80 backdrop-blur-sm border-b border-gray-200 px-6 py-4">
					<div className="flex items-center justify-between">
						<div className="flex items-center space-x-4">
							<h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
							<div className="hidden md:flex items-center bg-white border border-gray-300 rounded-xl px-4 py-2 shadow-sm">
								<FontAwesomeIcon icon={faMagnifyingGlass} className="text-gray-400 mr-2" />
								<input
									type="text"
									placeholder="Search..."
									className="outline-none bg-transparent text-gray-700 placeholder-gray-400"
								/>
							</div>
						</div>
						<div className="flex items-center space-x-4">
							<button className="relative p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors">
								<FontAwesomeIcon icon={faBell} className="text-xl" />
								<span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
									3
								</span>
							</button>
							<button className="flex items-center space-x-2 p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors">
								<FontAwesomeIcon icon={faUser} className="text-xl" />
								<span className="hidden md:block font-medium">Admin</span>
							</button>
						</div>
					</div>
				</div>

				{/* Main Content */}
				<div className="flex-1 p-6">
					{/* Welcome Section */}
					<div className="mb-8">
						<h2 className="text-3xl font-bold text-gray-900 mb-2">Welcome back!</h2>
						<p className="text-gray-600">Here&apos;s what&apos;s happening with your business today.</p>
					</div>

					{/* Stats Grid */}
					<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6 mb-8">
						{/* Users Card */}
						<div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-lg transition-all duration-300">
							<div className="flex items-center justify-between mb-4">
								<div className="p-3 bg-blue-100 rounded-xl">
									<FontAwesomeIcon icon={faUsers} className="text-blue-600 text-xl" />
								</div>
								<div className="flex items-center space-x-1 text-green-600 bg-green-100 px-2 py-1 rounded-full text-sm">
									<FontAwesomeIcon icon={faArrowTrendUp} className="text-xs" />
									<span>+12.5%</span>
								</div>
							</div>
							<h3 className="text-gray-600 text-sm font-medium mb-1">Total Users</h3>
							<div className="text-3xl font-bold text-gray-900 mb-2">
								{userCount !== null ? `${userCount.toLocaleString()}` : (
									<div className="animate-pulse bg-gray-200 h-8 rounded"></div>
								)}
							</div>
							<p className="text-gray-500 text-sm flex items-center">
								<FontAwesomeIcon icon={faArrowTrendUp} className="text-green-500 mr-1 text-xs" />
								Top Monthly Trend
							</p>
						</div>

						{/* Restaurants Card */}
						<div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-lg transition-all duration-300">
							<div className="flex items-center justify-between mb-4">
								<div className="p-3 bg-green-100 rounded-xl">
									<FontAwesomeIcon icon={faStore} className="text-green-600 text-xl" />
								</div>
								<div className="flex items-center space-x-1 text-green-600 bg-green-100 px-2 py-1 rounded-full text-sm">
									<FontAwesomeIcon icon={faArrowTrendUp} className="text-xs" />
									<span>+8.2%</span>
								</div>
							</div>
							<h3 className="text-gray-600 text-sm font-medium mb-1">Total Restaurants</h3>
							<div className="text-3xl font-bold text-gray-900 mb-2">
								{restaurantCount !== null ? restaurantCount.toLocaleString() : (
									<div className="animate-pulse bg-gray-200 h-8 rounded"></div>
								)}
							</div>
							<p className="text-gray-500 text-sm flex items-center">
								<FontAwesomeIcon icon={faArrowTrendUp} className="text-green-500 mr-1 text-xs" />
								Active Partners
							</p>
						</div>

						{/* Products Card */}
						<div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-lg transition-all duration-300">
							<div className="flex items-center justify-between mb-4">
								<div className="p-3 bg-purple-100 rounded-xl">
									<FontAwesomeIcon icon={faBox} className="text-purple-600 text-xl" />
								</div>
								<div className="flex items-center space-x-1 text-green-600 bg-green-100 px-2 py-1 rounded-full text-sm">
									<FontAwesomeIcon icon={faArrowTrendUp} className="text-xs" />
									<span>+15.3%</span>
								</div>
							</div>
							<h3 className="text-gray-600 text-sm font-medium mb-1">Total Products</h3>
							<div className="text-3xl font-bold text-gray-900 mb-2">54,650</div>
							<p className="text-gray-500 text-sm flex items-center">
								<FontAwesomeIcon icon={faArrowTrendUp} className="text-green-500 mr-1 text-xs" />
								Available Items
							</p>
						</div>

						{/* Orders Card */}
						<div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-lg transition-all duration-300">
							<div className="flex items-center justify-between mb-4">
								<div className="p-3 bg-orange-100 rounded-xl">
									<FontAwesomeIcon icon={faShoppingCart} className="text-orange-600 text-xl" />
								</div>
								<div className="flex items-center space-x-1 text-green-600 bg-green-100 px-2 py-1 rounded-full text-sm">
									<FontAwesomeIcon icon={faArrowTrendUp} className="text-xs" />
									<span>+22.1%</span>
								</div>
							</div>
							<h3 className="text-gray-600 text-sm font-medium mb-1">Total Orders</h3>
							<div className="text-3xl font-bold text-gray-900 mb-2">
								{orderCount !== null ? orderCount.toLocaleString() : (
									<div className="animate-pulse bg-gray-200 h-8 rounded"></div>
								)}
							</div>
							<p className="text-gray-500 text-sm flex items-center">
								<FontAwesomeIcon icon={faArrowTrendUp} className="text-green-500 mr-1 text-xs" />
								This Month
							</p>
						</div>

						{/* Agents Card */}
						<div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-lg transition-all duration-300">
							<div className="flex items-center justify-between mb-4">
								<div className="p-3 bg-indigo-100 rounded-xl">
									<FontAwesomeIcon icon={faUserTie} className="text-indigo-600 text-xl" />
								</div>
								<div className="flex items-center space-x-1 text-green-600 bg-green-100 px-2 py-1 rounded-full text-sm">
									<FontAwesomeIcon icon={faArrowTrendUp} className="text-xs" />
									<span>+5.7%</span>
								</div>
							</div>
							<h3 className="text-gray-600 text-sm font-medium mb-1">Total Agents</h3>
							<div className="text-3xl font-bold text-gray-900 mb-2">
								{agentCounts.total !== null ? agentCounts.total.toLocaleString() : (
									<div className="animate-pulse bg-gray-200 h-8 rounded"></div>
								)}
							</div>
							<div className="space-y-1">
								<div className="flex items-center justify-between text-sm">
									<span className="text-gray-500 flex items-center">
										<FontAwesomeIcon icon={faCheckCircle} className="text-green-500 mr-1 text-xs" />
										Approved
									</span>
									<span className="font-medium text-gray-900">
										{agentCounts.approved !== null ? agentCounts.approved : '...'}
									</span>
								</div>
								<div className="flex items-center justify-between text-sm">
									<span className="text-gray-500 flex items-center">
										<FontAwesomeIcon icon={faClock} className="text-yellow-500 mr-1 text-xs" />
										Pending
									</span>
									<span className="font-medium text-gray-900">
										{agentCounts.pending !== null ? agentCounts.pending : '...'}
									</span>
								</div>
							</div>
						</div>
					</div>

					{/* Quick Actions */}
					<div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
						<div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
							<h3 className="text-xl font-semibold text-gray-900 mb-4">Quick Actions</h3>
							<div className="grid grid-cols-2 gap-4">
								<button className="p-4 bg-blue-50 hover:bg-blue-100 rounded-xl transition-colors text-left">
									<div className="flex items-center space-x-3">
										<div className="p-2 bg-blue-100 rounded-lg">
											<FontAwesomeIcon icon={faUsers} className="text-blue-600" />
										</div>
										<div>
											<p className="font-medium text-gray-900">Manage Users</p>
											<p className="text-sm text-gray-500">View all users</p>
										</div>
									</div>
								</button>
								<button className="p-4 bg-green-50 hover:bg-green-100 rounded-xl transition-colors text-left">
									<div className="flex items-center space-x-3">
										<div className="p-2 bg-green-100 rounded-lg">
											<FontAwesomeIcon icon={faStore} className="text-green-600" />
										</div>
										<div>
											<p className="font-medium text-gray-900">Restaurants</p>
											<p className="text-sm text-gray-500">Manage partners</p>
										</div>
									</div>
								</button>
								<button className="p-4 bg-purple-50 hover:bg-purple-100 rounded-xl transition-colors text-left">
									<div className="flex items-center space-x-3">
										<div className="p-2 bg-purple-100 rounded-lg">
											<FontAwesomeIcon icon={faShoppingCart} className="text-purple-600" />
										</div>
										<div>
											<p className="font-medium text-gray-900">Orders</p>
											<p className="text-sm text-gray-500">Track orders</p>
										</div>
									</div>
								</button>
								<button className="p-4 bg-orange-50 hover:bg-orange-100 rounded-xl transition-colors text-left">
									<div className="flex items-center space-x-3">
										<div className="p-2 bg-orange-100 rounded-lg">
											<FontAwesomeIcon icon={faUserTie} className="text-orange-600" />
										</div>
										<div>
											<p className="font-medium text-gray-900">Agents</p>
											<p className="text-sm text-gray-500">Manage agents</p>
										</div>
									</div>
								</button>
							</div>
						</div>

						<div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
							<h3 className="text-xl font-semibold text-gray-900 mb-4">Recent Activity</h3>
							<div className="space-y-4">
								<div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
									<div className="w-2 h-2 bg-green-500 rounded-full"></div>
									<div className="flex-1">
										<p className="text-sm font-medium text-gray-900">New user registered</p>
										<p className="text-xs text-gray-500">2 minutes ago</p>
									</div>
								</div>
								<div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
									<div className="w-2 h-2 bg-blue-500 rounded-full"></div>
									<div className="flex-1">
										<p className="text-sm font-medium text-gray-900">Order #1234 completed</p>
										<p className="text-xs text-gray-500">15 minutes ago</p>
									</div>
								</div>
								<div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
									<div className="w-2 h-2 bg-purple-500 rounded-full"></div>
									<div className="flex-1">
										<p className="text-sm font-medium text-gray-900">New restaurant added</p>
										<p className="text-xs text-gray-500">1 hour ago</p>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}

export default AdminDashboard;
