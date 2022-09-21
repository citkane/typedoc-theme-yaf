import { assert, fixture, html } from '@open-wc/testing';
import '../../../dist/src/webComponents/';
import { YAFElement } from '../../../dist/src/webComponents/';
import { baseElementFunctions, baseElementVars } from './stubs/stubs';

describe('Web Components', function () {
	describe('Unit tests for YafElement base class', function () {
		let el: YAFElement;
		const componentName = 'test-element';
		class TestElement extends YAFElement {
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
		it('makes a signature component', function () {
			const sigType = { type: 'inferred', testprop: { foo: 'foo' } };

			//@ts-expect-error: Intentionally passing generic object instead of signature type
			let newEl: YAFElement = el.makeSignature(sigType, 'none');
			assert.deepEqual(sigType, (<any>newEl).props);
			assert.isFalse(newEl.hasAttribute('needsparenthesis'));

			//@ts-expect-error: Intentionally passing generic object instead of signature type
			newEl = el.makeSignature(sigType, 'arrayElement');
			assert.isTrue(newEl.hasAttribute('needsparenthesis'));
		});
	});
});
