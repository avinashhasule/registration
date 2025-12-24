/** @type {import('next').NextConfig} */

const cspHeader = `
    default-src 'self' ${process.env.NEXT_PUBLIC_ALLOWED_CONNECT_SRC} https://patient.jlhl.in;
    connect-src ${process.env.NEXT_PUBLIC_ALLOWED_CONNECT_SRC};
    script-src 'self' 'unsafe-eval' 'unsafe-inline' ${process.env.NEXT_PUBLIC_ALLOWED_CONNECT_SRC};
    style-src 'self' 'unsafe-inline';
    worker-src 'self' blob: data:;
    img-src 'self' blob: data:;
    font-src 'self';
    object-src 'self' blob: data:;
    base-uri 'self';
    form-action 'self';
    frame-ancestors 'none';
    block-all-mixed-content;
    upgrade-insecure-requests;
`;

const securityHeaders = [
  {
    key: "X-Frame-Options",
    value: "DENY",
  },
  {
    key: "X-Content-Type-Options",
    value: "nosniff",
  },
  {
    key: "X-Powered-By",
    value: "JLHL",
  },
];

if (process.env.NEXT_PUBLIC_APPLY_SECURITY_HEADERS === "true") {
  securityHeaders.push(
    ...[
      {
        key: "Content-Security-Policy",
        value: cspHeader.replace(/\n/g, ""),
      },
      {
        key: "Referrer-Policy",
        value: "origin-when-cross-origin",
      },
      {
        key: "Strict-Transport-Security",
        value: "max-age=63072000; includeSubDomains; preload",
      },
      {
        key: "X-XSS-Protection",
        value: "1; mode=block",
      },
    ]
  );
}

const nextConfig = {
  poweredByHeader: false,
  compiler: {
    styledComponents: true,
  },
  swcMinify: false,
  async redirects() {
    return [
      {
        source: "/",
        destination: "/login",
        permanent: true,
      },
    ];
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "medulla-cdn.s3.ap-south-1.amazonaws.com",
        port: "",
        pathname: "**",
      },
    ],
  },
  output: "standalone", // mine worked fine without this line
  reactStrictMode: false,
  async headers() {
    return [
      {
        source: "/(.*)?", // Matches all pages
        headers: securityHeaders,
      },
    ];
  },
  webpack: (config) => {
    config.module.rules.push({
      test: /\.node$/,
      use: "node-loader",
    });
    config.resolve.alias.canvas = false;
    config.resolve.alias.encoding = false;
    return config;
  },
};

module.exports = nextConfig;
