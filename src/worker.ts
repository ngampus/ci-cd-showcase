export interface Env {
	VERSION?: string;
}

const HTML = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>CI/CD Showcase — DevOps Portfolio</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      background: #0d1117; color: #c9d1d9; line-height: 1.6;
      min-height: 100vh; padding: 2rem 1rem;
    }
    .container { max-width: 960px; margin: 0 auto; }
    header { text-align: center; margin-bottom: 3rem; }
    h1 { font-size: 2.5rem; color: #58a6ff; margin-bottom: 0.5rem; }
    .subtitle { color: #8b949e; font-size: 1.1rem; }
    .badge-row { display: flex; gap: 0.5rem; justify-content: center; flex-wrap: wrap; margin-top: 1rem; }
    .badge { background: #21262d; padding: 0.25rem 0.75rem; border-radius: 999px; font-size: 0.8rem; border: 1px solid #30363d; }
    section { margin-bottom: 2.5rem; }
    h2 { color: #58a6ff; font-size: 1.5rem; margin-bottom: 1rem; border-bottom: 1px solid #30363d; padding-bottom: 0.5rem; }
    .cards { display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 1rem; }
    .card {
      background: #161b22; border: 1px solid #30363d; border-radius: 8px; padding: 1.5rem;
      transition: border-color 0.2s;
    }
    .card:hover { border-color: #58a6ff; }
    .card h3 { color: #f0f6fc; margin-bottom: 0.75rem; display: flex; align-items: center; gap: 0.5rem; }
    .card ul { list-style: none; }
    .card li { padding: 0.25rem 0; font-size: 0.9rem; color: #8b949e; }
    .card li code { background: #21262d; padding: 0.1rem 0.4rem; border-radius: 4px; color: #79c0ff; font-size: 0.85rem; }
    .links { display: flex; gap: 1rem; flex-wrap: wrap; }
    .link-btn {
      display: inline-block; background: #238636; color: white; padding: 0.6rem 1.2rem;
      border-radius: 6px; text-decoration: none; font-weight: 600; transition: background 0.2s;
    }
    .link-btn:hover { background: #2ea043; }
    .link-btn.secondary { background: #21262d; border: 1px solid #30363d; }
    .link-btn.secondary:hover { background: #30363d; }
    .stage-table { width: 100%; border-collapse: collapse; margin-top: 1rem; }
    .stage-table th, .stage-table td { text-align: left; padding: 0.6rem; border-bottom: 1px solid #30363d; font-size: 0.9rem; }
    .stage-table th { color: #58a6ff; }
    .stage-table code { background: #21262d; padding: 0.1rem 0.4rem; border-radius: 4px; color: #79c0ff; }
    footer { text-align: center; color: #8b949e; font-size: 0.85rem; margin-top: 3rem; }
    .live-dot { display: inline-block; width: 8px; height: 8px; background: #3fb950; border-radius: 50%; margin-right: 0.4rem; }
  </style>
</head>
<body>
  <div class="container">
    <header>
      <h1>CI/CD Showcase</h1>
      <p class="subtitle">Multi-platform CI/CD pipeline comparison — DevOps Portfolio</p>
      <div class="badge-row">
        <span class="badge">GitHub Actions</span>
        <span class="badge">GitLab CI</span>
        <span class="badge">Jenkins</span>
        <span class="badge">Cloudflare Workers</span>
        <span class="badge"><span class="live-dot"></span>Live on Edge</span>
      </div>
    </header>

    <section>
      <h2>Overview</h2>
      <p>This project demonstrates equivalent CI/CD pipelines across three major platforms, deployed to the edge via Cloudflare Workers. Each platform runs the same stages: lint, test, security scan, build, and deploy — proving portability of DevOps workflows.</p>
    </section>

    <section>
      <h2>Pipeline Stages Comparison</h2>
      <table class="stage-table">
        <thead>
          <tr><th>Stage</th><th>GitHub Actions</th><th>GitLab CI</th><th>Jenkins</th></tr>
        </thead>
        <tbody>
          <tr><td>Lint</td><td><code>golangci-lint</code>, <code>hadolint</code>, <code>yamllint</code></td><td><code>golangci-lint</code></td><td>Parallel: Go, Docker, YAML</td></tr>
          <tr><td>Test</td><td><code>go test -race -cover</code></td><td><code>go test</code> + coverage</td><td><code>go test</code> + coverage</td></tr>
          <tr><td>Security</td><td>Trivy + SARIF</td><td>Trivy SARIF</td><td>Trivy + Nancy</td></tr>
          <tr><td>Build</td><td>Docker multi-stage</td><td>Docker build/push</td><td>Docker withRegistry</td></tr>
          <tr><td>Deploy</td><td>Manual approval</td><td>Manual approval</td><td>Input approval</td></tr>
        </tbody>
      </table>
    </section>

    <section>
      <h2>Platform Pipelines</h2>
      <div class="cards">
        <div class="card">
          <h3>⚡ GitHub Actions</h3>
          <ul>
            <li><code>.github/workflows/ci.yml</code></li>
            <li>Lint → Test → Security → Build</li>
            <li>Deploy Worker on push to main</li>
            <li>SARIF upload to code scanning</li>
          </ul>
        </div>
        <div class="card">
          <h3>🔧 GitLab CI</h3>
          <ul>
            <li><code>.gitlab-ci.yml</code></li>
            <li>Parallel lint/test jobs</li>
            <li>Trivy SAST reports</li>
            <li>Manual staging → prod gates</li>
          </ul>
        </div>
        <div class="card">
          <h3>🏗️ Jenkins</h3>
          <ul>
            <li><code>Jenkinsfile</code></li>
            <li>Declarative pipeline</li>
            <li>Shared libraries pattern</li>
            <li>Submitter-restricted prod</li>
          </ul>
        </div>
      </div>
    </section>

    <section>
      <h2>Edge Deployment</h2>
      <div class="cards">
        <div class="card">
          <h3>☁️ Cloudflare Workers</h3>
          <ul>
            <li>Deployed via <code>wrangler</code></li>
            <li>TypeScript Worker at edge</li>
            <li>Auto-deploy from all 3 CI platforms</li>
            <li>Global low-latency serving</li>
          </ul>
        </div>
      </div>
    </section>

    <section>
      <h2>Links</h2>
      <div class="links">
        <a class="link-btn" href="https://github.com/ngampus/ci-cd-showcase" target="_blank" rel="noopener">View on GitHub</a>
        <a class="link-btn secondary" href="/healthz">Health Check</a>
        <a class="link-btn secondary" href="https://github.com/ngampus" target="_blank" rel="noopener">Profile</a>
      </div>
    </section>

    <footer>
      <p>Built by Rangga Chandra Nugraha — DevOps Engineer</p>
      <p>Served from Cloudflare Workers Edge · showcase.letssee.my.id</p>
    </footer>
  </div>
</body>
</html>`;

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

		return new Response(HTML, {
			headers: { "content-type": "text/html; charset=utf-8" },
		});
	},
};
