/**
 * Overrides the default theme
 * 
 * @module
 */

import { Application } from "typedoc";
import { YafTheme } from "./preprocessor/YafTheme";

export function load(app: Application) {
    app.renderer.defineTheme("yaf", YafTheme);
}
