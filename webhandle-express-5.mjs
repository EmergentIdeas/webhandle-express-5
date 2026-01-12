import Webhandle from "@webhandle/core/webhandle.mjs"
import express from "express"
import isStream from "@webhandle/core/lib/is-stream.mjs"

export default class WebhandleExpress5 extends Webhandle {
	constructor(options) {
		super(options)
	}

	async init() {
		if (!this.initialized) {
			await super.init()
			this.app = this.compositeRouter
			this.app.set('x-powered-by', false)
			this.initialized = true
		}


	}
	createRouter() {
		return new express.Router()
	}
	createAppRouter() {
		return express()
	}

	/**
	 * Renders data based on templates 
	 * @param {string} templateName The name of the template to render
	 * @param {object:string} [data] The data processed by the template
	 * @param {function(err, content)} [callback] If supplied, the callback will receive the content of template rendered 
	 * @param {stream} [destination] If supplied, the rendered template will be written to the output stream 
	 * @returns A promise which resolves to the rendered template content if no destination wtream is specified
	 */
	async render(templateName, data, callback, destination) {
		if (typeof data === 'function') {
			callback = data
			data = undefined
		}
		else if (isStream(data)) {
			destination = data
			data = callback = undefined
		}
		else {
			if (isStream(callback)) {
				destination = callback
				callback = undefined
			}
		}

		return this.app.render(templateName, data, (err, content) => {
			if (destination) {
				destination.write(content)
				if (callback) {
					try {
						callback()
					}
					catch (e) {
					}
					return
				}
				else {
					return
				}
			}
			else if (callback) {
				try {
					callback(err, content)
				}
				catch (e) {
				}
			}
		})
	}
}