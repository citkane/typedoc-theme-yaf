import { componentName } from '../../types/frontendTypes.js';
import yafElement from '../yafElement.js';
import appState from '../lib/AppState.js';

/**
 * The highest level component of the theme, whereunder all other components reside
 */
export class TypedocThemeYaf extends HTMLElement {
	connectedCallback() {
		/*
			this.body.addEventListener(
				trigger.fetch.reflectionById,
				this.reflectionById as EventListener
			);
			this.body.addEventListener(
				trigger.get.reflectionLinkById,
				this.reflectionLinkById as EventListener
			);
			*/

		appState
			.initCache()
			.then(() =>
				this.appendChild(yafElement.getHtmlTemplate(typedocThemeYaf))
			);

		//events.on(trigger.fetch.reflectionById, this.reflectionById);
		//events.on(trigger.get.reflectionLinkById, this.reflectionLinkById);
	}
	/**
	 * - removes the `reflectionById` listener from the DOM `body`
	 */
	disconnectedCallback() {
		//events.off(trigger.fetch.reflectionById, this.reflectionById);
		//events.off(trigger.get.reflectionLinkById, this.reflectionLinkById);
		/*
		this.body.removeEventListener(
			trigger.fetch.reflectionById,
			this.reflectionById as EventListener
		);

		this.body.removeEventListener(
			trigger.get.reflectionLinkById,
			this.reflectionLinkById as EventListener
		);
		*/
	}

	/**
	 * An event handler that fetches reflection data by id and returns
	 * it to the event callback function.
	 *
	 * Listens on the DOM Body
	 *
	 * @param e
	 *
	 * @event
	 * @remarks
	 * This is a blocktag
	 */

	/*
	reflectionById = (e: CustomEvent) => {
		const { id, callBack } = e.detail;
		console.error(id);
		const { fileName, level } = window.yaf.reflectionMap[id];
		appState
			.getData<YAFDataObject>(fileName)
			.then((reflection) => {
				callBack(
					level
						? (reflection.children?.find(
								(child) => child.id === id
						  ) as YAFDataObject)
						: reflection
				);
			})
			.catch(this.errorHandlers.data);
	};

	reflectionLinkById = (e: CustomEvent) => {
		const { callBack, id } = e.detail;
		callBack(id);
	};
	*/
}
const typedocThemeYaf: componentName = 'typedoc-theme-yaf';
customElements.define(typedocThemeYaf, TypedocThemeYaf);
