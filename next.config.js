const withBundleAnalyzer = require("@next/bundle-analyzer")({
    enabled: process.env.ANALYZE === "true",
    typescript: {
        ignoreBuildErrors: "true",
      },
      eslint: {
        ignoreDuringBuilds: "true",
      },
});
module.exports = withBundleAnalyzer({});
