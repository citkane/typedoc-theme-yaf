import { JSONOutput } from 'typedoc';
import { YAFDataObject, YAFReflectionLink } from '../../../types/types.js';
import { debouncer } from '../../../types/frontendTypes.js';
import { YafMember } from '../Member/YafMember.js';
import errorHandlers from '../../lib/ErrorHandlers.js';
import {
	YafMemberGroupLink,
	YafMemberGroupReflection,
} from '../Member/index.js';
import appState from '../../lib/AppState.js';
import yafElement from '../../yafElement.js';
const { debounce, makeElement } = yafElement;

/**
 *
 */
export class YafContentMembers extends HTMLElement {
	props!: YAFDataObject;
	pageId!: string;

	connectedCallback() {
		if (debounce(this as debouncer)) return;

		const { groups, children, id, kind } = this.props;
		this.pageId = String(id);

		const isLinkList = this.linkReferencPageTypes.includes(kind);
		const constructorGroup = groups?.find(
			(group) => group.title === 'Constructors'
		);
		const hasConstructor =
			constructorGroup && constructorGroup.children?.length;

		const HTMLElements = [
			hasConstructor
				? this.factory.constructorElement(
						constructorGroup,
						children || []
				  )
				: undefined,
			groups
				?.sort((a, b) => a.title.localeCompare(b.title))
				.map((group) => {
					const isConstructorGroup =
						group.title === 'Constructors' &&
						group.children &&
						group.children.length === 1;

					if (isConstructorGroup) return undefined;
					if (isLinkList)
						return this.factory.linkGroup(group, children || []);
					return this.factory.reflectionGroup(group, children || []);
				}),
		];

		HTMLElements.flat()
			.filter((element) => !!element)
			.forEach((element) => this.appendChild(element!));
	}

	private factory = {
		/**
		 * Returns a HTMLElement for the consructor member
		 * @param constructorGroup
		 * @param children
		 * @returns
		 */
		constructorElement: (
			constructorGroup: JSONOutput.ReflectionGroup,
			children: YAFDataObject[]
		) => {
			const childId = constructorGroup.children![0];
			const constructor = children.find((child) => child.id === childId);
			if (constructor) {
				const HTMLElement = makeElement<YafMember, YafMember['props']>(
					'yaf-member',
					null,
					null,
					constructor
				);
				HTMLElement.id = 'constructor';
				return HTMLElement;
			} else {
				errorHandlers.notFound(
					`Could not find reflection id: ${childId} in group ${constructorGroup.title}`
				);
			}
		},
		linkGroup: (
			group: JSONOutput.ReflectionGroup,
			children: YAFDataObject[]
		) => {
			const linkChildren = group.children
				?.map((id) => {
					const child =
						children.find((child) => child.id === id) ||
						appState.reflectionMap[id];
					child.id = String(id);
					!child &&
						errorHandlers.notFound(
							`Did not find reflectionMap id: ${id}`
						);
					return appState.reflectionMap[id] ? child : undefined;
				})
				.filter((child) => !!child);

			return makeElement<YafMemberGroupLink, YafMemberGroupLink['props']>(
				'yaf-member-group-link',
				null,
				null,
				{
					title: group.title,
					children: <YAFReflectionLink[]>linkChildren || [],
				}
			);
		},
		reflectionGroup: (
			group: JSONOutput.ReflectionGroup,
			children: YAFDataObject[]
		) => {
			const groupChildren = YafMemberGroupReflection.mapReflectionGroup(
				group,
				children
			);

			return makeElement<
				YafMemberGroupReflection,
				YafMemberGroupReflection['props']
			>('yaf-member-group-reflection', null, null, {
				title: group.title,
				children: <YAFDataObject[]>groupChildren || [],
				pageId: this.pageId,
			});
		},
	};
	private linkReferencPageTypes = (<(keyof typeof appState.reflectionKind)[]>[
		'Namespace',
		'Project',
	]).map((kindString) => appState.reflectionKind[kindString]);
}

const yafContentMembers = 'yaf-content-members';
customElements.define(yafContentMembers, YafContentMembers);
