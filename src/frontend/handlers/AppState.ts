import {
	localStorageKey,
	ReflectionKind,
	yafDisplayOptions,
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
		const { deepFreeze } = AppState;
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
				reflectionMap: deepFreeze<reflectionMap>(reflectionMap),
				reflectionKind: deepFreeze<ReflectionKind>(relectionKind),
				kindSymbols: deepFreeze<kindSymbols>(kindSymbols),
				needsParenthesis:
					deepFreeze<needsParenthesis>(needsParenthesis),
				navigationMenu: deepFreeze<treeMenuRoot>(navigationMenu),
				drawers: AppState.getLocalStorageItem('drawers') || {},
				scrollTop: AppState.getLocalStorageItem('scrollTop') || {},
				options: {
					display:
						AppState.getLocalStorageItem('displayOptions') ||
						AppState.defaultOptions.display,
				},
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
	get callTypes() {
		return [
			this.reflectionKind.CallSignature,
			this.reflectionKind.ConstructorSignature,
			this.reflectionKind.Function,
			this.reflectionKind.FunctionOrMethod,
			this.reflectionKind.GetSignature,
			this.reflectionKind.Method,
			this.reflectionKind.SetSignature,
		];
	}
	get projectName() {
		return this.reflectionMap['project']?.name;
	}

	toggleDisplayOption = (flag: yafDisplayOptions) => {
		const displayState = this.options.display[flag];
		const newDisplayState = displayState === 'show' ? 'hide' : 'show';
		this.state.options.display[flag] = newDisplayState;

		return newDisplayState;
	};
	setScrollTop = (id: string, position: number) =>
		(this.state.scrollTop[id] = position);

	getPageData = (fileName: string): Promise<YAFDataObject> =>
		this.state.pageData[fileName]
			? Promise.resolve(<YAFDataObject>this.state.pageData[fileName])
			: AppState.fetchDataFromFile<YAFDataObject>(fileName).then(
					(data) => {
						this.state.pageData[fileName] =
							AppState.deepFreeze(data);
						return <YAFDataObject>this.state.pageData[fileName];
					}
			  );
	getBreadcrumb = (id: number, crumbArray: number[] = []): number[] => {
		crumbArray.unshift(id);
		const link = this.reflectionMap[id];
		if (link.parentId) return this.getBreadcrumb(link.parentId, crumbArray);
		return crumbArray;
	};
	private flushStateCache = () => {
		localStorage.clear();
		this.initCache().then(() => AppState.saveToLocalStorage(this.state));
	};

	private static defaultDataDir = './frontend/data/';
	private static defaultOptions: yafState['options'] = {
		display: {
			inherited: 'hide',
			private: 'hide',
		},
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
		localStorage.setItem(
			'displayOptions',
			JSON.stringify(state.options.display)
		);
	};

	private static deepFreeze = <T>(property: unknown): T => {
		if (!property || typeof property !== 'object') return property as T;
		if (!Object.isFrozen(property)) Object.freeze(property);
		if (Array.isArray(property)) {
			property.forEach((child) => this.deepFreeze(child));
		} else {
			Object.values(property).forEach((child) => this.deepFreeze(child));
		}
		return property as T;
	};
}

const appState = new AppState();
export default appState;
