/**
 * Overrides the default theme
 * 
 * @module
 */

import { Application, JSX } from "typedoc";
import { YafTheme } from "./themes/YafTheme";

export function load(app: Application) {
    app.renderer.hooks.on(
        'body.end',
        (context): JSX.Element => (<script src={context.relativeURL('./assets/yaf.js')} />)
    );
    app.renderer.defineTheme("yaf", YafTheme);
}