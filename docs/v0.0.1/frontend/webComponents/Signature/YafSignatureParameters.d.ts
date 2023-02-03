import { YafParameterReflection } from '../../../types/types.js';
import { YafHTMLElement } from '../../index.js';
export declare class YafSignatureParameters extends YafHTMLElement<YafParameterReflection[] | undefined> {
    onConnect(): void;
    makeFlags: (parameter: YafParameterReflection) => HTMLElement & import("../../../types/frontendTypes.js").yafHTMLExtension;
    makeName: (parameter: YafParameterReflection) => HTMLElement & import("../../../types/frontendTypes.js").yafHTMLExtension;
    makeType: (parameter: YafParameterReflection) => HTMLElement & import("../../../types/frontendTypes.js").yafHTMLExtension;
    makeDefault: (parameter: YafParameterReflection) => HTMLElement & import("../../../types/frontendTypes.js").yafHTMLExtension;
    makeComment: (parameter: YafParameterReflection) => HTMLElement & import("../../../types/frontendTypes.js").yafHTMLExtension;
}
