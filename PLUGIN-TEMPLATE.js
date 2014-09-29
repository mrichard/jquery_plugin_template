(function($, window, document, undefined){

    "use strict";

    // shortcut to Array#slice method
    var slice = Array.prototype.slice;

    // extend $.Class - more info http://ejohn.org/blog/simple-javascript-inheritance/
    // this is where the core functionality should be defined. Each jquery object that gets called with this plugin will instantiate this class.
    $.[PLUGIN_NAME] = $.Class.extend({

        // this function runs on instantiation. Ex: new $.[PLUGIN_NAME](this, options);
        // any instance variables should be defined in here
        // element is the jquery dom object
        // options are the options passed in (after the merge with default)
        // 'this' will be the [PLUGIN_NAME] Class instance
        initialize: function (element, options) {

        }
    });

    $.fn.[PLUGIN_NAME] = function (options) {

        var args = slice.call(arguments, 1), method;

        // was a string passed into the plugin call ex: $("#myElement").pluginName('do_cool_stuff');
        // used to trigger behavior possibly after the plugin has started up
        if (typeof options === 'string') {
            method = options;
            options = null;
        }

        // for each jquery element ex: $(".link").pluginName() // could be more then one .link on the page
        return this.each(function(){

            // check for instance already instantiated and stored in data()
            // more info http://api.jquery.com/data/
            var instance = $.data(this, '[PLUGIN_DATA_STORAGE]');

            // merge the options passed in with the default options. 
            // Example you could have a default animation speed defined in defaults = {} but when the plugin is called you pass in a custom animation speed which will override the default.
            options = $.extend({}, $.fn.[PLUGIN_NAME].defaults, options);

            // if no instance then instantiate the [PLUGIN_NAME] Class and store it in data()
            if (!instance) {
                instance = new $.[PLUGIN_NAME](this, options);
                $.data(this, '[PLUGIN_DATA_STORAGE]', instance);
            }

            // if method was passed in, then run it
            if (method) {
                instance[method].apply(instance, args);
            }
        });
    };


    // default settings for plugin
    $.fn.[PLUGIN_NAME].defaults = {
    };

}(jQuery, window, document));