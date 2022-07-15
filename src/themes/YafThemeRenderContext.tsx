import { DefaultTheme, DefaultThemeRenderContext, Options } from "typedoc";
import { yafLayout } from "../layouts/yaf";
import { navigation, primaryNavigation } from "../partials/navigation";
import { menuHeader } from '../partials/menuHeader';

export class YafThemeRenderContext extends DefaultThemeRenderContext {
	menuHeader
	constructor(theme: DefaultTheme, options: Options) {
		super(theme, options);
		this.defaultLayout = yafLayout(this);
		this.navigation = navigation(this);
		this.primaryNavigation = primaryNavigation(this);
		this.menuHeader = menuHeader(this);
	}
}