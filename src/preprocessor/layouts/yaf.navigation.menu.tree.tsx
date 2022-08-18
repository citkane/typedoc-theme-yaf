import { PageEvent, Reflection, JSX, DeclarationReflection, ProjectReflection } from "typedoc";
import { treeMenuBranch } from "../../types";
import { YafThemeRenderContext } from "../YafThemeRenderContext";

function buildNavTree(menuNode: any, reflection: DeclarationReflection | ProjectReflection, context: YafThemeRenderContext): treeMenuBranch {
	if(reflection.isProject()) {
		reflection.children?.forEach(child => buildNavTree(menuNode, child, context))

	} else {
		menuNode[reflection.id] = {
			name: reflection.name,
			url: `?fragment=${reflection.url}`,
			children: {}
		}
		reflection.children?.forEach(child => {
			buildNavTree(menuNode[reflection.id].children, child, context);
		});
	}
	return menuNode
	
}

export const navigationMenuTree = (context: YafThemeRenderContext, props: PageEvent<Reflection>) => {
	const navTree = buildNavTree({}, props.project, context);
	context.browserDataCache.setCacheItem('yaf.navigation.menu.tree', navTree);
	return <JSX.Raw html={`<yaf-navigation-menu-tree />`} />
}