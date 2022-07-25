/**
 * Overrides the default theme
 * 
 * @module
 */

import { Application, JSX } from "typedoc";
import { YafTheme } from "./themes/YafTheme";

export function load(app: Application) {
    app.renderer.defineTheme("yaf", YafTheme);
}
