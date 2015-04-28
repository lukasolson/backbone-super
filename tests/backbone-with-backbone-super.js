var exec = require('child_process').exec,
  fs = require('fs');

exports['Backbone tests should not fail with Backbone-Super'] = function(test) {
  var confFilePath = 'backbone/karma.conf.js',
    content = fs.readFileSync(confFilePath, 'utf8');
  content = content.replace("'backbone.js'", "'backbone.js', '../backbone-super/backbone-super.js'");
  fs.writeFileSync(confFilePath, content, 'utf8');

  var testCommand = 'cd backbone && npm test';
  exec(testCommand, function(error, stdout, stderr) {
    if (error !== null) {
      console.error(stdout);
      console.error(stderr);
      test.equal(error, null);
    }

    test.done();
  });
};

