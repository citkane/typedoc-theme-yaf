import {
	componentName,
	flagCounts,
	yafEventList,
	yafHTMLExtension,
} from '../../../types/frontendTypes.js';
import { YAFReflectionLink } from '../../../types/types.js';
import { action, appState, events } from '../../handlers/index.js';
import {
	makeElement,
	makeLinkElement,
	makeNameSpan,
	makeSymbolSpan,
	normaliseFlags,
} from '../../yafElement.js';
import YafHTMLElement from '../../YafHTMLElement.js';
import { YafWidgetKind } from '../Widget/YafWidgetKind.js';
import { YafWidgetTagToggle } from '../Widget/YafWidgetTagToggle.js';

const { trigger, action } = events;

type result = [number, YAFReflectionLink];
type results = result[];

/**
 *
 */
export class YafNavigationSearch extends YafHTMLElement {
	private resultsHTMLElement = makeElement('ul', 'results');
	private debouncer!: ReturnType<typeof setTimeout>;
	private dictionary!: YAFReflectionLink[];
	constructor() {
		super();
		const {
			SignatureContainer,
			SetSignature,
			GetSignature,
			SomeSignature,
			CallSignature,
			IndexSignature,
			ConstructorSignature,
			ContainsCallSignatures,
		} = appState.reflectionKind;
		const excluded = [
			SignatureContainer,
			SetSignature,
			GetSignature,
			SomeSignature,
			CallSignature,
			IndexSignature,
			ConstructorSignature,
			ContainsCallSignatures,
		];
		this.dictionary = Object.keys(appState.reflectionMap)
			.map((id) => appState.reflectionMap[id])
			.filter((reflection) => excluded.indexOf(reflection.kind) === -1);
	}
	onConnect() {
		const { display } = appState.options;
		Object.keys(display).forEach((key) => {
			this.setAttribute(
				key,
				appState.options.display[<keyof typeof display>key]
			);
		});
		this.eventsList.forEach((event) => events.on(...event));

		this.appendChild(this.resultsHTMLElement);
	}
	disconnectedCallback() {
		this.eventsList.forEach((event) => events.off(...event));
	}
	private search = ({ detail }: CustomEvent<action['menu']['search']>) => {
		clearTimeout(this.debouncer);
		this.debouncer = setTimeout(() => {
			const { resultLink, tagToggles } = YafNavigationSearch.factory;
			const { searchString } = detail;
			const results: results = [];
			this.dictionary.forEach((reflection) => {
				if (!this.match(results, searchString, reflection)) {
					this.match(results, searchString, reflection, 'query', 100);
				}
			});
			const resultHTMLListItems = results
				.sort((a, b) => (a[0] > b[0] ? 1 : a[0] < b[0] ? -1 : 0))
				.map((result: result) => resultLink(result[1], searchString));

			this.resultsHTMLElement.replaceChildren();
			this.resultsHTMLElement.appendChildren(resultHTMLListItems);
			const tagToggleHTMLElement = tagToggles(this.resultsHTMLElement);
			this.resultsHTMLElement.prepend(tagToggleHTMLElement);
			this.scrollTop = 0;
		}, 600);
	};
	private match = (
		results: results,
		searchString: string,
		reflection: YAFReflectionLink,
		target: 'name' | 'query' = 'name',
		offset = 0
	) => {
		searchString = searchString.trim();
		let targetString = reflection[target];
		if (searchString === targetString) {
			results.push([0 + offset, reflection]);
			return true;
		}
		if (targetString.startsWith(searchString)) {
			results.push([1 + offset, reflection]);
			return true;
		}
		if (targetString.includes(searchString)) {
			results.push([2 + offset, reflection]);
			return true;
		}
		searchString = searchString.toLocaleLowerCase();
		targetString = targetString.toLocaleLowerCase();
		if (searchString === targetString) {
			results.push([3 + offset, reflection]);
			return true;
		}
		if (targetString.startsWith(searchString)) {
			results.push([4 + offset, reflection]);
			return true;
		}
		if (targetString.includes(searchString)) {
			results.push([5 + offset, reflection]);
			return true;
		}
		return false;
	};
	private eventsList: yafEventList = [
		[trigger.menu.search, this.search],
		[
			trigger.options.display,
			({ detail }: CustomEvent<action['options']['display']>) => {
				const { key, value } = detail;
				this.setAttribute(key, value);
			},
		],
	];
	private static factory = {
		resultLink: (
			reflectionLink: YAFReflectionLink,
			searchString: string
		) => {
			const { highlight } = this.factory;
			const { query, hash, name, kind, flags } = reflectionLink;
			const flagClasses = normaliseFlags(flags).join(' ').trim();
			const listHTMLElement = makeElement('li', flagClasses);

			let href = `?page=${query}`;
			if (hash) href += `#${hash}`;

			const linkHTMLElement = makeLinkElement(href);
			const nameHTMLElement = highlight(makeNameSpan(name), searchString);
			const queryHTMLElement = highlight(
				makeSymbolSpan(query),
				searchString
			);
			const linkSymbolHTMLElement = makeElement<
				YafWidgetKind,
				YafWidgetKind['props']
			>('yaf-widget-kind', null, null, { kind: String(kind) });

			linkHTMLElement.appendChildren([nameHTMLElement, queryHTMLElement]);

			listHTMLElement.appendChildren([
				linkSymbolHTMLElement,
				linkHTMLElement,
			]);

			return listHTMLElement;
		},
		highlight: (
			span: HTMLElement & yafHTMLExtension,
			searchString: string,
			anycase?: boolean
		): HTMLElement => {
			searchString = anycase
				? searchString.toLocaleLowerCase()
				: searchString;
			const resultString = anycase
				? span.innerText.toLocaleLowerCase()
				: span.innerText;
			if (resultString === searchString) {
				span.classList.add('lit');
				return span;
			}
			if (resultString.includes(searchString)) {
				const regexString = `(${searchString})`;
				const regex = anycase
					? new RegExp(regexString, 'ig')
					: new RegExp(regexString, 'g');
				const spanHTMLElements = span.innerText
					.split(regex)
					.map((part) => {
						return makeElement(
							'span',
							(anycase ? part.toLocaleLowerCase() : part) ===
								searchString
								? 'lit'
								: undefined,
							part
						);
					});
				span.innerText = '';
				span.appendChildren(spanHTMLElements);
				return span;
			}
			return anycase
				? span
				: this.factory.highlight(span, searchString, true);
		},
		tagToggles: (resultsHTMLElement: HTMLElement) => {
			const flagCounts: flagCounts = {
				private: resultsHTMLElement.querySelectorAll('.private').length,
				inherited:
					resultsHTMLElement.querySelectorAll('.inherited').length,
			};
			const wrapperHTMLElement = makeElement('li');
			wrapperHTMLElement.appendChild(
				makeElement<YafWidgetTagToggle>(
					'yaf-widget-tag-toggle',
					undefined,
					undefined,
					{ flagCounts }
				)
			);
			return wrapperHTMLElement;
		},
	};
}
const yafNavigationSearch: componentName = 'yaf-navigation-search';
customElements.define(yafNavigationSearch, YafNavigationSearch);
