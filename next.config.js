/** @type {import('next').NextConfig} */
module.exports = {
  output: "export",
  trailingSlash: true,
  reactStrictMode: true,
  turbopack: { root: process.cwd() },
};
