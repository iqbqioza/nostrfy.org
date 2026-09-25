import type { Locale } from './locale';

export interface UiStrings {
	logoAria: string;
	header: {
		docs: string;
		about: string;
		donate: string;
		github: string;
		mainNav: string;
		mobileNav: string;
		toggleMenu: string;
		language: string;
	};
	footer: {
		tagline: string;
		documentation: string;
		project: string;
		source: string;
		copyrightPrefix: (year: number) => string;
		licenseLabel: string;
		labels: Record<string, string>;
	};
	docs: {
		documentation: string;
		previous: string;
		next: string;
		pagination: string;
		home: string;
		breadcrumb: string;
		breadcrumbAria: string;
	};
	navGroups: Record<string, string>;
	navItems: Record<string, string>;
	error: {
		notFound: string;
		generic: string;
		notFoundBody: string;
		genericBody: string;
		home: string;
	};
	meta: {
		homeTitle: string;
		defaultDescription: string;
		ogImageAlt: string;
	};
}

export const ui: Record<Locale, UiStrings> = {
	en: {
		logoAria: 'nostrfy home',
		header: {
			docs: 'Docs',
			about: 'About',
			donate: 'Donate',
			github: 'GitHub',
			mainNav: 'Main',
			mobileNav: 'Mobile',
			toggleMenu: 'Toggle menu',
			language: 'Language'
		},
		footer: {
			tagline:
				'An all-in-one Nostr relay server engine written in Rust. Open source, dual-licensed under MIT or Apache-2.0.',
			documentation: 'Documentation',
			project: 'Project',
			source: 'Source on GitHub',
			copyrightPrefix: (year) => `© ${year} iqbqioza · Released under the `,
			licenseLabel: 'MIT or Apache-2.0 license',
			labels: {
				'/docs/introduction/': 'Introduction',
				'/docs/installation/': 'Installation',
				'/docs/configuration/': 'Configuration',
				'/docs/deploy/': 'Deployment',
				'/docs/troubleshooting/': 'Troubleshooting',
				'/about/': 'About',
				'/faq/': 'FAQ',
				'/compare/strfry/': 'nostrfy vs strfry',
				'/donate/': 'Donate',
				github: 'GitHub',
				releases: 'Releases',
				security: 'Security policy'
			}
		},
		docs: {
			documentation: 'Documentation',
			previous: 'Previous',
			next: 'Next',
			pagination: 'Pagination',
			home: 'Home',
			breadcrumb: 'Docs',
			breadcrumbAria: 'Breadcrumb'
		},
		navGroups: {
			'Getting started': 'Getting started',
			Operations: 'Operations',
			Features: 'Features',
			Deployment: 'Deployment',
			Help: 'Help'
		},
		navItems: {
			'/docs/introduction/': 'Introduction',
			'/docs/installation/': 'Installation',
			'/docs/quick-start/': 'Quick start',
			'/docs/configuration/': 'Configuration',
			'/docs/commands/': 'Commands',
			'/docs/operation/': 'Running the relay',
			'/docs/migrating-from-strfry/': 'Migrating from strfry',
			'/docs/nips/': 'Supported NIPs',
			'/docs/rest-api/': 'REST API',
			'/docs/groups/': 'NIP-29 Groups',
			'/docs/livekit/': 'LiveKit rooms',
			'/docs/blossom/': 'Blossom file server',
			'/docs/management/': 'NIP-86 management',
			'/docs/deploy/': 'Overview',
			'/docs/deploy/fly/': 'Fly.io',
			'/docs/deploy/vps/': 'Any VPS',
			'/docs/deploy/digitalocean/': 'Digital Ocean',
			'/docs/deploy/aws/': 'AWS',
			'/docs/deploy/gcp/': 'Google Cloud',
			'/docs/deploy/azure/': 'Azure',
			'/docs/troubleshooting/': 'Troubleshooting'
		},
		error: {
			notFound: 'Page not found',
			generic: 'Something went wrong',
			notFoundBody: "The page you're looking for doesn't exist or has moved.",
			genericBody: 'An unexpected error occurred. Please try again.',
			home: 'Back to home'
		},
		meta: {
			homeTitle: 'nostrfy — All-in-one Nostr relay server engine',
			defaultDescription:
				'nostrfy is an all-in-one Nostr relay server engine written in Rust. Blazing fast by design. Lean by nature. Powerful by default.',
			ogImageAlt: 'nostrfy — All-in-one Nostr relay server engine'
		}
	},
	'zh-Hans': {
		logoAria: 'nostrfy 首页',
		header: {
			docs: '文档',
			about: '关于',
			donate: '捐赠',
			github: 'GitHub',
			mainNav: '主导航',
			mobileNav: '移动导航',
			toggleMenu: '切换菜单',
			language: '语言'
		},
		footer: {
			tagline: '用 Rust 编写的一体化 Nostr 中继服务器引擎。开源，采用 MIT 或 Apache-2.0 双许可。',
			documentation: '文档',
			project: '项目',
			source: '在 GitHub 上查看源码',
			copyrightPrefix: (year) => `© ${year} iqbqioza · 基于 `,
			licenseLabel: 'MIT 或 Apache-2.0 许可发布',
			labels: {
				'/docs/introduction/': '简介',
				'/docs/installation/': '安装',
				'/docs/configuration/': '配置',
				'/docs/deploy/': '部署',
				'/docs/troubleshooting/': '故障排除',
				'/about/': '关于',
				'/faq/': '常见问题',
				'/compare/strfry/': 'nostrfy 与 strfry 对比',
				'/donate/': '捐赠',
				github: 'GitHub',
				releases: '版本发布',
				security: '安全策略'
			}
		},
		docs: {
			documentation: '文档',
			previous: '上一页',
			next: '下一页',
			pagination: '分页',
			home: '首页',
			breadcrumb: '文档',
			breadcrumbAria: '面包屑导航'
		},
		navGroups: {
			'Getting started': '快速入门',
			Operations: '运维',
			Features: '功能',
			Deployment: '部署',
			Help: '帮助'
		},
		navItems: {
			'/docs/introduction/': '简介',
			'/docs/installation/': '安装',
			'/docs/quick-start/': '快速开始',
			'/docs/configuration/': '配置参考',
			'/docs/commands/': '命令参考',
			'/docs/operation/': '运行中继',
			'/docs/migrating-from-strfry/': '从 strfry 迁移',
			'/docs/nips/': '支持的 NIP',
			'/docs/rest-api/': 'REST API',
			'/docs/groups/': 'NIP-29 群组',
			'/docs/livekit/': 'LiveKit 房间',
			'/docs/blossom/': 'Blossom 文件服务器',
			'/docs/management/': 'NIP-86 管理',
			'/docs/deploy/': '概览',
			'/docs/deploy/fly/': 'Fly.io',
			'/docs/deploy/vps/': '任意 VPS',
			'/docs/deploy/digitalocean/': 'Digital Ocean',
			'/docs/deploy/aws/': 'AWS',
			'/docs/deploy/gcp/': 'Google Cloud',
			'/docs/deploy/azure/': 'Azure',
			'/docs/troubleshooting/': '故障排除'
		},
		error: {
			notFound: '页面未找到',
			generic: '出错了',
			notFoundBody: '你访问的页面不存在或已被移动。',
			genericBody: '发生了意外错误，请重试。',
			home: '返回首页'
		},
		meta: {
			homeTitle: 'nostrfy — 一体化 Nostr 中继服务器引擎',
			defaultDescription:
				'nostrfy 是用 Rust 编写的一体化 Nostr 中继服务器引擎。设计上追求极速，天生轻量，默认强大。',
			ogImageAlt: 'nostrfy — 一体化 Nostr 中继服务器引擎'
		}
	},
	'zh-Hant': {
		logoAria: 'nostrfy 首頁',
		header: {
			docs: '文件',
			about: '關於',
			donate: '捐贈',
			github: 'GitHub',
			mainNav: '主導覽',
			mobileNav: '行動版導覽',
			toggleMenu: '切換選單',
			language: '語言'
		},
		footer: {
			tagline: '以 Rust 撰寫的一體化 Nostr 中繼伺服器引擎。開源，採用 MIT 或 Apache-2.0 雙授權。',
			documentation: '文件',
			project: '專案',
			source: '在 GitHub 檢視原始碼',
			copyrightPrefix: (year) => `© ${year} iqbqioza · 依 `,
			licenseLabel: 'MIT 或 Apache-2.0 授權發布',
			labels: {
				'/docs/introduction/': '簡介',
				'/docs/installation/': '安裝',
				'/docs/configuration/': '設定',
				'/docs/deploy/': '部署',
				'/docs/troubleshooting/': '疑難排解',
				'/about/': '關於',
				'/faq/': '常見問題',
				'/compare/strfry/': 'nostrfy 與 strfry 比較',
				'/donate/': '捐贈',
				github: 'GitHub',
				releases: '版本發布',
				security: '安全政策'
			}
		},
		docs: {
			documentation: '文件',
			previous: '上一頁',
			next: '下一頁',
			pagination: '分頁',
			home: '首頁',
			breadcrumb: '文件',
			breadcrumbAria: '麵包屑導覽'
		},
		navGroups: {
			'Getting started': '快速入門',
			Operations: '維運',
			Features: '功能',
			Deployment: '部署',
			Help: '說明'
		},
		navItems: {
			'/docs/introduction/': '簡介',
			'/docs/installation/': '安裝',
			'/docs/quick-start/': '快速開始',
			'/docs/configuration/': '設定參考',
			'/docs/commands/': '指令參考',
			'/docs/operation/': '執行中繼',
			'/docs/migrating-from-strfry/': '從 strfry 遷移',
			'/docs/nips/': '支援的 NIP',
			'/docs/rest-api/': 'REST API',
			'/docs/groups/': 'NIP-29 群組',
			'/docs/livekit/': 'LiveKit 房間',
			'/docs/blossom/': 'Blossom 檔案伺服器',
			'/docs/management/': 'NIP-86 管理',
			'/docs/deploy/': '總覽',
			'/docs/deploy/fly/': 'Fly.io',
			'/docs/deploy/vps/': '任意 VPS',
			'/docs/deploy/digitalocean/': 'Digital Ocean',
			'/docs/deploy/aws/': 'AWS',
			'/docs/deploy/gcp/': 'Google Cloud',
			'/docs/deploy/azure/': 'Azure',
			'/docs/troubleshooting/': '疑難排解'
		},
		error: {
			notFound: '找不到頁面',
			generic: '發生錯誤',
			notFoundBody: '你造訪的頁面不存在或已被移動。',
			genericBody: '發生未預期的錯誤，請再試一次。',
			home: '返回首頁'
		},
		meta: {
			homeTitle: 'nostrfy — 一體化 Nostr 中繼伺服器引擎',
			defaultDescription:
				'nostrfy 是以 Rust 撰寫的一體化 Nostr 中繼伺服器引擎。設計上追求極速，天生輕量，預設強大。',
			ogImageAlt: 'nostrfy — 一體化 Nostr 中繼伺服器引擎'
		}
	}
};

export function t(locale: Locale): UiStrings {
	return ui[locale];
}
