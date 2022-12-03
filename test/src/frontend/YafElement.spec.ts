import { assert, fixture, html } from '@open-wc/testing';
import YafElement from '../../../dist/src/frontend/YafElement.js';
import {
	baseElementFunctions,
	baseElementVars,
	stubDataFile,
} from './stubs/stubs';
import { trigger } from '../../../dist/src/frontend/lib/eventApi';
import sinon from 'sinon';

export default () =>
	describe('Unit tests for YafElement base class', function () {
		let el: YafElement;
		const componentName = 'test-element';
		class TestElement extends YafElement {
			constructor() {
				super('test-element');
			}
		}
		customElements.define(componentName, TestElement);

		it('loads', async function () {
			el = await fixture(html`<test-element />`);
			assert.hasAllKeys(el, [
				...baseElementVars,
				...baseElementFunctions,
			]);
			baseElementFunctions.forEach((key) => {
				assert.isFunction((<any>el)[key]);
			});
		});
		it('makes a new Element', function () {
			const newEl = el.makeElement('<span />');
			assert.dom.equal(newEl, '<span></span>');
		});
		it('makes new html content', function () {
			const newEl = el.makeContent('<div>hello</div><div>hello</div>');
			newEl.childNodes.forEach((node) => {
				assert.dom.equal(node, '<div>hello</div>');
			});
		});
		/*
		it('makes a signature component', function () {
			const sigType = {
				type: 'inferred',
				testprop: { foo: 'foo' },
			};

			//@ts-expect-error: Intentionally passing generic object instead of signature type
			let newEl = el.makeSignature(sigType, 'none');
			assert.deepEqual(sigType, (<any>newEl).props);
			assert.isFalse(newEl.hasAttribute('needsparenthesis'));

			//@ts-expect-error: Intentionally passing generic object instead of signature type
			newEl = el.makeSignature(sigType, 'arrayElement');
			assert.isTrue(newEl.hasAttribute('needsparenthesis'));

			sigType.type = 'named-tuple-member';
			//@ts-expect-error: Intentionally passing generic object instead of signature type
			newEl = el.makeSignature(sigType, 'none');
			assert.dom.equal(
				newEl,
				'<yaf-content-signature-namedtuplemember></yaf-content-signature-namedtuplemember>'
			);
			newEl = el.makeSignature(undefined, 'none');
			assert.dom.equal(
				newEl,
				'<yaf-content-signature-unknown></yaf-content-signature-unknown>'
			);
		});
		*/
		it('makes a span Element', function () {
			let newEl = el.makeSpan('test', 'test');
			assert.dom.equal(newEl, '<span class="test">test</span>');
			newEl = el.makeSpan('test');
			assert.dom.equal(newEl, '<span>test</span>');
		});
		it('appends a span to a parent', function () {
			el.appendSpanTo('test', 'test');
			assert.dom.equal(
				el,
				'<test-element><span class="test">test</span></test-element>'
			);
		});
		/*
		it('sets props to an Element', function () {
			el.setPropTo(el, 'test', 'foo');
			assert.deepEqual(el.props, { test: 'foo' });
			el.setPropsTo(el, { test: 'bar', foo: 'foo' });
			assert.deepEqual(el.props, { test: 'bar', foo: 'foo' });
		});
		*/
		it('fetches templates as html string from the server', async function () {
			const htmlTemplate = await el.fetchTemplate(
				'html',
				'stub-template-html'
			);
			assert.equal(htmlTemplate.trim(), '<div>stub template html</div>');
			const cssTemplate = await el.fetchTemplate(
				'css',
				'stub-template-css'
			);
			assert.equal(
				cssTemplate.trim(),
				'<style>body { display: none }</style>'
			);
		});
		it('fetches data as json from the server', async function () {
			const data1 = await el.fetchData('stubDataFile');
			const data2 = await el.fetchData('stubDataFile.json');
			const data3 = await el.fetchData('stubDataFile.jSoN');

			[data1, data2, data3].forEach((data) => {
				assert.deepEqual(data, stubDataFile);
			});
		});

		it('triggers an event on `body` with the purpose of to fetching a reflection by id', async function () {
			const body = document.querySelector('body') as HTMLBodyElement;
			const callBack = (e: { detail: any }) =>
				e.detail.callBack(e.detail.id);
			body.addEventListener(trigger.fetch.reflectionById, <any>callBack);

			// we only test if the event fires as the actual fetching is outside the scope here
			const id = (await el.fetchReflectionById(11)) as unknown as number;

			body.removeEventListener(
				trigger.fetch.reflectionById,
				<any>callBack
			);
			assert.equal(id, 11);
		});
		it('needs parenthesis', function () {
			assert.isFalse(el.needsParenthesis());
			el.setAttribute('needsParenthesis', '');
			assert.isTrue(el.needsParenthesis());
		});
		it('processes errors', function () {
			const stubErrMessage = sinon
				.stub(console, 'error')
				.callsFake(() => null);

			const message = 'testing an error, please ignore';
			assert.equal(
				el.errors.template({
					message,
				}),
				`<yaf-error>${message}</yaf-error>`
			);
			const testError = new Error(message);
			assert.equal((<Error>el.errors.data(testError)).message, message);

			(<typeof stubErrMessage>console.error).restore();
		});
	});
