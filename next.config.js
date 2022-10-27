/** @type {import('next').NextConfig} */

const { withSentryConfig } = require("@sentry/nextjs");

const moduleExports = {
  reactStrictMode: true,
};

const sentryWebpackPluginOptions = {
  silent: true,
};

const config = process.env.NEXT_PUBLIC_E2E
  ? moduleExports
  : withSentryConfig(moduleExports, sentryWebpackPluginOptions);
module.exports = config;
