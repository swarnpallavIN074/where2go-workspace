/** @type {import('next').NextConfig} */
const nextConfig = {
	reactStrictMode: false,
	images: {
		domains: ["res.cloudinary.com"],
	},
	rewrites: async () => {
		return [
			{
				source: "/api/:path*",
				destination: "http://localhost:3000/api/:path*", // Proxy to Backend
			},
		];
	},
};

export default nextConfig;
