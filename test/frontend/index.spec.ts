import { visualDiff } from '@web/test-runner-visual-regression';
import { setViewport } from '@web/test-runner-commands';
import { doesNotMatch } from 'assert';

type done = () => void;

it('sets the viewport size', async function () {
	await setViewport({ width: 1350, height: 2000 });
});
it('initial load', function (done: done) {
	screenShot(done, 'initialLoad');
});
it('expands the menu', function (done: done) {
	this.timeout(4000);
	const button = document.querySelector(
		'yaf-navigation-header .open.button'
	) as HTMLElement;
	button?.click();
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
	await setViewport({ width: 900, height: 2000 });
	const items = <HTMLElement[]>[
		...document.querySelectorAll(
			'yaf-navigation-menu li.header, yaf-navigation-menu-branch'
		),
	];
	const container = document.querySelector(
		'yaf-chrome-content'
	) as HTMLElement;

	const time = items.length * 1500;
	this.timeout(time);

	for (let i = 0; i < items.length; i++) {
		const item = items[i];
		const id = item.id;
		const link = item.querySelector(
			item.nodeName === 'LI'
				? 'a'
				: ':scope > .header > yaf-navigation-link a'
		) as HTMLElement;
		link!.click();
		await new Promise((resolve) =>
			screenShot(
				() => {
					resolve(true);
				},
				id,
				1000,
				container
			)
		);
	}
});

function screenShot(
	callBack: done,
	name: string,
	time = 100,
	element = document.body
) {
	setTimeout(async () => {
		await visualDiff(element, name);
		callBack();
	}, time);
}

//import '../../../dist/src/frontend';

/*
import unitTestUtils from './lib/utils.spec';
import unitTestEvents from './lib/events.spec';
import unitTestYafElement from './YafElement.spec';

describe('Frontend unit tests', function () {
	this.beforeAll(function () {
		makeFetchStub();
	});
	this.afterAll(function () {
		(<fetchStub>window.fetch).restore();
	});
	unitTestUtils();
	unitTestEvents();
	unitTestYafElement();
});

import typedocThemeYaf from './webComponents/TypedocThemeYaf.spec';
import { fetchStub, makeFetchStub } from './stubs/stubs';
describe('Frontend component unit tests', function () {
	this.beforeAll(function () {
		makeFetchStub();
	});
	this.afterAll(function () {
		(<fetchStub>window.fetch).restore();
	});
	typedocThemeYaf();
});
*/
