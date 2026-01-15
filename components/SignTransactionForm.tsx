"use client";

import { WalletAdapterNetwork } from "@solana/wallet-adapter-base";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { VersionedTransaction } from "@solana/web3.js";
import bs58 from "bs58";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useNetwork } from "@/contexts/NetworkContext";

type Encoding = "base58" | "base64";

interface FormData {
	transaction: string;
	encoding: Encoding;
	broadcast: boolean;
	skipSimulation: boolean;
}

export function SignTransactionForm() {
	const { publicKey, signTransaction } = useWallet();
	const { connection } = useConnection();
	const { network } = useNetwork();

	const [signedTransaction, setSignedTransaction] = useState<string | null>(null);
	const [txSignature, setTxSignature] = useState<string | null>(null);
	const [error, setError] = useState<string | null>(null);
	const [isLoading, setIsLoading] = useState(false);
	const [failedTxData, setFailedTxData] = useState<{ message: string; signatures: string[] } | null>(null);

	const {
		register,
		handleSubmit,
		watch,
		formState: { errors },
	} = useForm<FormData>({
		defaultValues: {
			transaction: "",
			encoding: "base58",
			broadcast: false,
			skipSimulation: false,
		},
	});

	const encoding = watch("encoding");
	const broadcast = watch("broadcast");

	const onSubmit = async (data: FormData) => {
		if (!publicKey || !signTransaction) {
			setError("Wallet not connected or doesn't support transaction signing");
			return;
		}

		setIsLoading(true);
		setError(null);
		setSignedTransaction(null);
		setTxSignature(null);
		setFailedTxData(null);

		try {
			let txBytes: Uint8Array;

			if (data.encoding === "base58") {
				txBytes = bs58.decode(data.transaction);
			} else {
				const binaryString = atob(data.transaction);
				txBytes = Uint8Array.from(binaryString, (char) => char.charCodeAt(0));
			}

			const tx = VersionedTransaction.deserialize(txBytes);
			const signedTx = await signTransaction(tx);

			const signedBytes = signedTx.serialize();
			let signedEncoded: string;

			if (data.encoding === "base58") {
				signedEncoded = bs58.encode(signedBytes);
			} else {
				signedEncoded = btoa(String.fromCharCode(...signedBytes));
			}

			setSignedTransaction(signedEncoded);

			if (data.broadcast) {
				try {
					const signature = await connection.sendTransaction(signedTx, {
						skipPreflight: data.skipSimulation,
					});
					setTxSignature(signature);
				} catch (broadcastErr) {
					// Store message and signatures for inspector link on simulation failure
					const messageBase64 = btoa(String.fromCharCode(...signedTx.message.serialize()));
					const signatures = signedTx.signatures.map((sig) => bs58.encode(sig));
					setFailedTxData({ message: messageBase64, signatures });
					throw broadcastErr;
				}
			}
		} catch (err) {
			setError(err instanceof Error ? err.message : "Failed to sign transaction");
		} finally {
			setIsLoading(false);
		}
	};

	const copyToClipboard = async (text: string) => {
		await navigator.clipboard.writeText(text);
	};

	const getExplorerUrl = (signature: string) => {
		const cluster = network === WalletAdapterNetwork.Mainnet ? "" : `?cluster=${network}`;
		return `https://explorer.solana.com/tx/${signature}${cluster}`;
	};

	const getInspectorUrl = (data: { message: string; signatures: string[] }) => {
		const cluster = network === WalletAdapterNetwork.Mainnet ? "mainnet" : network;
		// Double URL encode signatures JSON array and message (as expected by Solana Explorer)
		const signaturesJson = JSON.stringify(data.signatures);
		const encodedSignatures = encodeURIComponent(encodeURIComponent(signaturesJson));
		const encodedMessage = encodeURIComponent(encodeURIComponent(data.message));
		return `https://explorer.solana.com/tx/inspector?cluster=${cluster}&signatures=${encodedSignatures}&message=${encodedMessage}`;
	};

	return (
		<form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
			<div className="form-control">
				<label className="label" htmlFor="transaction">
					<span className="label-text">Serialized Transaction</span>
				</label>
				<textarea
					id="transaction"
					className="textarea textarea-bordered h-32 font-mono text-sm"
					placeholder={`Enter ${encoding} encoded transaction...`}
					{...register("transaction", { required: "Transaction is required" })}
				/>
				{errors.transaction && <span className="text-error text-sm mt-1">{errors.transaction.message}</span>}
			</div>

			<fieldset className="form-control">
				<legend className="label">
					<span className="label-text">Encoding</span>
				</legend>
				<div className="flex gap-4">
					<label className="label cursor-pointer gap-2">
						<input type="radio" className="radio radio-primary" value="base58" {...register("encoding")} />
						<span className="label-text">Base58</span>
					</label>
					<label className="label cursor-pointer gap-2">
						<input type="radio" className="radio radio-primary" value="base64" {...register("encoding")} />
						<span className="label-text">Base64</span>
					</label>
				</div>
			</fieldset>

			<div className="form-control">
				<label className="label cursor-pointer justify-start gap-4">
					<input type="checkbox" className="checkbox checkbox-primary" {...register("broadcast")} />
					<span className="label-text">Broadcast transaction after signing</span>
				</label>
				{broadcast && (
					<>
						<span className="text-warning text-sm ml-10">
							Warning: This will send the transaction to the network. Make sure you trust the transaction contents.
						</span>
						<label className="label cursor-pointer justify-start gap-4 ml-6">
							<input
								type="checkbox"
								className="checkbox checkbox-secondary checkbox-sm"
								{...register("skipSimulation")}
							/>
							<span className="label-text text-sm">Skip transaction simulation (preflight)</span>
						</label>
					</>
				)}
			</div>

			{error && (
				<div className="alert alert-error">
					<div className="flex flex-col gap-2 w-full">
						<span>{error}</span>
						{failedTxData && (
							<a
								href={getInspectorUrl(failedTxData)}
								target="_blank"
								rel="noopener noreferrer"
								className="btn btn-sm btn-outline btn-error"
							>
								Simulate on Solana Explorer
							</a>
						)}
					</div>
				</div>
			)}

			{txSignature && (
				<div className="alert alert-success">
					<div className="flex flex-col gap-2 w-full">
						<span>Transaction broadcasted successfully!</span>
						<a
							href={getExplorerUrl(txSignature)}
							target="_blank"
							rel="noopener noreferrer"
							className="link link-primary text-sm break-all"
						>
							View on Solana Explorer
						</a>
					</div>
				</div>
			)}

			{signedTransaction && (
				<div className="space-y-2">
					<label className="label" htmlFor="signed-output">
						<span className="label-text">Signed Transaction ({encoding})</span>
					</label>
					<div className="flex gap-2">
						<textarea
							id="signed-output"
							className="textarea textarea-bordered flex-1 font-mono text-sm h-24"
							value={signedTransaction}
							readOnly
						/>
						<button
							type="button"
							className="btn btn-outline self-start"
							onClick={() => copyToClipboard(signedTransaction)}
						>
							Copy
						</button>
					</div>
				</div>
			)}

			<button type="submit" className="btn btn-primary w-full" disabled={!publicKey || isLoading}>
				{isLoading ? <span className="loading loading-spinner" /> : broadcast ? "Sign & Broadcast" : "Sign Transaction"}
			</button>

			{!publicKey && (
				<p className="text-center text-base-content/50 text-sm">Connect your wallet to sign transactions</p>
			)}
		</form>
	);
}
