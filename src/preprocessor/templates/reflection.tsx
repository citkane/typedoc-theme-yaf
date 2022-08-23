/* eslint-disable @typescript-eslint/no-unused-vars */
import { PageEvent, JSX, ContainerReflection } from 'typedoc';
import { YafThemeRenderContext } from '../YafThemeRenderContext';

export const yafReflectionTemplate =
	(context: YafThemeRenderContext) =>
	(props: PageEvent<ContainerReflection>) => {
		return <div>Hello reflection</div>;
	};
