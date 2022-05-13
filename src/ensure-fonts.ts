import {continueRender, delayRender, staticFile} from 'remotion';

const ensureFont = (
	name: string,
	path: string,
	weight: string,
	style: 'normal' | 'italic'
) => {
	if (typeof window !== 'undefined' && 'FontFace' in window) {
		const font = new FontFace(name, `url(${path})`, {
			weight,
			style,
		});
		const handle = delayRender();
		font.load().then(() => {
			document.fonts.add(font);
			continueRender(handle);
		});
	}
};

export const ensureAllFonts = () => {
	ensureFont(
		'Roboto Condensed',
		staticFile('/RobotoCondensed-Regular.ttf'),
		'300',
		'normal'
	);
	ensureFont(
		'Roboto Condensed',
		staticFile('/RobotoCondensed-Bold.ttf'),
		'500',
		'normal'
	);
	ensureFont(
		'Roboto Condensed',
		staticFile('/RobotoCondensed-Italic.ttf'),
		'300',
		'italic'
	);
};
