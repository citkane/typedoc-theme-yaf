import { assert } from '@open-wc/testing';
import { event, trigger } from '../../../../dist/src/frontend/lib/eventApi';

const body = document.querySelector('body') as HTMLBodyElement;

export default () =>
	describe('Events unit tests', function () {
		it('triggers a setLocation event', function (done) {
			const fn = () => {
				assert.isTrue(true);
				body.removeEventListener(trigger.content.setLocation, fn);
				done();
			};
			body.addEventListener(trigger.content.setLocation, fn);
			body.dispatchEvent(event.content.setLocation());
		});
		it('triggers a scrollTo event', function (done) {
			const fn = (e: CustomEvent<{ target: string | 0 }>) => {
				assert.equal(e.detail?.target, 'test');
				body.removeEventListener(
					trigger.content.scrollTo,
					fn as EventListener
				);
				done();
			};
			body.addEventListener(
				trigger.content.scrollTo,
				fn as EventListener
			);
			body.dispatchEvent(event.content.scrollTo('test'));
		});
		it('triggers a fetchReflectionById event', function (done) {
			const fn = (e: CustomEvent) => {
				body.removeEventListener(
					trigger.fetch.reflectionById,
					fn as EventListener
				);
				e.detail?.callBack({ id: e.detail?.id });
			};
			body.addEventListener(
				trigger.fetch.reflectionById,
				fn as EventListener
			);
			body.dispatchEvent(
				event.fetch.reflectionById(10, (data) => {
					assert.equal(data.id, 10);
					done();
				})
			);
		});
	});
