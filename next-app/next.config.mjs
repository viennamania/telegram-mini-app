/** @type {import('next').NextConfig} */
const nextConfig = {
  // fixes wallet connect dependency issue https://docs.walletconnect.com/web3modal/nextjs/about#extra-configuration
  webpack: (config) => {
    config.externals.push("pino-pretty", "lokijs", "encoding");
    return config;
  },

  images: {
    domains: [
      "cryptologos.cc",
      "vzrcy5vcsuuocnf3.public.blob.vercel-storage.com",

      "fal.media",
      "owinwallet.com",
      "res.cloudinary.com",

      "replicate.delivery",
      "replicate.com",
 
      "t.me",

    ],
  },

};

export default nextConfig;
