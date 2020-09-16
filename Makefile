default: tsconfig build
	:

.PHONY: tsconfig
tsconfig: tsconfig.esm.snabbdom.json tsconfig.esm.src.json
	:

tsconfig.esm.snabbdom.json:
	node tsconfig.esm.snabbdom.js > tsconfig.esm.snabbdom.json

tsconfig.esm.src.json:
	node tsconfig.esm.src.js > tsconfig.esm.src.json

.PHONY: build
build: build.pcss
	npx tsc -b
	npx rollup -c rollup.config.mod.js
	npx tsc -b tsconfig.esm.snabbdom.json
	npx ttsc -b tsconfig.esm.src.json

.PHONY: build.pcss
build.pcss:
	npx rollup -c rollup.config.pcss.js
