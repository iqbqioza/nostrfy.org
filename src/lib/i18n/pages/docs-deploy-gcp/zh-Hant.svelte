<script lang="ts">
	import DocsTitle from '$lib/components/docs/DocsTitle.svelte';
	import CodeBlock from '$lib/components/CodeBlock.svelte';
	import Callout from '$lib/components/Callout.svelte';
	import { localePath } from '$lib/i18n/locale';

	const p = (path: string) => localePath('zh-Hant', path);

	const vpsCmd = `curl -fsSL https://raw.githubusercontent.com/iqbqioza/nostrfy/main/install.sh | sh
sudo mkdir -p /etc/nostrfy
sudo curl -fsSL -o /etc/nostrfy/nostrfy.toml \\
  https://raw.githubusercontent.com/iqbqioza/nostrfy/main/deploy/nostrfy.toml
sudo nano /etc/nostrfy/nostrfy.toml                 # 設定 name、public_url、private_key
sudo curl -fsSL -o /etc/systemd/system/nostrfy.service \\
  https://raw.githubusercontent.com/iqbqioza/nostrfy/main/deploy/nostrfy.service
sudo systemctl daemon-reload
sudo systemctl enable --now nostrfy`;
	const verifyCmd = `curl http://<external-ip>:8080/health`;
</script>

<DocsTitle
	title="部署到 Google Cloud"
	description="在 Google Cloud Compute Engine 或 Cloud Run 上部署 nostrfy — 逐步說明，含 systemd、TLS 與縮容至零的注意事項。"
/>

<div class="doc-body">
	<p>
		選項：<strong>Compute Engine</strong>（VM，推薦）或 <strong>Cloud Run</strong>
		（容器）。
	</p>

	<h2>選項 1：Compute Engine（推薦）</h2>
	<ol>
		<li>
			<strong>建立 VM</strong>：Ubuntu 24.04 LTS（或 Debian），<code>e2-small</code>（2 GB）
			起步足夠。選擇離使用者近的區域。
		</li>
		<li>
			<strong>防火牆規則</strong>：允許入站 TCP <code>8080</code>（以及 <code>443</code> 用於
			TLS）。在 <strong>Network → Firewall</strong> 下，用你指派給 VM 的目標標籤建立規則。
		</li>
		<li>
			<strong>SSH 登入</strong>（主控台的 SSH 按鈕即可）並依照通用
			<a href={p('/docs/deploy/vps/')}>VPS 指南</a>操作：
		</li>
	</ol>
	<CodeBlock code={vpsCmd} lang="sh" />
	<ol start="4">
		<li>
			<strong>保留靜態 IP</strong>（External IP → Reserve），使 <code>public_url</code> 在
			重新啟動後仍然有效。
		</li>
		<li>
			<strong>驗證</strong>：
		</li>
	</ol>
	<CodeBlock code={verifyCmd} lang="sh" />
	<ol start="6">
		<li>
			<strong>加入 TLS（<code>wss://</code>）</strong>用 certbot + nginx（如
			<a href={p('/docs/deploy/vps/')}>VPS 指南</a>）或帶託管憑證的 GCP 負載平衡器。
		</li>
	</ol>

	<h2>選項 2：Cloud Run（容器）</h2>
	<p>
		Cloud Run 從倉庫的 <code>Dockerfile</code> 建置（它會下載預編譯的發行
		二進位檔）：
	</p>
	<ol>
		<li>
			<strong>從 GitHub 倉庫建立服務</strong>（或將映像推送到 Artifact
			Registry）。
		</li>
		<li>
			<strong>連接埠</strong>：將容器連接埠設為 <code>8080</code>。
		</li>
		<li>
			<strong>配置記憶體</strong>：至少 512 MB（LMDB + 非同步執行環境）。
		</li>
		<li>
			<strong>持久儲存</strong>：在 <code>/data</code> 附加 <strong>Cloud Run 磁碟區（filestore/gcsfuse）</strong>
			— LMDB 需要檔案系統，因此在 <code>/data</code> 掛載 GCS FUSE 可實現持久化。
		</li>
		<li>
			<strong>TLS</strong>：Cloud Run 自動提供 <code>https://</code> — 設定
			<code>relay.public_url = "wss://&lt;service&gt;.a.run.app"</code>（或你的自訂網域）。
		</li>
	</ol>

	<Callout type="note" title="Cloud Run 預設縮容至零">
		對於中繼，設定 <strong>min instances = 1</strong> 使其永不變冷。烘焙到映像中的
		<code>deploy/nostrfy.container.toml</code> 可以透過在 <code>/etc/nostrfy/nostrfy.toml</code>
		掛載你自己的 <code>nostrfy.toml</code> 來替換。
	</Callout>
</div>
