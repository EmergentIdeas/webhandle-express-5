#! /bin/bash
node "test/view-server.mjs"
node "test/error-server.mjs"
node "test/simple-static-files.mjs"
node "test/prefixed-static-files.mjs"
node "test/fixed-static-files.mjs"