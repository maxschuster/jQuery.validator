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
         * @ToDo: Clean this method...
         */
        check: function(e) {
            var $this = $(e.target),
                    data = $this.data('validator'),
                    ajax = data.settings.ajax,
                    oldValid = data.valid,
                    regex = data.mask,
                    value = $this.val(),
                    rel = data.settings.rel;
            
            if (data.oldValue === value) {
                return;
            }
            
            data.oldValue = value;
            
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
                
                $this.trigger('checkedvalue.validator');

            };

            if (data.disabled === true || data.settings.optional === true && value === '') {
                setIsValid(true);
            } else if (rel !== false) {
                var $rel = $(rel);
                setIsValid($rel.validator('valid') && value === $rel.val());
            } else if (ajax !== false) {
                
                data.ajaxTimer.timer({
                    delay: data.ajaxRefreshInterval,
                    autoStart: true
                }).on('complete.timer', function () {
                    $.ajax({
                        url: ajax,
                        dataType: 'json',
                        cache: false,
                        type: 'post',
                        data: {
                            'jquery_validate': value
                        },
                        success: function(data) {
                            $this.removeClass('validator-loading');
                            setIsValid(data);
                        },
                        error: function() {
                            $this.removeClass('validator-loading');
                            setIsValid(false);
                        }
                    });
                });
                
                $this.addClass('validator-loading');
                
                
            } else {
                regex.lastIndex = 0;
                setIsValid(regex.test(value));
            }
            
            $this.data('validator', data);
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
                            mask: 'required',
                            // Predifined regexp masks
                            predefinedMasks: {
                                // http://stackoverflow.com/questions/46155/validate-email-address-in-javascript#answer-46181
                                'email': /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
                                'required': /^.+$/gm,
                                'zip_code_ger_and_at': /^\d{4,5}$/, // Valid for "DE" and "AT"
                                'no_white_space': /^\w+$/g,
                                'number': /^\d+((?:\.\d{0,})?(?:\,\d{0,})?)$/,
                                'integer': /^\d+$/,
                                'date_day_month_year': /^\d{1,2}\.\d{1,2}\.(\d{2}|\d{4})$/,
                                'date_year_month_day': /^\d{4}-\d{2}-\d{2}$/
                            },
                            ajax: false,
                            ajaxRefreshInterval: 2000,
                            optional: false,
                            liveCheck: false,
                            rel: false
                        },
                        mask: null,
                        valid: false,
                        disabled: false,
                        ajaxTimer: $({}),
                        oldValue: undefined
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
                    $(data.settings.rel).on('checkedvalue.validator', function() {
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

/*
 * jQuery.timer
 * Copyright 2012 Max Schuster 
 * Licensed under the Apache License, Version 2.0 (the "License");
 * You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0
 */
(function(c,f){var g=function(){return this.each(function(){var b=c(this),a=b.data("timer");c.extend(a,{currentCount:a.currentCount+1});c(this).data("timer",a);0!==a.settings.repeatCount&&a.currentCount>=a.settings.repeatCount?(b.timer("stop",!1),b.trigger("complete.timer",{delay:a.settings.delay,repeatCount:a.settings.repeatCount,currentCount:a.currentCount,running:a.running})):b.trigger("tick.timer",{delay:a.settings.delay,repeatCount:a.settings.repeatCount,currentCount:a.currentCount,running:a.running})})},
e={init:function(b){return this.each(function(){var a=c(this),d=a.data("timer");d&&a.timer("destroy");d={currentCount:0,running:!1,interval:null,settings:{delay:1E3,repeatCount:1,autoStart:!1}};c.extend(d.settings,b);a.data("timer",d);!0===d.settings.autoStart&&a.timer("start")})},destroy:function(){return this.each(function(){var b=c(this),a=b.data("timer");b.timer("stop",!1);b.trigger("destroy.timer",{delay:a.settings.delay,repeatCount:a.settings.repeatCount,currentCount:a.currentCount,running:a.running});
b.off(".timer");b.removeData("timer")})},reset:function(){return this.each(function(){var b=c(this),a=b.data("timer");b.timer("stop",!1);c.extend(a,{currentCount:0});c(this).data("timer",a);b.trigger("reset.timer",{delay:a.settings.delay,repeatCount:a.settings.repeatCount,currentCount:a.currentCount,running:a.running})})},start:function(){return this.each(function(){var b=c(this),a=b.data("timer");c.extend(a,{interval:setInterval(c.proxy(g,b),a.settings.delay),running:!0});c(this).data("timer",a);
b.trigger("start.timer",{delay:a.settings.delay,repeatCount:a.settings.repeatCount,currentCount:a.currentCount,running:a.running})})},stop:function(b){b===f&&(b=!0);return this.each(function(){var a=c(this),d=a.data("timer");clearInterval(d.interval);c.extend(d,{interval:null,running:!1});c(this).data("timer",d);!0===b&&a.trigger("stop.timer",{delay:d.settings.delay,repeatCount:d.settings.repeatCount,currentCount:d.currentCount,running:d.running})})}};c.fn.timer=function(b){if(e[b])return e[b].apply(this,
Array.prototype.slice.call(arguments,1));if("object"===typeof b||!b)return e.init.apply(this,arguments);c.error("Method "+b+" does not exist on jQuery.timer")}})(jQuery);