import type { Configuration } from 'webpack';

/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack(config: Configuration) {
    if (!config.module?.rules) throw new Error("Webpack configuration is missing module.rules.");

    // Find the existing rule for SVGs
    const fileLoaderRule = config.module.rules.find((rule) =>
      rule && typeof rule === 'object' && 'test' in rule && rule.test instanceof RegExp && rule.test.test('.svg')
    );

    if (!fileLoaderRule || typeof fileLoaderRule !== 'object') {
      throw new Error("SVG file loader rule not found.");
    }

    config.module.rules.push(
      // Reapply the existing rule for SVG imports ending with ?url
      {
        ...fileLoaderRule,
        test: /\.svg$/i,
        resourceQuery: /url/, // e.g., *.svg?url
      },
      // Add new rule to handle React components for other *.svg imports
      {
        test: /\.svg$/i,
        issuer: fileLoaderRule.issuer,
        resourceQuery: { not: [/url/] },
        use: ["@svgr/webpack"],
      }
    );

    // Exclude SVGs from the original rule to prevent conflicts
    if ('exclude' in fileLoaderRule) {
      fileLoaderRule.exclude = /\.svg$/i;
    }

    return config;
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'graph.facebook.com',
        port: '',
        // pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'lh3.googleusercontent.com',
        port: '',
        pathname: '/**',
      },
    ],
  },
  
};

export default nextConfig;
