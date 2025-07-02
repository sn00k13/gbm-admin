'use client';

import React, { useEffect, useState } from 'react';
import Navbar from '../../../components/Navbar';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
	faMagnifyingGlass,
	faBell,
	faUser,
	faArrowTrendUp,
} from '@fortawesome/free-solid-svg-icons';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../../../firebase'; // adjust path if needed

function AdminDashboard() {
    const [userCount, setUserCount] = useState<number | null>(null);
    const [restaurantCount, setRestaurantCount] = useState<number | null>(null);
    const [orderCount, setOrderCount] = useState<number | null>(null); // 1. Add state
    const [agentCounts, setAgentCounts] = useState<{ total: number | null; pending: number | null; approved: number | null }>({ total: null, pending: null, approved: null });

    useEffect(() => {
        const fetchCounts = async () => {
            const usersSnapshot = await getDocs(collection(db, 'users'));
            setUserCount(usersSnapshot.size);

            const restaurantsSnapshot = await getDocs(collection(db, 'restaurants'));
            setRestaurantCount(restaurantsSnapshot.size);

            const ordersSnapshot = await getDocs(collection(db, 'orders')); // 2. Fetch orders
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
		<div className="flex w-full h-screen bg-gray-300">
			<Navbar />
			<div className="flex flex-col w-full">
				<div className="flex items-center mb-4 w-full border-b-1 border-gray-400 p-8">
					<div className="flex items-center justify-between space-x-4">
						<p>Admin Dashboard</p>
						<div className="flex items-center justify-between bg-gray-100 p-1 rounded space-x-2 pl-2">
							<FontAwesomeIcon icon={faMagnifyingGlass} />
							<input
								type="text"
								name="dashSearch"
								id="dashSearch"
								placeholder="Search"
								className="focus:outline-none bg-gray-100"
							/>
						</div>
					</div>
					<div className="flex items-center justify-between space-x-8 ml-auto text-2xl">
						<div>
							<FontAwesomeIcon icon={faBell} />
						</div>
						<div>
							<FontAwesomeIcon icon={faUser} />
						</div>
					</div>
				</div>
				<div className="flex items-center justify-center w-full h-auto p-4 space-x-12">
					<div className="border border-gray-400 h-36 w-56 rounded p-4 text-sm justify-between flex flex-col shadow-lg bg-white">
						<div className="flex items-center justify-between">
							<p>Total Users</p>
							<div className="flex items-center space-x-2 text-green-600 bg-green-100 p-1 rounded">
								<FontAwesomeIcon icon={faArrowTrendUp} />
								<p>+12.5%</p>
							</div>
						</div>
						<div className="text-2xl font-bold ">
							{userCount !== null ? `${userCount} MAU` : 'Loading...'}
						</div>
						<div className="flex items-center">
							<p>Top Monthly Trend</p>
							<FontAwesomeIcon icon={faArrowTrendUp} />
						</div>
					</div>
					<div className="border border-gray-400 h-36 w-56 rounded p-4 text-sm justify-between flex flex-col shadow-lg bg-white">
						<div className="flex items-center justify-between">
							<p>Total Restaurants</p>
							<div className="flex items-center space-x-2 text-green-600 bg-green-100 p-1 rounded">
								<FontAwesomeIcon icon={faArrowTrendUp} />
								<p>+12.5%</p>
							</div>
						</div>
						<div className="text-2xl font-bold ">
							{restaurantCount !== null ? restaurantCount : 'Loading...'}
						</div>
						<div className="flex items-center">
							<p>Top Monthly Trend</p>
							<FontAwesomeIcon icon={faArrowTrendUp} />
						</div>
					</div>
					<div className="border border-gray-400 h-36 w-56 rounded p-4 text-sm justify-between flex flex-col shadow-lg bg-white">
						<div className="flex items-center justify-between">
							<p>Total Products</p>
							<div className="flex items-center space-x-2 text-green-600 bg-green-100 p-1 rounded">
								<FontAwesomeIcon icon={faArrowTrendUp} />
								<p>+12.5%</p>
							</div>
						</div>
						<div className="text-2xl font-bold ">54,650</div>
						<div className="flex items-center">
							<p>Top Monthly Trend</p>
							<FontAwesomeIcon icon={faArrowTrendUp} />
						</div>
					</div>
					<div className="border border-gray-400 h-36 w-56 rounded p-4 text-sm justify-between flex flex-col shadow-lg bg-white">
						<div className="flex items-center justify-between">
							<p>Total orders</p>
							<div className="flex items-center space-x-2 text-green-600 bg-green-100 p-1 rounded">
								<FontAwesomeIcon icon={faArrowTrendUp} />
								<p>+12.5%</p>
							</div>
						</div>
						<div className="text-2xl font-bold ">
                			{orderCount !== null ? orderCount : 'Loading...'}
            			</div>
						<div className="flex items-center">
							<p>Top Monthly Trend</p>
							<FontAwesomeIcon icon={faArrowTrendUp} />
						</div>
					</div>
					<div className="border border-gray-400 h-36 w-56 rounded p-4 text-sm justify-between flex flex-col shadow-lg bg-white">
						<div className="flex items-center justify-between">
							<p>Total Agents</p>
							<div className="flex items-center space-x-2 text-green-600 bg-green-100 p-1 rounded">
								<FontAwesomeIcon icon={faArrowTrendUp} />
								<p>+12.5%</p>
							</div>
						</div>
						<div className="text-2xl font-bold ">
							{agentCounts.total !== null ? agentCounts.total : 'Loading...'}
						</div>
						<div className="flex flex-col text-sm mt-1">
							<span>Approved: {agentCounts.approved !== null ? agentCounts.approved : '...'}</span>
							<span>Pending: {agentCounts.pending !== null ? agentCounts.pending : '...'}</span>
						</div>
						
					</div>
				</div>
			</div>
		</div>
	);
}

export default AdminDashboard;
