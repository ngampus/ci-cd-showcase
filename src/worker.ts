export interface Env {
	VERSION?: string;
}

export default {
	async fetch(request: Request, env: Env): Promise<Response> {
		const url = new URL(request.url);
		const version = env.VERSION ?? "dev";

		if (url.pathname === "/healthz") {
			return new Response(
				JSON.stringify({
					status: "ok",
					version: version,
					timestamp: new Date().toISOString(),
				}),
				{
					headers: { "content-type": "application/json" },
				},
			);
		}

		return new Response(`CI/CD Showcase v${version}\n`, {
			headers: { "content-type": "text/plain" },
		});
	},
};
