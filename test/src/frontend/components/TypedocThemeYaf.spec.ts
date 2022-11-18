import { assert } from '@open-wc/testing';
import { TypedocThemeYaf } from '../../../../dist/src/frontend/components';
import { event } from '../../../../dist/src/frontend/lib/eventApi';
import { stubDataFile } from '../stubs/stubs';

export default () => {
	describe('The default theme layout component', function () {
		const body = document.querySelector('body') as HTMLBodyElement;
		const layout = new TypedocThemeYaf();
		it('loads', function (done) {
			const observer = new MutationObserver(() => {
				assert.equal(layout.childElementCount, 3);
				const style = layout.querySelector('style');

				const left = layout.querySelector('yaf-chrome-left') as Element;
				const content = layout.querySelector(
					'yaf-chrome-content'
				) as Element;

				assert.equal(left.constructor.name, 'YafChromeLeft');
				assert.equal(content.constructor.name, 'YafChromeContent');
				assert.equal(style?.innerHTML.length, 1654);
				done();
			});
			observer.observe(layout, { childList: true });
			body.appendChild(layout);
		});
		it('adds the listener and tooling for reflectionById', async function () {
			const Promises = [
				new Promise((resolve) =>
					body.dispatchEvent(
						event.fetch.reflectionById(0, (reflection) =>
							resolve(reflection)
						)
					)
				),
				new Promise((resolve) =>
					body.dispatchEvent(
						event.fetch.reflectionById(1, (reflection) =>
							resolve(reflection)
						)
					)
				),
			];

			const data = await Promise.all(Promises);
			assert.deepEqual(data[0], <any>stubDataFile);
			assert.deepEqual(data[1], <any>stubDataFile.children[0]);
		});
		it('unloads', function () {
			body.removeChild(layout);
			layout.disconnectedCallback();
		});
	});
};
