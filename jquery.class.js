// An implementation of a base Class inspired from John Resig's [Simple
// JavaScript Inheritance](http://bit.ly/4U5H) and Jeremy Ashkenas'
// [Backbone](http://bit.ly/rs31BV) implementations.

(function(){

	'use strict';

	// Initial Setup
	// -------------

	var root = this;

	// Local reference to the global jQuery object.
	var $ = root.jQuery;

	// Local reference to the global underscore object.
	var _ = root._;

	// A private regular expression used to test if `_super_` is actually called
	// within an extended class method. Most methods aren't overriden, so for
	// the sake of performance it is worth the effort. Some platforms don't
	// allow the decompilation of functions. Hence, the regular expression test.
	var _overriding = /xyz/.test(function(){'xyz';}) ? /\b_super_\b/ : /.*/;

	// Class
	// -----

	// The base Class constructor.
	var Class = $.Class = function () {
		if (this.initialize) {
			this.initialize.apply(this, arguments);
		}
	};

	// The base Class static properties.
	_.extend(Class, {

		// Similar to `extend`, except that it adopts properties from one or
		// more other classes without inheritance. It's intended to reduce some
		// limitations of single inheritance by enabling a developer to reuse
		// sets of methods freely in several independent classes living in
		// different class hierarchies.
		// @static
		// @param {Class} Class...
		implement: function () {
			var prototype = this.prototype;
			_.each(arguments, function (Class) {
				var instance = new Class();
				for (var name in instance) {
					prototype[name] = instance[name];
				}
			});
		},

		// Creates a new Class that inherits from this class.
		// @static
		// @param {Object} [instanceProperties] properties that belong to each
		// instance generated from this class.
		// @param {Object} [staticProperties] properties that belong to the
		// class itself.
		extend: function (instanceProperties, staticProperties) {

			var Parent = this;
			var Child;

			// The constructor function for the new subclass is either defined
			// by you (the "constructor" property in your `extend` definition),
			// or defaulted by us to simply call the parent's constructor.
			if (instanceProperties && _.has(instanceProperties, 'constructor')) {
				Child = instanceProperties.constructor;
			} else {
				Child = function () {
					return Parent.apply(this, arguments);
				};
			}

			// Add static properties to the constructor function, if supplied.
			_.extend(Child, Parent, staticProperties);

			// Set the prototype chain to inherit from `Parent`, without calling
			// `Parent`'s constructor function.
			var Surrogate = function () { this.constructor = Child; };
			Surrogate.prototype = Parent.prototype;
			Child.prototype = new Surrogate();

			// Add prototype properties (instance properties) to the subclass,
			// if supplied.
			_.each(instanceProperties, function (property, name) {

				// Check if we're overwriting an existing function
				if (_.isFunction(property) &&
					_.isFunction(Parent.prototype[name]) &&
					_overriding.test(property)) {

					Child.prototype[name] = function () {
						var tmp = this._super_;

						// Add a new `._super_()` method that is the same
						// method but on the super-class.
						this._super_ = Parent.prototype[name];

						// The method only need to be bound temporarily, so we
						// remove it when we're done executing
						var result = property.apply(this, arguments);

						this._super_ = tmp;

						return result;
					};

				// Otherwise, simply copy over the property
				} else {
					Child.prototype[name] = property;
				}
			});

			return Child;
		}

	});

}).call(this);