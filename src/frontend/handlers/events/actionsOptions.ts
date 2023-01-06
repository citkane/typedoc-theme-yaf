import { yafDisplayOptions } from '../../../types/frontendTypes.js';
import { trigger } from './triggers.js';

type display = {
	key: yafDisplayOptions;
	value: 'show' | 'hide';
};
export const display = (key: display['key'], value: display['value']) =>
	new CustomEvent<display>(trigger.options.display, {
		detail: { key, value },
	});

export interface options {
	display: display;
}
