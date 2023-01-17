# typedoc-theme-yaf

**ALPHA:** This is not yet mobile or production ready.

A theme that is focussed on nested project exploration, graphical clarity and an optimised end user experience.

<a href="https://raw.githubusercontent.com/citkane/typedoc-theme-yaf/assets/typedoc-theme-yaf.jpg"><img src="https://raw.githubusercontent.com/citkane/typedoc-theme-yaf/assets/typedoc-theme-yaf.jpg" height="400px" width="auto"/></a>

#### <a href="">Live Example</a>

## Usage
This theme couples and cross links your documentation content to a contextual menu tree.

The expanding menu contains links to all depths of information. Conversely, you can click on any content heading to expand, scroll and highlight your place in the documentation tree.

@TODO feature: 
Provide tabbed bookmarks for convenient cross referencing between documentation locations. 

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
Proceed with building your documentation.

Note that the `index.html` output for the documentation build will be a SPA entry point, so very little will happen if you open it with your browser locally. You will have to serve it with a server application of your choice, eg. the VS-Code [Live Server](https://github.com/ritwickdey/vscode-live-server) plugin.

## Frontend Strategy
The frontend decouples itself from the default TypeDoc theme `.html` fragment strategy and creates a single page application (SPA) which consumes `.json` data fragments.

This facilitates a user experience where place-keeping while reading and navigating is maintained across document pages, page reloads and browser sessions.

Options to show or hide complexity, such as private or inherited items, are left to the end user. Toggle buttons are contextually placed and easy to both understand and use.

The length of content is handily compressed with folding "drawers". The open/close state of these as well as the page scroll position is persisted, so the end user spends less time finding items on long pages and more time reading them.

The SPA is built with zero dependencies using [Web Components](https://en.wikipedia.org/wiki/Web_Components).


## Backend Strategy
The backend takes as input the default TypeDoc [`ProjectReflection`](https://typedoc.org/api/classes/ProjectReflection.html) and [`JSONOutput.ProjectReflection`](https://typedoc.org/api/interfaces/JSONOutput.ProjectReflection.html) and outputs a collection of `.json` data files for consumption by the frontend.

The theme does not (majorly) interfere with the default TypeDoc data construction flow, but rather serialises the standard output into it's own needs.   

## Contribution and Development

## Roadmap
### Short Term
- Implement search functionality
- Implement document versioning
- Implement reflection reference linkages across mono-repo workspaces  
### Medium Term
- Implement tabbed bookmarks
- Implement end user notes (using local storage)
- Migrate code view from external links to local rendering. Enable bookmarks, notes for same.
### Long term
- Either collaborate with TypeDoc to standardise it's default JSON output, or purpose build a TSDoc document parser and migrate this theme to be a standalone documentation product.
