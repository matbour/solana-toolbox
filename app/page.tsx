import Link from "next/link";

const tools = [
	{
		title: "Sign Message",
		description:
			"Sign a free-form text message with your wallet. Supports both plain text and base64 encoded binary data.",
		href: "/sign-message",
	},
	{
		title: "Sign Transaction",
		description:
			"Sign an arbitrary serialized transaction (base58 or base64). Optionally broadcast the signed transaction to the network.",
		href: "/sign-transaction",
	},
];

export default function Home() {
	return (
		<div className="py-8">
			<div className="text-center mb-12">
				<h1 className="text-4xl font-bold mb-4">Solana Toolbox</h1>
				<p className="text-lg text-base-content/70 max-w-2xl mx-auto">
					A collection of tools for working with Solana transactions. Connect your wallet to get started.
				</p>
			</div>

			<div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
				{tools.map((tool) => (
					<Link key={tool.href} href={tool.href} className="card bg-base-200 hover:bg-base-300 transition-colors">
						<div className="card-body">
							<h2 className="card-title text-primary">{tool.title}</h2>
							<p className="text-base-content/70">{tool.description}</p>
							<div className="card-actions justify-end mt-4">
								<span className="btn btn-primary btn-sm">Open Tool</span>
							</div>
						</div>
					</Link>
				))}
			</div>
		</div>
	);
}
