run:
	npm run dev

run-dev-back:
	npm run dev-back

run-dev-front:
	npm run dev-front

test-e2e:
	npm run test-e2e

build:
	npm run build

test-routes:
	npm run test-routes

prod:
	npm run start

typage:
	npx tsc --noEmit

seed:
	npx prisma db seed

lint:
	npm run lint
