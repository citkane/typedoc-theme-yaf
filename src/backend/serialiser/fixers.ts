import {
	DeclarationReflection,
	JSONOutput,
	ReflectionKind,
	ReflectionType,
} from 'typedoc';

import { serialiserReflection } from '../../types/backendTypes';
import { YAFDataObject, YafDeclarationReflection } from '../../types/types';
import { YafSerialiser } from './YafSerialiser';

export const fixDeclarationSignatures = (
	object: YAFDataObject,
	reflection: serialiserReflection,
	yafSerializer: YafSerialiser
) => {
	const { signatures: objectSignatures } = object;

	if (!objectSignatures) return undefined;

	const fixedSignatures = objectSignatures?.map((objectSignature) => {
		const reflectionSignature = reflection.signatures?.find(
			(reflectionSignature) =>
				reflectionSignature.id == objectSignature.id
		);
		objectSignature.flags = YafSerialiser.extendDefaultFlags(
			objectSignature as YAFDataObject
		);

		objectSignature = yafSerializer.parseReflectionToYafDataObject(
			objectSignature as YAFDataObject,
			reflectionSignature,
			object.location.hash,
			reflection
		);
		return objectSignature;
	});

	return fixedSignatures;
};
export const mutateFixDeclarationReflections = (
	object: YafDeclarationReflection,
	reflection: serialiserReflection,
	yafSerializer: YafSerialiser,
	rootReflection?: serialiserReflection
) => {
	const reflectionDeclaration =
		reflection.type instanceof ReflectionType
			? reflection.type.declaration
			: undefined;
	if (!reflectionDeclaration) return;

	const objectDeclaration = object.type.declaration as YAFDataObject;
	objectDeclaration.location = object.location;
	objectDeclaration.name = reflection.name;

	objectDeclaration.signatures = fixDeclarationSignatures(
		objectDeclaration as YAFDataObject,
		reflectionDeclaration,
		yafSerializer
	);

	objectDeclaration.children = objectDeclaration.children?.map(
		(objectChild, i) => {
			return yafSerializer.parseReflectionToYafDataObject(
				objectChild as YAFDataObject,
				reflectionDeclaration.children[i],
				object.location.hash,
				rootReflection || reflection
			);
		}
	);
};

export const mutateFixReflectionGroups = (object: YAFDataObject) => {
	if (
		!object.type ||
		!('declaration' in object.type) ||
		!object.type.declaration.groups
	)
		return;
	const groups = object.type.declaration.groups;
	const children = object.type.declaration.children;

	const propertyGroup = groups.find((group) => group.title === 'Properties');
	let methodGroup = groups.find((group) => group.title === 'Methods');
	const getMethodGroup = () => {
		if (methodGroup) return methodGroup;
		methodGroup = {
			title: 'Methods',
			children: [],
		} as JSONOutput.ReflectionGroup;
		groups.push(methodGroup);
		return methodGroup;
	};

	if (propertyGroup)
		propertyGroup.children = propertyGroup.children?.filter((id) => {
			const child = children?.find((child) => child.id === id);
			if (child && child.kind === ReflectionKind.CallSignature) {
				methodGroup = getMethodGroup();
				methodGroup.children?.push(id);
				return false;
			}
			return true;
		});
	object.type.declaration.groups = groups.filter(
		(group) => group.children?.length
	);
};
export const fixedReflectionChild = (
	child: serialiserReflection,
	parent: serialiserReflection
) => {
	const childClone = new DeclarationReflection(
		child.name,
		getCallSignatureKind(child),
		parent
	);
	Object.keys(child).forEach((key) => {
		if (['name', 'kind', 'parent', 'kindString'].includes(key)) return;

		if (Object.prototype.hasOwnProperty.call(child, key))
			childClone[key] = child[key];
	});
	childClone.kindString = getKindString(childClone.kind);
	return childClone;
};

const getCallSignatureKind = (reflection: serialiserReflection) => {
	const type = reflection.type as ReflectionType;
	const signatures = type?.declaration?.signatures;

	if (!signatures || signatures.length !== 1) return reflection.kind;
	return signatures[0].kind;
};

const getKindString = (kind: ReflectionKind) => {
	let str = ReflectionKind[kind];
	str = str.replace(/(.)([A-Z])/g, (_m, a, b) => a + ' ' + b.toLowerCase());
	return str;
};
