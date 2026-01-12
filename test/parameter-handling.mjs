import Webhandle from "../webhandle-express-5.mjs"
import addStandardMiddleware from "../lib/add-standard-middleware.mjs";
import listenOnHttpServer from "@webhandle/core/lib/listen-on-http-server.mjs";
import fs from "node:fs/promises"
import { lookup } from 'mime-types'; // You may need to install 'mime-types'
import { openAsBlob } from 'node:fs';

import test from 'node:test';
import assert from 'node:assert'

import wait from "./wait.mjs";


let webhandle = new Webhandle()
await webhandle.init()
addStandardMiddleware(webhandle)



webhandle.routers.primary.get('/query-parameters', (req, res, next) => {
	res.json(req.query)

})
webhandle.routers.primary.post('/body-parameters', (req, res, next) => {
	res.json(req.body)
})

webhandle.routers.primary.post('/file-parameters', (req, res, next) => {
	res.json({ msg: 'Uploaded' })
})

await wait(300)
await listenOnHttpServer(webhandle)

test("check parameter parsing", async (t) => {
	await t.test('query parameters', async (t) => {
		let response = await fetch('http://localhost:3000/query-parameters?name=Dan&position=chair')
		let result = await response.json()
		assert.equal(result.name, 'Dan', "Name did not match")
		assert.equal(result.position, 'chair', "Position did not match")
	})
	await t.test('body parameters', async (t) => {
		let data = {
			name: 'Dan'
			, position: 'chair'
		}

		let response = await fetch('http://localhost:3000/body-parameters', {
			method: 'POST'
			, headers: {
				"Content-Type": "application/json",
			}
			, body: JSON.stringify(data)
		})
		let result = await response.json()
		assert.equal(result.name, 'Dan', "Name did not match")
		assert.equal(result.position, 'chair', "Position did not match")

		response = await fetch('http://localhost:3000/body-parameters', {
			method: 'POST'
			, headers: {
				"Content-Type": "application/x-www-form-urlencoded",
			}
			, body: 'name=Dan&position=chair'
		})
		result = await response.json()
		assert.equal(result.name, 'Dan', "Name did not match")
		assert.equal(result.position, 'chair', "Position did not match")

	})
	await t.test('file upload', async (t) => {
		let filePath = './test-data/views/something-2.html'
		const fileBlob = await openAsBlob(filePath, { type: lookup(filePath) || 'application/octet-stream' })


		// Create a new FormData object (native to Node.js v16.15.0+ and v17.5.0+)
		const formData = new FormData()

		// Append the file blob to the form data, specifying the field name and original filename
		formData.set("file_upload_field_name", fileBlob, "file_name_on_server.ext")

		// Send the POST request using the native fetch API
		const response = await fetch('http://localhost:3000/file-parameters', {
			method: 'POST',
			body: formData, // The browser/Node.js automatically sets the correct Content-Type: multipart/form-data header
		})

		if (!response.ok) {
			throw new Error(`Upload failed with status: ${response.statusText}`)
		}

		const data = await response.json()
		console.log("File uploaded successfully:", data)
	})

	await t.test('shutdown', async (t) => {
		webhandle.server.close()
		await wait(300)
	})

})
