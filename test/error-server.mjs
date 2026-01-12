import Webhandle from "../webhandle-express-5.mjs"
import listenOnHttpServer from "@webhandle/core/lib/listen-on-http-server.mjs";
import test from 'node:test';
import assert from 'node:assert'
import wait from "./wait.mjs";


let webhandle = new Webhandle()
await webhandle.init()




webhandle.routers.primary.use((req, res, next) => {
	// console.log('first router')
	next(new Error('the test'))
})

webhandle.routers.primary.use((req, res, next) => {
	// console.log('next router')
	res.end('first hello')
	next()
})
webhandle.routers.primary.use((err, req, res, next) => {
	// console.log('error handler')
	next()
})
webhandle.routers.primary.use((req, res, next) => {
	// console.log('post error router')
	res.end('after error hello')
})

await wait(3000)
await listenOnHttpServer(webhandle)

test("check render results", async (t) => {
	await t.test('express direct render', async (t) => {
		let response = await fetch('http://localhost:3000/one')
		let body = await response.text()
		assert.equal(body, 'after error hello', 'The post error handler middleware did not execute.')
	})

	await t.test('shutdown', async (t) => {
		webhandle.server.close()
		await wait(300)
	})
})

