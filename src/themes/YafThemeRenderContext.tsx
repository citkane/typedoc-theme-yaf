import { DefaultTheme, DefaultThemeRenderContext, Options } from "typedoc";
import { defaultLayout } from "../layouts/default";
import { navigation, primaryNavigation } from "../partials/navigation";

export class YafThemeRenderContext extends DefaultThemeRenderContext {
	constructor(theme: DefaultTheme, options: Options) {
		super(theme, options);
		this.defaultLayout = defaultLayout(this);
		this.navigation = navigation(this);
		this.primaryNavigation = primaryNavigation(this);
	}
}