"use client";

import { WalletAdapterNetwork } from "@solana/wallet-adapter-base";
import { createContext, type ReactNode, useContext, useMemo, useState } from "react";

interface NetworkContextType {
	network: WalletAdapterNetwork;
	setNetwork: (network: WalletAdapterNetwork) => void;
	endpoint: string;
}

const NetworkContext = createContext<NetworkContextType>({
	network: WalletAdapterNetwork.Devnet,
	setNetwork: () => {},
	endpoint: "",
});

export function useNetwork() {
	const context = useContext(NetworkContext);
	if (!context) {
		throw new Error("useNetwork must be used within a NetworkProvider");
	}
	return context;
}

const ENDPOINTS: Record<WalletAdapterNetwork, string> = {
	[WalletAdapterNetwork.Devnet]: "https://api.devnet.solana.com",
	[WalletAdapterNetwork.Testnet]: "https://api.testnet.solana.com",
	[WalletAdapterNetwork.Mainnet]: "https://api.mainnet-beta.solana.com",
};

export function NetworkProvider({ children }: { children: ReactNode }) {
	const [network, setNetwork] = useState<WalletAdapterNetwork>(WalletAdapterNetwork.Devnet);

	const endpoint = useMemo(() => ENDPOINTS[network], [network]);

	const value = useMemo(
		() => ({
			network,
			setNetwork,
			endpoint,
		}),
		[network, endpoint],
	);

	return <NetworkContext.Provider value={value}>{children}</NetworkContext.Provider>;
}
