# walkers

1) Install Node.js and gulp
$ npm -g install gulp

2) Install dependencies and their type definitions:
$ npm install
```

This code base is in the pre stages of development.  It can be built but you will see errors in the build. 

There are currently two build options :
* gulp build_matter
The resulting bundled JS file can be tested by loading :
* walkers/source/test_matter.html
...into a browser.
This option uses the matter-js 2D engine for controling the movment of objects.

OR

* gulp build_mock
The resulting bundled JS file can be tested by loading :
* walkers/source/test_mock.html
...into a browser.
This option uses a mock engine to control the movment of objects

