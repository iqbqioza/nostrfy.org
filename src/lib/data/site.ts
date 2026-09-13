const latestRelease = 'v0.1.10';

export const site = {
	name: 'nostrfy',
	domain: 'nostrfy.org',
	tagline: 'All-in-one Nostr relay server engine',
	description:
		'nostrfy is an all-in-one Nostr relay server engine written in Rust. Blazing fast by design, lean by nature, powerful by default.',
	arch: 'Blazing fast by design. Lean by nature. Powerful by default.',
	github: 'https://github.com/iqbqioza/nostrfy',
	githubRaw: 'https://raw.githubusercontent.com/iqbqioza/nostrfy/main',
	latestRelease,
	license: 'MIT',
	installScriptUrl: 'https://raw.githubusercontent.com/iqbqioza/nostrfy/main/install.sh',
	installCommand: 'curl -fsSL https://raw.githubusercontent.com/iqbqioza/nostrfy/main/install.sh | sh',
	relays: [{ name: 'relay.nostrfy.org', url: 'wss://relay.nostrfy.org' }],
	donate: {
		bitcoin: '13LUTf5tBXAv2TyEiKHpg9kVWtgiYz3ZYs',
		bitcoinSegwit: 'bc1qttlc8m9gsh24xxqys26gaz2mtgfzw7s7770am6'
	},
	developer: {
		handle: 'iqbqioza',
		name: 'iqbqioza',
		avatarUrl: 'https://iqbqioza.com/.well-known/assets/images/picture.png',
		url: 'https://github.com/iqbqioza'
	}
};

export const installVariants = [
	{
		title: 'Specific version',
		command: `VERSION=${latestRelease} curl -fsSL https://raw.githubusercontent.com/iqbqioza/nostrfy/main/install.sh | sh`
	},
	{
		title: 'System-wide',
		command:
			'INSTALL_DIR=/usr/local/bin sudo curl -fsSL https://raw.githubusercontent.com/iqbqioza/nostrfy/main/install.sh | sh'
	},
	{
		title: 'Overwrite existing',
		command: 'curl -fsSL https://raw.githubusercontent.com/iqbqioza/nostrfy/main/install.sh | sh -s -- --force'
	},
	{
		title: 'Build from source',
		command: 'git clone https://github.com/iqbqioza/nostrfy.git && cd nostrfy && cargo build --release'
	}
];