"use client";

import { ConnectionProvider, WalletProvider } from "@solana/wallet-adapter-react";
import { WalletModalProvider } from "@solana/wallet-adapter-react-ui";
import type { ReactNode } from "react";
import { useNetwork } from "@/contexts/NetworkContext";

import "@solana/wallet-adapter-react-ui/styles.css";

export function AppWalletProvider({ children }: { children: ReactNode }) {
	const { endpoint } = useNetwork();

	return (
		<ConnectionProvider endpoint={endpoint}>
			<WalletProvider wallets={[]} autoConnect>
				<WalletModalProvider>{children}</WalletModalProvider>
			</WalletProvider>
		</ConnectionProvider>
	);
}
