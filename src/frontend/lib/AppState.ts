import {
	drawerState,
	localStorageKey,
	drawersState,
	reflectionMap,
	ReflectionKind,
	kindSymbols,
	treeMenuRoot,
	YAFDataObject,
	yafState,
	drawers,
} from '../../types/types.js';
import { errorHandlers } from './errors.js';
import { fetchFile } from './utils.js';

const defaultDataDir = './frontend/data/';
const defaultDrawerState: drawersState = { drawers: {}, scrollTop: 0 };

/**
 * **Initialises the frontend state.**
 *
 */
class AppState {
	state = <yafState>{};
	async init() {
		const Promises = [
			this.getData('yafReflectionMap'),
			this.getData('yafReflectionKind'),
			this.getData('yafKindSymbols'),
			this.getData('yafNavigationMenu'),
		];
		try {
			const [reflectionMap, relectionKind, kindSymbols, navigationMenu] =
				await Promise.all(Promises);

			this.state = {
				reflectionMap: <reflectionMap>reflectionMap,
				reflectionKind: <ReflectionKind>relectionKind,
				kindSymbols: <kindSymbols>kindSymbols,
				navigationMenu: <treeMenuRoot>navigationMenu,
				pageDataCache: {},
				drawers: {
					content: this.getDrawerStates(
						'content'
					) as drawers['content'],
					menu: this.getDrawerStates('menu') as drawersState,
				},
			};
			Object.freeze(this.state);

			window.addEventListener('beforeunload', () => {
				localStorage.setItem(
					'menu',
					JSON.stringify(this.state.drawers.menu)
				);
				localStorage.setItem(
					'content',
					JSON.stringify(this.state.drawers.content)
				);
			});
		} catch (err) {
			errorHandlers.data(err);
			return;
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
	get navigationMenu() {
		return this.state.navigationMenu;
	}
	get pageDataCache() {
		return (fileName: string): Promise<YAFDataObject> =>
			this.state.pageDataCache[fileName]
				? Promise.resolve(
						<YAFDataObject>this.state.pageDataCache[fileName]
				  )
				: this.getData<YAFDataObject>(fileName).then((data) => {
						this.state.pageDataCache[fileName] = data;
						return <YAFDataObject>(
							this.state.pageDataCache[fileName]
						);
				  });
	}
	get drawers() {
		const { content, menu } = this.state.drawers;
		return {
			menu: (id: string) => menu.drawers[id] || 'closed',
			menuTop: () => menu.scrollTop,
			content: (pageId: string, drawerId: string) => {
				if (!content[pageId]) return 'closed';
				return content[pageId].drawers[drawerId] || 'closed';
			},
			contentTop: (pageId: string) => {
				if (!content[pageId]) return 0;
				return content[pageId].scrollTop;
			},
		};
	}
	get setDrawers() {
		return {
			menu: this.setMenuDrawer,
			menuTop: this.setMenuTop,
			content: this.setContentDrawer,
			contentTop: this.setContentTop,
		};
	}

	private setMenuDrawer = (drawerId: string, drawerState: drawerState) =>
		(this.state.drawers.menu.drawers[drawerId] = drawerState);
	private setMenuTop = (scrollTop: number) =>
		(this.state.drawers.menu.scrollTop = scrollTop);
	private setContentDrawer = (
		pageId: string,
		drawerId: string,
		drawerState: drawerState
	) => {
		const { content } = this.state.drawers;
		if (!content[pageId]) content[pageId] = defaultDrawerState;
		content[pageId].drawers[drawerId] = drawerState;
	};
	private setContentTop = (pageId: string, scrollTop: number) => {
		const { content } = this.state.drawers;
		if (!content[pageId]) content[pageId] = defaultDrawerState;
		content[pageId].scrollTop = scrollTop;
	};

	/**
	 * Fetches a .json data file
	 * @param fileName
	 * @returns reflection data
	 */
	private getData = async <returnType>(fileName: string) => {
		fileName = fileName.replace(/.JSON$/i, '.json');
		fileName = fileName.endsWith('.json') ? fileName : `${fileName}.json`;

		const filePath = `${defaultDataDir}${fileName}`;
		const data = await fetchFile(filePath, 'json');
		return <returnType>data;
	};

	/**
	 * Retrieves the given state key from localstorage and audits the key structure for corruption.\
	 * The audit is needed if state structure changes between releases to flush the storage client side.
	 *
	 * @param key The localstorage key
	 * @returns Uncorrupted data or throws an error.
	 */
	private getDrawerStates = (key: localStorageKey) => {
		try {
			const stringData = localStorage.getItem(key);
			const data = stringData ? JSON.parse(stringData) : undefined;

			switch (key) {
				case 'menu':
					return data
						? this.auditDrawerData(data)
						: defaultDrawerState;
					break;
				case 'content':
					if (data) {
						Object.keys(data).forEach((id) => {
							data[id] = this.auditDrawerData(data[id]);
						});
					} else {
						return {};
					}
					return data;
					break;
			}
		} catch (err) {
			errorHandlers.localStorage(key);
		}
	};

	/**
	 * Audits the state data key structure for corruption.
	 * @param data
	 * @returns Uncorrupted data or throws an error.
	 */
	private auditDrawerData = (data: drawersState | drawers['content']) => {
		const dataKeys = Object.keys(data);
		const storeKeys = Object.keys(defaultDrawerState);

		if (
			!(
				dataKeys.length === storeKeys.length &&
				dataKeys.every((el) => storeKeys.includes(el))
			)
		)
			throw Error();

		return data;
	};
}

const appState = new AppState();
export default appState;
