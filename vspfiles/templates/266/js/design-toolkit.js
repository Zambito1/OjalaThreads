(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
/*
 * classList.js: Cross-browser full element.classList implementation.
 * 2014-07-23
 *
 * By Eli Grey, http://eligrey.com
 * Public Domain.
 * NO WARRANTY EXPRESSED OR IMPLIED. USE AT YOUR OWN RISK.
 */
/*global self, document, DOMException */
/*! @source http://purl.eligrey.com/github/classList.js/blob/master/classList.js*/
if ("document" in self) {

    // Full polyfill for browsers with no classList support
    if (!("classList" in document.createElement("_"))) {

        (function(view) {

            "use strict";

            if (!('Element' in view)) return;

            var
                classListProp = "classList",
                protoProp = "prototype",
                elemCtrProto = view.Element[protoProp],
                objCtr = Object,
                strTrim = String[protoProp].trim || function() {
                    return this.replace(/^\s+|\s+$/g, "");
                },
                arrIndexOf = Array[protoProp].indexOf || function(item) {
                    var
                        i = 0,
                        len = this.length;
                    for (; i < len; i++) {
                        if (i in this && this[i] === item) {
                            return i;
                        }
                    }
                    return -1;
                }
                // Vendors: please allow content code to instantiate DOMExceptions
                ,
                DOMEx = function(type, message) {
                    this.name = type;
                    this.code = DOMException[type];
                    this.message = message;
                },
                checkTokenAndGetIndex = function(classList, token) {
                    if (token === "") {
                        throw new DOMEx(
                            "SYNTAX_ERR", "An invalid or illegal string was specified"
                        );
                    }
                    if (/\s/.test(token)) {
                        throw new DOMEx(
                            "INVALID_CHARACTER_ERR", "String contains an invalid character"
                        );
                    }
                    return arrIndexOf.call(classList, token);
                },
                ClassList = function(elem) {
                    var
                        trimmedClasses = strTrim.call(elem.getAttribute("class") || ""),
                        classes = trimmedClasses ? trimmedClasses.split(/\s+/) : [],
                        i = 0,
                        len = classes.length;
                    for (; i < len; i++) {
                        this.push(classes[i]);
                    }
                    this._updateClassName = function() {
                        elem.setAttribute("class", this.toString());
                    };
                },
                classListProto = ClassList[protoProp] = [],
                classListGetter = function() {
                    return new ClassList(this);
                };
            // Most DOMException implementations don't allow calling DOMException's toString()
            // on non-DOMExceptions. Error's toString() is sufficient here.
            DOMEx[protoProp] = Error[protoProp];
            classListProto.item = function(i) {
                return this[i] || null;
            };
            classListProto.contains = function(token) {
                token += "";
                return checkTokenAndGetIndex(this, token) !== -1;
            };
            classListProto.add = function() {
                var
                    tokens = arguments,
                    i = 0,
                    l = tokens.length,
                    token, updated = false;
                do {
                    token = tokens[i] + "";
                    if (checkTokenAndGetIndex(this, token) === -1) {
                        this.push(token);
                        updated = true;
                    }
                }
                while (++i < l);

                if (updated) {
                    this._updateClassName();
                }
            };
            classListProto.remove = function() {
                var
                    tokens = arguments,
                    i = 0,
                    l = tokens.length,
                    token, updated = false,
                    index;
                do {
                    token = tokens[i] + "";
                    index = checkTokenAndGetIndex(this, token);
                    while (index !== -1) {
                        this.splice(index, 1);
                        updated = true;
                        index = checkTokenAndGetIndex(this, token);
                    }
                }
                while (++i < l);

                if (updated) {
                    this._updateClassName();
                }
            };
            classListProto.toggle = function(token, force) {
                token += "";

                var
                    result = this.contains(token),
                    method = result ?
                    force !== true && "remove" :
                    force !== false && "add";

                if (method) {
                    this[method](token);
                }

                if (force === true || force === false) {
                    return force;
                } else {
                    return !result;
                }
            };
            classListProto.toString = function() {
                return this.join(" ");
            };

            if (objCtr.defineProperty) {
                var classListPropDesc = {
                    get: classListGetter,
                    enumerable: true,
                    configurable: true
                };
                try {
                    objCtr.defineProperty(elemCtrProto, classListProp, classListPropDesc);
                } catch (ex) { // IE 8 doesn't support enumerable:true
                    if (ex.number === -0x7FF5EC54) {
                        classListPropDesc.enumerable = false;
                        objCtr.defineProperty(elemCtrProto, classListProp, classListPropDesc);
                    }
                }
            } else if (objCtr[protoProp].__defineGetter__) {
                elemCtrProto.__defineGetter__(classListProp, classListGetter);
            }

        }(self));

    } else {
        // There is full or partial native classList support, so just check if we need
        // to normalize the add/remove and toggle APIs.

        (function() {
            "use strict";

            var testElement = document.createElement("_");

            testElement.classList.add("c1", "c2");

            // Polyfill for IE 10/11 and Firefox <26, where classList.add and
            // classList.remove exist but support only one argument at a time.
            if (!testElement.classList.contains("c2")) {
                var createMethod = function(method) {
                    var original = DOMTokenList.prototype[method];

                    DOMTokenList.prototype[method] = function(token) {
                        var i, len = arguments.length;

                        for (i = 0; i < len; i++) {
                            token = arguments[i];
                            original.call(this, token);
                        }
                    };
                };
                createMethod('add');
                createMethod('remove');
            }

            testElement.classList.toggle("c3", false);

            // Polyfill for IE 10 and Firefox <24, where classList.toggle does not
            // support the second argument.
            if (testElement.classList.contains("c3")) {
                var _toggle = DOMTokenList.prototype.toggle;

                DOMTokenList.prototype.toggle = function(token, force) {
                    if (1 in arguments && !this.contains(token) === !force) {
                        return force;
                    } else {
                        return _toggle.call(this, token);
                    }
                };

            }

            testElement = null;
        }());

    }

}



/*
 * design-toolkit.js: Design Javascript Library
 *
 */

if (typeof jQuery === 'undefined') {
    var newScript = document.createElement('script');
    newScript.src = 'https://ajax.googleapis.com/ajax/libs/jquery/1.4.2/jquery.min.js';
    newScript.type = 'text/javascript';
    var docHead = document.getElementsByTagName('head')[0];
    var firstScript = document.getElementsByTagName('script')[0];
    docHead.insertBefore(newScript, firstScript);
    if (newScript.readyState) {
        newScript.onreadystatechange = function() {
            "use strict";
            if (newScript.readyState === 'loaded' || newScript.readyState === 'complete') {
                loadDTK(jQuery, window, document);
            }
        };
    } else {
        newScript.onload = function() {
            "use strict";
            loadDTK(jQuery, window, document);
        };
    }
} else {
    loadDTK(jQuery, window, document);
}

function loadDTK($, window, document, undefined) {
    "use strict";

    // Function to add classes to HTML tag on specified pages
    // used for name-spaced styling of checkout pages, contact,
    // thank you page, non-category/product pages, and deal of the day page.
    var htmlClasses = function(contactArticleID, hideOnClass) {
        var HTML = document.getElementsByTagName('html')[0];
        var PageClasses = {
            '': 'home', // Homepage
            'default.asp': 'home', // Homepage
            'searchresults.asp': 'category',
            'productslist.asp': 'category',
            'productdetails.asp': 'productdetails',
            'shoppingcart.asp': 'shoppingcart',
            'one-page-checkout.asp': 'onepagecheckout',
            'orderfinished.asp': 'thankyou',
            'dealoftheday.asp': 'dealoftheday',
            'register.asp': 'register',
            'orders.asp': 'orderhistory',
            'orderdetails.asp': 'orderdetails',
            'kb_results.asp': 'kb_results',
            'myaccount_myreviews.asp': 'myreviews',
            'ReviewMod.asp': 'myreviews'
        };

        // Remove "no-js" class just because
        HTML.classList.remove('no-js');
        // Well yeah
        HTML.classList.add('js');

        // Add loading class by default
        HTML.classList.add('u-loading');

        // Loop through object of pages and corresponding classes
        // to inject html tag class per page basis
        for (var Page in PageClasses) {
            var pageName = PageName().replace(/\#.*/g, '');
            if (PageClasses.hasOwnProperty(Page)) {
                if (pageName === Page) {
                    HTML.classList.add(PageClasses[Page])
                }
            }
        }

        // Add contact class on contact pages
        // uses contactArticleID to determine appropriate article page
        if (contactArticleID !== undefined) {
            if (/^\d+$/.test(contactArticleID)) {
                var currentPage = location.pathname.substr(1).toLowerCase();
                if (currentPage === 'articles.asp') {
                    var articlePage = (currentPage + location.search).toLowerCase();
                    var articlePttn = '(articles\\.asp\\?id=' + contactArticleID + ')';
                    var articleRegEx = new RegExp(articlePttn, "i");
                    var articleCheck = articleRegEx.test(articlePage);
                    if (articleCheck) {
                        HTML.classList.add('contact');
                    }
                }
            }
        }

        // Adds helper class on all non category and product pages
        if (hideOnClass !== undefined) {
            if (PageName() !== 'searchresults.asp' && PageName() !== 'productdetails.asp') {
                HTML.classList.add(hideOnClass);
            }
        }
    }
    htmlClasses('83', 'l-full-width');

    window.DTK = {
        addWindowLoadEvent: function(func) {
            if (func) {
                if (window.addEventListener) {
                    window.addEventListener("load", func, false);
                } else {
                    window.attachEvent("onload", func);
                }
                return this;
            } else {
                return false;
            }
        },

        removeBreadcrumb: function() {
            var ele = document.getElementById('content_area');
            var tables = ele.getElementsByTagName('table');
            var toremove = tables[0];

            toremove.parentNode.removeChild(toremove);
            return this;
        },

        removeAllTablePadding: function() {
            var allTables = document.getElementsByTagName('table');
            var nTables = allTables.length;
            for (var i = 0; i < nTables; i++) {
                allTables[i].setAttribute('cellpadding', '0');
                allTables[i].setAttribute('cellspacing', '0');
            }
            return this;
        },

        injectTag: function(options) {
            var defaultSettings = {
                "type": null,
                "url": null,
                "callback": null,
                "node": "script",
                "cache": true,
                "class": null
            };
            for (var i in defaultSettings) {
                if (typeof options[i] === 'undefined') {
                    options[i] = defaultSettings[i];
                }
            }
            var parentOfNode = document.getElementsByTagName(options.node)[0];
            if (options.type === 'stylesheet') {
                var docHead = parentOfNode.parentNode;
                if (document.createStyleSheet) {
                    document.createStyleSheet(options.url);
                    return this;
                } else {
                    var cssTag = document.createElement('link');
                    cssTag.setAttribute('rel', 'stylesheet');
                    cssTag.setAttribute('type', 'text/css');
                    cssTag.setAttribute('href', options.url);
                    docHead.appendChild(cssTag);
                    return this;
                }
            } else if (options.type === 'script') {
                var script = document.createElement('script');
                script.type = 'text/javascript';
                var ts = new Date().getTime();
                if (script.readyState) {
                    script.onreadystatechange = function() {
                        if (script.readyState === 'loaded' || script.readyState === 'complete') {
                            script.onreadystatechange = null;
                            if (typeof options.callback === 'function') {
                                options.callback();
                            }
                        }
                    };
                } else {
                    script.onload = function() {
                        if (typeof options.callback === 'function') {
                            options.callback();
                        }
                    };
                }
                if (options.cache === false) {
                    options.url += (/\?/.test(options.url) ? '&' : '?') + 'vjsNoCache=' + ts;
                }
                script.src = options.url;
                parentOfNode.parentNode.insertBefore(script, parentOfNode);
                return this;
            }
        },

        checkPage: function(targetPage) {
            if (typeof PageName === 'function') {
                if (PageName().split('#')[0] === targetPage.toLowerCase()) {
                    return true;
                } else {
                    if (targetPage.toLowerCase() === 'default.asp') {
                        if (PageName().split('#')[0] === '') {
                            return true;
                        }
                        return false;
                    }
                }
            }
        },

        loadCSS: function(templateName) {
            if (!templateName) {
                window.alert('No template name specified');
                return false;
            }
        },

        placeholderPolyfill: function() {
            var ti = document.createElement('input');
            if (!('placeholder' in ti)) {
                $('input[placeholder]').each(function() {
                    var val = $(this).attr('placeholder');
                    $(this).removeAttr('placeholder').val(val);
                    $(this).bind({
                        focus: function() {
                            var curVal = $(this).val();
                            if (curVal === val) {
                                $(this).val('');
                            }
                        },
                        blur: function() {
                            if ($(this).val() === '') {
                                $(this).val(val);
                            }
                        }
                    });
                });
            }
        },

        formCheck: function(formObj) {
            var ff36 = typeof document.body.style.MozBoxShadow === 'undefined' ? false : true;
            var ie8 = window.attachEvent ? true : false;
            var saf = window.WebKitAnimationEvent && !(window.WebGLActiveInfo) ? true : false;
            var formEls = formObj.elements;
            var errors = 0;

            if (ff36 || ie8 || saf) {
                //debugger;
                $.each(formEls, function(i, el) {
                    el.style.outline = "";
                    if (el.getAttribute('required')) {
                        if (el.value === "" || el.selectedIndex === -1) {
                            if (el.hasAttribute === undefined) {
                                el.style.border = "1px solid #d30000";
                            } else {
                                el.style.outline = "1px solid #d30000";
                            }
                            errors++;
                        }
                    } else if (el.getAttribute('type') === 'email') {
                        var e = /^(([^<>\(\)\[\]\\.,;:\s@\"]+(\.[^<>\(\)\[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-z\-0-9]+\.)+[a-z]{2,}))$/i;
                        var validEmail = e.test(el.value);
                        if (!validEmail) {
                            if (el.hasAttribute === undefined) {
                                el.style.border = "1px solid #d30000";
                            } else {
                                el.style.outline = "1px solid #d30000";
                            }
                            errors++;
                        }
                    }
                });

                if (errors > 0) {
                    window.alert('The fields in red are either required or invalid.');
                    return false;
                }
            } else if ($("#Email_1").val() !== $("#Email_2").val()) {
                window.alert("The emails do not match.");
                return false;
            } else {
                return true;
            }
        },

        addYear: function() {
            var year = (new Date()).getFullYear();
            if ($('.insertYear').length > 0) {
                $('.insertYear').html(year);
            }
        },

        init: function() {
            this.placeholderPolyfill();
            this.addYear();
        }

    }; //end definition of window.DTK

    $(document).ready(function() {
        DTK.init();
    });

    window.volMobile=/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);


    // var contentArea = document.getElementById("content_area");
    // contentArea.onload = function(){
    //     var h = document.getElementsByTagName('html')[0];
    //     setTimeout(function() {h.classList.remove('u-loading')}, 30);
    // };


}
},{}]},{},[1]);
