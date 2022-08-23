import { PageEvent, Reflection, JSX } from 'typedoc';
import { YafThemeRenderContext } from '../YafThemeRenderContext';
import fs from 'fs-extra';
import path from 'path';

export const yafIndex =
	(context: YafThemeRenderContext) => (props: PageEvent<Reflection>) => {
		return (
			<html lang={context.options.getValue('htmlLang')}>
				<head>
					{getTitle(props)}
					{getMeta(props)}
					{getLinks(context)}
					{getScripts(context)}
				</head>
				<body>
					<div id="main">
						<div id="sidebar">
							{context.yafNavigationMenuHeader(props)}
							{context.yafNavigationMenuTree(props)}
						</div>
						<JSX.Raw html="<yaf-content />" />
					</div>
					{context.hook('body.end')}
				</body>
			</html>
		);
	};

function getTitle(props: PageEvent<Reflection>) {
	return (
		<title>
			{props.model.name === props.project.name
				? props.project.name
				: `${props.model.name} | ${props.project.name}`}
		</title>
	);
}
function getMeta(props: PageEvent<Reflection>) {
	return (
		<>
			<meta charSet="utf-8" />
			<meta http-equiv="x-ua-compatible" content="IE=edge" />
			<meta
				name="description"
				content={'Documentation for ' + props.project.name}
			/>
			<meta
				name="viewport"
				content="width=device-width, initial-scale=1"
			/>
		</>
	);
}
function getLinks(context: YafThemeRenderContext) {
	return (
		<>
			<link
				rel="stylesheet"
				href={context.relativeURL('assets/style.css')}
			/>
			<link
				rel="stylesheet"
				href={context.relativeURL('assets/fonts/fonts.css')}
			/>
			{context.options.getValue('customCss') && (
				<link
					rel="stylesheet"
					href={context.relativeURL('assets/custom.css')}
				/>
			)}
		</>
	);
}
function getScripts(context: YafThemeRenderContext) {
	const webComponents = fs
		.readdirSync(path.join(__dirname, '../../webComponents/components'))
		.filter((path) => path.endsWith('.js'));

	return (
		<>
			{webComponents.map((file) => {
				return (
					<script
						type="module"
						src={context.relativeURL(
							`webComponents/components/${file}`
						)}
						defer
					></script>
				);
			})}
			<script
				src={context.relativeURL('assets/search.js')}
				id="search-script"
				async
			></script>
		</>
	);
}
