'use client';

import React from 'react';
import { signOut } from 'firebase/auth';
import { auth } from '../firebase'; // adjust the path if needed
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import logo from '../components/images/logo.png'; // adjust the path if needed
import Link from 'next/link';

function NavBar() {
	const router = useRouter();

	const handleLogout = async () => {
		await signOut(auth);
		router.push('/'); // Redirect to login or home page
	};
	return (
		<div className="flex flex-col h-full p-4 justify-between bg-white">
			<div>
				<div className="flex items-center justify-center mb-8 pb-4 border-b border-gray-200">
					<Image
						src={logo}
						alt="logo"
						width={40}
						// height={50}
					/>
					<div className="text-xl font-bold ml-2">
						<p>GOBUYME</p>
						<p className="font-normal italic text-sm">(Admin)</p>
					</div>
				</div>
				<div className="space-y-1">
					<Link
						href="/users"
						className="block px-3 py-2 text-gray-700 hover:bg-gray-100 hover:text-gray-900 rounded-lg transition-colors"
					>
						Users
					</Link>
					<Link
						href="/restaurants"
						className="block px-3 py-2 text-gray-700 hover:bg-gray-100 hover:text-gray-900 rounded-lg transition-colors"
					>
						Restaurants
					</Link>
					<Link
						href="/agents"
						className="block px-3 py-2 text-gray-700 hover:bg-gray-100 hover:text-gray-900 rounded-lg transition-colors"
					>
						Agents
					</Link>
					<Link
						href="/products"
						className="block px-3 py-2 text-gray-700 hover:bg-gray-100 hover:text-gray-900 rounded-lg transition-colors"
					>
						Products
					</Link>
					<Link
						href="/orders"
						className="block px-3 py-2 text-gray-700 hover:bg-gray-100 hover:text-gray-900 rounded-lg transition-colors"
					>
						Orders
					</Link>
					<Link
						href="/transactions"
						className="block px-3 py-2 text-gray-700 hover:bg-gray-100 hover:text-gray-900 rounded-lg transition-colors"
					>
						Transactions
					</Link>
					<Link
						href="/receipts"
						className="block px-3 py-2 text-gray-700 hover:bg-gray-100 hover:text-gray-900 rounded-lg transition-colors"
					>
						Receipts
					</Link>
					<Link
						href="/analysis"
						className="block px-3 py-2 text-gray-700 hover:bg-gray-100 hover:text-gray-900 rounded-lg transition-colors"
					>
						Analysis
					</Link>
				</div>
			</div>
			
			<div className="space-y-2">
				<button className='w-full text-left px-3 py-2 text-gray-700 hover:bg-gray-100 hover:text-gray-900 rounded-lg transition-colors'>
					Settings
				</button>
				<button 
					onClick={handleLogout} 
					className='w-full text-left px-3 py-2 text-gray-700 hover:bg-gray-100 hover:text-gray-900 rounded-lg transition-colors'
				>
					Logout
				</button>
			</div>
		</div>
	);
}

export default NavBar;
