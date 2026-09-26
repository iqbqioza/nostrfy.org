<script lang="ts">
	import DocsTitle from '$lib/components/docs/DocsTitle.svelte';
	import CodeBlock from '$lib/components/CodeBlock.svelte';
	import Callout from '$lib/components/Callout.svelte';
	import { localePath } from '$lib/i18n/locale';

	const p = (path: string) => localePath('ru', path);

	const vpsCmd = `ssh -i your-key.pem ec2-user@<public-ip>        # для Ubuntu: ubuntu@<public-ip>
curl -fsSL https://raw.githubusercontent.com/iqbqioza/nostrfy/main/install.sh | sh
sudo mkdir -p /etc/nostrfy
sudo curl -fsSL -o /etc/nostrfy/nostrfy.toml \\
  https://raw.githubusercontent.com/iqbqioza/nostrfy/main/deploy/nostrfy.toml
sudo nano /etc/nostrfy/nostrfy.toml                 # задайте name, public_url, private_key
sudo curl -fsSL -o /etc/systemd/system/nostrfy.service \\
  https://raw.githubusercontent.com/iqbqioza/nostrfy/main/deploy/nostrfy.service
sudo systemctl daemon-reload
sudo systemctl enable --now nostrfy`;
	const verifyCmd = `curl http://<public-ip>:8080/health`;
	const ecrCmd = `docker buildx build --platform linux/amd64,linux/arm64 -t <account>.dkr.ecr.<region>.amazonaws.com/nostrfy .`;
</script>

<DocsTitle
	title="Развёртывание на AWS"
	description="Развёртывание nostrfy на AWS EC2, Lightsail или ECS/Fargate — шаг за шагом: systemd, TLS за обратным прокси и контрольный список для запуска в производство."
/>

<div class="doc-body">
	<p>
		Варианты: <strong>EC2</strong> (ВМ, рекомендуется), <strong>Lightsail</strong> (более простая ВМ) или
		<strong>ECS/Fargate</strong> (контейнеры).
	</p>

	<h2>Вариант 1: EC2 (рекомендуется)</h2>
	<ol>
		<li>
			<strong>Запустите инстанс</strong>: Amazon Linux 2023 или Ubuntu 24.04 LTS,
			<code>t3.small</code> (2 ГБ ОЗУ) достаточно для начала. Выберите регион ближе к вашим пользователям.
		</li>
		<li>
			<strong>Группа безопасности</strong>: разрешите входящий TCP <code>8080</code> (и <code>443</code> для
			TLS). Ограничьте правило SSH вашим IP.
		</li>
		<li>
			<strong>Подключитесь по SSH</strong> и следуйте общему <a href={p('/docs/deploy/vps/')}
				>руководству по VPS</a
			>:
		</li>
	</ol>
	<CodeBlock code={vpsCmd} lang="sh" />
	<ol start="4">
		<li>
			<strong>Проверьте</strong>:
		</li>
	</ol>
	<CodeBlock code={verifyCmd} lang="sh" />
	<ol start="5">
		<li>
			<strong>Добавьте TLS (<code>wss://</code>)</strong> с certbot + nginx (как в
			<a href={p('/docs/deploy/vps/')}>руководстве по VPS</a>) или с Application/Network Load Balancer
			и сертификатом ACM — затем задайте <code>relay.public_url</code> и перезапустите.
		</li>
	</ol>

	<h2>Вариант 2: Lightsail</h2>
	<p>
		Инстансы Lightsail работают точно так же, как в руководстве по EC2 — на вкладке <strong>сети</strong> находятся
		правила брандмауэра: откройте TCP <code>8080</code>.
	</p>

	<h2>Вариант 3: ECS / Fargate (контейнер)</h2>
	<p>
		<code>Dockerfile</code> в репозитории скачивает готовый релизный бинарник во время сборки:
	</p>
	<ol>
		<li>
			Отправьте образ в ECR:
			<CodeBlock code={ecrCmd} lang="sh" />
		</li>
		<li>
			Создайте сервис ECS (Fargate, 1 задача) со <strong>смонтированным томом EFS в
			<code>/data</code></strong> (постоянство LMDB — без него данные теряются при повторных развёртываниях).
		</li>
		<li>
			Откройте порт <code>8080</code>; спереди поставьте ALB + сертификат ACM для TLS.
		</li>
		<li>
			Встроенную конфигурацию <code>deploy/nostrfy.container.toml</code> можно переопределить, смонтировав собственный
			<code>nostrfy.toml</code> в <code>/etc/nostrfy/nostrfy.toml</code> (например, форк, копирующий его в образ).
		</li>
	</ol>

	<h2>Elastic IP</h2>
	<p>
		Привяжите <strong>Elastic IP</strong> к инстансу, если вы его останавливаете/запускаете — иначе публичный
		IP изменится и <code>public_url</code> сломается.
	</p>

	<Callout type="note" title="TLS завершается на вашем прокси или у провайдера">
		Сам релей обслуживает обычный WebSocket на 8080 и учитывает X-Forwarded-Proto.
	</Callout>
</div>
