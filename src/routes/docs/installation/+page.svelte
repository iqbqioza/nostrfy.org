<script lang="ts">
	import DocsTitle from '$lib/components/docs/DocsTitle.svelte';
	import CodeBlock from '$lib/components/CodeBlock.svelte';
	import Callout from '$lib/components/Callout.svelte';

	const lowSpecConfig = `[database]
search_index = false   # halves the database size and saves CPU/IO`;
	const buildSource = `git clone https://github.com/iqbqioza/nostrfy.git
cd nostrfy
cargo build --release`;
	const installScript = `curl -fsSL https://raw.githubusercontent.com/iqbqioza/nostrfy/main/install.sh | sh`;
	const freebsdBuild = `pkg install -y rust
cargo build --release`;
	const port80Run = `nostrfy --config nostrfy.toml start`;
</script>

<DocsTitle
	title="Installation"
	description="Requirements, building from source, installing a pre-built binary, and notes for FreeBSD."
/>

<div class="doc-body">
	<h2>Requirements</h2>
	<ul>
		<li>A recent stable Rust toolchain (only needed to build the relay).</li>
		<li>A Linux machine.</li>
		<li>2 GB of RAM or more is recommended — see the low-spec note below for a 0.25 vCPU / 512 MB VPS.</li>
	</ul>

	<h3>Low-spec VPS (0.25 vCPU / 512 MB)</h3>
	<p>
		nostrfy is verified to run stably even when the database exceeds RAM. The LMDB map is a
		<strong>sparse 1 TiB virtual reservation</strong> — physical disk grows only with the data written —
		and process memory stays flat: a relay with a 252 MB database held <strong>7.9 MB of private RSS</strong>
		(the rest is reclaimable file cache the kernel evicts under pressure).
	</p>
	<p>For a tiny VPS, one setting makes the biggest difference:</p>
	<CodeBlock code={lowSpecConfig} lang="toml" />
		<div class="overflow-x-auto">
		<table>
		<thead>
			<tr>
				<th>Setting</th>
				<th>Effect</th>
				<th>Measured</th>
			</tr>
		</thead>
		<tbody>
			<tr>
				<td><code>search_index = false</code></td>
				<td>
					Disables the NIP-50 word index — search still works (whole-word matching) but is slower
				</td>
				<td>41.8 MB → 20.5 MB per 10,000 events</td>
			</tr>
			<tr>
				<td>Defaults</td>
				<td>Already tuned for low memory</td>
				<td>No change needed for 512 MB</td>
			</tr>
		</tbody>
	</table>
	</div>

	<h2>Building from source</h2>
	<CodeBlock code={buildSource} lang="bash" />
	<p>When the build finishes, the binary is at <code>target/release/nostrfy</code>.</p>

	<h2>Installing a pre-built binary</h2>
	<p>
		The release workflow attaches pre-built binaries for <strong>Linux x86_64</strong>,
		<strong>Linux aarch64</strong> and <strong>FreeBSD x86_64</strong>. The same
		<code>install.sh</code> works on both OSes — it detects the platform, downloads the matching
		binary and verifies its checksum:
	</p>
	<CodeBlock code={installScript} lang="bash" />

	<h3>FreeBSD</h3>
	<p>nostrfy builds and runs on FreeBSD 13.x and 14.x (amd64). Install Rust and build with:</p>
	<CodeBlock code={freebsdBuild} lang="sh" />
	<p>Platform notes:</p>
	<ul>
		<li>
			The process-alive check used by <code>start</code>/<code>stop</code>/<code>restart</code> reads the
			process name via the <code>kern.proc.pid.&lt;pid&gt;.comm</code> sysctl on FreeBSD (it uses
			<code>/proc/&lt;pid&gt;/comm</code> on Linux), so a stale pid file whose pid was reused by another
			program is detected on both platforms.
		</li>
		<li>
			<code>nostrfy start</code> daemonizes like on Linux; the standard double-fork daemon works with the default
			<code>rc</code> integration (<code>service nostrfy start</code>).
		</li>
		<li>
			Blossom's <code>min_free_bytes</code> check uses <code>statvfs</code>, which both systems provide; no
			other platform-specific code is used (the relay itself is plain async Rust on top of tokio).
		</li>
	</ul>

	<h3>Running on port 80</h3>
	<p>
		Regular users cannot bind port 80. Either run with <code>sudo</code>, or use a higher port such as 8080.
	</p>
	<CodeBlock
		code={port80Run}
		lang="bash"
		caption="Example: run on port 8080 (works for regular users; change port in the config first)."
	/>

	<Callout type="tip" title="Next">
		Now that nostrfy is installed, follow the <a href="/docs/quick-start/">quick start</a> guide.
	</Callout>
</div>