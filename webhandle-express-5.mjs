import Webhandle from "@webhandle/core/webhandle.mjs"
import express from "express"
import isStream from "@webhandle/core/lib/is-stream.mjs"
import serveStatic from 'serve-static'
import createRememberPassingRouter from '@webhandle/core/lib/create-remember-passing-router.mjs'

export default class WebhandleExpress5 extends Webhandle {
	constructor(options) {
		super(options)
		this.staticDirs = []
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
	 * Serves static files from the path specified.
	 * @param {string} path 
	 * @param {object} [options] Options
	 * @param {string} [options.urlPrefix] Even though the folder structure at that location 
	 * doesn't have the prefix folders, any request for those resources must.
	 * @param {string} [options.fixedSetOfFiles] If true, it will be assumed that the resources are at a
	 * fixed, known set of URLs. That is, if a url can't be found the first time it's searched for
	 * it would be found subsequent times either. This let's us optimize server files from libraries
	 * or otherwise unchanging sets. This is assumed true if `development` is not true.
	 */
	addStaticDir(path,  {urlPrefix, fixedSetOfFiles} = {}) {
		let info = super.addStaticDir(path, {urlPrefix, fixedSetOfFiles});
		fixedSetOfFiles = info.fixedSetOfFiles

		let router = serveStatic(info.path)
		if(fixedSetOfFiles) {
			info.innerRouter = router
			let wrapped = createRememberPassingRouter(router)
			wrapped.router = router
			router = wrapped
		}
		
		info.router = router
		
		if(!urlPrefix) {
			this.routers.staticServers.use(router)
		}
		else {
			this.routers.staticServers.use(urlPrefix, router)
		}
		
		return info
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