"use client";

import { useWallet } from "@solana/wallet-adapter-react";
import bs58 from "bs58";
import { useState } from "react";
import { useForm } from "react-hook-form";

interface FormData {
	message: string;
	isBase64: boolean;
}

export function SignMessageForm() {
	const { publicKey, signMessage } = useWallet();
	const [signature, setSignature] = useState<string | null>(null);
	const [error, setError] = useState<string | null>(null);
	const [isLoading, setIsLoading] = useState(false);

	const {
		register,
		handleSubmit,
		watch,
		formState: { errors },
	} = useForm<FormData>({
		defaultValues: {
			message: "",
			isBase64: false,
		},
	});

	const isBase64 = watch("isBase64");

	const onSubmit = async (data: FormData) => {
		if (!publicKey || !signMessage) {
			setError("Wallet not connected or doesn't support message signing");
			return;
		}

		setIsLoading(true);
		setError(null);
		setSignature(null);

		try {
			let messageBytes: Uint8Array;

			if (data.isBase64) {
				const binaryString = atob(data.message);
				messageBytes = Uint8Array.from(binaryString, (char) => char.charCodeAt(0));
			} else {
				messageBytes = new TextEncoder().encode(data.message);
			}

			const signatureBytes = await signMessage(messageBytes);
			const signatureBase58 = bs58.encode(signatureBytes);
			setSignature(signatureBase58);
		} catch (err) {
			setError(err instanceof Error ? err.message : "Failed to sign message");
		} finally {
			setIsLoading(false);
		}
	};

	const copyToClipboard = async () => {
		if (signature) {
			await navigator.clipboard.writeText(signature);
		}
	};

	return (
		<form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
			<div className="form-control">
				<label className="label" htmlFor="message">
					<span className="label-text">Message</span>
				</label>
				<textarea
					id="message"
					className="textarea textarea-bordered h-32 font-mono"
					placeholder={isBase64 ? "Enter base64 encoded data..." : "Enter your message..."}
					{...register("message", { required: "Message is required" })}
				/>
				{errors.message && <span className="text-error text-sm mt-1">{errors.message.message}</span>}
			</div>

			<div className="form-control">
				<label className="label cursor-pointer justify-start gap-4">
					<input type="checkbox" className="toggle toggle-primary" {...register("isBase64")} />
					<span className="label-text">Base64 encoded input (for binary data)</span>
				</label>
			</div>

			{error && (
				<div className="alert alert-error">
					<span>{error}</span>
				</div>
			)}

			{signature && (
				<div className="space-y-2">
					<label className="label" htmlFor="signature-output">
						<span className="label-text">Signature (base58)</span>
					</label>
					<div className="flex gap-2">
						<input
							id="signature-output"
							type="text"
							className="input input-bordered flex-1 font-mono text-sm"
							value={signature}
							readOnly
						/>
						<button type="button" className="btn btn-outline" onClick={copyToClipboard}>
							Copy
						</button>
					</div>
				</div>
			)}

			<button type="submit" className="btn btn-primary w-full" disabled={!publicKey || isLoading}>
				{isLoading ? <span className="loading loading-spinner" /> : "Sign Message"}
			</button>

			{!publicKey && <p className="text-center text-base-content/50 text-sm">Connect your wallet to sign messages</p>}
		</form>
	);
}
