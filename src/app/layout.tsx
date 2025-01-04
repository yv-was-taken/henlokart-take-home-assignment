import "@rainbow-me/rainbowkit/styles.css";
import { Providers } from "./providers";
import { type Metadata } from "next";

export const metadata: Metadata = {
  title: "Web3 App",
  description: "Web3 application with wallet connection",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
