import bodyParser from 'body-parser'
import multer from 'multer'
import cookieParser from 'cookie-parser'

export default function addStandardMiddleware(webhandle, options) {
	
	let maxUploadSize = webhandle.config?.express?.maxUploadSize || '5mb'
	let fileUploadDest = webhandle.config?.express?.fileUploadDest

	//handle json bodies
	webhandle.routers.requestParse.use(bodyParser.json({
		limit: maxUploadSize
	}))
	
	//handle url encoded bodies
	webhandle.routers.requestParse.use(bodyParser.urlencoded({
		limit: maxUploadSize
		, extended: false
	}))
	
	// file uploads
	let uploaderParameters = {}
	if(fileUploadDest) {
		uploaderParameters.dest = fileUploadDest
	}
	let fileUploader = multer(uploaderParameters)
	webhandle.routers.requestParse.use(fileUploader.any())
	

	// cookies
	webhandle.routers.requestParse.use(cookieParser())	
}
