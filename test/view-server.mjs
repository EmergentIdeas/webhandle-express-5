import Webhandle from "../webhandle-express-5.mjs"
import addStandardMiddleware from "../lib/add-standard-middleware.mjs";
import listenOnHttpServer from "@webhandle/core/lib/listen-on-http-server.mjs";
import fs from "node:fs/promises"

import test from 'node:test';
import assert from 'node:assert'

import wait from "./wait.mjs";


let webhandle = new Webhandle()
await webhandle.init()


webhandle.app.engine('ntl', async (filePath, options, callback) => { // define the template engine
	// webhandle.log.info({
	// 	filePath, options
	// })
	// webhandle.log.info({
	// 	filePath
	// })
	let data = await fs.readFile(filePath)
	data = data.toString()
	return callback(null, data)
})
webhandle.app.set('views', ['./test-data/views', './test-data/views2']) // specify the views directory
webhandle.app.set('view engine', 'ntl') // register the template engine

webhandle.routers.primary.get('/one', (req, res, next) => {
	webhandle.app.render('something', {}, (err, html) => {
		res.end(html)
	})
})
webhandle.routers.primary.get('/two', (req, res, next) => {
	webhandle.render('something-2', {}, (err, html) => {
		if (err) {
			console.log(err)
			log.error(err)
		}
		res.end(html)
	})
})
webhandle.routers.primary.get('/three', (req, res, next) => {
	res.render('something-3')
})


listenOnHttpServer(webhandle)

await test("check render results", async (t) => {
	await t.test('express direct render', async (t) => {
		let response = await fetch('http://localhost:3000/one')
		let body = await response.text()
		let fileContent = await fs.readFile('./test-data/views/something.ntl')
		assert.equal(body, fileContent, 'Result did not match template')
	})
	await t.test('webhandle direct render', async (t) => {
		let response = await fetch('http://localhost:3000/two')
		let body = await response.text()
		let fileContent = await fs.readFile('./test-data/views2/something-2.ntl')
		assert.equal(body, fileContent, 'Result did not match template')
	})
	await t.test('response render', async (t) => {
		let response = await fetch('http://localhost:3000/three')
		let body = await response.text()
		let fileContent = await fs.readFile('./test-data/views/something-3.ntl')
		assert.equal(body, fileContent, 'Result did not match template')
	})
	
	await t.test('shutdown', async (t) => {
		webhandle.server.close()
	})
	
})

