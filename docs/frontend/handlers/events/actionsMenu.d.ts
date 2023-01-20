import { scrollTo } from './index.js';
export declare const rollMenuDown: () => Event;
export declare const rollMenuUp: () => Event;
export type toggle = {
    state?: 'open' | 'close';
};
export declare const toggle: (state?: toggle['state']) => CustomEvent<toggle>;
export interface menu {
    /**
     * Scrolls the main navigation menu to the given id.
     */
    scrollTo: scrollTo;
    /**
     * Expands all drawers of the main navigation menu
     */
    rollMenuDown: null;
    /**
     * Contracts all drawers of the main navigation menu
     */
    rollMenuUp: null;
    /**
     * Toggle the open/close state of the main navigation menu in mobile views
     */
    toggle: toggle;
}
