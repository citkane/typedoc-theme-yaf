import { JSONOutput } from 'typedoc';
import { YAFDataObject, YAFReflectionLink } from '../../types/types.js';
import appState from '../lib/AppState.js';
import yafElement from '../YafElement.js';
import { YafMember } from './members/YafMember.js';
import {
	YafMemberGroupLink,
	YafMemberGroupReflection,
} from './members/YafMemberGroups.js';
import errorHandlers from '../lib/ErrorHandlers.js';

export * from './members/index.js';

/**
 *
 */
export class YafContentMembers extends HTMLElement {
	props!: {
		groups: YAFDataObject['groups'];
		children: YAFDataObject['children'];
		pageId: string;
	};

	connectedCallback() {
		if (yafElement.debounce(this as Record<string, unknown>)) return;

		const { groups, children } = this.props;

		console.log(groups);

		const isLinkList = children && children.length ? false : true;
		const constructor = groups?.find(
			(group) => group.title === 'Constructors'
		);

		/* There should only ever be one constructor, so it does not need a group header
		 */
		if (constructor && constructor.children?.length) {
			this.makeConstructor(
				constructor.children[0],
				constructor,
				children || []
			);
		}

		groups
			?.sort((a, b) => a.title.localeCompare(b.title))
			.forEach((group) => {
				if (
					group.title === 'Constructors' &&
					group.children &&
					group.children.length === 1
				) {
					return;
				} else if (isLinkList) {
					/* This is a group of links to reflection pages, ie. a summary page
					 */
					this.makeLinkGroup(group);
				} else {
					/* This is a reflection page with reflections rolled up into groups
					 */
					this.makeReflectionGroup(group, children || []);
				}
			});
	}
	makeConstructor = (
		childId: number,
		group: JSONOutput.ReflectionGroup,
		children: YAFDataObject[]
	) => {
		const constructor = children.find((child) => child.id === childId);
		if (constructor) {
			const member = yafElement.makeElement<
				YafMember,
				YafMember['props']
			>('yaf-member', null, null, constructor);
			member.id = 'constructor';
			this.appendChild(member);
		} else {
			errorHandlers.notFound(
				`Could not find reflection id: ${childId} in group ${group.title}`
			);
		}
	};
	makeLinkGroup = (group: JSONOutput.ReflectionGroup) => {
		const children = group.children
			?.map((id) => {
				const child = appState.reflectionMap[id];
				!child &&
					errorHandlers.notFound(
						`Did not find reflectionMap id: ${id}`
					);
				return appState.reflectionMap[id] ? child : undefined;
			})
			.filter((child) => !!child);

		const linkGroup = yafElement.makeElement<
			YafMemberGroupLink,
			YafMemberGroupLink['props']
		>('yaf-member-group-link', null, null, {
			title: group.title,
			children: <YAFReflectionLink[]>children || [],
		});

		this.appendChild(linkGroup);
	};
	makeReflectionGroup = (
		group: JSONOutput.ReflectionGroup,
		children: YAFDataObject[]
	) => {
		const groupChildren = group.children
			?.map((id) => {
				const child = children?.find((child) => child.id === id);
				!child &&
					errorHandlers.notFound(`Did not find reflection id: ${id}`);
				return child;
			})
			.filter((child) => !!child);

		const reflectionGroup = yafElement.makeElement<
			YafMemberGroupReflection,
			YafMemberGroupReflection['props']
		>('yaf-member-group-reflection', null, null, {
			title: group.title,
			children: <YAFDataObject[]>groupChildren || [],
			pageId: this.props.pageId,
		});
		this.appendChild(reflectionGroup);
	};
}

const yafContentMembers = 'yaf-content-members';
customElements.define(yafContentMembers, YafContentMembers);
