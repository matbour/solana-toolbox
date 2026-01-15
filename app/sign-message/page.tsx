import Link from "next/link";
import { SignMessageForm } from "@/components/SignMessageForm";

export default function SignMessagePage() {
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
					<h1 className="card-title text-2xl mb-2">Sign Message</h1>
					<p className="text-base-content/70 mb-6">
						Sign a free-form message with your connected wallet. Toggle the switch to sign base64 encoded binary data.
					</p>
					<SignMessageForm />
				</div>
			</div>
		</div>
	);
}
