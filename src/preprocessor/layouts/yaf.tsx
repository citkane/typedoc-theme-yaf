import { PageEvent, Reflection, JSX } from "typedoc";
import { YafThemeRenderContext } from "../YafThemeRenderContext";
import fs from 'fs-extra';
import path from 'path';

export const yafPartial = (context: YafThemeRenderContext) => (props: PageEvent<Reflection>) => {
    return (
        <>
            <JSX.Raw html="<yaf-content />" />
            <template id="content">
                {context.hook("content.begin")}
                {context.header(props)}
                {props.template(props)}
                {context.hook("content.end")}
            </template>
        </>
    )
}

export const yafIndex = (context: YafThemeRenderContext) => (props: PageEvent<Reflection>) => {
    const webComponents = fs.readdirSync(path.join(__dirname, '../../webComponents/components'))
        .filter(path => path.endsWith('.js'));
    return (
        
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

                <link rel="stylesheet" href={context.relativeURL("assets/style.css")} />
                <link rel="stylesheet" href={context.relativeURL("assets/fonts/fonts.css")} />
                {context.options.getValue("customCss") && (
                    <link rel="stylesheet" href={context.relativeURL("assets/custom.css")} />
                )}
                <script type="module" src={context.relativeURL("webComponents/yafData.js")} defer />

                {webComponents.map(file => {
                    return <script type="module" src={context.relativeURL(`webComponents/components/${file}`)} defer ></script>
                })}
                <script src={context.relativeURL("assets/search.js")} id="search-script" async ></script>

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
                        {/* <div id="menu">
                            {context.hook("navigation.begin")}
                            {context.navigation(props)}
                            {context.hook("navigation.end")}
                        </div> */}
                        
                        { context.yaf.navigation.menu.tree(context, props) }

                    </div>
                    {yafPartial(context)(props)}
                </div>
                {context.hook("body.end")}
            </body>
        </html>
)};