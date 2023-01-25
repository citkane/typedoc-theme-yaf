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
import { appState } from '../../handlers/index.js';

/**
 *
 */
export class YafMemberDeclaration extends YafHTMLElement<{
	data: YafDeclarationReflection;
	idPrefix: string;
}> {
	onConnect() {
		const { type, id } = this.props.data;
		const { idPrefix } = this.props;
		const { factory } = YafMemberDeclaration;
		const isReflection = type?.type === 'reflection';
		const isReflectionSignature =
			isReflection && !!type.declaration?.signatures;
		const isReflectionGroup = isReflection && !!type.declaration?.groups;

		const HTMLElements = [
			!isReflectionSignature
				? factory.memberSignatures(this.props.data)
				: undefined,
			isReflectionGroup
				? factory.memberGroups(type, id, idPrefix)
				: undefined,
			isReflectionSignature ? factory.memberSignatures(type) : undefined,
		]
			.filter((element) => !!element)
			.flat();

		this.appendChildren(HTMLElements);

		YafMemberGroupReflection.renderDrawersFromRoot(this);
	}

	private static factory = {
		memberGroups: (
			type: JSONOutput.ReflectionType,
			parentId: number,
			idPrefix: string | undefined
		) => {
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
						title: group.title,
						children: group.children,
						pageId: String(id),
						nested: true,
						idPrefix,
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
