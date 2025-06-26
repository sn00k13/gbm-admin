'use client';

import React from 'react';
import Link from 'next/link';

function Footer() {
	return (
		<div className=" md:grid-cols-2 w-full">
			<div className="flex flex-col md:flex-row items-center justify-center p-4 gap-4">
				<p className="text-xs text-gray-600">
					&copy; {new Date().getFullYear()} Bubble Barrel Commerce Nig. Ltd. All rights reserved.
				</p>
				<ul className="flex gap-4 justify-end">
					<li>
						<Link href="/privacy" className="text-xs text-gray-600">
							Privacy Policy
						</Link>
					</li>
					<li>
						<Link href="/terms" className="text-xs text-gray-600">
							Terms of Service
						</Link>
					</li>
					<li>
						<Link href="/contact" className="text-xs text-gray-600">
							Contact Us
						</Link>
					</li>
				</ul>
			</div>

		</div>
	);
}

export default Footer;
