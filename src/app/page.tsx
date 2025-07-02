"use client";

import React, { useState } from 'react';
import Image from 'next/image';
import backgroundPoster from '../components/images/arif.jpg';
import logo from '../components/images/logo.png';
import Footer from '../components/Footer';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth, db } from '../firebase';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { useRouter } from 'next/navigation';

export default function Home() {
	const [username, setUsername] = useState('');
	const [password, setPassword] = useState('');
	const [error, setError] = useState('');
	const router = useRouter();

	const handleLogin = async (e: React.FormEvent) => {
		e.preventDefault();
		setError('');
		try {
			// Look up email by username
			const q = query(
				collection(db, 'admin'),
				where('username', '==', username)
			);
			const querySnapshot = await getDocs(q);
			if (querySnapshot.empty) {
				setError('Username not found.');
				return;
			}
			const userDoc = querySnapshot.docs[0];
			const email = userDoc.data().email;
			await signInWithEmailAndPassword(auth, email, password);
			router.push('/dashboard'); // Redirect to the dashboard after successful login
		} catch {
			setError('Invalid credentials.');
		}
	};

	return (
		<div className="flex flex-col items-center justify-center relative h-screen bg-gray-200">
			<Image
				src={backgroundPoster}
				alt="Background Poster"
				layout="fill"
				objectFit="cover"
				className="absolute inset-0 z-0 opacity-50"
			/>
			<div className="relative z-10 grid grid-cols-2 items-center justify-between h-96 bg-gray-100 w-full">
				<div className="flex flex-col items-center justify-between w-full h-full bg-[#FFF0EB] p-4">
					<div>
						<div className="flex items-start">
							<Image
								src={logo}
								alt="Background Poster"
								width={120}
								height={80}
							/>
							<div>
								<h1 className="text-4xl font-bold text-left text-[#0B3948] mt-20">
									Welcome to GoBuyMe
								</h1>
								<p className="text-center text-[#0B3948] mt-4 text-sm">
									This is the admin dashboard for managing your application.
								</p>
							</div>
						</div>
					</div>
					<Footer />
				</div>
				<div className="flex flex-col w-full items-center px-32">
					<form
						className="bg-white p-4 rounded shadow-md flex flex-col gap-4 w-full"
						onSubmit={handleLogin}
					>
						<h2 className="text-2xl font-semibold text-center text-[#0B3948] mb-4">
							Admin Login
						</h2>
						{error && <div className="text-red-500 text-center">{error}</div>}
						<label className="flex flex-col text-sm font-medium text-gray-700">
							Username
							<input
								type="text"
								name="username"
								value={username}
								onChange={(e) => setUsername(e.target.value)}
								className="mt-1 p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#0B3948]"
								required
							/>
						</label>
						<label className="flex flex-col text-sm font-medium text-gray-700">
							Password
							<input
								type="password"
								name="password"
								value={password}
								onChange={(e) => setPassword(e.target.value)}
								className="mt-1 p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#0B3948]"
								required
							/>
						</label>
						<button
							type="submit"
							className="bg-[#FF521B] text-white py-2 rounded hover:bg-[#F8673B] transition"
						>
							Login
						</button>
					</form>
				</div>
			</div>
		</div>
	);
}
