import {
	componentName,
	componentName as typedocThemeYaf,
	htmlString,
	reflectionMap,
	YAFDataObject,
} from '../types.js';
import { YafElement } from '../YafElement.js';
import { trigger } from '../lib/eventApi.js';
import { kindSymbols } from '../../types.js';

const { yaf } = window;
/**
 * The highest level component of the theme, whereunder all other components reside
 */
export class TypedocThemeYaf extends YafElement {
	constructor() {
		super(typedocThemeYaf);
		if (!window.yaf.menuState)
			window.yaf.menuState = {
				menu: {},
				content: {},
				scrollTop: 0,
			};
		try {
			window.yaf.menuState = JSON.parse(localStorage.menuState);
		} catch (err) {
			this.errors.localStorage('menuState');
			window.yaf.menuState = { menu: {}, content: {}, scrollTop: 0 };
		}
		window.addEventListener('beforeunload', () => {
			localStorage.setItem('menuState', JSON.stringify(yaf.menuState));
		});
	}
	/**
	 * The user preference for a light or dark theme
	 * @todo Develop theming
	 */
	theme = 'light' as 'light' | 'dark';
	/**
	 * - fetches the reflectionMap
	 * - fetches the HTML template
	 * - fetches the CSS template
	 * - adds the `reflectionById` listener to the DOM `body`
	 */
	async connectedCallback() {
		const Promises = [
			this.fetchData<reflectionMap>('yafReflectionMap').catch((err) =>
				this.errors.data(err)
			),
			this.fetchData('yafKindSymbols').catch((err) =>
				this.errors.data(err)
			),
			this.fetchTemplate('html').catch((err) =>
				this.errors.template(err)
			),
		];
		try {
			const [reflectionMap, kindSymbols, html] = await Promise.all(
				Promises
			);
			yaf.reflectionMap = reflectionMap as reflectionMap;
			yaf.kindSymbols = kindSymbols as kindSymbols;

			const innerHtml = this.makeContent(html as htmlString);
			this.appendChild(innerHtml);

			this.body.addEventListener(
				trigger.fetch.reflectionById,
				this.reflectionById as EventListener
			);
			this.body.addEventListener(
				trigger.get.reflectionLinkById,
				this.reflectionLinkById as EventListener
			);
		} catch (err) {
			console.error(err);
		}
	}
	/**
	 * - removes the `reflectionById` listener from the DOM `body`
	 */
	disconnectedCallback() {
		this.body.removeEventListener(
			trigger.fetch.reflectionById,
			this.reflectionById as EventListener
		);

		this.body.removeEventListener(
			trigger.get.reflectionLinkById,
			this.reflectionLinkById as EventListener
		);
	}

	/**
	 * An event handler that fetches reflection data by id and returns
	 * it to the event callback function.
	 *
	 * Listens on the DOM Body
	 *
	 * @param e
	 * @param test2 A test param, please delete
	 * @param test
	 *
	 * @event
	 * @remarks
	 * This is a blocktag
	 */
	reflectionById = <testtype>(
		e: CustomEvent<{
			id: number;
			callBack: (r: YAFDataObject) => void;
		}>,
		test2?: string,
		...test: [foo: string, bar: string]
	) => {
		const { id, callBack } = e.detail;
		console.error(id);
		const { fileName, level } = window.yaf.reflectionMap[id];
		this.fetchData<YAFDataObject>(fileName)
			.then((reflection) => {
				callBack(
					level
						? (reflection.children?.find(
								(child) => child.id === id
						  ) as YAFDataObject)
						: reflection
				);
			})
			.catch(this.errors.data);
	};

	reflectionLinkById = (
		e: CustomEvent<{
			id: number;
			callBack: (r: number) => void;
		}>
	) => {
		const { callBack, id } = e.detail;
		callBack(id);
	};
}
const typedocThemeYaf: componentName = 'typedoc-theme-yaf';
customElements.define(typedocThemeYaf, TypedocThemeYaf);
