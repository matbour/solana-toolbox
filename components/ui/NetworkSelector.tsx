"use client";

import { WalletAdapterNetwork } from "@solana/wallet-adapter-base";
import { useNetwork } from "@/contexts/NetworkContext";

export function NetworkSelector() {
	const { network, setNetwork } = useNetwork();

	return (
		<div className="flex items-center gap-2">
			<span className="text-sm text-base-content/70">Network:</span>
			<select
				className="select select-sm select-bordered"
				value={network}
				onChange={(e) => setNetwork(e.target.value as WalletAdapterNetwork)}
			>
				<option value={WalletAdapterNetwork.Devnet}>Devnet</option>
				<option value={WalletAdapterNetwork.Mainnet}>Mainnet</option>
			</select>
		</div>
	);
}
