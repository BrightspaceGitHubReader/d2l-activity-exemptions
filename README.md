[![Build status][ci-image]][ci-url]

# \<activity-exemptions\>

Activity exemptions

## Install the Polymer-CLI

First, make sure you have the [Polymer CLI](https://www.npmjs.com/package/polymer-cli) installed. Then run `polymer serve` to serve your application locally.

## Viewing Your Application

```
$ polymer serve
```

## Building Your Application

```
$ polymer build
```

This will create a `build/` folder with `bundled/` and `unbundled/` sub-folders
containing a bundled (Vulcanized) and unbundled builds, both run through HTML,
CSS, and JS optimizers.

You can serve the built versions by giving `polymer serve` a folder to serve
from:

```
$ polymer serve build/bundled
```

## Running Tests

```
$ polymer test
```

Your application is already set up to be tested via [web-component-tester](https://github.com/Polymer/web-component-tester). Run `polymer test` to run your application's test suite locally.

## Local Testing

Testing from within LMS:

1. Checkout brightspace/activity-exemptions and brightspace/brightspace-integration

2. In brightspace-integration project, ensure you're in the correct branch (add_activity_exemptions)

3. In activity-exemptions directory, run
	```shell
	bower link
	```
to allow it to be linked from brightspace-integration

4. In brightspace-integration directory, run
	```shell
	bower link activity-exemptions
	```
to link to the local activity-exemptions project

5. Build and run brightspace-integration (will have to be rebuilt on any changes to activity-exemptions)

6. Run the brightspace-integration:
    ```shell
    npm run serve
    ```

This will run a web server on port `8080`.

7. Point your Brightspace instance at the local brightspace-integration project:
    - Edit the `{instance}/config/Infrastructure/D2L.LP.Web.Bsi.config.json` in your filesystem
    - Change the `baseLocation` and `baseLocation-c12i12n` properties to `http://localhost:8080/` (or your machine hostname) - note the trailing `/`
    - Restart IIS (iisreset)

This config file gets overwritten when the LMS gets built.  Beware the full_all...


[ci-url]: https://travis-ci.org/Brightspace/d2l-activity-exemptions
[ci-image]: https://img.shields.io/travis/Brightspace/d2l-activity-exemptions/master.svg
