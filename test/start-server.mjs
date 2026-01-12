import Webhandle from "../webhandle-express-5.mjs"
import listenOnHttpServer from "@webhandle/core/lib/listen-on-http-server.mjs";


let webhandle = new Webhandle()
await webhandle.init()




webhandle.routers.primary.use((req, res, next) => {
	for(let i = 0; i < 100; i++) {
		// console.log('tick')
		// log.info('tick')
	}
	// console.timeEnd('request processing')
	res.end('hello there')
})
listenOnHttpServer(webhandle)