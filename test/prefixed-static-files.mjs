import Webhandle from "../webhandle-express-5.mjs"
import addStandardMiddleware from "../lib/add-standard-middleware.mjs";
import listenOnHttpServer from "@webhandle/core/lib/listen-on-http-server.mjs";
import fs from "node:fs/promises"
import FileSink from 'file-sink'

import test from 'node:test';
import assert from 'node:assert'

import wait from "./wait.mjs";


let webhandle = new Webhandle()
await webhandle.init()
addStandardMiddleware(webhandle)


await wait(300)
await listenOnHttpServer(webhandle)

let testdir = 'test' + (new Date().getTime())
let testpath = '/tmp/' + testdir
let fsTmp = new FileSink('/tmp')
await fsTmp.mkdir(testdir)

let fsTest = new FileSink(testpath)

webhandle.addStaticDir(testpath, {
	urlPrefix: '/files'
})
let oneData = 'abc'
await fsTest.write('one.txt', oneData)

test("fetch static contents", async (t) => {
	await t.test('prefixed files', async (t) => {
		let response = await fetch('http://localhost:3000/one.txt')
		let body = await response.text()
		assert(body != oneData, 'Result did not match file')

		response = await fetch('http://localhost:3000/files/one.txt')
		body = await response.text()
		assert.equal(body, oneData, 'Result did not match file')
	})
	
	await t.test('shutdown', async (t) => {
		webhandle.server.close()
		await wait(300)
		await fsTmp.rm(testdir)
	})
	
})
