!function(){function e(){var e,t=navigator.userAgent,n=t.match(/(opera|chrome|safari|firefox|msie|trident(?=\/))\/?\s*(\d+)/i)||[];return/trident/i.test(n[1])?(e=/\brv[ :]+(\d+)/g.exec(t)||[],"ie"+(e[1]||"")):"Chrome"===n[1]&&(e=t.match(/\bOPR\/(\d+)/),null!==e)?"opera"+e[1]:(n=n[2]?[n[1],n[2]]:[navigator.appName,navigator.appVersion,"-?"],null!==(e=t.match(/version\/(\d+)/i))&&n.splice(1,1,e[1]),n[0]+n[1])}var t="unknown";try{t=e()}catch(n){}try{new Float32Array(100),window.onerror=function(){}}catch(n){window.onload=function(){document.getElementById("not-supported")}}}(),function(e){function t(e,t){return function(){e.apply(t,arguments)}}function n(e){if("object"!=typeof this)throw new TypeError("Promises must be constructed via new");if("function"!=typeof e)throw new TypeError("not a function");this._state=null,this._value=null,this._deferreds=[],u(e,t(r,this),t(i,this))}function o(e){var t=this;return null===this._state?void this._deferreds.push(e):void f(function(){var n=t._state?e.onFulfilled:e.onRejected;if(null===n)return void(t._state?e.resolve:e.reject)(t._value);var o;try{o=n(t._value)}catch(r){return void e.reject(r)}e.resolve(o)})}function r(e){try{if(e===this)throw new TypeError("A promise cannot be resolved with itself.");if(e&&("object"==typeof e||"function"==typeof e)){var n=e.then;if("function"==typeof n)return void u(t(n,e),t(r,this),t(i,this))}this._state=!0,this._value=e,a.call(this)}catch(o){i.call(this,o)}}function i(e){this._state=!1,this._value=e,a.call(this)}function a(){for(var e=0,t=this._deferreds.length;t>e;e++)o.call(this,this._deferreds[e]);this._deferreds=null}function c(e,t,n,o){this.onFulfilled="function"==typeof e?e:null,this.onRejected="function"==typeof t?t:null,this.resolve=n,this.reject=o}function u(e,t,n){var o=!1;try{e(function(e){o||(o=!0,t(e))},function(e){o||(o=!0,n(e))})}catch(r){if(o)return;o=!0,n(r)}}var f=n.immediateFn||"function"==typeof setImmediate&&setImmediate||function(e){setTimeout(e,1)},l=Array.isArray||function(e){return"[object Array]"===Object.prototype.toString.call(e)};n.prototype["catch"]=function(e){return this.then(null,e)},n.prototype.then=function(e,t){var r=this;return new n(function(n,i){o.call(r,new c(e,t,n,i))})},n.all=function(){var e=Array.prototype.slice.call(1===arguments.length&&l(arguments[0])?arguments[0]:arguments);return new n(function(t,n){function o(i,a){try{if(a&&("object"==typeof a||"function"==typeof a)){var c=a.then;if("function"==typeof c)return void c.call(a,function(e){o(i,e)},n)}e[i]=a,0===--r&&t(e)}catch(u){n(u)}}if(0===e.length)return t([]);for(var r=e.length,i=0;i<e.length;i++)o(i,e[i])})},n.resolve=function(e){return e&&"object"==typeof e&&e.constructor===n?e:new n(function(t){t(e)})},n.reject=function(e){return new n(function(t,n){n(e)})},n.race=function(e){return new n(function(t,n){for(var o=0,r=e.length;r>o;o++)e[o].then(t,n)})},"undefined"!=typeof module&&module.exports?module.exports=n:e.Promise||(e.Promise=n)}(this),function(e){function t(e,t,o,i){var a,c;if("function"==typeof t?(c=t,a=[]):(a=t,c=o),r[e])throw"DI conflict: Module "+e+" already defined.";return r[e]={name:e,callback:c,loaded:null,wasLoaded:!1,dependencies:a},i&&n(r[e]),r[e]}function n(e){var t=[];return e.dependencies.forEach(function(e){var o=r[e];if(!o)throw"DI error: Module "+e+" not defined";t.push(o.wasLoaded?o.loaded:n(o))}),e.loaded=e.callback.apply(null,t),e.wasLoaded=!0,W[e.name]?console.error("DI error: Object W."+e.name+" already exists"):W[e.name]=e.loaded,e.loaded}function o(e,t){var o,i,a;"function"==typeof e?(i=e,o=[]):(o=e,i=t),a=n({callback:i,dependencies:o});for(var c in r)r[c].wasLoaded||console.warn("DI warning: module "+c+" defined but not loaded")}var r={};e.W||(e.W={}),o.modules=r,e.W.require=o,e.W.define=t}(window);var is_native="undefined"!=typeof global&&"undefined"!=typeof global.process;!function(){var e=function(e){return console.log("sysErr",e.stack),!1};is_native&&process.on("uncaughtException",e),window.onerror=e}();