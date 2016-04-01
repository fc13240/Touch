! function() {
	function a() {
		var a, b = navigator.userAgent,
			c = b.match(/(opera|chrome|safari|firefox|msie|trident(?=\/))\/?\s*(\d+)/i) || [];
		return /trident/i.test(c[1]) ? (a = /\brv[ :]+(\d+)/g.exec(b) || [], "ie" + (a[1] || "")) : "Chrome" === c[1] && (a = b.match(/\bOPR\/(\d+)/), null !== a) ? "opera" + a[1] : (c = c[2] ? [c[1], c[2]] : [navigator.appName, navigator.appVersion, "-?"], null !== (a = b.match(/version\/(\d+)/i)) && c.splice(1, 1, a[1]), c[0] + c[1])
	}
	var b = "unknown";
	try {
		b = a()
	} catch (c) {}
	try {
		new Float32Array(100);
		window.onerror = function(a, c, d, e, f) {
			// ga("send", "event", "error v" + W.version, a + " URL:" + c + " LINE:" + d + " COLUMN:" + e + " BROWSER:" + b + " " + navigator.userAgent), ga("send", "pageview", "errors/" + W.version + "/" + b + "/" + d + "/" + e + "/" + a)
		}
	} catch (c) {
		window.onload = function() {
			var a = document.getElementById("not-supported");
			// a.style.display = "block", window.ga && ga("send", "pageview", "notSupported/" + b + "/" + navigator.userAgent)
		}
	}
}(),
function(a) {
	function b(a, b) {
		return function() {
			a.apply(b, arguments)
		}
	}

	function c(a) {
		if ("object" != typeof this) throw new TypeError("Promises must be constructed via new");
		if ("function" != typeof a) throw new TypeError("not a function");
		this._state = null, this._value = null, this._deferreds = [], i(a, b(e, this), b(f, this))
	}

	function d(a) {
		var b = this;
		return null === this._state ? void this._deferreds.push(a) : void j(function() {
			var c = b._state ? a.onFulfilled : a.onRejected;
			if (null === c) return void(b._state ? a.resolve : a.reject)(b._value);
			var d;
			try {
				d = c(b._value)
			} catch (e) {
				return void a.reject(e)
			}
			a.resolve(d)
		})
	}

	function e(a) {
		try {
			if (a === this) throw new TypeError("A promise cannot be resolved with itself.");
			if (a && ("object" == typeof a || "function" == typeof a)) {
				var c = a.then;
				if ("function" == typeof c) return void i(b(c, a), b(e, this), b(f, this))
			}
			this._state = !0, this._value = a, g.call(this)
		} catch (d) {
			f.call(this, d)
		}
	}

	function f(a) {
		this._state = !1, this._value = a, g.call(this)
	}

	function g() {
		for (var a = 0, b = this._deferreds.length; b > a; a++) d.call(this, this._deferreds[a]);
		this._deferreds = null
	}

	function h(a, b, c, d) {
		this.onFulfilled = "function" == typeof a ? a : null, this.onRejected = "function" == typeof b ? b : null, this.resolve = c, this.reject = d
	}

	function i(a, b, c) {
		var d = !1;
		try {
			a(function(a) {
				d || (d = !0, b(a))
			}, function(a) {
				d || (d = !0, c(a))
			})
		} catch (e) {
			if (d) return;
			d = !0, c(e)
		}
	}
	var j = c.immediateFn || "function" == typeof setImmediate && setImmediate || function(a) {
			setTimeout(a, 1)
		},
		k = Array.isArray || function(a) {
			return "[object Array]" === Object.prototype.toString.call(a)
		};
	c.prototype["catch"] = function(a) {
		return this.then(null, a)
	}, c.prototype.then = function(a, b) {
		var e = this;
		return new c(function(c, f) {
			d.call(e, new h(a, b, c, f))
		})
	}, c.all = function() {
		var a = Array.prototype.slice.call(1 === arguments.length && k(arguments[0]) ? arguments[0] : arguments);
		return new c(function(b, c) {
			function d(f, g) {
				try {
					if (g && ("object" == typeof g || "function" == typeof g)) {
						var h = g.then;
						if ("function" == typeof h) return void h.call(g, function(a) {
							d(f, a)
						}, c)
					}
					a[f] = g, 0 === --e && b(a)
				} catch (i) {
					c(i)
				}
			}
			if (0 === a.length) return b([]);
			for (var e = a.length, f = 0; f < a.length; f++) d(f, a[f])
		})
	}, c.resolve = function(a) {
		return a && "object" == typeof a && a.constructor === c ? a : new c(function(b) {
			b(a)
		})
	}, c.reject = function(a) {
		return new c(function(b, c) {
			c(a)
		})
	}, c.race = function(a) {
		return new c(function(b, c) {
			for (var d = 0, e = a.length; e > d; d++) a[d].then(b, c)
		})
	}, "undefined" != typeof module && module.exports ? module.exports = c : a.Promise || (a.Promise = c)
}(this),
/*! 
Adrian Cooney <cooney.adrian@gmail.com> License: MIT */
function(a) {
	function b(a, b, d, f) {
		var g, h;
		if ("function" == typeof b ? (h = b, g = []) : (g = b, h = d), e[a]) throw "DI conflict: Module " + a + " already defined.";
		return e[a] = {
			name: a,
			callback: h,
			loaded: null,
			wasLoaded: !1,
			dependencies: g
		}, f && c(e[a]), e[a]
	}

	function c(a) {
		var b = [];
		return a.dependencies.forEach(function(a) {
			var d = e[a];
			if (!d) throw "DI error: Module " + a + " not defined";
			d.wasLoaded ? b.push(d.loaded) : b.push(c(d))
		}), a.loaded = a.callback.apply(null, b), a.wasLoaded = !0, W[a.name] ? console.error("DI error: Object W." + a.name + " already exists") : W[a.name] = a.loaded, a.loaded
	}

	function d(a, b) {
		var d, f, g;
		"function" == typeof a ? (f = a, d = []) : (d = a, f = b), g = c({
			callback: f,
			dependencies: d
		});
		for (var h in e) e[h].wasLoaded || console.warn("DI warning: module " + h + " defined but not loaded")
	}
	var e = {};
	a.W || (a.W = {}), d.modules = e, a.W.require = d, a.W.define = b
}(window) /*! */

var is_native = typeof global !== 'undefined' && typeof global.process !== 'undefined';
!function(){
	var fn_error = function(e){
		console.log('sysErr',e.stack);
		return false;
	}
	if(is_native){
		process.on('uncaughtException',fn_error);
	}
	window.onerror = fn_error;
}();