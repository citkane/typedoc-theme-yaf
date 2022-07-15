import { DefaultThemeRenderContext, PageEvent, Reflection, JSX, DeclarationReflection, ProjectReflection } from "typedoc";

type menuNode = {
	[key: string]: {
		'name': string,
		'url': string,
		'children': menuNode
	}
};


export const navigation = (context: DefaultThemeRenderContext) => (props: PageEvent<Reflection>) => {
	return (<>
		{context.primaryNavigation(props)}
	</>);
}

function buildNavTree(menuNode: any, reflection: DeclarationReflection | ProjectReflection, context: DefaultThemeRenderContext): menuNode {
	if(reflection.isProject()) {
		reflection.children?.forEach(child => buildNavTree(menuNode, child, context));
	} else {
		menuNode[reflection.id] = {
			name: reflection.name,
			url: context.urlTo(reflection),
			children: {}
		}
		reflection.children?.forEach(child => {
			buildNavTree(menuNode[reflection.id].children, child, context)
		});
	}
	return menuNode
}
function renderNavTree(menu: menuNode, depth: number) {
	if (!Object.keys(menu).length) return null;
	const keys = Object.keys(menu)
	return <ul class={depth === 0? 'root' : ''}>{
		keys.map((key: string, i) => {
			const item = menu[key];
			const childLen = Object.keys(menu[key].children).length;
			let classes = '';
			if (i===0) classes += 'first';
			if(i===keys.length-1) classes += ' last';
			if(childLen > 0) classes+= ' parent';
			return (
				<li class={classes}>
					<a	id={key} href={ item.url }
						data-depth={depth}
						data-count={i}
						data-children={childLen}
					>{item.name}</a>
					{renderNavTree(item.children, depth + 1)}
				</li>
			)
		})
	}
	</ul>
}
export const primaryNavigation = (context: DefaultThemeRenderContext) => (props: PageEvent<Reflection>) => {
	const navTree = buildNavTree({}, props.project, context);
	return <nav id='yaf-nav-primary'>{renderNavTree(navTree, 0)}</nav>
}