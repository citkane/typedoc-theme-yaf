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
		<h2>{props.project.name}</h2>
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

	//const modules = props.project.getChildrenByKind(ReflectionKind.Project);
	
	return <nav id='yaf-nav-primary'>{renderNavTree(navTree, 0)}</nav>
	
	/*
	const [ext, int] = partition(modules, (m) => m.flags.isExternal);

	const selected = props.model.isProject();
	const current = selected || int.some((mod) => inPath(mod, props.model));

	return (
		<nav class="tsd-navigation primary">
			<details class="tsd-index-accordion" open={true}>
				<summary class="tsd-accordion-summary">
					<h3>{context.icons.chevronDown()} Modules</h3>
				</summary>
				<div class="tsd-accordion-details">
					<ul>
						<li class={classNames({ current, selected })}>
							<a href={context.urlTo(props.model.project)}>{wbr(props.project.name)}</a>
							<ul>{int.map(link)}</ul>
						</li>
						{ext.map(link)}
					</ul>
				</div>
			</details>
		</nav>
	);
	*/
}
/*
export function navigation(context: DefaultThemeRenderContext, props: PageEvent<Reflection>) {

	
	
	return (
		<>
		    
			{context.primaryNavigation(props)}
			{context.secondaryNavigation(props)}
			{context.settings()}
		</>
	);

}

/*
function buildFilterItem(context: DefaultThemeRenderContext, name: string, displayName: string, defaultValue: boolean) {
	return (
		<li class="tsd-filter-item">
			<label class="tsd-filter-input">
				<input type="checkbox" id={`tsd-filter-${name}`} name={name} checked={defaultValue} />
				{context.icons.checkbox()}
				<span>{displayName}</span>
			</label>
		</li>
	);
}
*/
/*
	function link(mod: DeclarationReflection) {
		const current = inPath(mod, props.model);
		const selected = mod.name === props.model.name;
		let childNav: JSX.Element | undefined;
		const childModules = mod.children?.filter((m) => m.kindOf(ReflectionKind.SomeModule));
		if (childModules?.length) {
			childNav = <ul>{childModules.map(link)}</ul>;
		}

		return (
			<li class={classNames({ current, selected, deprecated: mod.isDeprecated() }, mod.cssClasses)}>
				<a href={context.urlTo(mod)}>
					{wbr(`${mod.name}${mod.version !== undefined ? ` - v${mod.version}` : ""}`)}
				</a>
				{childNav}
			</li>
		);
	}
}

export function secondaryNavigation(context: DefaultThemeRenderContext, props: PageEvent<Reflection>) {
	// Multiple entry points, and on main project page.
	if (props.model.isProject() && props.model.getChildrenByKind(ReflectionKind.Module).length) {
		return;
	}

	const effectivePageParent =
		(props.model instanceof ContainerReflection && props.model.children?.length) || props.model.isProject()
			? props.model
			: props.model.parent!;

	const children = (effectivePageParent as ContainerReflection).children || [];

	const pageNavigation = children
		.filter((child) => !child.kindOf(ReflectionKind.SomeModule))
		.map((child) => {
			return (
				<li
					class={classNames(
						{ deprecated: child.isDeprecated(), current: props.model === child },
						child.cssClasses
					)}
				>
					<a href={context.urlTo(child)} class="tsd-index-link">
						{context.icons[child.kind]()}
						{wbr(child.name)}
					</a>
				</li>
			);
		});

	if (effectivePageParent.kindOf(ReflectionKind.SomeModule | ReflectionKind.Project)) {
		return (
			<nav class="tsd-navigation secondary menu-sticky">
				{!!pageNavigation.length && <ul>{pageNavigation}</ul>}
			</nav>
		);
	}

	return (
		<nav class="tsd-navigation secondary menu-sticky">
			<ul>
				<li
					class={classNames(
						{
							deprecated: effectivePageParent.isDeprecated(),
							current: effectivePageParent === props.model,
						},
						effectivePageParent.cssClasses
					)}
				>
					<a href={context.urlTo(effectivePageParent)} class="tsd-index-link">
						{context.icons[effectivePageParent.kind]()}
						<span>{wbr(effectivePageParent.name)}</span>
					</a>
					{!!pageNavigation.length && <ul>{pageNavigation}</ul>}
				</li>
			</ul>
		</nav>
	);
}

function inPath(thisPage: Reflection, toCheck: Reflection | undefined): boolean {
	while (toCheck) {
		if (toCheck.isProject()) return false;

		if (thisPage === toCheck) return true;

		toCheck = toCheck.parent;
	}
	return false;
}
*/
