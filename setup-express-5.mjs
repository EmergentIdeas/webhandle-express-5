import WebhandleExpress5 from "./webhandle-express-5.mjs";
import addStandardMiddleware from "./lib/add-standard-middleware.mjs";

export default async function setupExpress5(options) {
	let webhandle = new WebhandleExpress5(options) 
	await webhandle.init()
	addStandardMiddleware(webhandle)
	return webhandle
}