import { JSONOutput } from 'typedoc';
import { YAFDataObject, YAFReflectionLink } from '../types.js';
import { YafElement } from '../YafElement.js';
import { YafMember } from './members/YafMember.js';
import {
	YafMemberGroupLink,
	YafMemberGroupReflection,
} from './members/YafMemberGroups.js';

export * from './members/index.js';
const { yaf } = window;

/**
 *
 */
export class YafContentMembers extends YafElement {
	props!: {
		groups: YAFDataObject['groups'];
		children: YAFDataObject['children'];
	};

	constructor() {
		super(yafContentMembers);
	}

	connectedCallback() {
		if (this.debounce()) return;

		const { groups, children } = this.props;
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
			const member: YafMember = this.makeElement('<yaf-member />');
			member.props = constructor;
			this.appendChild(member);
		} else {
			this.errors.notFound(
				`Could not find reflection id: ${childId} in group ${group.title}`
			);
		}
	};
	makeLinkGroup = (group: JSONOutput.ReflectionGroup) => {
		const linkGroup = this.makeElement<YafMemberGroupLink>(
			'<yaf-member-group-link />'
		);
		const children = group.children
			?.map((id) => {
				const child = yaf.reflectionMap[id];
				!child &&
					this.errors.notFound(
						`Did not find reflectionMap id: ${id}`
					);
				return yaf.reflectionMap[id] ? child : undefined;
			})
			.filter((child) => !!child);

		linkGroup.props = {
			title: group.title,
			children: <YAFReflectionLink[]>children || [],
		};

		this.appendChild(linkGroup);
	};
	makeReflectionGroup = (
		group: JSONOutput.ReflectionGroup,
		children: YAFDataObject[]
	) => {
		const reflectionGroup = this.makeElement<YafMemberGroupReflection>(
			'<yaf-member-group-reflection />'
		);
		const groupChildren = group.children
			?.map((id) => {
				const child = children?.find((child) => child.id === id);
				!child &&
					this.errors.notFound(`Did not find reflection id: ${id}`);
				return child;
			})
			.filter((child) => !!child);
		reflectionGroup.props = {
			title: group.title,
			children: <YAFDataObject[]>groupChildren || [],
		};
		this.appendChild(reflectionGroup);
	};
}

const yafContentMembers = 'yaf-content-members';
customElements.define(yafContentMembers, YafContentMembers);
