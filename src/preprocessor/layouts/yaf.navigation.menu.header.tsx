// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { DefaultThemeRenderContext, PageEvent, Reflection, JSX } from 'typedoc';

export const menuHeader =
	(context: DefaultThemeRenderContext) => (props: PageEvent<Reflection>) => {
		return (
			<>
				<img
					id="logo"
					src={context.relativeURL('assets/logo.svg') as string}
					alt={props.project.name}
				/>
				<h1>{props.project.name}</h1>
				<input type="search" id="search" />
			</>
		);
	};
