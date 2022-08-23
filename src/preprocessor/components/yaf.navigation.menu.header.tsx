// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { PageEvent, Reflection, JSX } from 'typedoc';
import { YafThemeRenderContext } from '../YafThemeRenderContext';

export const yafNavigationMenuHeader =
	(context: YafThemeRenderContext) => (props: PageEvent<Reflection>) => {
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
