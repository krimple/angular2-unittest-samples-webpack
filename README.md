# Demo Angular App
## Uses angular-class's angular2-webpack-starter as a base

Thanks to @patrickjs for figuring this base project out!

## Not possible without the support of the Angular2 community

Thanks to @zoechi for a last minute conversation around testing components
that helped me unlock the BlogRoll spec.

[![Gitter](https://badges.gitter.im/angular/angular.svg)](https://gitter.im/angular/angular?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge)

## Setting up

```bash
npm install -g typescript@1.7.5
npm install
```

## To run the samples
1.  Start the backend server
```bash
node server.js
```

1. In another terminal, fire up the web server

```bash
npm run server:dev
```

This application runs and watches for changes to the source code, which
will trigger the browser to reload the application after the TypeScript
compilation process completes.

## To run tests

```bash
npm run watch:test
```

This will run Karma and cause it to watch the source and test code. Any
attempt to save the test or source code will re-run the tests.

## To debug tests

In `karma.conf.js`, make sure you select the Chrome browser. It will
appear when you run `watch:test`. Click on the `debug` button on the
browser window, and open Chrome Developer Tools (CMD-ALT-J on OS X,
CTRL-SHIFT-J on Windows).

To debug the test source, open up sources and view the `WebPack` `.`
directory, which will contain all of your sources.

Unfortunately, to allow the Istanbul code coverage system to work, the
non-test source code has been instrumented and is unreadable. To
temporarily disable this process and allow debugging of the source code
directly, edit `webpack.test.config.js`, and uncomment line 67 - which
will exclude the source code from Istanbul as the test code already is.

Your code coverage will report 0% everywhere at this point, but when you
load your scripts into the browser, you will be able to debug.


Beyond this, the rest of the repository is based on Patrick Stapleton's
`Angular Webpack Starter` so head over to that repository for more
information on how to use the features, or review this project's
`package.json` file.

Happy trails,

Ken Rimple
Feb 28, 2016
