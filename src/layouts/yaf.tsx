import { PageEvent, Reflection, JSX } from "typedoc";

import { YafThemeRenderContext } from "../themes/YafThemeRenderContext";

export const yafLayout = (context: YafThemeRenderContext) => (props: PageEvent<Reflection>) => (
    <html class="default" lang={context.options.getValue("htmlLang")}>
        <head>
            <meta charSet="utf-8" />
            {context.hook("head.begin")}
            <meta http-equiv="x-ua-compatible" content="IE=edge" />
            <title>
                {props.model.name === props.project.name
                    ? props.project.name
                    : `${props.model.name} | ${props.project.name}`}
            </title>
            <meta name="description" content={"Documentation for " + props.project.name} />
            <meta name="viewport" content="width=device-width, initial-scale=1" />

            <link rel="stylesheet" href={context.relativeURL("assets/css/style.css")} />
            <link rel="stylesheet" href={context.relativeURL("assets/fonts/fonts.css")} />
            {context.options.getValue("customCss") && (
                <link rel="stylesheet" href={context.relativeURL("assets/custom.css")} />
            )}
            <script async src={context.relativeURL("assets/search.js")} id="search-script"></script>
            {context.hook("head.end")}
        </head>
        <body>
            {context.hook("body.begin")}
            <script>
                <JSX.Raw html='document.documentElement.dataset.theme = localStorage.getItem("tsd-theme") || "os"' />
            </script>
            {/*context.toolbar(props)*/}

            <div id="main">
                <div id="sidebar">
                    <div id="menuHeader">
                        {context.menuHeader(props)}
                    </div>
                    <div id="menu">
                        {context.hook("navigation.begin")}
                        {context.navigation(props)}
                        {context.hook("navigation.end")}
                    </div>
                </div>
                <div id="content">
                    {context.hook("content.begin")}
                    {context.header(props)}
                    {props.template(props)}
                    {context.hook("content.end")}
                </div>
            </div>
            <script src={context.relativeURL("assets/yaf.js")}></script>
            {context.hook("body.end")}
        </body>
    </html>
);