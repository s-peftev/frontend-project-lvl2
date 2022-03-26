install:
	npm ci

gendiff:
	node bin/gendiff.js

publish:
	npm publish --dry-run

lint:
	npx eslint .

prettier:
	npx prettier --write .

test-coverage:
	npm test -- --coverage --coverageProvider=v8