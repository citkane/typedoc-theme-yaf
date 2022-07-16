import { DefaultTheme, Renderer, RendererEvent } from "typedoc";
import { YafThemeRenderContext } from "./YafThemeRenderContext";
import { copySync } from "fs-extra";
import path from "path";

export class YafTheme extends DefaultTheme {
	private _contextCache?: YafThemeRenderContext;
	constructor(renderer: Renderer) {
		super(renderer);
		const rootFolder = path.join(__dirname, '../../');
		const out = path.join(this.application.options.getValue('out'), './assets');
		const staticAssets = path.join(rootFolder , 'assets');
		const builtAssets = path.join(rootFolder , 'dist/assets');	
		this.listenTo(this.owner, RendererEvent.END, () => {
			copySync(staticAssets, out);
			copySync(builtAssets, out);
		});
	}
	public override getRenderContext(): YafThemeRenderContext {
		this._contextCache ||= new YafThemeRenderContext(this, this.application.options)
		return this._contextCache;	
	}
}