function escapeHtml(s: string): string {
	return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

function escRe(s: string): string {
	return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

type Rule = { re: RegExp; cls: string };

function apply(src: string, rules: Rule[]): string {
	const out = escapeHtml(src);
	if (rules.length === 0) return out;

	let flags = 'g';
	if (rules.some((r) => r.re.flags.includes('m'))) flags += 'm';
	if (rules.some((r) => r.re.flags.includes('i'))) flags += 'i';

	const combined = new RegExp(
		rules.map((r, i) => `(?<t${i}>${r.re.source})`).join('|'),
		flags
	);

	return out.replace(combined, (m, ...rest) => {
		const groups = rest[rest.length - 1] as Record<string, string>;
		for (let i = 0; i < rules.length; i++) {
			if (groups[`t${i}`] !== undefined) {
				return `<span class="${rules[i].cls}">${m}</span>`;
			}
		}
		return m;
	});
}

const STR = `("(?:[^"\\\\]|\\\\.)*"|'(?:[^'\\\\]|\\\\.)*'|\`[^\`]*\`)`;

function langRules(lang: string): Rule[] {
	switch (lang) {
		case 'bash':
		case 'sh':
		case 'shell':
			return [
				{ re: new RegExp(STR, 'g'), cls: 'tok-s' },
				{ re: /#[^\n]*/g, cls: 'tok-c' },
				{ re: /\$[A-Za-z_][\w]*|\$\{[^}]*\}/g, cls: 'tok-v' },
				{ re: /(--?[A-Za-z][\w-]*)/g, cls: 'tok-f' },
				{ re: /\b\d+(?:\.\d+)?\b/g, cls: 'tok-n' }
			];
		case 'toml':
			return [
				{ re: new RegExp(STR, 'g'), cls: 'tok-s' },
				{ re: /#[^\n]*/g, cls: 'tok-c' },
				{ re: /^([a-zA-Z_][\w_]*\s*)(?==)/gm, cls: 'tok-p' },
				{ re: /^\[[^\]]*\]([^\n]*)?/m, cls: 'tok-sec' },
				{ re: /\b(true|false|\d+(?:\.\d+)?)\b/g, cls: 'tok-n' }
			];
		case 'json':
		case 'jsonc':
			return [
				{ re: /\/\/[^\n]*|\/\*[\s\S]*?\*\//g, cls: 'tok-c' },
				{ re: /"([^"\\]+)"(?=\s*:)/g, cls: 'tok-p' },
				{ re: new RegExp(STR, 'g'), cls: 'tok-s' },
				{ re: /\b(true|false|null|\d+(?:\.\d+)?)\b/g, cls: 'tok-n' }
			];
		case 'nginx':
			return [
				{ re: /#[^\n]*/g, cls: 'tok-c' },
				{ re: /^(\s*)([a-z_]+)/gm, cls: 'tok-k' },
				{ re: new RegExp(STR, 'g'), cls: 'tok-s' },
				{ re: /\$[A-Za-z_][\w]*|\$\{[^}]*\}/g, cls: 'tok-v' }
			];
		case 'caddy':
			return [
				{ re: /#[^\n]*|\/\*[\s\S]*?\*\//g, cls: 'tok-c' },
				{ re: /^(\s*)([a-z_]+)/m, cls: 'tok-k' },
				{ re: new RegExp(STR, 'g'), cls: 'tok-s' }
			];
		case 'plaintext':
		case 'text':
			return [];
		default:
			return [
				{ re: /\/\/[^\n]*|#[^\n]*/g, cls: 'tok-c' },
				{ re: new RegExp(STR, 'g'), cls: 'tok-s' },
				{ re: /\b(\d+(?:\.\d+)?|true|false)\b/g, cls: 'tok-n' }
			];
	}
}

export function highlight(code: string, lang: string): string {
	const key = lang.toLowerCase();
	return apply(code, langRules(key));
}

export { escRe };