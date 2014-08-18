var exec = require('child_process').exec,
  path = require('path'),
  fs = require('fs'),
  vow = require('vow'),
  rimraf = require('rimraf');

exports['Backbone tests should not fail with Backbone-Super'] = function(test) {
  var backboneTestsTmpPath = path.join(__dirname, 'backbone_tests');
  copyBackboneTests(backboneTestsTmpPath)
    .then(injectBackboneSuper)
    .spread(runBackboneTests.bind(null, test))
    .always(cleanUp.bind(null, backboneTestsTmpPath))
    .done(test.done, function(reason) {
      console.log(reason);
    }, test);
};

function copyBackboneTests(backboneTestsTmpPath) {
  var backboneTestsPath = path.join(__dirname, '../node_modules/backbone/test'),
    cmd = 'cp -r ' + backboneTestsPath + ' ' + backboneTestsTmpPath,
    deferred = vow.defer();

  exec(cmd, function(error) {
    return error === null ? deferred.resolve(backboneTestsTmpPath) : deferred.reject(error);
  });

  return deferred.promise();
}

function injectBackboneSuper(backboneTestsTmpPath) {
  var deferred = vow.defer(),
    indexFilePath = path.join(backboneTestsTmpPath, 'index.html');

  fs.readFile(indexFilePath, 'utf8', function(error, content) {
    if (error !== null) {
      deferred.reject(error);
      return;
    }

    var backboneScripts =
      '<script src="../../node_modules/backbone/backbone.js"></script>' +
        '<script src="../../backbone-super/backbone-super.js"></script>';
    content = content.replace(/<script.*?\bbackbone\.js.*?\/script>/, backboneScripts);

    fs.writeFile(indexFilePath, content, 'utf8', function(error) {
      return error === null ? deferred.resolve([backboneTestsTmpPath, indexFilePath]) : deferred.reject(error);
    });
  });

  return deferred.promise();
}

function runBackboneTests(test, backboneTestsTmpPath, indexFilePath) {
  var deferred = vow.defer(),
    runnerPath = path.join(backboneTestsTmpPath, 'vendor/runner.js'),
    testCommand = ['phantomjs', runnerPath, indexFilePath + '?noglobals=true'].join(' ');

  exec(testCommand, function(error, stdout, stderr) {
    if (error !== null) {
      console.error(stdout);
      console.error(stderr);
      test.equal(error, null);
      deferred.reject(error);
      return;
    }

    deferred.resolve(backboneTestsTmpPath);
  });

  return deferred.promise();
}

function cleanUp(backboneTestsTmpPath) {
  var deferred = vow.defer();
  rimraf(backboneTestsTmpPath, function(error) {
    return error === null ? deferred.resolve() : deferred.reject(error);
  });
  return deferred.promise();
}
