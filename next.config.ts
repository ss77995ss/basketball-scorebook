import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  // styled-components needs the SWC transform for stable class names
  compiler: { styledComponents: true },
  reactCompiler: true,
};

export default nextConfig;
