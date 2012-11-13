/*
 * Copyright 2012 Max Schuster 
 * 
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

(function($, undefinded) {
    
    var privateMethods = {
        /**
         * Handler for events that trigger a value check
         */
        check: function(e) {
            var $this = $(e.target),
                    data = $this.data('validator'),
                    ajax = data.settings.ajax,
                    oldValid = data.valid,
                    regex = data.mask,
                    value = $this.val(),
                    rel = data.settings.rel;

            var setIsValid = function(valid) {

                data.valid = valid;

                $this.data('validator', data);

                if (valid) {
                    $this.removeClass('validator-invalid');
                    if (oldValid !== valid) { // check if state changed
                        $this.trigger('valid.validator');
                    }
                } else {
                    $this.addClass('validator-invalid');
                    if (oldValid !== valid) { // check if state changed
                        $this.trigger('invalid.validator');
                    }
                }
                
                $this.trigger('checkedValue.validator');

            };

            if (data.disabled === true || data.settings.optional === true && value === '') {
                setIsValid(true);
            } else if (rel !== false) {
                var $rel = $(rel);
                setIsValid($rel.validator('valid') && value === $rel.val());
            } else if (ajax !== false) {
                $.ajax({
                    url: ajax,
                    dataType: 'json',
                    cache: false,
                    type: 'post',
                    data: {
                        'jquery_validate': value
                    },
                    success: function(data) {
                        setIsValid(data);
                    }
                });
            } else {
                regex.lastIndex = 0;
                setIsValid(regex.test(value));
            }
        }
    };

    var methods = {
        /**
         * Initializes the plugin on the given set of jQuery elements
         */
        init: function(options) {

            return this.each(function() {

                var $this = $(this),
                        data = $this.data('validator');

                // Exit if element not supported
                if (!$this.is('input[type="text"], input[type="password"], textarea')) {
                    return;
                }

                // If the plugin hasn't been initialized yet
                if (!data) {

                    /*
                     Do more setup stuff here
                     */

                    data = {
                        settings: {
                            mask: 'notEmpty',
                            // Predifined regexp masks
                            predefinedMasks: {
                                // http://stackoverflow.com/questions/46155/validate-email-address-in-javascript#answer-46181
                                'email': /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
                                'notEmpty': /^.+$/gm,
                                'zipCode': /^\d{4,5}$/, // Valid for "DE" and "AT"
                                'noWhiteSpace': /^\w+$/g
                            },
                            ajax: false,
                            optional: false,
                            liveCheck: false,
                            rel: false
                        },
                        mask: null,
                        valid: false,
                        disabled: false
                    };

                }

                $this.addClass('validator');

                $.extend(true, data.settings, options);

                if (typeof data.settings.mask === 'string') {
                    if (data.settings.predefinedMasks[data.settings.mask]) {
                        data.mask = data.settings.predefinedMasks[data.settings.mask];
                    } else {
                        data.mask = new RegExp(data.settings.mask);
                    }
                } else {
                    data.mask = data.settings.mask;
                }

                $this.data('validator', data);

                $this.off('.validator');

                if (data.settings.liveCheck === true) {
                    $this.on('keydown.validator keyup.validator keypress.validator change.validator blur.validator', privateMethods.check);
                    $this.trigger('change.validator');
                } else {
                    $this.on('change.validator blur.validator', privateMethods.check);
                    $this.trigger('change.validator');
                }

                if (data.settings.rel) {
                    $(data.settings.rel).on('checkedValue.validator', function() {
                        $this.trigger('change.validator');
                    });
                }
            });
        },
        destroy: function( ) {

            return this.each(function() {

                var $this = $(this),
                        data = $this.data('validator');
                if (data === undefinded) {
                    return;
                }
                
                // Namespacing FTW
                $this.off('.validator');
                
                $this.removeData('validator').removeClass('validator validator-invalid');

            });

        },
        disable: function() {

            return this.each(function() {

                var $this = $(this),
                        data = $this.data('validator');

                if (data === undefinded)
                    return;

                data.disabled = true;

                $this.data('validator', data);

                $this.trigger('change.validator');

            });

        },
        enable: function() {

            return this.each(function() {

                var $this = $(this),
                        data = $this.data('validator');

                if (data === undefinded)
                    return;

                data.disabled = false;

                $this.data('validator', data);
                
                $this.trigger('change.validator');

            });

        },
        valid: function() {

            var $this = $(this), result = true;

            $this.each(function() {

                var data = $(this).data('validator');

                if (data !== undefinded && data.valid === false) {
                    result = false;
                    return false;
                }
            });

            return result;

        }
    };

    $.fn.validator = function(method) {

        if (methods[method]) {
            return methods[method].apply(this, Array.prototype.slice.call(arguments, 1));
        } else if (typeof method === 'object' || !method) {
            return methods.init.apply(this, arguments);
        } else {
            $.error('Method ' + method + ' does not exist on jQuery.vaidator');
        }

    };

})(jQuery);