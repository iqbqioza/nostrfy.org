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
			'/docs/groups/': 'NIP-29 groups',
			'/docs/livekit/': 'LiveKit rooms',
			'/docs/blossom/': 'Blossom file server',
			'/docs/management/': 'NIP-86 management',
			'/docs/deploy/': 'Overview',
			'/docs/deploy/fly/': 'Fly.io',
			'/docs/deploy/vps/': 'Any VPS',
			'/docs/deploy/digitalocean/': 'DigitalOcean',
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
			'/docs/quick-start/': '快速入门',
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
			genericBody: '發生非預期的錯誤，請再試一次。',
			home: '返回首頁'
		},
		meta: {
			homeTitle: 'nostrfy — 一體化 Nostr 中繼伺服器引擎',
			defaultDescription:
				'nostrfy 是以 Rust 撰寫的一體化 Nostr 中繼伺服器引擎。設計上追求極速，天生輕量，預設強大。',
			ogImageAlt: 'nostrfy — 一體化 Nostr 中繼伺服器引擎'
		}
	},
	ja: {
		logoAria: 'nostrfy ホーム',
		header: {
			docs: 'ドキュメント',
			about: '概要',
			donate: '寄付',
			github: 'GitHub',
			mainNav: 'メインナビ',
			mobileNav: 'モバイルナビ',
			toggleMenu: 'メニューを切り替え',
			language: '言語'
		},
		footer: {
			tagline:
				'Rust で書かれたオールインワンの Nostr リレーサーバーエンジン。オープンソース、MIT または Apache-2.0 のデュアルライセンス。',
			documentation: 'ドキュメント',
			project: 'プロジェクト',
			source: 'GitHub でソースを見る',
			copyrightPrefix: (year) => `© ${year} iqbqioza · `,
			licenseLabel: 'MIT または Apache-2.0 ライセンス',
			labels: {
				'/docs/introduction/': 'はじめに',
				'/docs/installation/': 'インストール',
				'/docs/configuration/': '設定',
				'/docs/deploy/': 'デプロイ',
				'/docs/troubleshooting/': 'トラブルシューティング',
				'/about/': '概要',
				'/faq/': 'よくある質問',
				'/compare/strfry/': 'nostrfy と strfry の比較',
				'/donate/': '寄付',
				github: 'GitHub',
				releases: 'リリース',
				security: 'セキュリティポリシー'
			}
		},
		docs: {
			documentation: 'ドキュメント',
			previous: '前へ',
			next: '次へ',
			pagination: 'ページネーション',
			home: 'ホーム',
			breadcrumb: 'ドキュメント',
			breadcrumbAria: 'パンくずリスト'
		},
		navGroups: {
			'Getting started': 'はじめに',
			Operations: '運用',
			Features: '機能',
			Deployment: 'デプロイ',
			Help: 'ヘルプ'
		},
		navItems: {
			'/docs/introduction/': 'はじめに',
			'/docs/installation/': 'インストール',
			'/docs/quick-start/': 'クイックスタート',
			'/docs/configuration/': '設定リファレンス',
			'/docs/commands/': 'コマンドリファレンス',
			'/docs/operation/': 'リレーの運用',
			'/docs/migrating-from-strfry/': 'strfry からの移行',
			'/docs/nips/': '対応 NIP',
			'/docs/rest-api/': 'REST API',
			'/docs/groups/': 'NIP-29 グループ',
			'/docs/livekit/': 'LiveKit ルーム',
			'/docs/blossom/': 'Blossom ファイルサーバー',
			'/docs/management/': 'NIP-86 管理',
			'/docs/deploy/': '概要',
			'/docs/deploy/fly/': 'Fly.io',
			'/docs/deploy/vps/': '任意の VPS',
			'/docs/deploy/digitalocean/': 'DigitalOcean',
			'/docs/deploy/aws/': 'AWS',
			'/docs/deploy/gcp/': 'Google Cloud',
			'/docs/deploy/azure/': 'Azure',
			'/docs/troubleshooting/': 'トラブルシューティング'
		},
		error: {
			notFound: 'ページが見つかりません',
			generic: '問題が発生しました',
			notFoundBody: 'お探しのページは存在しないか、移動されました。',
			genericBody: '予期しないエラーが発生しました。もう一度お試しください。',
			home: 'ホームに戻る'
		},
		meta: {
			homeTitle: 'nostrfy — オールインワンの Nostr リレーサーバーエンジン',
			defaultDescription:
				'nostrfy は Rust で書かれたオールインワンの Nostr リレーサーバーエンジン。設計から高速、本質的に軽量、標準で強力。',
			ogImageAlt: 'nostrfy — オールインワンの Nostr リレーサーバーエンジン'
		}
	},
	ru: {
		logoAria: 'Главная nostrfy',
		header: {
			docs: 'Документация',
			about: 'О проекте',
			donate: 'Поддержать',
			github: 'GitHub',
			mainNav: 'Основная навигация',
			mobileNav: 'Мобильная навигация',
			toggleMenu: 'Переключить меню',
			language: 'Язык'
		},
		footer: {
			tagline:
				'Универсальный серверный движок Nostr-релея, написанный на Rust. Открытый исходный код, двойная лицензия MIT или Apache-2.0.',
			documentation: 'Документация',
			project: 'Проект',
			source: 'Исходный код на GitHub',
			copyrightPrefix: (year) => `© ${year} iqbqioza · `,
			licenseLabel: 'лицензия MIT или Apache-2.0',
			labels: {
				'/docs/introduction/': 'Введение',
				'/docs/installation/': 'Установка',
				'/docs/configuration/': 'Конфигурация',
				'/docs/deploy/': 'Развёртывание',
				'/docs/troubleshooting/': 'Устранение неполадок',
				'/about/': 'О проекте',
				'/faq/': 'Частые вопросы',
				'/compare/strfry/': 'nostrfy против strfry',
				'/donate/': 'Поддержать',
				github: 'GitHub',
				releases: 'Релизы',
				security: 'Политика безопасности'
			}
		},
		docs: {
			documentation: 'Документация',
			previous: 'Назад',
			next: 'Вперёд',
			pagination: 'Постраничная навигация',
			home: 'Главная',
			breadcrumb: 'Документация',
			breadcrumbAria: 'Хлебные крошки'
		},
		navGroups: {
			'Getting started': 'С чего начать',
			Operations: 'Эксплуатация',
			Features: 'Возможности',
			Deployment: 'Развёртывание',
			Help: 'Помощь'
		},
		navItems: {
			'/docs/introduction/': 'Введение',
			'/docs/installation/': 'Установка',
			'/docs/quick-start/': 'Быстрый старт',
			'/docs/configuration/': 'Справочник по конфигурации',
			'/docs/commands/': 'Справочник команд',
			'/docs/operation/': 'Эксплуатация релея',
			'/docs/migrating-from-strfry/': 'Миграция со strfry',
			'/docs/nips/': 'Поддерживаемые NIP',
			'/docs/rest-api/': 'REST API',
			'/docs/groups/': 'Группы NIP-29',
			'/docs/livekit/': 'Комнаты LiveKit',
			'/docs/blossom/': 'Файловый сервер Blossom',
			'/docs/management/': 'Управление NIP-86',
			'/docs/deploy/': 'Обзор',
			'/docs/deploy/fly/': 'Fly.io',
			'/docs/deploy/vps/': 'Любой VPS',
			'/docs/deploy/digitalocean/': 'Digital Ocean',
			'/docs/deploy/aws/': 'AWS',
			'/docs/deploy/gcp/': 'Google Cloud',
			'/docs/deploy/azure/': 'Azure',
			'/docs/troubleshooting/': 'Устранение неполадок'
		},
		error: {
			notFound: 'Страница не найдена',
			generic: 'Что-то пошло не так',
			notFoundBody: 'Запрошенная страница не существует или была перемещена.',
			genericBody: 'Произошла непредвиденная ошибка. Попробуйте ещё раз.',
			home: 'Вернуться на главную'
		},
		meta: {
			homeTitle: 'nostrfy — универсальный серверный движок Nostr-релея',
			defaultDescription:
				'nostrfy — универсальный серверный движок Nostr-релея на Rust. Скорость по замыслу, лёгкость по природе, мощь по умолчанию.',
			ogImageAlt: 'nostrfy — универсальный серверный движок Nostr-релея'
		}
	},
	de: {
		logoAria: 'nostrfy Startseite',
		header: {
			docs: 'Dokumentation',
			about: 'Über',
			donate: 'Spenden',
			github: 'GitHub',
			mainNav: 'Hauptnavigation',
			mobileNav: 'Mobile Navigation',
			toggleMenu: 'Menü umschalten',
			language: 'Sprache'
		},
		footer: {
			tagline:
				'Eine All-in-One-Nostr-Relay-Server-Engine in Rust. Open Source, dual unter MIT oder Apache-2.0 lizenziert.',
			documentation: 'Dokumentation',
			project: 'Projekt',
			source: 'Quellcode auf GitHub',
			copyrightPrefix: (year) => `© ${year} iqbqioza · `,
			licenseLabel: 'MIT- oder Apache-2.0-Lizenz',
			labels: {
				'/docs/introduction/': 'Einführung',
				'/docs/installation/': 'Installation',
				'/docs/configuration/': 'Konfiguration',
				'/docs/deploy/': 'Bereitstellung',
				'/docs/troubleshooting/': 'Fehlerbehebung',
				'/about/': 'Über',
				'/faq/': 'FAQ',
				'/compare/strfry/': 'nostrfy vs. strfry',
				'/donate/': 'Spenden',
				github: 'GitHub',
				releases: 'Releases',
				security: 'Sicherheitsrichtlinie'
			}
		},
		docs: {
			documentation: 'Dokumentation',
			previous: 'Zurück',
			next: 'Weiter',
			pagination: 'Seitennavigation',
			home: 'Startseite',
			breadcrumb: 'Dokumentation',
			breadcrumbAria: 'Breadcrumb-Navigation'
		},
		navGroups: {
			'Getting started': 'Erste Schritte',
			Operations: 'Betrieb',
			Features: 'Funktionen',
			Deployment: 'Bereitstellung',
			Help: 'Hilfe'
		},
		navItems: {
			'/docs/introduction/': 'Einführung',
			'/docs/installation/': 'Installation',
			'/docs/quick-start/': 'Schnellstart',
			'/docs/configuration/': 'Konfigurationsreferenz',
			'/docs/commands/': 'Befehlsreferenz',
			'/docs/operation/': 'Relay betreiben',
			'/docs/migrating-from-strfry/': 'Migration von strfry',
			'/docs/nips/': 'Unterstützte NIPs',
			'/docs/rest-api/': 'REST-API',
			'/docs/groups/': 'NIP-29-Gruppen',
			'/docs/livekit/': 'LiveKit-Räume',
			'/docs/blossom/': 'Blossom-Dateiserver',
			'/docs/management/': 'NIP-86-Verwaltung',
			'/docs/deploy/': 'Übersicht',
			'/docs/deploy/fly/': 'Fly.io',
			'/docs/deploy/vps/': 'Beliebiger VPS',
			'/docs/deploy/digitalocean/': 'Digital Ocean',
			'/docs/deploy/aws/': 'AWS',
			'/docs/deploy/gcp/': 'Google Cloud',
			'/docs/deploy/azure/': 'Azure',
			'/docs/troubleshooting/': 'Fehlerbehebung'
		},
		error: {
			notFound: 'Seite nicht gefunden',
			generic: 'Etwas ist schiefgelaufen',
			notFoundBody: 'Die gesuchte Seite existiert nicht oder wurde verschoben.',
			genericBody: 'Ein unerwarteter Fehler ist aufgetreten. Bitte versuchen Sie es erneut.',
			home: 'Zurück zur Startseite'
		},
		meta: {
			homeTitle: 'nostrfy — All-in-One-Nostr-Relay-Server-Engine',
			defaultDescription:
				'nostrfy ist eine All-in-One-Nostr-Relay-Server-Engine in Rust. Blitzschnell per Design, schlank von Natur aus, leistungsstark als Standard.',
			ogImageAlt: 'nostrfy — All-in-One-Nostr-Relay-Server-Engine'
		}
	},
	fr: {
		logoAria: 'Accueil nostrfy',
		header: {
			docs: 'Documentation',
			about: 'À propos',
			donate: 'Faire un don',
			github: 'GitHub',
			mainNav: 'Navigation principale',
			mobileNav: 'Navigation mobile',
			toggleMenu: 'Ouvrir ou fermer le menu',
			language: 'Langue'
		},
		footer: {
			tagline:
				'Un moteur de serveur relais Nostr tout-en-un écrit en Rust. Logiciel libre et open source, sous double licence MIT ou Apache-2.0.',
			documentation: 'Documentation',
			project: 'Projet',
			source: 'Code source sur GitHub',
			copyrightPrefix: (year) => `© ${year} iqbqioza · `,
			licenseLabel: 'licence MIT ou Apache-2.0',
			labels: {
				'/docs/introduction/': 'Introduction',
				'/docs/installation/': 'Installation',
				'/docs/configuration/': 'Configuration',
				'/docs/deploy/': 'Déploiement',
				'/docs/troubleshooting/': 'Dépannage',
				'/about/': 'À propos',
				'/faq/': 'FAQ',
				'/compare/strfry/': 'nostrfy vs strfry',
				'/donate/': 'Faire un don',
				github: 'GitHub',
				releases: 'Versions',
				security: 'Politique de sécurité'
			}
		},
		docs: {
			documentation: 'Documentation',
			previous: 'Précédent',
			next: 'Suivant',
			pagination: 'Pagination',
			home: 'Accueil',
			breadcrumb: 'Documentation',
			breadcrumbAria: "Fil d’Ariane"
		},
		navGroups: {
			'Getting started': 'Pour commencer',
			Operations: 'Exploitation',
			Features: 'Fonctionnalités',
			Deployment: 'Déploiement',
			Help: 'Aide'
		},
		navItems: {
			'/docs/introduction/': 'Introduction',
			'/docs/installation/': 'Installation',
			'/docs/quick-start/': 'Démarrage rapide',
			'/docs/configuration/': 'Référence de configuration',
			'/docs/commands/': 'Référence des commandes',
			'/docs/operation/': 'Exploiter le relais',
			'/docs/migrating-from-strfry/': 'Migration depuis strfry',
			'/docs/nips/': 'NIPs pris en charge',
			'/docs/rest-api/': 'API REST',
			'/docs/groups/': 'Groupes NIP-29',
			'/docs/livekit/': 'Salles LiveKit',
			'/docs/blossom/': 'Serveur de fichiers Blossom',
			'/docs/management/': 'Gestion NIP-86',
			'/docs/deploy/': 'Aperçu',
			'/docs/deploy/fly/': 'Fly.io',
			'/docs/deploy/vps/': 'N’importe quel VPS',
			'/docs/deploy/digitalocean/': 'Digital Ocean',
			'/docs/deploy/aws/': 'AWS',
			'/docs/deploy/gcp/': 'Google Cloud',
			'/docs/deploy/azure/': 'Azure',
			'/docs/troubleshooting/': 'Dépannage'
		},
		error: {
			notFound: 'Page introuvable',
			generic: 'Une erreur est survenue',
			notFoundBody: "La page que vous cherchez n’existe pas ou a été déplacée.",
			genericBody: 'Une erreur inattendue est survenue. Veuillez réessayer.',
			home: "Retour à l’accueil"
		},
		meta: {
			homeTitle: 'nostrfy — moteur de serveur relais Nostr tout-en-un',
			defaultDescription:
				'nostrfy est un moteur de serveur relais Nostr tout-en-un écrit en Rust. Rapide par conception, léger par nature, puissant par défaut.',
			ogImageAlt: 'nostrfy — moteur de serveur relais Nostr tout-en-un'
		}
	},
	es: {
		logoAria: 'Inicio de nostrfy',
		header: {
			docs: 'Documentación',
			about: 'Acerca de',
			donate: 'Donar',
			github: 'GitHub',
			mainNav: 'Navegación principal',
			mobileNav: 'Navegación móvil',
			toggleMenu: 'Alternar menú',
			language: 'Idioma'
		},
		footer: {
			tagline:
				'Un motor de servidor de relé Nostr todo en uno escrito en Rust. Código abierto, con doble licencia MIT o Apache-2.0.',
			documentation: 'Documentación',
			project: 'Proyecto',
			source: 'Código fuente en GitHub',
			copyrightPrefix: (year) => `© ${year} iqbqioza · `,
			licenseLabel: 'licencia MIT o Apache-2.0',
			labels: {
				'/docs/introduction/': 'Introducción',
				'/docs/installation/': 'Instalación',
				'/docs/configuration/': 'Configuración',
				'/docs/deploy/': 'Despliegue',
				'/docs/troubleshooting/': 'Solución de problemas',
				'/about/': 'Acerca de',
				'/faq/': 'Preguntas frecuentes',
				'/compare/strfry/': 'nostrfy vs strfry',
				'/donate/': 'Donar',
				github: 'GitHub',
				releases: 'Versiones',
				security: 'Política de seguridad'
			}
		},
		docs: {
			documentation: 'Documentación',
			previous: 'Anterior',
			next: 'Siguiente',
			pagination: 'Paginación',
			home: 'Inicio',
			breadcrumb: 'Documentación',
			breadcrumbAria: 'Ruta de navegación'
		},
		navGroups: {
			'Getting started': 'Primeros pasos',
			Operations: 'Operación',
			Features: 'Funciones',
			Deployment: 'Despliegue',
			Help: 'Ayuda'
		},
		navItems: {
			'/docs/introduction/': 'Introducción',
			'/docs/installation/': 'Instalación',
			'/docs/quick-start/': 'Inicio rápido',
			'/docs/configuration/': 'Referencia de configuración',
			'/docs/commands/': 'Referencia de comandos',
			'/docs/operation/': 'Ejecutar el relé',
			'/docs/migrating-from-strfry/': 'Migrar desde strfry',
			'/docs/nips/': 'NIP compatibles',
			'/docs/rest-api/': 'API REST',
			'/docs/groups/': 'Grupos NIP-29',
			'/docs/livekit/': 'Salas LiveKit',
			'/docs/blossom/': 'Servidor de archivos Blossom',
			'/docs/management/': 'Gestión NIP-86',
			'/docs/deploy/': 'Resumen',
			'/docs/deploy/fly/': 'Fly.io',
			'/docs/deploy/vps/': 'Cualquier VPS',
			'/docs/deploy/digitalocean/': 'Digital Ocean',
			'/docs/deploy/aws/': 'AWS',
			'/docs/deploy/gcp/': 'Google Cloud',
			'/docs/deploy/azure/': 'Azure',
			'/docs/troubleshooting/': 'Solución de problemas'
		},
		error: {
			notFound: 'Página no encontrada',
			generic: 'Algo salió mal',
			notFoundBody: 'La página que buscas no existe o se ha movido.',
			genericBody: 'Se ha producido un error inesperado. Inténtalo de nuevo.',
			home: 'Volver al inicio'
		},
		meta: {
			homeTitle: 'nostrfy — motor de servidor de relé Nostr todo en uno',
			defaultDescription:
				'nostrfy es un motor de servidor de relé Nostr todo en uno escrito en Rust. Rápido por diseño, ligero por naturaleza, potente por defecto.',
			ogImageAlt: 'nostrfy — motor de servidor de relé Nostr todo en uno'
		}
	},
	pt: {
		logoAria: 'Início do nostrfy',
		header: {
			docs: 'Documentação',
			about: 'Sobre',
			donate: 'Doar',
			github: 'GitHub',
			mainNav: 'Navegação principal',
			mobileNav: 'Navegação móvel',
			toggleMenu: 'Alternar menu',
			language: 'Idioma'
		},
		footer: {
			tagline:
				'Um motor de servidor de relay Nostr tudo-em-um escrito em Rust. Código aberto, com dupla licença MIT ou Apache-2.0.',
			documentation: 'Documentação',
			project: 'Projeto',
			source: 'Código-fonte no GitHub',
			copyrightPrefix: (year) => `© ${year} iqbqioza · `,
			licenseLabel: 'licença MIT ou Apache-2.0',
			labels: {
				'/docs/introduction/': 'Introdução',
				'/docs/installation/': 'Instalação',
				'/docs/configuration/': 'Configuração',
				'/docs/deploy/': 'Implantação',
				'/docs/troubleshooting/': 'Solução de problemas',
				'/about/': 'Sobre',
				'/faq/': 'Perguntas frequentes',
				'/compare/strfry/': 'nostrfy vs strfry',
				'/donate/': 'Doar',
				github: 'GitHub',
				releases: 'Versões',
				security: 'Política de segurança'
			}
		},
		docs: {
			documentation: 'Documentação',
			previous: 'Anterior',
			next: 'Próximo',
			pagination: 'Paginação',
			home: 'Início',
			breadcrumb: 'Documentação',
			breadcrumbAria: 'Trilha de navegação'
		},
		navGroups: {
			'Getting started': 'Primeiros passos',
			Operations: 'Operação',
			Features: 'Recursos',
			Deployment: 'Implantação',
			Help: 'Ajuda'
		},
		navItems: {
			'/docs/introduction/': 'Introdução',
			'/docs/installation/': 'Instalação',
			'/docs/quick-start/': 'Início rápido',
			'/docs/configuration/': 'Referência de configuração',
			'/docs/commands/': 'Referência de comandos',
			'/docs/operation/': 'Executar o relay',
			'/docs/migrating-from-strfry/': 'Migrar do strfry',
			'/docs/nips/': 'NIPs suportados',
			'/docs/rest-api/': 'API REST',
			'/docs/groups/': 'Grupos NIP-29',
			'/docs/livekit/': 'Salas LiveKit',
			'/docs/blossom/': 'Servidor de arquivos Blossom',
			'/docs/management/': 'Gerenciamento NIP-86',
			'/docs/deploy/': 'Visão geral',
			'/docs/deploy/fly/': 'Fly.io',
			'/docs/deploy/vps/': 'Qualquer VPS',
			'/docs/deploy/digitalocean/': 'Digital Ocean',
			'/docs/deploy/aws/': 'AWS',
			'/docs/deploy/gcp/': 'Google Cloud',
			'/docs/deploy/azure/': 'Azure',
			'/docs/troubleshooting/': 'Solução de problemas'
		},
		error: {
			notFound: 'Página não encontrada',
			generic: 'Algo deu errado',
			notFoundBody: 'A página que você procura não existe ou foi movida.',
			genericBody: 'Ocorreu um erro inesperado. Tente novamente.',
			home: 'Voltar ao início'
		},
		meta: {
			homeTitle: 'nostrfy — motor de servidor de relay Nostr tudo-em-um',
			defaultDescription:
				'nostrfy é um motor de servidor de relay Nostr tudo-em-um escrito em Rust. Rápido por design, leve por natureza, poderoso por padrão.',
			ogImageAlt: 'nostrfy — motor de servidor de relay Nostr tudo-em-um'
		}
	},
	it: {
		logoAria: 'Home di nostrfy',
		header: {
			docs: 'Documentazione',
			about: 'Informazioni',
			donate: 'Dona',
			github: 'GitHub',
			mainNav: 'Navigazione principale',
			mobileNav: 'Navigazione mobile',
			toggleMenu: 'Apri/chiudi il menu',
			language: 'Lingua'
		},
		footer: {
			tagline:
				'Un motore di server relay Nostr tutto-in-uno scritto in Rust. Open source, con doppia licenza MIT o Apache-2.0.',
			documentation: 'Documentazione',
			project: 'Progetto',
			source: 'Codice sorgente su GitHub',
			copyrightPrefix: (year) => `© ${year} iqbqioza · `,
			licenseLabel: 'licenza MIT o Apache-2.0',
			labels: {
				'/docs/introduction/': 'Introduzione',
				'/docs/installation/': 'Installazione',
				'/docs/configuration/': 'Configurazione',
				'/docs/deploy/': 'Distribuzione',
				'/docs/troubleshooting/': 'Risoluzione dei problemi',
				'/about/': 'Informazioni',
				'/faq/': 'Domande frequenti',
				'/compare/strfry/': 'nostrfy vs strfry',
				'/donate/': 'Dona',
				github: 'GitHub',
				releases: 'Release',
				security: 'Politica di sicurezza'
			}
		},
		docs: {
			documentation: 'Documentazione',
			previous: 'Precedente',
			next: 'Successivo',
			pagination: 'Paginazione',
			home: 'Home',
			breadcrumb: 'Documentazione',
			breadcrumbAria: 'Percorso di navigazione'
		},
		navGroups: {
			'Getting started': 'Per iniziare',
			Operations: 'Operazioni',
			Features: 'Funzionalità',
			Deployment: 'Distribuzione',
			Help: 'Aiuto'
		},
		navItems: {
			'/docs/introduction/': 'Introduzione',
			'/docs/installation/': 'Installazione',
			'/docs/quick-start/': 'Avvio rapido',
			'/docs/configuration/': 'Riferimento di configurazione',
			'/docs/commands/': 'Riferimento dei comandi',
			'/docs/operation/': 'Gestione del relay',
			'/docs/migrating-from-strfry/': 'Migrazione da strfry',
			'/docs/nips/': 'NIP supportati',
			'/docs/rest-api/': 'API REST',
			'/docs/groups/': 'Gruppi NIP-29',
			'/docs/livekit/': 'Stanze LiveKit',
			'/docs/blossom/': 'Server di file Blossom',
			'/docs/management/': 'Gestione NIP-86',
			'/docs/deploy/': 'Panoramica',
			'/docs/deploy/fly/': 'Fly.io',
			'/docs/deploy/vps/': 'Qualsiasi VPS',
			'/docs/deploy/digitalocean/': 'Digital Ocean',
			'/docs/deploy/aws/': 'AWS',
			'/docs/deploy/gcp/': 'Google Cloud',
			'/docs/deploy/azure/': 'Azure',
			'/docs/troubleshooting/': 'Risoluzione dei problemi'
		},
		error: {
			notFound: 'Pagina non trovata',
			generic: 'Qualcosa è andato storto',
			notFoundBody: 'La pagina che cerchi non esiste o è stata spostata.',
			genericBody: 'Si è verificato un errore imprevisto. Riprova.',
			home: 'Torna alla home'
		},
		meta: {
			homeTitle: 'nostrfy — motore di server relay Nostr tutto-in-uno',
			defaultDescription:
				'nostrfy è un motore di server relay Nostr tutto-in-uno scritto in Rust. Veloce per progettazione, leggero per natura, potente di default.',
			ogImageAlt: 'nostrfy — motore di server relay Nostr tutto-in-uno'
		}
	},
};

export function t(locale: Locale): UiStrings {
	return ui[locale];
}
