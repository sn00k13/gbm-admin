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
		<div className="flex flex-col p-4 border-r-1 border-gray-400 justify-between bg-gray-100">
			<div>
				<div className="flex items-center justify-center mb-8 border-b-1  border-gray-300 py-4">
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
				<div>
				<Link
					href="/stores"
					className="block mb-2 hover:bg-orange-400 p-2 hover:rounded"
				>
					Users
				</Link>
				<Link
					href="/stores"
					className="block mb-2 hover:bg-orange-400 p-2 hover:rounded"
				>
					Restaurants
				</Link>
				<Link
					href="/stores"
					className="block mb-2 hover:bg-orange-400 p-2 hover:rounded"
				>
					Agents
				</Link>
				<Link
					href="/stores"
					className="block mb-2 hover:bg-orange-400 p-2 hover:rounded"
				>
					Products
				</Link>
				<Link
					href="/stores"
					className="block mb-2 hover:bg-orange-400 p-2 hover:rounded"
				>
					Orders
				</Link>
				<Link
					href="/stores"
					className="block mb-2 hover:bg-orange-400 p-2 hover:rounded"
				>
					Transactions
				</Link>
				<Link
					href="/stores"
					className="block mb-2 hover:bg-orange-400 p-2 hover:rounded"
				>
					Receipts
				</Link>
				<Link
					href="/stores"
					className="block mb-2 hover:bg-orange-400 p-2 hover:rounded"
				>
					Analysis
				</Link>
			</div>
			</div>
			
			<div className="flex justify-between items-center text-sm">
				<button className='hover:bg-orange-400 p-2 hover:rounded'>Settings</button>
				<button onClick={handleLogout} className='hover:bg-orange-400 p-2 hover:rounded'>Logout</button>
			</div>
		</div>
	);
}

export default NavBar;
