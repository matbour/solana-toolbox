import Link from "next/link";
import { SignTransactionForm } from "@/components/SignTransactionForm";

export default function SignTransactionPage() {
	return (
		<div className="max-w-2xl mx-auto py-8">
			<div className="mb-6">
				<Link href="/" className="btn btn-ghost btn-sm gap-2">
					<svg
						xmlns="http://www.w3.org/2000/svg"
						className="h-4 w-4"
						fill="none"
						viewBox="0 0 24 24"
						stroke="currentColor"
						aria-hidden="true"
					>
						<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
					</svg>
					Back
				</Link>
			</div>

			<div className="card bg-base-200">
				<div className="card-body">
					<h1 className="card-title text-2xl mb-2">Sign Transaction</h1>
					<p className="text-base-content/70 mb-6">
						Sign a serialized transaction with your connected wallet. Choose between base58 or base64 encoding.
						Optionally broadcast the signed transaction to the network.
					</p>
					<SignTransactionForm />
				</div>
			</div>
		</div>
	);
}
