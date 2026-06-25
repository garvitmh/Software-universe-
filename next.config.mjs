/** @type {import('next').NextConfig} */
const nextConfig = {
  // transformers.js + onnxruntime ship native binaries — keep them external so
  // Next requires them at runtime instead of trying to bundle them.
  experimental: {
    serverComponentsExternalPackages: ["@huggingface/transformers", "onnxruntime-node"],
  },
};

export default nextConfig;
