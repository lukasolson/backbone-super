require('../backbone-super/backbone-super');
var Backbone = require('backbone'),
  callChain;

var Class1 = Backbone.Model.extend({
  method1: function () {
    callChain.push('Class1#method1');
  },

  method2: function () {
    callChain.push('Class1#method2');
  },

  method4: function () {
    callChain.push('Class1#method4(' + Array.prototype.join.call(arguments, ',') + ')');
  }
});

var Class2 = Class1.extend({
  method1: function () {
    this._super();
    callChain.push('Class2#method1');
  },

  method4: function () {
    this._super('arg1', 'arg2');
    callChain.push('Class2#method4');
  }
});

var Class3 = Class2.extend({
  method1: function () {
    this._super();
    callChain.push('Class3#method1');
  },

  method2: function () {
    this._super();
    callChain.push('Class3#method2');
  }
});

var Class4 = Class1.extend({
  method3: function () {
    this._super();
    callChain.push('Class4#method3');
  }
});

var Class5 = Class4.extend({
  method3: function () {
    this._super();
    callChain.push('Class5#method3');
  }
});

exports.setUp = function (callback) {
  callChain = [];
  callback();
};

exports['_super method should invoke the same method of'] = {
  'parent class': function (test) {
    var instance = new Class2;
    instance.method1();
    test.deepEqual(callChain, ['Class1#method1', 'Class2#method1']);
    test.done();
  },
  'any parent class in prototype chain': function (test) {
    var instance = new Class3;
    instance.method2();
    test.deepEqual(callChain, ['Class1#method2', 'Class3#method2']);
    test.done();
  }
};

exports['_super method should work properly with the prototype chain'] = function (test) {
  var instance = new Class3;
  instance.method1();
  test.deepEqual(callChain, ['Class1#method1', 'Class2#method1', 'Class3#method1']);
  test.done();
};

exports['_super method should throw an error if method with same name does not found in parent class'] = {
  '': function (test) {
    var instance = new Class4;
    test.throws(function () {
      instance.method3();
    });
    test.done();
  },
  'even if this._super is already defined': function (test) {
    var instance = new Class5;
    test.throws(function () {
      instance.method3();
    });
    test.done();
  }
};

exports['_super method should be able to accept arguments'] = function (test) {
  var instance = new Class2;
  instance.method4();
  test.deepEqual(callChain, ['Class1#method4(arg1,arg2)', 'Class2#method4']);
  test.done();
};