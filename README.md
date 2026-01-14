

## Parameters, Body, Query, Files

Data from http requests are accessed in the normal Express way. Post parameters are in
`req.body`. Route parameters (/users/:userId/books/:bookId) are available in
`req.params`. Query parameters (/books?bookId=12) are available at `req.query`. 

Uploaded files are available at `req.files`, an array of file objects. By default, 
each file content is available as a buffer in memory.  Each file object has the keys:
```fieldname, originalname, encoding, mimetype, buffer, size```

## Configuration


There a several configuration parameters that are set in the webhandle.config object
that can affect this package.

* express.maxUploadSize - (optional) A string like `5mb` which sets the maximum size of any upload by file or urlencoded bodies. Default is 5mb
* express.fileUploadDest - (optional) The temporary location for uploaded files