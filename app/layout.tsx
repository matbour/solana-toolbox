import type { Metadata } from "next";
import Link from "next/link";
import { AppWalletProvider } from "@/components/providers/WalletProvider";
import { NetworkSelector } from "@/components/ui/NetworkSelector";
import { WalletButton } from "@/components/ui/WalletButton";
import { NetworkProvider } from "@/contexts/NetworkContext";
import "./globals.css";

export const metadata: Metadata = {
	title: "Solana Toolbox",
	description: "A collection of tools for Solana transactions",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
	return (
		<html lang="en" data-theme="dark">
			<body className="min-h-screen bg-base-100">
				<NetworkProvider>
					<AppWalletProvider>
						<div className="navbar bg-base-200 px-4">
							<div className="flex-1">
								<Link href="/" className="text-xl font-bold text-primary">
									Solana Toolbox
								</Link>
							</div>
							<div className="flex-none gap-4">
								<NetworkSelector />
								<WalletButton />
							</div>
						</div>
						<main className="container mx-auto p-4">{children}</main>
					</AppWalletProvider>
				</NetworkProvider>
			</body>
		</html>
	);
}
