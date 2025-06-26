import Image from 'next/image';
import backgroundPoster from '../components/images/arif.jpg';
import logo from '../components/images/logo.png';
import Footer from '../components/Footer';

export default function Home() {
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
					<form className="bg-white p-4 rounded shadow-md flex flex-col gap-4 w-full">
						<h2 className="text-2xl font-semibold text-center text-[#0B3948] mb-4">
							Admin Login
						</h2>
						<label className="flex flex-col text-sm font-medium text-gray-700">
							Username
							<input
								type="text"
								name="username"
								className="mt-1 p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#0B3948]"
								required
							/>
						</label>
						<label className="flex flex-col text-sm font-medium text-gray-700">
							Password
							<input
								type="password"
								name="password"
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
