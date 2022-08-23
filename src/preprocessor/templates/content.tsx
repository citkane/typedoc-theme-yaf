// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { PageEvent, Reflection, JSX } from 'typedoc';
import { YafThemeRenderContext } from '../YafThemeRenderContext';

export const yafContent =
	(context: YafThemeRenderContext) => (props: PageEvent<Reflection>) => {
		return (
			<>
				{context.yafContentHeader(props)}
				{props.template(props)}
			</>
		);
	};
