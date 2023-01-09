# Bugsnag module for Silverstripe
[![CI](https://github.com/Violet88github/silverstripe-bugsnag-module-vue/actions/workflows/cicd.yml/badge.svg)](https://github.com/Violet88github/silverstripe-bugsnag-module-vue/actions/workflows/cicd.yml)
[![Scrutinizer Code Quality](https://scrutinizer-ci.com/g/Violet88github/silverstripe-bugsnag-module-vue/badges/quality-score.png?b=master)](https://scrutinizer-ci.com/g/Violet88github/silverstripe-bugsnag-module-vue/?branch=master)
[![Build Status](https://scrutinizer-ci.com/g/Violet88github/silverstripe-bugsnag-module-vue/badges/build.png?b=master)](https://scrutinizer-ci.com/g/Violet88github/silverstripe-bugsnag-module-vue/build-status/master)
[![Code Intelligence Status](https://scrutinizer-ci.com/g/Violet88github/silverstripe-bugsnag-module-vue/badges/code-intelligence.svg?b=master)](https://scrutinizer-ci.com/code-intelligence)
## Requirements

* SilverStripe ^4.0
* [silverstripe/framework](https://packagist.org/packages/silverstripe/framework)
* [bugsnag/bugsnag](https://packagist.org/packages/bugsnag/bugsnag)
* [guzzlehttp/guzzle](https://packagist.org/packages/guzzlehttp/guzzle)
* [silverstripe/admin](https://packagist.org/packages/silverstripe/admin)

## Dev requirements
* [phpunit/phpunit](https://packagist.org/packages/phpunit/phpunit)
* [squizlabs/php_codesniffer](https://packagist.org/packages/squizlabs/php_codesniffer)

## NPM Requirements
* [webpack](https://www.npmjs.com/package/webpack)
* [dotenv](https://www.npmjs.com/package/dotenv)
* [webpack-bugsnag-plugins](https://www.npmjs.com/package/webpack-bugsnag-plugins)

## Installation
To install, first add the following to your composer.json
```json
"repositories": [
        {
            "type": "composer",
            "url": "https://asset-packagist.org"
        }
    ],
```
after that run the following command
```bash
composer require violet88/bugsnag-silverstripe-vue
```
After installing the composer package, it is important to install the node dependencies of the module. To make this easier add the following to your composer.json
```json
"scripts": {
        "install-bugsnag-packages": [
            "cd vendor/violet88/bugsnag-silverstripe-vue && npm install"
        ]
    }
```
And run the command:
```bash
composer install-bugsnag-packages
```
## License
See [License](license.md)

## Documentation
 * [Documentation readme](docs/en/readme.md)

## Configuration
For base use, add the following to your .env file

<strong>When running local, to prevent Bugsnag from being filled with errors, set BUGSNAG_ACTIVE to false OR do not declare it. (If not declared messages will also not be sent to Bugsnag.</strong>

```bash
BUGSNAG_API_KEY=<YOUR BUGSNAG API KEY>
BUGSNAG_STANDARD_SEVERITY=<STANDARD SEVERITY LEVEL FOR BUGSNAG (info OR warning OR error)>
BUGSNAG_ACTIVE=<true OR false, depending on whether bugsnag should be ACTIVE>
```
For using the BugsnagLogger as the standard error logger, add the following to your configuration yaml
```yaml
SilverStripe\Core\Injector\Injector:
  Psr\Log\LoggerInterface:
    calls:
      BugsnagHandler: [pushHandler, ['%$BugsnagHandler']]
  BugsnagHandler:
    class: Violet88\BugsnagModule\BugsnagLogger
    constructor:
      - '%$Violet88\BugsnagModule\Bugsnag'
```
For using the CLI command to sent your current release revision to Bugsnag, add the following to your routes yaml
```yaml
SilverStripe\Control\Director:
    rules:
        'bugsnag//build': 'Violet88\BugsnagModule\BugsnagController'
        'bugsnag//initial': 'Violet88\BugsnagModule\BugsnagController'
```
For the Vue part of the module to work you have to run:
```bash
npm install dotenv webpack webpack-bugsnag-plugins
```
and add the following to your webpack.mix.js
```js
require('dotenv').config();
let webpack = require('webpack');
const { BugsnagSourceMapUploaderPlugin } = require('webpack-bugsnag-plugins');
const PACKAGE_VERSION = process.env.npm_package_version

let dotenvplugin = new webpack.DefinePlugin({
    'process.env': {
        'BUGSNAG_API_KEY': JSON.stringify(process.env.BUGSNAG_API_KEY),
        'BUGSNAG_ACTIVE': JSON.stringify(process.env.BUGSNAG_ACTIVE),
        'VERSION': JSON.stringify(PACKAGE_VERSION)
    }
});
mix.options({legacyNodePolyfills: false})
mix.webpackConfig({
    output: {
        library: 'BugsnagVue',
        libraryTarget: 'umd',
        umdNamedDefine: true,
        globalObject: 'this'
    },
    plugins: [
        dotenvplugin,
        new BugsnagSourceMapUploaderPlugin({
            apiKey: process.env.BUGSNAG_API_KEY,
            appVersion: PACKAGE_VERSION ?? '1.0.0',
            overwrite: true,
            publicPath: '*'
        })
    ]
});

```
Also make sure you generate the sourcemaps, for example by adding `.sourceMaps(true, 'source-map')` between mix.js()). This could look as follows:
```js
mix.sourceMaps(true, 'source-map').js([
    `${theme}/javascript/bundle.js`,
    //'vendor/violet88/silverstripe-bugsnag-module-vue/src/js/BugsnagVue.js'
    ], `${theme}/dist/js/bundle.js`);
```
After that add the following to your root composer.json
```json
"scripts": {
        "install-bugsnag-packages": [
            "cd vendor/violet88/bugsnag-silverstripe-vue && npm install"
        ]
    }
```
and run the following command
```bash
composer run-script install-bugsnag-packages
```

## Basic usage
### PHP
For sending a basic error to Bugsnag, use the following code
```php
use Violet88\BugsnagModule\Bugsnag;
use Exception;
use SilverStripe\Core\Injector\Injector;

try{
    //do something
} catch (Exception $e) {
    $bugsnag = Injector::inst()->get(Bugsnag::class);
    $bugsnag->sendException($e);
}
```

### Javascript
For sending a basic error to Bugsnag, use the following code
```js
// Here it is important that the require is pointing to the correct path. Point it to the path where you've installed the composer package.
const Bugsnag = require('/vendor/Violet88/BugsnagVueModule/src/js/BugsnagVue.js');

Bugsnag.start();
try{
    something.risky();
}catch(e){
    Bugsnag.notify(e);
}
```

## Maintainers
 * Sven van der Zwet <s.vanderzwet@student.avans.nl>

## Bugtracker
Bugs are tracked in the issues section of this repository. Before submitting an issue please read over
existing issues to ensure yours is unique.

If the issue does look like a new bug:

 - Create a new issue
 - Choose the issue template for 'Bugs'
 - Follow the instructions in the template

Please report security issues to the module maintainers directly. Please don't file security issues in the bugtracker.

## Development and contribution
If you would like to make contributions to the module please ensure you raise a pull request and discuss with the module maintainers.

Feel free to join the community on slack: [Join Slack](https://join.slack.com/t/silverstripe-bugsnag/shared_invite/zt-1gprtht4j-RIY_QyhTTxJZliDRlBAS~Q)
