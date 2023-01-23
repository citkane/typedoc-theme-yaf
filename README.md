# typedoc-theme-yaf

**ALPHA:** This is not production ready.

A theme that optimises deep project exploration, graphical clarity and a fluid end user experience.

<a href="https://raw.githubusercontent.com/citkane/typedoc-theme-yaf/assets/typedoc-theme-yaf.jpg"><img src="https://raw.githubusercontent.com/citkane/typedoc-theme-yaf/assets/typedoc-theme-yaf.jpg" height="auto" width="500px"/></a>

#### <a href="https://citkane.github.io/typedoc-theme-yaf/">Live Example</a>

## Usage
This theme couples and cross links your documentation content to a contextual menu tree.

The expanding menu contains links to all depths of information. Conversely, you can click on any content heading to expand, scroll and highlight your place in the documentation tree.


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

TODO feature: 
Provide tabbed bookmarks for convenient cross referencing between documentation locations. 

The SPA is built with zero dependencies using [Web Components](https://en.wikipedia.org/wiki/Web_Components).


## Backend Strategy
The backend takes as input the default TypeDoc [`ProjectReflection`](https://typedoc.org/api/classes/ProjectReflection.html) and [`JSONOutput.ProjectReflection`](https://typedoc.org/api/interfaces/JSONOutput.ProjectReflection.html) and outputs a collection of `.json` data files for consumption by the frontend.

The theme does not (majorly) interfere with the default TypeDoc data construction flow, but rather serialises the standard output into it's own needs.   

## Contribution and Development

Please let us know in the [issues](https://github.com/citkane/typedoc-theme-yaf/issues) if something breakingly wrong is afoot when you render your project with this theme.

If you spot a gremlin, or want to suggest an enhancement, please use the Github [discussion](https://github.com/citkane/typedoc-theme-yaf/discussions) section.

If you want to get involved in the code, please clone [the repo](https://github.com/citkane/typedoc-theme-yaf) and submit your pull requests.  
You can spin up a local [hot development](https://github.com/citkane/typedoc-plugin-hot-dev) instance by running `npx hot-dev` from your terminal. This is already installed as a theme dependency. For the first run only, do `npm i && npm run build`.

## Roadmap
### Short Term
- Implement search functionality
- Implement document versioning
- ~~Implement reflection reference linkages across mono-repo workspaces~~ ✅
- Write meaningful tests and pretend that this was always a test driven design process...
### Medium Term
- Implement tabbed bookmarks
- Implement end user sticky notes (using local storage)
- Migrate code view from external links to local rendering. Enable bookmarks, notes for same.
- Support diagrams in MarkDown
- Main navigation menu extension, eg. `.md` defined tutorials and documentation with hierarchical chapters.
### Long term
- Either collaborate with TypeDoc to normalise it's default JSON output, or purpose build a TSDoc document parser and migrate this theme to be a standalone documentation product.
