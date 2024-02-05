/** @type {import('next').NextConfig} */

const { withSentryConfig } = require("@sentry/nextjs");

const moduleExports = {
  reactStrictMode: true,
  swcMinify: true,
  transpilePackages: [
    "antd",
    "rc-util",
    "@ant-design/icons",
    "@ant-design/icons-svg",
    "rc-pagination",
    "rc-picker",
    "rc-tree",
    "rc-table",
  ],
};

const sentryWebpackPluginOptions = {
  silent: true,
};

const config = process.env.NEXT_PUBLIC_E2E
  ? moduleExports
  : withSentryConfig(moduleExports, sentryWebpackPluginOptions);
module.exports = config;
