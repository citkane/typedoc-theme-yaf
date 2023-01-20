import { trigger } from './triggers.js';
export const rollMenuDown = () => new Event(trigger.menu.rollMenuDown);
export const rollMenuUp = () => new Event(trigger.menu.rollMenuUp);
export const toggle = (state) => new CustomEvent(trigger.menu.toggle, {
    detail: { state },
});
//# sourceMappingURL=actionsMenu.js.map