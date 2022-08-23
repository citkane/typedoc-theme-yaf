// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { PageEvent, Reflection, JSX } from 'typedoc';
import { YafThemeRenderContext } from '../YafThemeRenderContext';

export const yafContentHeader =
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	(context: YafThemeRenderContext) => (props: PageEvent<Reflection>) => {
		const id = props.model.id;
		context.frontEndDataCache.push([
			`yaf.content`,
			{ isProject: props.model.isProject() },
			id,
		]);
		return <>Hello Yaf Header</>;
	};
