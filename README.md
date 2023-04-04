## Available Scripts

In the project directory, you can run:

### `yarn start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

The page will reload when you make changes.\
You may also see any lint errors in the console.

### `yarn build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

### `yarn deploy:main`

To build and deploy to main location.

May been execution permissions one time. `chmod u+x ./scripts/deploy_main.sh`

### `yarn deploy:demo`

To build and deploy to demo location.

May been execution permissions one time. `chmod u+x ./scripts/deploy_demo.sh`

### `yarn start:instrumentation`

To start dev app with code coverage intrumentation. The report is saved at
`./coverage/lcov-report/index.html`.

### `yarn run cypress open`

To run cypress tests interactively. Remember to start server with instrumentation to be able to generate coverage report.

### `yarn run percy exec -- cypress run --spec \'cypress/e2e/path/to/spec.cy.js\'`

Run visual tests using percy. Will run all tests (including non visual) in the specified specs file/folder(s). Requires Percy token to be set using `export PERCY_TOKEN=token`.
