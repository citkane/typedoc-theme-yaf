import { JSONOutput } from 'typedoc';
import { YAFDataObject } from '../../../types/types.js';
import { YafMember } from '../Member/YafMember.js';
import errorHandlers from '../../handlers/ErrorHandlers.js';
import {
	YafMemberGroupLink,
	YafMemberGroupReflection,
} from '../Member/index.js';
import appState from '../../handlers/AppState.js';
import { makeElement } from '../../yafElement.js';
import { YafHTMLElement } from '../../index.js';

/**
 *
 */
export class YafContentMembers extends YafHTMLElement<YAFDataObject> {
	pageId!: string;

	onConnect() {
		const { groups, children, id, kind } = this.props;
		this.pageId = String(id);

		const isLinkList = this.linkReferencPageTypes.includes(kind);
		const constructorGroup = groups?.find(
			(group) => group.title === 'Constructors'
		);
		const hasConstructor =
			constructorGroup && constructorGroup.children?.length === 1;

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
						group.title === 'Constructors' && hasConstructor;

					if (isConstructorGroup || !group.children?.length)
						return undefined;

					return isLinkList
						? this.factory.linkGroup(group, children || [])
						: this.factory.reflectionGroup(group, children || []);
				}),
		].flat();

		this.appendChildren(HTMLElements);
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
			const serialisedChildren = YafMember.serialiseLinkGroup(
				group,
				children
			);

			return makeElement<YafMemberGroupLink, YafMemberGroupLink['props']>(
				'yaf-member-group-link',
				null,
				null,
				{
					title: group.title,
					children: serialisedChildren,
				}
			);
		},
		reflectionGroup: (
			group: JSONOutput.ReflectionGroup,
			children: YAFDataObject[]
		) => {
			const serialisedGroup = YafMember.serialiseReflectionGroup(
				group,
				children
			);

			return makeElement<
				YafMemberGroupReflection,
				YafMemberGroupReflection['props']
			>('yaf-member-group-reflection', null, null, {
				title: group.title,
				children: serialisedGroup.children,
				pageId: this.pageId,
			});
		},
	};
	private linkReferencPageTypes = (<(keyof typeof appState.reflectionKind)[]>[
		'Namespace',
		'Module',
		'Project',
	]).map((kindString) => appState.reflectionKind[kindString]);
}

const yafContentMembers = 'yaf-content-members';
customElements.define(yafContentMembers, YafContentMembers);
