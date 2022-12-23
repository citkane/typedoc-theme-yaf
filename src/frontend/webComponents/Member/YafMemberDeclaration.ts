import {
	YAFDataObject,
	YafDeclarationReflection,
	YafSignatureReflection,
} from '../../../types/types';
import {
	YafMember,
	YafMemberGroupReflection,
	YafMemberSignatures,
} from './index.js';
import { componentName } from '../../../types/frontendTypes';
import { JSONOutput } from 'typedoc';
import { makeElement } from '../../yafElement.js';
import { YafHTMLElement } from '../../index.js';

/**
 *
 */
export class YafMemberDeclaration extends YafHTMLElement<YafDeclarationReflection> {
	onConnect() {
		const { name, type } = this.props;
		const { factory } = YafMemberDeclaration;
		const isReflection = type?.type === 'reflection';
		const isReflectionSignature =
			isReflection && !!type.declaration?.signatures;
		const isReflectionGroup = isReflection && !!type.declaration?.groups;

		const HTMLElements = [
			!isReflectionSignature
				? factory.memberSignatures(this.props)
				: undefined,
			isReflectionGroup ? factory.memberGroups(type, name) : undefined,
			isReflectionSignature ? factory.memberSignatures(type) : undefined,
		]
			.filter((element) => !!element)
			.flat();

		this.appendChildren(HTMLElements);

		/**
		 * NOTE: Calls `renderDrawers()` from the root of the drawer tree only.
		 */
		(HTMLElements as unknown as YafMemberGroupReflection[]).forEach(
			(element) => {
				if (element?.drawers) element.drawers.renderDrawers(true);
			}
		);
	}

	private static factory = {
		memberGroups: (type: JSONOutput.ReflectionType, parentName: string) => {
			if (
				!type.declaration ||
				!type.declaration.children ||
				!type.declaration.children?.length
			)
				return undefined;

			const { groups, children, id } = type.declaration;
			const serialisedGroups = groups?.map((group) =>
				YafMember.serialiseReflectionGroup(
					group,
					(children as YAFDataObject[]) || []
				)
			);
			return (
				serialisedGroups?.map((group) => {
					return makeElement<
						YafMemberGroupReflection,
						YafMemberGroupReflection['props']
					>('yaf-member-group-reflection', null, null, {
						title: `${parentName}: ${group.title}`,
						children: group.children,
						pageId: String(id),
						nested: true,
					});
				}) || undefined
			);
		},
		memberSignatures: (
			member: JSONOutput.ReflectionType | YafDeclarationReflection
		) => {
			const declaration = (<JSONOutput.ReflectionType>member).declaration;
			const signatures = declaration
				? (declaration.signatures as YafSignatureReflection[])
				: undefined;

			return makeElement<
				YafMemberSignatures,
				YafMemberSignatures['props']
			>(
				'yaf-member-signatures',
				null,
				null,
				signatures || [member as YafDeclarationReflection]
			);
		},
	};
}
const yafMemberDeclaration: componentName = 'yaf-member-declaration';
customElements.define(yafMemberDeclaration, YafMemberDeclaration);
