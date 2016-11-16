Oyez
====
[![NPM](https://nodei.co/npm/oyez.png?downloads=true&downloadRank=true&stars=true)](https://nodei.co/npm/oyez/)

[![Code Climate](https://codeclimate.com/github/dancrumb/oyez/badges/gpa.svg)](https://codeclimate.com/github/dancrumb/oyez)
[![Test Coverage](https://codeclimate.com/github/dancrumb/oyez/badges/coverage.svg)](https://codeclimate.com/github/dancrumb/oyez/coverage)
[![Build Status](https://travis-ci.org/dancrumb/oyez.svg?branch=master)](https://travis-ci.org/dancrumb/oyez)
[![dependencies Status](https://david-dm.org/dancrumb/oyez/status.svg)](https://david-dm.org/dancrumb/oyez)

Oyez is an Event Aggregator for node.js. You can use it to provide a consolidated interface to groups
of EventEmitters.

## Synopsis
Like bow-ties, EventEmitters are cool.

They provide a great way to decouple parts of a system.

Sometimes, you want to be able to create groups of EventEmitters as a single source
of events.

For instance, let's say you have a group of sources that can all emit a `'click'` event.
Let's say, also, that you want to trigger a handler should _any_ of them emit such an event.

With Oyez, you can do that easily:

```javascript

const buttons = new EventAggregator();
buttons.addSource(okButton);
buttons.addSource(cancelButton);
buttons.addSource(applyButton);

buttons.onAny('click', (source, eventArguments) => {
  console.log('A button was clicked!');
});
```

## Installation
Oyez can be installed easily with `npm`

```bash
npm install oyez
```

Currently, `oyez` has no dependencies for installation.

## API
The API has 4 interesting methods:

* `onAll`: like `EventEmitter#on`, but only triggers listeners when *all* of the sources have 
    emitted 
* `onAny`: like `EventEmitter#on`, but triggers listeners when *any* of the sources have emitted
* `onceAll`: like `EventEmitter#once`, but only triggers listeners when *all* of the sources have 
emitted
* `onceAny`: like `EventEmitter#once`, but triggers listeners when *any* of the sources have emitted

The full API is documented at [http://dancrumb.com/oyez/index.html](http://dancrumb.com/oyez/index.html).

## Tests
If you've pulled this from Github (rather than installed it from npm), you may wish to 
run the tests.

The tests have various dependencies, so make sure to run

``` 
npm install
```

first.

Next, be sure to use

```
npm test
```

as there is a `pretest` script that needs to run.

## Contributing
This module is written in ES2015 and then compiled down to JavaScript 5.

Make sure any new code has associated tests and that all tests are passing. Pull Requests
are welcome and are tested by [Travis-CI](https://travis-ci.org/dancrumb/oyez).

In addition, code coverage should not go down, nor should the [Code Climate quality score](https://codeclimate.com/github/dancrumb/oyez).
