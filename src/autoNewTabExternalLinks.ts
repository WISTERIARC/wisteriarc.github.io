import { visit } from 'unist-util-visit';

interface Options {
	domain: string;
}

export const autoNewTabExternalLinks = (options?: Options) => {
	const siteDomain = options?.domain ?? '';

	return (tree: any) => {
		visit(tree, (node: any) => {
			if (node.type != 'element') {
				return;
			}

			const element = node;

			if (!isAnchor(element)) {
				return;
			}

			const url = getUrl(element);

			if (isExternal(url, siteDomain)) {
				element.properties!['target'] = '_blank';
				element.properties!['rel'] = 'noopener noreferrer';
			}
		});
	};
};

const isAnchor = (element: any) => element.tagName == 'a' && element.properties && 'href' in element.properties;

const getUrl = (element: any) => {
	if (!element.properties) {
		return '';
	}

	const url = element.properties['href'];

	if (!url) {
		return '';
	}

	return url.toString();
};

const isExternal = (url: string, siteDomain: string): boolean => {
	if (!url.startsWith('http://') && !url.startsWith('https://')) {
		return false;
	}

	try {
		const parsedUrl = new URL(url);
		if (!siteDomain) {
			return true;
		}

		const parsedDomain = siteDomain.includes('://')
			? new URL(siteDomain).hostname
			: siteDomain.replace(/:\d+$/, '');

		return parsedUrl.hostname !== parsedDomain;
	} catch {
		return false;
	}
};