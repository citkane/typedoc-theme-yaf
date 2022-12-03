import {
	localStorageKey,
	ReflectionKind,
	yafState,
} from '../../types/frontendTypes.js';
import {
	reflectionMap,
	kindSymbols,
	treeMenuRoot,
	YAFDataObject,
	needsParenthesis,
} from '../../types/types.js';
import ErrorHandlers from './ErrorHandlers.js';
import events from './events/eventApi.js';

const { action } = events;

/**
 *
 */
export class AppState {
	private state!: yafState;

	constructor() {
		window.addEventListener('beforeunload', () =>
			AppState.saveToLocalStorage(this.state)
		);
		window.yaf = { flushStateCache: this.flushStateCache };
	}
	async initCache() {
		const Promises = [
			AppState.fetchDataFromFile('yafReflectionMap'),
			AppState.fetchDataFromFile('yafReflectionKind'),
			AppState.fetchDataFromFile('yafKindSymbols'),
			AppState.fetchDataFromFile('yafNavigationMenu'),
			AppState.fetchDataFromFile('yafNeedsParenthesis'),
		];
		try {
			const [
				reflectionMap,
				relectionKind,
				kindSymbols,
				navigationMenu,
				needsParenthesis,
			] = await Promise.all(Promises);

			this.state = {
				pageData: {},
				reflectionMap: reflectionMap as reflectionMap,
				reflectionKind: relectionKind as ReflectionKind,
				kindSymbols: kindSymbols as kindSymbols,
				needsParenthesis: needsParenthesis as needsParenthesis,
				navigationMenu: navigationMenu as treeMenuRoot,
				drawers: AppState.getLocalStorageItem('drawers') || {},
				scrollTop: AppState.getLocalStorageItem('scrollTop') || {},
				options:
					AppState.getLocalStorageItem('options') ||
					AppState.defaultOptions,
			};

			Object.freeze(this.state);
		} catch (err) {
			ErrorHandlers.data(err);
		}
	}

	get reflectionMap() {
		return this.state.reflectionMap;
	}
	get reflectionKind() {
		return this.state.reflectionKind;
	}
	get kindSymbols() {
		return this.state.kindSymbols;
	}
	get needsParenthesis() {
		return this.state.needsParenthesis;
	}
	get navigationMenu() {
		return this.state.navigationMenu;
	}
	get options() {
		return this.state.options;
	}
	get openDrawers() {
		return this.state.drawers;
	}
	get scrollTops() {
		return this.state.scrollTop;
	}
	set openDrawer(id: string) {
		this.state.drawers[id] = 'open';
	}
	set closeDrawer(id: string) {
		delete this.state.drawers[id];
	}
	set showInheritedMembers(state: 'show' | 'hide') {
		this.state.options.showInheritedMembers = state;
		events.dispatch(action.options.showInheritedMembers(state));
	}

	setScrollTop = (id: string, position: number) =>
		(this.state.scrollTop[id] = position);

	getPageData = (fileName: string): Promise<YAFDataObject> =>
		this.state.pageData[fileName]
			? Promise.resolve(<YAFDataObject>this.state.pageData[fileName])
			: AppState.fetchDataFromFile<YAFDataObject>(fileName).then(
					(data) => {
						this.state.pageData[fileName] = data;
						return <YAFDataObject>this.state.pageData[fileName];
					}
			  );

	private flushStateCache = () => {
		(<(keyof yafState)[]>Object.keys(localStorage)).forEach((key) => {
			if (this.state[key]) localStorage.removeItem(key);
		});
		this.initCache().then(() => AppState.saveToLocalStorage(this.state));
	};

	private static defaultDataDir = './frontend/data/';
	private static defaultOptions: yafState['options'] = {
		showInheritedMembers: 'hide',
	};

	private static fetchDataFromFile = async <returnType>(fileName: string) => {
		fileName = fileName.replace(/.JSON$/i, '.json');
		fileName = fileName.endsWith('.json') ? fileName : `${fileName}.json`;

		const filePath = `${AppState.defaultDataDir}${fileName}`;
		const data = await AppState.fetchFile(filePath, 'json');
		return <returnType>data;
	};
	private static fetchFile = (
		filePath: string,
		type: 'json' | 'text'
	): Promise<object | string> =>
		new Promise((resolve, reject) => {
			return fetch(filePath).then((stream) => {
				if (stream.ok) {
					resolve(stream[type]());
				} else {
					reject(new Error(`${stream.statusText}: ${filePath}`));
				}
			});
		});
	private static getLocalStorageItem = (key: localStorageKey) => {
		try {
			const stringData = localStorage.getItem(key);
			const data = stringData ? JSON.parse(stringData) : undefined;

			return data;
		} catch (err) {
			ErrorHandlers.localStorage(key);
		}
	};

	private static saveToLocalStorage = (state: yafState) => {
		localStorage.setItem('drawers', JSON.stringify(state.drawers));
		localStorage.setItem('scrollTop', JSON.stringify(state.scrollTop));
		localStorage.setItem('options', JSON.stringify(state.options));
	};
}

const appState = new AppState();
export default appState;
