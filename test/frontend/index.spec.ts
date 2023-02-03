import { visualDiff } from '@web/test-runner-visual-regression';
import { setViewport } from '@web/test-runner-commands';

type callBack = (err?: any) => void;

it('sets the viewport size', async function () {
	await setViewport({ width: 1350, height: 2000 });
});
it('initial load', function (done: callBack) {
	screenShot(done, 'initialLoad');
});
it('expands the menu', function (done: callBack) {
	this.timeout(8000);
	const button = document.querySelector(
		'yaf-navigation-header .open.button'
	) as HTMLElement;
	button?.click();
	console.log('click');
	screenShot(menuScrolled, 'menuExpanded', 1000);

	function menuScrolled() {
		const menu = document.querySelector(
			'yaf-navigation-menu'
		) as HTMLElement;
		menu!.scrollTop = menu!.scrollHeight;
		screenShot(done, 'menuScrolled', 1000);
	}
});
it('loads all the links', async function () {
	await setViewport({ width: 900, height: 1200 });
	const items = <HTMLElement[]>[
		...document.querySelectorAll(
			'yaf-navigation-menu li.header, yaf-navigation-menu-branch'
		),
	];
	const container = document.querySelector(
		'yaf-chrome-content'
	) as HTMLElement;

	const time = items.length * 2000;
	this.timeout(time);

	for (let i = 0; i < items.length; i++) {
		const item = items[i];
		const id = item.id;
		const imageName = `${i}_${id}`;
		const link = item.querySelector(
			item.nodeName === 'LI'
				? 'a'
				: ':scope > .header > yaf-navigation-link a'
		) as HTMLElement;

		link!.click();
		await new Promise((resolve, reject) => {
			screenShot(
				(err) => {
					if (err) {
						console.log(
							`image ${i + 1} of ${items.length}: ${imageName}`
						);
						reject(err);
					}
					resolve(true);
				},
				imageName,
				1200,
				container
			);
		});
	}
});

function screenShot(
	callBack: callBack,
	name: string,
	time = 100,
	element = document.body
) {
	console.log(name);
	setTimeout(async () => {
		visualDiff(element, name)
			.then(() => callBack())
			.catch((err) => callBack(err));
	}, time);
}
