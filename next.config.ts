/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack(config) {
    // Find the existing rule for SVGs
    const fileLoaderRule = config.module.rules.find((rule) =>
      rule.test?.test?.(".svg")
    );

    if (!fileLoaderRule) {
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
    fileLoaderRule.exclude = /\.svg$/i;

    return config;
  },
};

export default nextConfig;

