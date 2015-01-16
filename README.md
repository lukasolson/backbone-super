[![Build Status](https://travis-ci.org/lukasolson/backbone-super.svg)](https://travis-ci.org/lukasolson/backbone-super)

# Backbone-Super

This Backbone.js plugin provides a convenient super method.

Usually, when you're using Backbone.js, you have to do some funky (well, not funky... Javascript-y) stuff to be able to access parent methods.

From the Backbone.js documentation:

> Brief aside on super: JavaScript does not provide a simple way to call super — the function of the same name defined higher on the prototype chain. If you override a core function like set, or save, and you want to invoke the parent object's implementation, you'll have to explicitly call it, along these lines:

> ```javascript
var Note = Backbone.Model.extend({
	set: function(attributes, options) {
		Backbone.Model.prototype.set.call(this, attributes, options);
		...
	}
});
```

After including this plugin, you can do the same thing with the following syntax:

```javascript
var Note = Backbone.Model.extend({
	set: function(attributes, options) {
		this._super(attributes, options);
		...
	}
});
```

To use it, simply include it after you include Backbone.js:

```javascript
<script type="text/javascript" src="backbone.js"></script>
<script type="text/javascript" src="backbone-super.js"></script>
```

License: MIT

