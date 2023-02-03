export default class YafHtmlElement<T = Record<string, never>> extends HTMLElement {
    props: T;
    appendChildren: (children: (HTMLElement | undefined)[] | undefined) => void;
    private debounceCount;
    connectedCallback(): void;
}
