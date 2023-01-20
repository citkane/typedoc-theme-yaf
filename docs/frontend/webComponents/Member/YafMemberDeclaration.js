var _a;
import { YafMember, YafMemberGroupReflection, } from './index.js';
import { makeElement } from '../../yafElement.js';
import { YafHTMLElement } from '../../index.js';
import { appState } from '../../handlers/index.js';
/**
 *
 */
export class YafMemberDeclaration extends YafHTMLElement {
    onConnect() {
        var _b, _c;
        const { type, id } = this.props.data;
        const { idPrefix } = this.props;
        const { factory } = YafMemberDeclaration;
        const isReflection = (type === null || type === void 0 ? void 0 : type.type) === 'reflection';
        const isReflectionSignature = isReflection && !!((_b = type.declaration) === null || _b === void 0 ? void 0 : _b.signatures);
        const isReflectionGroup = isReflection && !!((_c = type.declaration) === null || _c === void 0 ? void 0 : _c.groups);
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
}
_a = YafMemberDeclaration;
YafMemberDeclaration.factory = {
    memberGroups: (type, parentId, idPrefix) => {
        var _b;
        if (!type.declaration ||
            !type.declaration.children ||
            !((_b = type.declaration.children) === null || _b === void 0 ? void 0 : _b.length))
            return undefined;
        const { groups, children, id } = type.declaration;
        const serialisedGroups = groups === null || groups === void 0 ? void 0 : groups.map((group) => YafMember.serialiseReflectionGroup(group, children || []));
        return ((serialisedGroups === null || serialisedGroups === void 0 ? void 0 : serialisedGroups.map((group) => {
            const { makeNestedGroupTitle } = _a.factory;
            return makeElement('yaf-member-group-reflection', null, null, {
                title: `${makeNestedGroupTitle(parentId)}:${group.title}`,
                children: group.children,
                pageId: String(id),
                nested: true,
                idPrefix,
            });
        })) || undefined);
    },
    memberSignatures: (member) => {
        const declaration = member.declaration;
        const signatures = declaration
            ? declaration.signatures
            : undefined;
        return makeElement('yaf-member-signatures', null, null, signatures || [member]);
    },
    makeNestedGroupTitle: (id, crumbs = []) => {
        const { makeNestedGroupTitle } = _a.factory;
        const name = appState.reflectionMap[id].name;
        const parent = appState.reflectionMap[id].parentId;
        const hash = appState.reflectionMap[id].hash;
        //if(!hash) return crumbs.join(':');
        crumbs.unshift(name);
        if (parent && hash)
            return makeNestedGroupTitle(parent, crumbs);
        return crumbs.join(':');
    }
};
const yafMemberDeclaration = 'yaf-member-declaration';
customElements.define(yafMemberDeclaration, YafMemberDeclaration);
//# sourceMappingURL=YafMemberDeclaration.js.map