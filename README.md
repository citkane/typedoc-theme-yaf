# Typedoc-theme-yaf

**ALPHA:** This is not yet mobile or production ready.

A theme that is focussed on nested project exploration, graphical clarity and an optimised end user experience.

<img src="https://raw.githubusercontent.com/citkane/typedoc-theme-yaf/assets/typedoc-theme-yaf.jpg" height="400px" width="auto"/>

## Usage
This theme couples and cross links your documentation content to a contextual menu tree.

The expanding menu contains links to all depths of information. Conversely, you can click on any content heading to expand, scroll and highlight your place in the documentation tree.

@TODO feature: 
Provide tabbed bookmarks for easier cross referencing between documentation locations. 

### Installation
**ALPHA:** This is not yet on NPM, so until then, instead of the below, do a git clone, run the `build` script and then npm install from your build folder location. 
```
npm i -D typedoc-theme-yaf
```
Once installed, adjust your [TypeDoc options](https://typedoc.org/guides/options/#options-1) to reflect:

```json
{
	"plugin": ["typedoc-theme-yaf"],
	"theme": "yaf"
}
```

## Frontend Strategy
The frontend decouples itself from the default TypeDoc theme '.html' fragment strategy and creates a single page application (SPA) which consumes '.json' data fragments. This allows for a user experience where your reading and navigation place is maintained across document pages, page reloads and browser sessions.





## Backend Strategy

## Contribution and Development
