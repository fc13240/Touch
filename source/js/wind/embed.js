/*!
	Copyright(c) 2014 - 2015, 2016, 2017 Citationtech SE, Windyty SE
	All rights reserved 
*/
function parseNewParams() {
	for (var a = {}, b = window.location.hash.substring(1), c = window.location.search.substring(1), d = (b || c).split("&"), e = 0; e < d.length; e++) {
		var f = d[e].split("=");
		a[decodeURIComponent(f[0])] = decodeURIComponent(f[1])
	}
	return a
}
function ga() {
	console.log.apply(console, arguments);
}
function parseOldParams() {
	for (var a = window.location.search.substring(1), b = a.split(","), c = {}, d = {
			levels: ["surface", "100m", "975h", "950h", "925h", "900h", "850h", "800h", "700h", "600h", "500h", "400h", "300h", "250h", "200h", "150h"],
			overlays: ["wind", "gust", "rain", "temp", "dewpoint", "clouds", "lclouds", "mclouds", "hclouds", "cbase", "visibility", "rainAccu", "snowAccu", "rh", "ozone", "cape", "pressure", "waves", "swell", "swell1", "swell2", "swell3", "wwaves", "sst", "sstanom", "currents"]
		}, e = 0; e < b.length; e++) {
		if (/^-?\d+\.\d+$/.test(b[e]) && /^-?\d+\.\d+$/.test(b[e + 1]) && /^\d+$/.test(b[e + 2])) {
			var f = parseInt(b[e + 2]);
			c.lat = parseFloat(b[e]), c.lon = parseFloat(b[e + 1]), f > 100 ? c.zoom = 4 : c.zoom = f, c.location = "coordinates", e += 2
		}
		var g = b[e];
		if (d.levels.indexOf(g) > -1 && (c.level = g), d.overlays.indexOf(g) > -1 && (c.overlay = g), "message" === g && (c.message = !0), "ip" === g && (c.location = "ip"), "marker" === g && (c.marker = !0), /metric/.test(g)) {
			var h = g.match(/metric\.(.+)\.(.+)/);
			1 === h[2].length && (h[2] = "°" + h[2]), c[h[1]] = h[2]
		}
	}
	return c.oldVersion = !0, console.log("%c Aloha! We have faster and more detailed version of Windytv widget for you. Please update your code at https://www.windytv.com/widgets", "color: blue; font-size: 200%;"), c
}! function() {
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
			ga("send", "event", "error v" + W.version, a + " URL:" + c + " LINE:" + d + " COLUMN:" + e + " BROWSER:" + b + " " + navigator.userAgent), ga("send", "pageview", "errors/" + W.version + "/" + b + "/" + d + "/" + e + "/" + a)
		}, window.onunhandledrejection = function(a) {
			console.error("Unhandled rejection (promise: ", a.promise, ", reason: ", a.reason, ").")
		}
	} catch (c) {
		window.onload = function() {
			var a = document.getElementById("not-supported");
			a.style.display = "block", ga("send", "pageview", "notSupported/" + b + "/" + navigator.userAgent)
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
		for (var a = 0, b = this._deferreds.length; a < b; a++) d.call(this, this._deferreds[a]);
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
	c.prototype.catch = function(a) {
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
			for (var d = 0, e = a.length; d < e; d++) a[d].then(b, c)
		})
	}, "undefined" != typeof module && module.exports ? module.exports = c : a.Promise || (a.Promise = c)
}(this),
/*! 
Adrian Cooney <cooney.adrian@gmail.com> License: MIT */
function(a) {
	function b(a, b, c) {
		var d, e;
		if ("function" == typeof b ? (e = b, d = []) : (d = b, e = c), g[a]) throw "DI conflict: Module " + a + " already defined.";
		return g[a] = {
			name: a,
			callback: e,
			loaded: null,
			wasLoaded: !1,
			dependencies: d
		}, g[a]
	}

	function c(a) {
		var b = [];
		return a.dependencies.forEach(function(d) {
			var e = g[d];
			if (!e) throw "DI error: Module " + d + " not defined. Required by:" + a.name;
			e.wasLoaded ? b.push(e.loaded) : b.push(c(e))
		}), a.loaded = a.callback.apply(null, b), a.wasLoaded = !0, W[a.name] ? console.error("DI error: Object W." + a.name + " already exists") : W[a.name] = a.loaded, a.loaded
	}

	function d(a) {
		var b = a.callback || function() {},
			d = a.options || {
				loadOrphaned: !0
			},
			f = a.dependencies || [],
			g = c({
				callback: function() {
					e(d.loadOrphaned), b.apply(null, arguments)
				},
				dependencies: f
			});
		return g
	}

	function e(a) {
		for (var b in g) g[b].wasLoaded || (a ? c(g[b]) : console.warn("DI warning: module " + b + " defined but not loaded"))
	}

	function f(a, b, c, d, e) {
		h[a] = {
			html: b,
			css: c,
			callback: e
		}
	}
	var g = {},
		h = {};
	a.W || (a.W = {}), d.modules = g, a.W.require = d, a.W.define = b, a.W.tag = f, a.W.tags = h
}(window), /*! */
W.define("http", ["lruCache", "rootScope", "log", "utils"], function(lruCache, rs, log, _) {
		function fetch(method, url, options, postData) {
			var wasCancelled = !1,
				data, headers = {},
				match, rqst, returnObject, cacheHit, promise;
			if (options = options || {}, "undefined" == typeof options.cache && (options.cache = !0), /^(node\/\S+|search\/\S+|forecast\/\S+)/.test(url)) {
				var allNums = parseInt(url.replace(/[^0-9]/g, ""));
				url = url + (/\?/.test(url) ? "&" : "?") + "hash=" + apiHash + "-" + _.num2char(allNums)
			}
			return url = encodeURI(url), "get" === method && options.cache && (cacheHit = cache.get(url)) ? Promise.resolve(cacheHit) : (rqst = new XMLHttpRequest, rqst.open(method, url, !0), promise = new Promise(function(resolve, reject) {
				rqst.onreadystatechange = function() {
					if (4 === rqst.readyState)
						if (options.parseHeaders && rqst.getAllResponseHeaders().split(/\n/).forEach(function(a) {
								(match = a.match(/(.*:?)\: (.*)/)) && (headers[match[1].toLowerCase()] = match[2])
							}), rqst.status >= 200 && rqst.status < 300 || 304 === rqst.status) {
							if (data = rqst.responseText, data && /json/.test(rqst.getResponseHeader("Content-Type"))) try {
								data = JSON.parse(data)
							} catch (e) {
								try {
									eval("data = " + data)
								} catch (e) {}
							}
							returnObject = {
								data: data,
								headers: headers,
								status: rqst.status
							}, options.cache && cache.put(url, returnObject), resolve(returnObject)
						} else reject(wasCancelled ? "cancelled" : rqst.status)
				}
			}), promise.cancel = function() {
				wasCancelled = !0, rqst.abort()
			}, "post" === method ? (rqst.setRequestHeader("Content-type", "application/json; charset=utf-8"), rqst.send(JSON.stringify(options.data))) : rqst.send(null), promise)
		}
		var meta = document.querySelector('meta[name="api-hash"]'),
			apiHash = "undefined",
			cache = new lruCache(50),
			http = {};
		return http.get = fetch.bind(null, "get"), http.post = fetch.bind(null, "post"), http
	}), /*! */
	W.define("broadcast", ["Evented"], function(a) {
		return a.instance({
			ident: "bcast"
		})
	}),
	/*!
	Licensed under MIT. 
	Copyright (c) 2010 Rasmus Andersson <http://hunch.se/> */
	W.define("lruCache", [], function() {
		function a(a) {
			this.size = 0, this.limit = a, this._keymap = {}
		}
		return a.prototype.put = function(a, b) {
			var c = {
				key: a,
				value: b
			};
			return this._keymap[a] = c, this.tail ? (this.tail.newer = c, c.older = this.tail) : this.head = c, this.tail = c, this.size === this.limit ? this.shift() : void this.size++
		}, a.prototype.shift = function() {
			var a = this.head;
			return a && (this.head.newer ? (this.head = this.head.newer, this.head.older = void 0) : this.head = void 0, a.newer = a.older = void 0, delete this._keymap[a.key]), a
		}, a.prototype.get = function(a, b) {
			var c = this._keymap[a];
			if (void 0 !== c) return c === this.tail ? b ? c : c.value : (c.newer && (c === this.head && (this.head = c.newer), c.newer.older = c.older), c.older && (c.older.newer = c.newer), c.newer = void 0, c.older = this.tail, this.tail && (this.tail.newer = c), this.tail = c, b ? c : c.value)
		}, a
	}), /*! */
	W.define("Class", [], function() {
		var a = {
			extend: function() {
				var a, b, c, d, e = Object.create(this);
				for (b = 0, c = arguments.length; b < c; b++) {
					d = arguments[b];
					for (a in d) e[a] = d[a]
				}
				return e
			},
			instance: function() {
				var a = this.extend.apply(this, arguments);
				return "function" == typeof a._init && a._init.call(a), a
			}
		};
		return a
	}),
	/*!
	Copyright(c) 2011 Daniel Lamb <daniellmb.com> MIT Licensed */
	W.define("Evented", ["Class"], function(a) {
		return a.extend({
			_init: function() {
				this.id = 0, this.cache = {}
			},
			emit: function(a, b, c, d, e) {
				var f, g, h;
				if (f = this.cache[a])
					for (g = f.length; g--;) {
						h = f[g];
						try {
							h.callback.call(this, b, c, d, e), h.once && this.off(h.id)
						} catch (i) {
							console.error("W.Evented: Failed to call ", a, i)
						}
					}
			},
			on: function(a, b, c) {
				return this.cache[a] || (this.cache[a] = []), this.cache[a].push({
					callback: b,
					id: ++this.id,
					once: c || !1
				}), this.id
			},
			once: function(a, b) {
				return this.on(a, b, !0)
			},
			off: function(a, b) {
				var c, d;
				if ("number" == typeof a) {
					for (var e in this.cache)
						if (c = this.cache[e]) {
							for (d = c.length; d--;) c[d].id === a && c.splice(d, 1);
							0 === c.length && delete this.cache[e]
						}
				} else if (c = this.cache[a]) {
					if (c = this.cache[a])
						for (d = c.length; d--;) c[d].callback === b && c.splice(d, 1);
					0 === c.length && delete this.cache[a]
				}
			}
		})
	}), /*! */
	W.define("log", ["broadcast", "rootScope"], function(a, b) {
		var c = {},
			d = Date.now(),
			e = {
				page: function(a) {
					a in c || (ga("send", "pageview", a), c[a] = 1)
				},
				event: function(a) {
					ga("send", "event", "info v" + b.version, a + " " + navigator.userAgent), console.log("Event triggered:" + a)
				}
			};
		return a.on("paramsChanged", function(a, b) {
			if (b) {
				var c = a[b];
				if (c) {
					if ("path" === b) {
						var f = c.split("/"),
							g = new Date(Date.UTC(f[0], f[1] - 1, f[2], f[3], 0, 0)),
							h = Math.round((g.getTime() - d) / 864e5);
						c = h + "d"
					}
					e.page(b + "/" + c), "ecmwf" !== a.model && e.page("model/" + a.model)
				}
			}
		}), a.on("mapChanged", function(a) {
			e.page("map/" + a.zoom)
		}), a.on("popupOpened", e.page.bind(e, "picker")), a.on("rqstOpen", function(a) {
			"detail" !== a && e.page("plugin/" + a)
		}), a.on("log", e.page), a.on("logEvent", e.event), a.on("animationStarted", function() {
			e.page("animation")
		}), e
	}), W.define("$", [], function() {
		return function(a, b) {
			return (b || document).querySelector(a)
		}
	}), /*! */
	W.define("utils", [], function() {
		var a = {},
			b = "bcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789a",
			c = b.split("");
		return a.num2char = function(a) {
			var c = "";
			do c = b.charAt(a % 60) + c, a = Math.floor(a / 60); while (a);
			return c
		}, a.char2num = function(a) {
			for (var b = 0, d = 0; d < a.length; d++) b = 60 * b + c.indexOf(a.charAt(d));
			return b
		}, a.emptyFun = function() {}, a.emptyGIF = "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///ywAAAAAAQABAAACAUwAOw==", a.contains = function(a, b) {
			return a && a.indexOf(b) > -1
		}, a.replaceClass = function(a, b) {
			var c = document.body.className;
			a.test(c) ? document.body.className = c.replace(a, b) : document.body.classList.add(b)
		}, a.each = function(a, b) {
			for (var c in a) b(a[c], c)
		}, a.clone = function(b, c) {
			var d;
			if (null === b || "object" != typeof b) d = b;
			else if (b instanceof Date) d = new Date, d.setTime(b.getTime());
			else if (b instanceof Array) {
				d = [];
				for (var e = 0, f = b.length; e < f; e++) d[e] = a.clone(b[e])
			} else if (b instanceof Object) {
				d = {};
				for (var g in b) !b.hasOwnProperty(g) || c && !a.contains(c, g) || (d[g] = a.clone(b[g]))
			} else console.warn("Unable to copy obj! Its type isn't supported.");
			return d
		}, a.signature = function(a) {
			var b = "";
			if (a instanceof Array)
				for (var c = 0, d = a.length; c < d; c++) b += a[c] && a[c].toString();
			else if (a instanceof Object)
				for (var e in a) a.hasOwnProperty(e) && (b += a[e] && a[e].toString());
			return b
		}, a.isArray = function(a) {
			return Array.isArray(a) || a instanceof Array
		}, a.DD2DMS = function(a, b) {
			function c(a) {
				return [Math.abs(0 | a), "°", 0 | (a < 0 ? a = -a : a) % 1 * 60, "'", 0 | 60 * a % 1 * 60, '"'].join("")
			}
			return [a < 0 ? "S" : "N", c(a), ", ", b < 0 ? "W" : "E", c(b)].join("")
		}, a.extend = function(a) {
			var b, c, d, e, f = Object.create(a);
			for (c = 1, d = arguments.length; c < d; c++) {
				e = arguments[c];
				for (b in e) f[b] = e[b]
			}
			return f
		}, a.include = function(a, b) {
			for (var c in b) a[c] = b[c];
			return a
		}, a.compare = function(a, b, c) {
			return c || (c = Object.keys(a)), !c.filter(function(c) {
				return a[c] !== b[c]
			}).length
		}, a.deg2rad = function(a) {
			return a * Math.PI / 180
		}, a.debounce = function(a, b, c) {
			var d;
			return function() {
				var e = this,
					f = arguments,
					g = function() {
						d = null, c || a.apply(e, f)
					},
					h = c && !d;
				clearTimeout(d), d = setTimeout(g, b), h && a.apply(e, f)
			}
		}, a.pad = function(a, b) {
			for (var c = String(a); c.length < (b || 2);) c = "0" + c;
			return c
		}, a.template = function(a, b) {
			return a ? a.replace(/\{\{?\s*(.+?)\s*\}?\}/g, function(a, c) {
				return "undefined" == typeof b[c] ? "" : b[c]
			}) : ""
		}, a.wind2obj = function(a) {
			return {
				wind: Math.sqrt(a[0] * a[0] + a[1] * a[1]),
				dir: 10 * Math.floor(18 + 18 * Math.atan2(a[0], a[1]) / Math.PI)
			}
		}, a.wave2obj = function(a) {
			return {
				period: Math.sqrt(a[0] * a[0] + a[1] * a[1]),
				dir: 10 * Math.floor(18 + 18 * Math.atan2(a[0], a[1]) / Math.PI),
				size: a[2]
			}
		}, a.bound = function(a, b, c) {
			return Math.max(Math.min(a, c), b)
		}, a.utcOffsetStr = function(b) {
			return (b < 0 ? "-" : "+") + a.pad(Math.abs(Math.round(b))) + ":00"
		}, Date.prototype.add = function(a, b) {
			var c = new Date(this.getTime());
			return c.setTime(this.getTime() + ("days" === b ? 24 : 1) * a * 60 * 60 * 1e3), c
		}, Date.prototype.toUTCPath = function() {
			return this.toISOString().replace(/^(\d+)-(\d+)-(\d+)T(\d+):.*$/, "$1/$2/$3/$4")
		}, Date.prototype.midnight = function() {
			return this.setHours(0), this.setMinutes(0), this.setSeconds(0), this.setMilliseconds(0), this
		}, window.requestAnimationFrame = window.requestAnimationFrame || window.mozRequestAnimationFrame || window.webkitRequestAnimationFrame || window.msRequestAnimationFrame, window.cancelAnimationFrame = window.cancelAnimationFrame || window.webkitCancelAnimationFrame || window.mozCancelAnimationFrame, window.requestAnimationFrame && window.cancelAnimationFrame || (window.requestAnimationFrame = function(a) {
			return window.setTimeout(a, 40)
		}, window.cancelAnimationFrame = window.clearTimeout), Math.log2 || (Math.log2 = function(a) {
			return Math.log(a) * Math.LOG2E
		}), a
	}), "undefined" == typeof W && (W = {}), /*! */
	W.languages = {
		en: {
			MON: "Monday",
			TUE: "Tuesday",
			WED: "Wednesday",
			THU: "Thursday",
			FRI: "Friday",
			SAT: "Saturday",
			SUN: "Sunday",
			TODAY: "Today",
			TOMORROW: "Tomorrow",
			YESTERDAY: "Yesterday",
			EARLIER: "Earlier",
			MON2: "Mon",
			TUE2: "Tue",
			WED2: "Wed",
			THU2: "Thu",
			FRI2: "Fri",
			SAT2: "Sat",
			SUN2: "Sun",
			TODAY2: "Today",
			TOMORROW2: "Tomor",
			YESTERDAY2: "Yest",
			MON01: "January",
			MON02: "February",
			MON03: "March",
			MON04: "April",
			MON05: "May",
			MON06: "June",
			MON07: "July",
			MON08: "August",
			MON09: "September",
			MON10: "October",
			MON11: "November",
			MON12: "December",
			SMON01: "Jan",
			SMON02: "Feb",
			SMON03: "Mar",
			SMON04: "Apr",
			SMON05: "May",
			SMON06: "Jun",
			SMON07: "Jul",
			SMON08: "Aug",
			SMON09: "Sep",
			SMON10: "Oct",
			SMON11: "Nov",
			SMON12: "Dec",
			WIFCST: "wind forecast",
			FOLLOW: "Follow us",
			EMBED: "Embed widget on page",
			MENU: "Menu",
			MENU_COMMUNITY: "Community",
			MENU_SETTINGS: "Settings",
			MENU_HELP: "Help",
			MENU_TOOLS: "Tools",
			MENU_CLOSE: "Close<br>menu",
			MENU_MAP: "Change background map",
			MENU_FB1: "Follow us on Facebook",
			MENU_FB2: "Share on Facebook",
			MENU_TW: "Share on Twitter",
			MENU_ABOUT: "About us",
			MENU_ABOUT2: "About",
			MENU_FORUM: "Discussion forum",
			MENU_MAP2: "...in very detailed zoom levels",
			MENU_LOCATION: "Find my location",
			MENU_RETINA: "Enable retina",
			MENU_FULLSCREEN: "Fullscreen mode",
			MENU_3D: "Show in 3D mode",
			MENU_DISTANCE: "Distance & planning",
			MENU_HISTORICAL: "Show historical data",
			MENU_LATLON: "Show lat, lon grid",
			MENU_W_STARTUP: "Show 7 day weather at startup",
			MENU_MOBILE: "Download App",
			MENU_FAVS: "Favorites",
			MENU_FEEDBACK: "Feedback",
			TOOLBOX_INFO: "info",
			TOOLBOX_ANIMATION: "animation",
			TOOLBOX_START: "Hide/show animated particles",
			MENU_F_MODEL: "Data",
			MENU_U_INTERVAL: "Update interval",
			MENU_D_UPDATED: "Updated",
			MENU_D_REFTIME: "Reference time",
			OVERLAY: "Overlay",
			MODEL: "Forecast model",
			WIND: "Wind",
			GUST: "Wind gusts",
			WIND_DIR: "Wind dir.",
			TEMP: "Temperature",
			PRESS: "Pressure",
			CLOUDS: "Clouds, rain",
			CLOUDS2: "Clouds",
			CLOUD_ALT: "Cloud base",
			TOTAL_CLOUDS: "Total clouds",
			LOW_CLOUDS: "Low clouds",
			MEDIUM_CLOUDS: "Medium clouds",
			HIGH_CLOUDS: "High clouds",
			CAPE: "CAPE Index",
			RAIN: "Rain, snow",
			RAIN3H: "Precip. past 3h",
			JUST_RAIN: "Rain",
			RAINRATE: "Max. rain rate",
			THUNDER: "Thunderstorms",
			SNOW: "Snow",
			OZONE: "Ozone layer",
			SHOW_GUST: "force of wind gusts",
			RH: "Humidity",
			WAVES: "Waves",
			WAVES2: "Waves, sea",
			SWELL: "Swell",
			SWELL1: "Swell 1",
			SWELL2: "Swell 2",
			SWELL3: "Swell 3",
			WWAVES: "Wind waves",
			ALL_WAVES: "All waves",
			SWELLPER: "Swell period",
			RACCU: "Rain accumulation",
			SACCU: "Snow accumulation",
			ACCU: "Accumulations",
			RAINACCU: "RAIN ACCUMULATION",
			SNOWACCU: "SNOW ACCUMULATION",
			SNOWCOVER: "Actual Snow Cover",
			SST: "Surface sea temperature",
			SST2: "Sea temperature",
			SSTA: "Sea temperature anomaly",
			SSTA2: "Temperature anomaly",
			CURRENT: "Currents",
			VISIBILITY: "Visibility",
			ACTUAL_TEMP: "Actual temperature",
			SSTAVG: "Average sea temperature",
			AVAIL_FOR: "Available for:",
			DEW_POINT: "Dew point",
			SLP: "Pressure (sea l.)",
			QFE: "Station pressure",
			ABOUT_OVERLAY: "About",
			ACC_LAST_DAYS: "Last {{num}} days",
			ACC_LAST_HOURS: "Last {{num}} hours",
			ACC_NEXT_DAYS: "Next {{num}} days",
			ACC_NEXT_HOURS: "Next {{num}} hours",
			ALTITUDE: "Altitude",
			SFC: "Surface",
			DATE_AND_TIME: "TIME",
			CLICK_ON_LEGEND: "Click to change units",
			ALTERNATIVE_UNIT_CHANGE: "Any overlay unit can be changed by clicking on color legend",
			COPY_TO_C: "Copy to clipboard",
			SEARCH: "Search location...",
			NEXT: "Next results...",
			LOW_PREDICT: "Low predictability of forecast",
			DAYS_AGO: "{{daysago}} days ago:",
			SHOW_ACTUAL: "Show actual forecast",
			DETAILED: "Detailed forecast for this location",
			PERIOD: "Period",
			DRAG_ME: "Drag me if you want",
			W_FORECAST_BY: "forecast by ",
			W_HOME: "set this as my start-up location",
			D_CLOSE: "Close<br>detail",
			D_SHOW_ON: "show on",
			D_GMAPS: "Google Maps",
			D_COURTESY: 'More forecast products for this spot at <a href=" https://www.meteoblue.com/en/weather/latlon/call?lat={{lat}}&lon={{lon}}">Meteoblue.com</a>',
			D_FCST: "Forecast for this location",
			D_LT: "Local timezone",
			D_WEBCAMS: "Webcams in vicinity",
			D_STATIONS: "Nearest weather stations",
			D_NO_WEBCAMS: "There are no webcams around this location (or we don't know about them)",
			D_ACTUAL: "actual image",
			D_DAYLIGHT: "image during daylight",
			D_SHOW_ANIM: "Show 24h animation",
			D_EXTERNAL: "external link to lookr.com",
			D_DISTANCE: "distance",
			D_MILES: "miles",
			D_MORE_THAN_HOUR: "more than hour ago",
			D_MIN_AGO: "{{duration}} minutes ago",
			D_SUNRISE: "Sunrise",
			D_SUNSET: "sunset",
			D_DUSK: "dusk",
			D_SUN_NEVER_SET: "Sun never set",
			D_POLAR_NIGHT: "Polar night",
			D_LT2: "local time",
			D_FAVORITES: "Add to Favorites",
			D_FAVORITES2: "Remove from Favorites",
			D_MBLUE: "Meteogram",
			D_AIRGRAM3: "Airgram",
			D_WAVE_FCST: "Wind and Waves",
			D_WAVE_FCST2: "Waves and sea",
			D_SETTINGS: "settings",
			D_MISSING_CAM: "Add new webcam",
			D_HOURS: "Hours",
			D_TEMP2: "Temp.",
			D_WIND_CHILL: "Wind chill (feeling temperature)",
			D_PRECI: "Precit.",
			D_ABOUT_LOC: "About this location",
			D_ABOUT_LOC2: "About location",
			D_TIMEZONE: "Timezone",
			D_PARAMETERS: "Add parameters",
			D_SETTINGS_LEFT: "Left side",
			D_SETTINGS_RIGHT: "Right side",
			D_SETTINGS_TIME1: "Local time of your computer",
			D_SETTINGS_TIME2: "Local time of selected destination",
			D_SETTINGS_PROVIDER: "Provider",
			D_FORECAST_FOR: "{{duration}} days forecast",
			E_MESSAGE: "Awesome weather forecast at",
			METAR_VAR: "Variable",
			METAR_MIN_AGO: "{DURATION}m ago",
			METAR_HOUR_AGO: "an hour ago",
			METAR_HOURS_AGO: "{DURATION}h ago",
			METAR_MORE_INFO: "more info",
			DEVELOPED: "Developed with",
			MESSAGE_NEMS4: "<span>Sweet!</span>Detailed 4x4km forecast model available for this area.",
			MESSAGE_BETTER: "forecast model available for this area.",
			AMSL: "Height above main sea level",
			FAVS_ON_MAP: "Show on map",
			FAVS_DETAIL: "Detailed forecast",
			FAVS_WIND: "Wind forecast",
			FAVS_RENAME: "rename",
			FAVS_DELETE: "delete",
			SHOW_ON_MAP: "Display on map",
			POI_STATIONS: "Weather stations",
			POI_AD: "Airports",
			POI_CAMS: "Webcams",
			POI_PG: "Paragliding spots",
			POI_KITE: "Kite/WS spots",
			POI_SURF: "Surfing spots",
			POI_EMPTY: "Empty map",
			POI_WIND: "Observed wind",
			POI_TEMP: "Observed temp.",
			POI_FAVS: "My favourites",
			POI_FCST: "Forecasted weather",
			P_ANDROID_APP: "Windyty for Android, free on Google Play",
			P_HOMESCREEN: "Tap <i></i> and 'Add to Home Screen' to launch Windyty faster on your iPhone",
			ND_MODEL: "Forecast model",
			ND_COMPARE: "Compare forecasts",
			S_PARTICLES: "Animation of wind",
			S_LANG: "Language",
			S_AUTOMATIC: "automatic",
			S_RELOAD: "...reload Windytv to take effect",
			S_RETINA: "Retina mode recommended",
			S_PREDEFINED: "Predefined",
			S_NORMAL: "Normal",
			S_HIGH: "High",
			S_INTENSIVE: "Intensive",
			S_ADD_OVERLAYS: "Show / add more overlays",
			S_OVR_QUICK: "Add to quick menu",
			S_ADVANCED_SETTINGS: "Advanced settings",
			S_TIME_FORMAT: "Time format",
			S_COLORS: "Modify overlay colors",
			S_LAT_LON: "Weather picker contains lat,lon",
			S_DENSITY: "Density",
			S_SPEED: "Speed",
			S_WIDTH: "Size",
			S_CONTRAST: "Contrast",
			S_LENGTH: "Length",
			U_LOGIN: "Login / Register",
			U_LOGOUT: "Logout",
			U_PROFILE: "My profile",
			U_PASSWD: "Change password",
			U_CHANGE_PIC: "Change my picture",
			OVR_RECOMENDED: "Recommended for:",
			OVR_ALL: "All",
			OVR_FLYING: "Flying",
			OVR_WATER: "Water",
			OVR_SKI: "Ski"
		}
	}, "object" == typeof module && module.exports && (module.exports = W.languages), W.supportedLanguages = ["auto", "en", "zh-TW", "zh", "ja", "fr", "de", "pt", "ko", "it", "ru", "nl", "cs", "tr", "pl", "sv", "fi", "ro", "el", "hu", "hr", "ca", "da", "ar", "sk", "uk", "bg", "he", "is", "lt", "et", "vi", "sl", "id", "th", "nb", "es"], EMBED_MODE = !0;
var emptyFun = function() {},
	q = /^\?\S+,\S+,\S+/.test(window.location.search) ? parseOldParams() : parseNewParams();
W.define("location", ["rootScope"], function(a) {
	return "coordinates" === q.location && q.lat && q.lon && (a.sharedCoords = {
		lat: q.lat,
		lon: q.lon,
		zoom: Math.min(11, +q.zoom)
	}), a.params.level = q.level || "surface", a.params.overlay = q.overlay || "wind", "in" == q.calendar ? a.params.timestamp = Date.now() + 60 * parseInt(q.forecast) * 60 * 1e3 : "then" == q.calendar && (a.params.timestamp = q.actualGrid), {
		url: emptyFun,
		title: emptyFun,
		reset: emptyFun
	}
}), W.define("storage", ["http", "rootScope"], function(a, b) {
	function c(c) {
		return new Promise(function(d, e) {
			a.get("/v" + b.version + "/" + c).then(function(a) {
				d(a.data)
			}).catch(e)
		})
	}
	return {
		// put: emptyFun,
		// get: emptyFun,
        // NOTE: 重写存储逻辑
        put: function(key, val) {
            localStorage.setItem(key, JSON.stringify(val));
        },
        get: function(key) {
            var val = localStorage.getItem(key);
            if (val !== undefined) {
                return JSON.parse(val);
            }
        },
		remove: emptyFun,
		getFile: c
	}
});
var ref = document.referrer,
	base = "https://www.windytv.com/",
	utm = "&utm_medium=embed-" + (q.type || "map") + "&utm_source=" + encodeURIComponent(ref),
	search = "",
	embedFcst = {
		options: {
			loadOrphaned: !1
		},
		dependencies: ["rootScope", "broadcast", "$", "overlays", "log", "detailTable"],
		callback: function(a, b, c, d, e, f) {
			e.page("/embedForecast"), document.body.classList.add("embed-forecast"), document.body.classList.add("ondetail"), document.body.classList.add("widget-mode"), d.wind.setMetric(q.metricWind || "kt"), d.temp.setMetric(q.metricTemp || "°C"), f.open(q), c("#detail").style.display = "block", c("#embed-info-link").href = base + q.lat + "/" + q.lon + "?" + utm, b.once("detailScrollEnd", function() {
				e.page("/embedForecast/interaction")
			})
		}
	},
	embedMap = {
		options: {
			loadOrphaned: !1
		},
		dependencies: ["rootScope", "broadcast", "$", "maps", "overlays", "log", "picker", "rhpane", "products", "windytyUI", "loadersUI"],
		callback: function(a, b, c, d, e, f) {
			document.body.classList.add("embed-map"), f.page("/embedMap/" + (q.oldVersion ? "oldURL" : "newURL")), e.wind.setMetric(q.metricWind || "kt"), e.temp.setMetric(q.metricTemp || "°C"), q.menu && document.body.classList.add("hide-controls"), q.message && document.body.classList.add("hide-message"), q.marker && b.once("redrawFinished", function() {
				b.emit("mapsPopupRequested", q.lat, q.lon)
			}), d.scrollWheelZoom.disable(), window.addEventListener("focus", function() {
				d.scrollWheelZoom.enable(), f.page("/embedMap/interaction")
			}), b.on("redrawFinished", function() {
				var b = a.map,
					d = [a.params.path.replace(/\//g, "-"), a.params.overlay, a.params.level, b.lat.toFixed(3), b.lon.toFixed(3), b.zoom];
				search = d.join(","), c("#note-message").href = c("#embed-fullscreen").href = c("#logo").href = base + "?" + search + utm
			}), b.on("rqstOpen", function(a, b) {
				"detail" === a && window.open(base + b.lat + "/" + b.lon + "?" + search + utm, "_blank")
			}), q.embedMake && window.parent && window.parent.updateValues && b.on("redrawFinished", function() {
				window.parent.updateValues(a.map)
			})
		}
	};
document.addEventListener("DOMContentLoaded", W.require.bind(null, "forecast" == q.type ? embedFcst : embedMap)), /*! */
	W.define("detailTable", ["$", "detailStations", "utils", "detailSlider", "detailBar", "detailWebcams", "rootScope", "broadcast", "http", "trans", "weatherRender", "Sticky", "UIcomponents"], function(a, b, c, d, e, f, g, h, i, j, k) {
		function l(a) {
			return a.touches ? a.touches[0].pageX : a.pageX
		}

		function m(a, b, d) {
			var e = c.bound((d - a) / (b - a), 0, 1);
			return e * e * e * (e * (6 * e - 15) + 10)
		}

		function n() {
			q = k.table(s, {
				rows: B[A],
				tdWidth: y,
				iconSize: 25,
				days: 7,
				params: t
			}), r = q.data, C.render(), x ? d.render(C, q) : e.render(C, r), j.translateDocument(u), w.classList.remove("show"), v.classList.add("show"), h.emit("rqstClose", "meteogram"), setTimeout(function() {
				h.emit("detailRendered", u.offsetHeight, s.header.utcOffset)
			}, 500)
		}

		function o(a) {
			t = a, w.classList.add("show"), v.classList.remove("show"), i.get("node/forecast/" + A + "/" + a.lat + "/" + a.lon).then(function(c) {
				c && c.data && (h.emit("detailLoaded", a), h.emit("log", "detail2/" + A), s = c.data, n(), a.height = C.getHeight(), f.load(a), b.load(a), C.wTitle.stickLeft(), s.celestial.atSea < 1 ? document.body.classList.add("isatsea") : document.body.classList.remove("isatsea"))
			}).catch(function(a) {
				h.emit("logEvent", "Render fail: " + t.lat + ", " + t.lon + " err:" + a), w.classList.remove("show"), v.classList.add("show")
			})
		}

		function p() {
			u.querySelector(".legend").innerHTML = B.ecmwf.map(function(a) {
				return '<div class="legend-' + a + '">&nbsp;</div>'
			}).join("")
		}
		var q, r, s, t, u = a("#detail"),
			v = a(".data-table", u),
			w = a(".myloader", u),
			x = g.isMobile || g.detailOnly,
			y = x ? 32 : 28,
			z = !1,
			A = "ecmwf",
			B = {
				ecmwf: ["hour", "icon", "temp", "wind", "gust", "windDir", "rain"],
				gfs: ["hour", "icon", "temp", "wind", "gust", "windDir", "rain"],
				nems: ["hour", "icon", "temp", "wind", "windDir", "rain"],
				waves: ["hour", "wind", "windDir", "waves", "wavesPeriod", "swell", "swellPeriod", "swell1", "swell1Period", "swell2", "swell2Period"]
			},
			C = W.Swipe.instance({
				el: a(".data-table table", u),
				legendOffset: x ? 31 : 100,
				wasScrolled: !1,
				dayEl: [],
				pxWidth: 0,
				tsWidth: 0,
				cursorX: 0,
				legendHidden: !1,
				px2ts: 0,
				lastScroll: 0,
				inertiaAnim: null,
				wTitle: new W.Sticky("webcam", a(".webcams .title", u), 0, 9),
				_init: function() {
					W.Swipe._init.call(this), v.addEventListener("mousedown", this.startDrag.bind(this)), v.addEventListener("scroll", this.scroll.bind(this)), this.scrollEndDebounced = c.debounce(this.scrollEnd.bind(this), 200)
				},
				scroll: function(a) {
					a.stopPropagation(), a.preventDefault();
					var b = a.target.scrollLeft,
						c = this.lastScroll - b;
					b < 0 || (this.scrollEndDebounced(), this.lastScroll = b, x ? (d.scroll(b), this.wasScrolled || (u.classList.add("scrolled"), this.wasScrolled = !0, setTimeout(d.resize.bind(d), 200))) : e.scroll(b), this.reflow(c))
				},
				reflow: function(a) {
					var b;
					if (a < 0)
						for (f.data.length && !this.legendHidden && 1 === this.wTitle.scrollLeft() && (u.classList.add("webcams-shown"), this.legendHidden = !0), f.isInViewport(), b = 0; b < this.dayEl.length; b++) this.dayEl[b].scrollLeft();
					else
						for (this.legendHidden && this.wTitle.scrollRight() === -1 && (u.classList.remove("webcams-shown"), this.legendHidden = !1), b = this.dayEl.length - 1; b >= 0; b--) this.dayEl[b].scrollRight()
				},
				scrollEnd: function() {
					var a = d.el.offsetLeft + d.el.offsetWidth / 2,
						b = this.tsWidth * a / (d.wrapper.offsetWidth - 10) + this.startOfTime;
					b === this.lastReportedTs || z || (h.emit("detailScrollEnd", a, b), this.lastReportedTs = b)
				},
				startDrag: function(a) {
					function b() {
						clearInterval(m), window.removeEventListener("mousemove", f), window.removeEventListener("mouseup", b), Math.abs(h) > 10 && (j = .6 * h, k = v.scrollLeft + j, i = Date.now(), o.inertiaAnim = window.requestAnimationFrame(d)), a.preventDefault(), a.stopPropagation()
					}

					function d() {
						var a = Date.now() - i,
							b = -j * Math.exp(-a / 325);
						Math.abs(b) > .5 && a < 3e3 && (v.scrollLeft = k + b, o.inertiaAnim = window.requestAnimationFrame(d))
					}

					function e() {
						var a = Date.now(),
							b = a - i,
							d = v.scrollLeft,
							e = d - n,
							f = 1e3 * e / (1 + b);
						i = a, n = d, h = c.bound(.8 * f + .2 * h, -500, 500)
					}

					function f(a) {
						var b = l(a);
						v.scrollLeft += g - b, g = b, a.preventDefault(), a.stopPropagation()
					}
					a.preventDefault();
					var g = l(a),
						h = 0,
						i = Date.now(),
						j = 0,
						k = 0,
						m = setInterval(e, 100),
						n = v.scrollLeft,
						o = this;
					e(), window.cancelAnimationFrame(this.inertiaAnim), window.addEventListener("mousemove", f), window.addEventListener("mouseup", b)
				},
				scrollTo: function(a, b) {
					function c() {
						var a = Date.now();
						v.scrollLeft = m(e, g, a) * f + d, a >= g ? b() : window.requestAnimationFrame(c)
					}
					var d = C.lastScroll,
						e = Date.now(),
						f = a - d,
						g = e + Math.max(500, 1.2 * Math.abs(f));
					c()
				},
				render: function() {
					this.tsWidth = 3 * q.hours * 60 * 60 * 1e3, this.pxWidth = q.hours * y, this.px2ts = this.tsWidth / this.pxWidth, this.startOfTime = r[0].ts, this.endOfTime = r[r.length - 1].ts, this.lastScroll = 0, this.legendHidden = !1, u.classList.remove("webcams-shown"), this.scrollTimer = null, v.scrollLeft = 0, this.el.innerHTML = q.html, a(".forecast-table", u).style["min-width"] = this.el.style.width = this.pxWidth + "px", a(".legend", u).innerHTML = q.legend, this.nowPosition = (Date.now() - this.startOfTime + 54e5) / this.px2ts, a(".forecast-table b", u).style.left = this.nowPosition + "px", a(".model-info", u).innerHTML = q.modelInfo, this.el.style.backgroundImage = "url(" + q.bgImage.img + ")", this.el.style.backgroundSize = q.bgImage.w + "px " + q.bgImage.h + "px", this.dayEl = [];
					for (var b = v.querySelectorAll(".td-days td div"), c = 0; c < b.length; c++) this.dayEl[c] = new W.Sticky(c, b[c], this.legendOffset, 9)
				},
				onswipe: function(a, b, c) {
					var e = this;
					"right" === a && this.lastScroll <= 0 && b < -50 && this.wasScrolled && (u.classList.remove("scrolled"), setTimeout(d.resize.bind(d), 300), setTimeout(function() {
						e.wasScrolled = !1
					}, 1e3))
				},
				getHeight: function() {
					var b = a("tr:first-child", this.el).offsetHeight,
						c = this.el.offsetHeight;
					return c - b
				}
			});
		return W.Switch.instance({
			el: a(".info .white-switch", u),
			initValue: "ecmwf",
			onset: function(a) {
				A = a, o(t)
			}
		}), {
			getParams: function() {
				return t
			},
			open: o,
			renderEmptyLegend: p
		}
	}), /*! */
	W.define("detailWebcams", ["$", "utils", "broadcast", "rootScope", "http", "trans", "Class"], function(a, b, c, d, e, f) {
		var g = {
			el: a("#detail .webcams"),
			checkbox: a("#webcam-daylight"),
			data: [],
			imgH: 224,
			imgW: 400,
			imgRatio: 400 / 224,
			imgsLoaded: !1,
			latestParams: null,
			canvas: a("#detail .webcams canvas"),
			container: a("#detail .webcams-container"),
			hide: function() {
				this.el.style.display = "none", this.data = []
			},
			isDayLight: function() {
				return this.checkbox.checked
			},
			isInViewport: function() {
				var a = this.el.getBoundingClientRect();
				a.left < window.innerWidth && this.loadImages()
			},
			render: function(a) {
				a = a || this.latestParams, this.imgH = a.height, this.imgW = Math.round(this.imgH * this.imgRatio), a = a || this.latestParams, this.container.innerHTML = this.html(a), this.imgsLoaded = !1, this.el.style.width = this.data.length * this.imgW + "px", this.canvas.width = this.data.length * this.imgW, this.canvas.height = this.imgH, this.isInViewport()
			},
			html: function(a) {
				var c = this,
					d = "",
					e = Date.now() / 1e3;
				return this.data.forEach(function(a, g) {
					d += b.template('<div class="webcam grab loading" data-i="{i}"  data-do="marker,{latLonId}" style="width:{imgW}px; height:{imgH}px"><div data-do="rqstOpen,{latLonId}" class="camtitle"><div class="wbcm-name">{title}</div><div class="small">{time}, {distance} km, {miles}</div></div></div>', {
						i: g,
						imgW: c.imgW,
						imgH: c.imgH,
						latLonId: +a.location.latitude + "," + a.location.longitude + "," + a.id,
						title: a.title,
						time: c.isDayLight() ? f.D_DAYLIGHT : b.template(f.D_MIN_AGO, {
							duration: Math.floor((e - a.image.update) / 60)
						}),
						distance: f.D_DISTANCE,
						km: a.distance.toFixed(1),
						miles: (.62 * a.distance).toFixed(1) + f.D_MILES
					})
				}), d
			},
			loadImages: function() {
				var b = this.canvas.getContext("2d"),
					c = this;
				this.data.forEach(function(d, e) {
					var f = new Image;
					f.onload = function() {
						b.drawImage(f, e * c.imgW, 0, c.imgW, c.imgH), a('div[data-i="' + e + '"]', c.el).classList.remove("loading")
					}, f.src = c.isDayLight() ? d.image.daylight.preview : d.image.current.preview
				}), this.imgsLoaded = !0
			},
			load: function(a) {
				var b = this;
				EMBED_MODE || (this.latestParams = a, this.hide(), e.get("node/webcams2/" + a.lat + "/" + a.lon).then(function(d) {
					var e = d.data;
					e.length > 0 && (b.data = e.slice(0, 7), b.checkbox.checked = !1, b.el.style.display = "inline-block", b.render.call(b, a, !1)), c.emit("webcamsLoaded", b.data.length)
				}))
			}
		};
		if (g.checkbox.onchange = g.render.bind(g, null), window.L) {
			var h = W.maps;
			W.EventCatcher.instance({
				events: ["mouseover", "mouseout", "click"],
				el: a("#detail .webcams"),
				marker: null,
				mouseover: function(a, b, c) {
					"marker" === a && (this.marker = L.marker([b, c], {
						icon: h.myMarkers.icon
					}).addTo(h))
				},
				mouseout: function(a, b, c) {
					"marker" === a && h.removeLayer(this.marker)
				},
				click: function(a, b, d, e) {
					"rqstOpen" === a && c.emit("rqstOpen", "lookr", e)
				}
			})
		}
		return g
	}), /*! */
	W.define("detailBar", ["$", "utils", "settings", "progressBar", "UIcomponents"], function(a, b, c, d) {
		var e, f = document.getElementById("detail"),
			g = a(".data-table", f),
			h = W.Drag.instance({
				el: a(".main-timecode", f),
				pLine: a(".progress-line", f),
				played: a(".progress-line .played", f),
				box: a(".main-timecode .box", f),
				ghost: a(".ghost-timecode", f),
				ghostBox: a(".ghost-timecode .box", f),
				isVisible: !0,
				latestCode: null,
				latestGhost: null,
				mouseInside: !1,
				displayHour: c.getHoursFunction(),
				_init: function() {
					W.Drag._init.call(this);
					var a = this;
					this.pLine.addEventListener("mouseup", this.click.bind(this)), this.debouncedBcast = b.debounce(this.bcast.bind(this), 100), a.pLine.addEventListener("mouseenter", function(b) {
						a.dragging || (a.updateGhost.call(a, b.clientX), a.ghost.style.opacity = 1), a.mouseInside = !0
					}), a.pLine.addEventListener("mousemove", function(b) {
						a.dragging ? a.ghost.style.opacity = 0 : a.updateGhost.call(a, b.clientX)
					}), a.pLine.addEventListener("mouseleave", function() {
						a.ghost.style.opacity = 0, a.mouseInside = !1
					})
				},
				bcast: function() {
					this.timestamp = this.start + this.timecodePos / this.pxRatio, d.set(this.timestamp)
				},
				click: function(a) {
					this.dragging || (this.addAnimation(), this.ondrag(a.pageX - 20, null, a), this.removeAnimation())
				},
				onKeyboard: function(a) {
					var b = d.onKeyboard(a);
					b && (this.addAnimation(), this.timecodePos = (b - this.start) * this.pxRatio, this.el.style.left = this.timecodePos + this.offset + "px", this.played.style.width = this.timecodePos + "px", this.renderHour(), this.removeAnimation())
				},
				addAnimation: function() {
					this.el.classList.add("anim-allowed")
				},
				removeAnimation: function() {
					window.setTimeout(function() {
						this.el.classList.remove("anim-allowed")
					}.bind(this), 300)
				},
				updateGhost: function(a) {
					var b = this.pos2offset(a);
					b && (this.ghostBox.textContent = this.pos2hour(b), this.ghost.style.left = a + "px")
				},
				pos2offset: function(a) {
					return a += 20, a > this.offset ? Math.min(a - this.offset, this.rightLimit) : null
				},
				ondrag: function(a, b, c) {
					a += 20, a > this.offset && (this.timecodePos = Math.min(a - this.offset, this.rightLimit), this.el.style.left = this.timecodePos + this.offset + "px", this.played.style.width = this.timecodePos + "px", this.renderHour()), this.debouncedBcast(), c.preventDefault()
				},
				renderHour: function() {
					this.box.textContent = this.pos2hour(this.timecodePos)
				},
				pos2hour: function(a) {
					var b = Math.round(a / e.pxWidth * this.numberOfHours % 24 + this.firstHour - 1.5);
					return b < 0 ? b = 24 - b : b > 23 && (b -= 24), this.displayHour(b)
				},
				scroll: function(a) {
					this.offset = g.offsetLeft - a, this.el.style.left = this.timecodePos + this.offset + "px"
				},
				render: function(a, b) {
					e = a, this.displayHour = c.getHoursFunction(), this.start = e.startOfTime - 54e5, this.firstHour = b[0].hour, this.pxRatio = e.pxWidth / e.tsWidth, this.rightLimit = Math.min(e.pxWidth, (d.calendar.end - this.start) * this.pxRatio), this.offset = g.offsetLeft - g.scrollLeft, this.pLine.style.width = this.rightLimit + "px", this.timecodePos = Math.min(e.pxWidth, (d.timestamp - this.start) * this.pxRatio), this.el.style.left = this.timecodePos + this.offset + "px", this.played.style.width = this.timecodePos + "px", this.numberOfHours = 3 * b.length, this.renderHour(), f.querySelector(".progress-line i").style.left = e.nowPosition + "px"
				}
			});
		return h
	}), /*! */
	W.define("detailSlider", ["$", "utils", "UIcomponents"], function(a, b) {
		var c, d = a("#detail"),
			e = a(".data-table", d),
			f = W.Drag.instance({
				el: a(".handle", d),
				wrapper: a(".slider-wrapper", d),
				slEl: a(".slider", d),
				_init: function() {
					W.Drag._init.call(this), window.addEventListener("resize", this.resize.bind(this)), this.wrapper.onclick = this.click.bind(this)
				},
				click: function(a) {
					var d = this.el.offsetWidth,
						f = this.wrapper.offsetWidth + 5,
						g = b.bound(a.clientX - d / 2, 0, f - d),
						h = (c.el.offsetWidth - e.offsetWidth) * g / (f - d);
					a.preventDefault(), a.stopPropagation(), c.scrollTo(h, function() {})
				},
				ondrag: function(a, d, f) {
					f.preventDefault();
					var g = this.slEl.offsetWidth,
						h = this.el.offsetWidth,
						i = c.el.offsetWidth,
						j = e.offsetWidth,
						k = b.bound(a, 0, g - h);
					this.el.style.left = k + "px", e.scrollLeft = (i - j) * k / (g - h)
				},
				render: function(b, d) {
					c = b, this.slEl.style.background = d.slider, a("table", this.wrapper).innerHTML = "<tr>" + d.sliderDays + "</tr>", this.resize()
				},
				scroll: function(a) {
					this.el.style.left = Math.min(a * this.leftCoeficient, this.leftLimit) + "px"
				},
				resize: function() {
					c && (this.el.style.width = Math.floor(100 * e.offsetWidth / c.el.offsetWidth) + "%", this.leftCoeficient = this.slEl.offsetWidth / c.el.offsetWidth, this.leftLimit = this.slEl.offsetWidth - this.el.offsetWidth, this.scroll(e.scrollLeft))
				}
			});
		return f
	}), /*! */
	W.define("detailOptions", ["detailTable", "utils", "broadcast", "rootScope", "http", "overlays"], function(a, b, c, d, e, f) {
		W.EventCatcher.instance({
			el: document.querySelector("#detail"),
			click: function(b, d) {
				switch (b) {
					case "close":
						c.emit("rqstClose", "detail");
						break;
					case "metric":
						f[d] && f[d].cycleMetric();
						break;
					case "meteogram":
						c.emit("rqstOpen", "meteogram", a.getParams());
						break;
					case "compare":
						c.emit("rqstOpen", "multimodel", a.getParams())
				}
			}
		})
	}), /*! */
	W.define("detailStations", ["$", "utils", "http", "overlays", "trans", "broadcast", "UIcomponents"], function(a, b, c, d, e, f) {
		function g(a) {
			c.get("node/stationsaround/" + a.lat + "/" + a.lon).then(function(b) {
				b && b.data && b.data.length ? (h(b.data, a), j.classList.add("open")) : j.classList.remove("open")
			})
		}

		function h(a, c) {
			var d = "";
			a.forEach(function(a) {
				a.name && (a.name = a.name.replace(/^[A-Z0-9]{4,8}\s/, "")), d += b.template('<div class="wx" data-do="{lat},{lon},{id}">{wx}<div class="wx-desc">{time}, {distance}: {name}</div></div><br/>', b.include(a, {
					wx: i(a),
					time: a.hAgo ? a.hAgo + "h ago" : a.minAgo + "m ago",
					distance: Math.floor(a.dist) + "km"
				}))
			}), k.style.height = c.height + "px", k.innerHTML = d
		}

		function i(a) {
			var b = '<span style="background-color:' + d.temp.c.color(a.temp + 272.15) + ';">' + d.temp.convertNumber(a.temp + 272.15) + "°</span>";
			return "number" == typeof a.wind && (b += '<span class="eather-icon .weather-icon-noamin" style="background-color:' + d.wind.c.color(a.wind) + ';">', "number" == typeof + a.dir && a.dir <= 360 && null != a.dir && a.wind > 0 && (b += '<div class="iconfont" style="transform: rotate(' + a.dir + "deg); -webkit-transform:rotate(" + a.dir + 'deg);">"</div>'), b += d.wind.convertValue(a.wind) + ("number" == typeof a.gust ? ", g:" + d.wind.convertNumber(a.gust) : "") + "</span>"), b
		}
		var j = a("#detail .stations"),
			k = a(".stations-container", j);
		if (window.L) {
			var l = W.maps;
			W.EventCatcher.instance({
				events: ["mouseover", "mouseout", "click"],
				el: a("#detail .stations"),
				marker: null,
				mouseover: function(a, b) {
					this.marker = L.marker([+a, +b], {
						icon: l.myMarkers.icon
					}).addTo(l)
				},
				mouseout: function(a, b) {
					this.marker && l.removeLayer(this.marker)
				},
				click: function(a, b, c) {
					f.emit("rqstClose", "detail"), f.emit("rqstOpen", "station", {
						id: c
					})
				}
			})
		}
		return {
			load: g
		}
	}), /*! */
	W.define("rootScope", [], function() {
		"undefined" == typeof API_MODE && (API_MODE = !1), "undefined" == typeof EMBED_MODE && (EMBED_MODE = !1), "undefined" == typeof SCRSAVER_MODE && (SCRSAVER_MODE = !1), "undefined" == typeof WIDGET_MODE && (WIDGET_MODE = !1);
		var a = window.navigator,
			b = (a.userAgent, {
				server: EMBED_MODE ? "https://www.windytv.com/" : "",
				server2: EMBED_MODE ? "https://www.windytv.com/" : "",
				tileServer: EMBED_MODE ? "https://www.windytv.com/tiles/" : "/tiles/",
				community: window.DEBUG ? "http://community.windy.tv:8000" : "https://community.windytv.com",
				version: W.version,
				levels: ["surface", "100m", "975h", "950h", "925h", "900h", "850h", "800h", "700h", "600h", "500h", "400h", "300h", "250h", "200h", "150h"],
				overlays: ["wind", "gust", "rain", "temp", "dewpoint", "clouds", "lclouds", "mclouds", "hclouds", "cbase", "visibility", "rainAccu", "snowAccu", "rh", "ozone", "cape", "pressure", "waves", "swell", "swellperiod", "swell1", "swell2", "swell3", "wwaves", "sst", "sstanom", "currents"],
				acTimes: ["past3d", "past24h", "next24h", "next3d", "next"],
				models: ["gfs", "ecmwf", "mbeurope", "namConus", "namHawaii", "namAlaska"],
				localModels: ["mbeurope", "namConus", "namHawaii", "namAlaska"],
				globalModels: ["gfs", "ecmwf"],
				browser: window.L && L.Browser,
				isTouch: window.L && L.Browser.touch,
				detailOnly: WIDGET_MODE,
				isMobile: window.screen && window.screen.width < 701,
				maxZoom: EMBED_MODE || API_MODE ? 11 : 17,
				isRetina: window.devicePixelRatio && window.devicePixelRatio > 1,
				prefLang: a.languages ? a.languages[0] : a.language || a.browserLanguage || a.systemLanguage || a.userLanguage || "en",
				params: {
					overlay: "wind",
					level: "surface",
					acTime: "next24h",
					timestamp: Date.now(),
					path: void 0,
					product: "ecmwf",
					model: "ecmwf",
					sstTime: "2015/01"
				},
				geoIP: {
					lat: 50,
					lon: 14,
					country: "US",
					zoom: 3,
					name: ""
				},
				map: {},
				globeMap: {},
				setLang: "en",
				pois: "favs",
				hash: "672caf27f5363dc833bda5099775e891",
				hereMapsID: "app_id=Ps0PWVjNew3jM9lpFHFG&app_code=eEg9396D7_C6NCcM1DUK2A"
			}),
			c = document.querySelector('meta[name="model"]');
		return c && c.content && b.globalModels.indexOf(c.content) > -1 && (b.params.model = c.content, b.params.product = c.content), b
	}), /*! */
	W.define("trans", ["http", "storage", "broadcast", "rootScope", "log", "settings"], function(a, b, c, d, e, f) {
		function g(a) {
			for (var b in a) i[b] = a[b]
		}

		function h(a) {
			var b = /(\w+)\|(\w+)\:(\w+)/;
			return /\|/.test(a) ? a.replace(b, function(b, c, d, e) {
				var f = i[c];
				return f && e ? f.replace(/\{\{[^\}]+\}\}/g, e) : a
			}) : i[a] || a
		}
		var i = {},
			j = "en",
			k = f.get("lang"),
			l = d.prefLang;
		"auto" !== k && k && (l = d.prefLang = k);
		var m = ["title", "placeholder", "t", "afterbegin", "beforeend", "tooltipsrc"];
		return i.translateDocument = function(a) {
			m.forEach(function(b) {
				for (var c, d, e = a.querySelectorAll("[data-" + b + "]"), f = 0, g = e.length; f < g; f++) switch (c = e[f], d = h(c.dataset[b]), b) {
					case "t":
						/</.test(d) ? c.innerHTML = d : c.textContent = d;
						break;
					case "title":
					case "placeholder":
						"undefined" != typeof c[b] && (c[b] = d);
						break;
					case "tooltipsrc":
						c.dataset.tooltip = d;
						break;
					case "afterbegin":
						3 == c.firstChild.nodeType && c.removeChild(c.firstChild), c.insertAdjacentHTML(b, d);
						break;
					case "beforeend":
						3 == c.lastChild.nodeType && c.removeChild(c.lastChild), c.insertAdjacentHTML(b, d)
				}
			})
		}, l && W.supportedLanguages.indexOf(l) > -1 ? j = l : l && (l = l.replace(/-\S+$/, ""), j = W.supportedLanguages.indexOf(l) > -1 ? l : "en", l !== j && e.page("langmissing/" + l)), g(W.languages.en), i.translateDocument(document.body), "en" !== j && b.getFile("lang/lang-" + j + ".json", {
			aboluteURL: !1,
			test: "TODAY"
		}).then(function(a) {
			g(a), i.translateDocument(document.body), c.emit("langChanged", j), d.setLang = j
		}), i
	}), /*! */
	W.define("settings", ["colors", "http", "utils", "storage", "broadcast", "rootScope", "geolocation"], function(a, b, c, d, e, f) {
		function g(a) {
			return "settings_" + a
		}

		function h(a) {
			return "settings_" + a + "_ts"
		}

		function i() {
			c.each(a, function(a, b) {
				var c = d.get("settings_color_" + b);
				c && c instanceof Array && a.setColors(c)
			})
		}

		function j(a, b) {
			return c.isArray(a) && a.every(function(a) {
				return c.contains(b, a)
			})
		}

		function k(a, b) {
			return "function" == typeof a.allowed ? a.allowed(b) : c.isArray(a.def) ? j(b, a.allowed) : c.contains(a.allowed, b)
		}

		function l() {
			if (window.localStorage) try {
				var a = {};
				for (var c in localStorage) /^settings/.test(c) && (a[c] = d.get(c));
				b.post("/users/settings", {
					data: a
				})
			} catch (f) {
				e.emit("logEvent", "Cant store settings to cloud: " + f)
			}
		}

		function m() {
			b.get("/users/settings").then(function(a) {
				if (a && a.data) {
					var b = W.metrics,
						c = a.data,
						f = !1,
						j = Object.keys(c).map(function(a) {
							return a.replace(/^[^_]+_/, "")
						}).filter(function(a) {
							return !/_ts$/.test(a)
						});
					j.forEach(function(a) {
						var e = c[h(a)],
							i = d.get(h(a));
						(!i || i < e) && (b[a] ? b[a].setMetric(c[g(a)], {
							doNotCheckValidity: !0,
							update: e,
							doNotSaveToCloud: !0
						}) : (q.set(a, c[g(a)], {
							doNotCheckValidity: /color_/.test(a),
							update: e,
							doNotSaveToCloud: !0
						}), /color_/.test(a) && (f = !0)))
					}), f && (i(), e.emit("redrawAnimation"))
				}
			}).then(l).catch(function(a) {
				e.emit("logEvent", "Cant load/merge settings from cloud: " + a)
			})
		}
		var n = f.geoIP && f.geoIP.country ? f.geoIP.country : "other",
			o = {
				map: {
					def: "sznmap",
					allowed: ["sznmap", "sat"]
				},
				retina: {
					def: !1,
					allowed: [!0, !1]
				},
				graticule: {
					def: !1,
					allowed: [!0, !1]
				},
				latlon: {
					def: !1,
					allowed: [!0, !1]
				},
				weatherv3: {
					def: !0,
					allowed: [!0, !1]
				},
				wasDragged: {
					def: !1,
					allowed: [!0, !1]
				},
				wasClicked: {
					def: !1,
					allowed: [!0, !1]
				},
				poisUsed: {
					def: !1,
					allowed: [!0, !1]
				},
				lang: {
					def: "auto",
					allowed: W.supportedLanguages
				},
				time: {
					def: /US|UK|PH|CA|AU|NZ|IN|EG|SA|CO|PK|MY/.test(n) ? "12h" : "24h",
					allowed: ["12h", "24h"]
				},
				quickOverlays: {
					def: ["wind", "clouds", "temp", "rain", "waves", "pressure"],
					allowed: f.overlays
				},
				particles: {
					def: {
						multiplier: 1,
						velocity: 1,
						width: 1,
						blending: 1,
						opacity: 1
					},
					allowed: function(a) {
						var b;
						if (!a || "object" != typeof a) return !1;
						for (var c in this.def)
							if (b = a[c], "number" != typeof b || b > 2 || b < 0) return !1;
						return !0
					}
				},
				colors: {
					allowed: function(a) {
						if (!c.isArray(a)) return !1;
						for (var b = 0; b < a.length; b++)
							if (!c.isArray(a[b])) return !1;
						return !0
					}
				},
				homeLocation: {
					def: null,
					allowed: function(a) {
						return !a || "object" == typeof a && a.lat && a.lon
					}
				}
			};
		i();
		var p = c.debounce(l, 3e3);
		e.on("userLoggedIn", m);
		var q = {
			defaults: /US|MY|LR/.test(n) ? "imperial" : "metric",
			set: function(a, b, c) {
				c = c || {};
				var i = o[/color_/.test(a) ? "colors" : a],
					j = {
						doNotCheckValidity: !!c.doNotCheckValidity,
						update: c.update || Date.now(),
						doNotSaveToCloud: !!c.doNotSaveToCloud
					};
				(j.doNotCheckValidity || i && k(i, b)) && (d.put(g(a), b), d.put(h(a), j.update), d.put("settings_lastUpdate", j.update), e.emit("settingsChanged", a, b), f.user && !j.doNotSaveToCloud && p())
			},
			delete: function(a) {
				d.remove(g(a)), d.remove(h(a))
			},
			get: function(a, b) {
				var c = o[a],
					e = d.get(g(a));
				return b ? e : c ? null === e ? c.def : k(c, e) ? e : c.def : null
			},
			getDefault: function(a) {
				return o[a].def
			},
			is12hFormat: function() {
				return "12h" === q.get("time")
			},
			getHoursFunction: function() {
				return this.is12hFormat() ? function(a) {
					return (a + 11) % 12 + 1 + (a >= 12 ? " PM" : " AM")
				} : function(a) {
					return a + ":00"
				}
			}
		};
		return q
	}), /*! */
	W.define("calendar", ["utils", "settings", "log", "trans"], function(a, b, c, d) {
		function e(a) {
			this.calendarDays = a.calendarDays || 10, this.numOfDays = a.numOfDays || 10, this.midnight = (new Date).midnight(), this.startOfTimeline = a.startOfTimeline || this.midnight, this.start = this.startOfTimeline.getTime(), this.days = [], this.endOfcalendar = this.startOfTimeline.add(this.calendarDays, "days"), this.endOfCal = this.endOfcalendar.getTime(), this.maxTimestamp = this.endOfcalendar.getTime(), this.longWeekdays = this.calendarDays < 8, this.type = this.endOfcalendar < this.midnight ? "historical" : this.startOfTimeline < this.midnight ? "mixed" : "forecast", this.timestamps = [], this.paths = [], this.interTimestamps = [], a.minifest ? this.createTimestampsFromMinifest(a.minifest) : this.createTimestamps(), this.end = Math.min(this.timestamps[this.timestamps.length - 1], this.endOfCal);
			for (var b, c, d, e, g, h = this.startOfTimeline.add(12), i = 0; i < this.calendarDays; i++) e = this.startOfTimeline.add(i, "days").getTime(), g = this.startOfTimeline.add(24).add(i, "days").getTime(), b = h.add(i, "days"), c = b.getTime(), d = f[b.getDay()], this.days[i] = {
				display: "historical" === this.type ? null : this.longWeekdays ? d : d + "2",
				displayLong: d,
				displayShort: d + "2",
				day: b.getDate(),
				middayTs: c,
				start: e,
				end: g,
				month: b.getMonth() + 1,
				year: b.getFullYear()
			};
			for (i = 1; i < this.paths.length; i++) this.interTimestamps.push(this.timestamps[i - 1] + Math.floor((this.timestamps[i] - this.timestamps[i - 1]) / 2));
			return this
		}
		var f = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"],
			g = b.getHoursFunction();
		return e.prototype = {
				createTimestamps: function() {
					var a, b, c = this.startOfTimeline.getUTCHours() % 3;
					for (c && (this.startOfTimeline = this.startOfTimeline.add(3 - c, "hours")), b = 0; b < 24 * this.numOfDays; b += 3) a = this.startOfTimeline.add(b, "hours"), this.paths.push(this.date2path(a)), this.timestamps.push(a.getTime())
				},
				createTimestampsFromMinifest: function(a) {
					var b = this;
					a && "object" == typeof a && a.ref && a.dst || c.event("Invalid format of minifest 2"), this.refTime = a.ref.replace(/(\d+)-(\d+)-(\d+)T(\d+):.*/, "$1$2$3$4"), this.refTimeTxt = a.ref, this.updateTxt = a.update, this.refTimeTs = new Date(a.ref).getTime(), this.updateTs = new Date(a.update).getTime();
					var d, e = this.refTimeTs,
						f = 36e5,
						g = Math.min(12, this.numOfDays),
						h = this.startOfTimeline.add(g, "days").getTime();
					a.dst.forEach(function(a) {
						for (var c = a[1]; c <= a[2]; c += a[0]) d = e + c * f, d <= h && (b.timestamps.push(d), b.paths.push(b.date2path(new Date(d))))
					})
				},
				date2path: function(b) {
					return [b.getUTCFullYear(), a.pad(b.getUTCMonth() + 1), a.pad(b.getUTCDate()), a.pad(b.getUTCHours())].join("/")
				},
				ts2path: function(a) {
					var b, c = this.interTimestamps;
					for (b = 0; b < c.length; b++)
						if (a < c[b]) return this.paths[b];
					return this.paths[c.length - 1]
				},
				path2date: function(a) {
					var b = a.split("/");
					return new Date(Date.UTC(b[0], b[1] - 1, b[2], b[3], 0, 0))
				},
				ts2string: function(a) {
					var b = new Date(a),
						c = b.getDay(),
						e = b.getDate(),
						h = g(b.getHours());
					return d[f[c]] + " " + e + " - " + h
				}
			},
			function(a) {
				return new e(a)
			}
	}), /*! */
	W.define("Overlay", ["utils", "trans", "Class"], function(a, b) {
		var c = W.Class.extend({
			c: null,
			m: null,
			ident: "",
			trans: null,
			filename: null,
			sea: null,
			dataQuality: null,
			dataLoading: -1,
			hasParticles: !0,
			fileSuffix: null,
			interpolate: "interpolateAll",
			JPGtransparency: !1,
			_init: function() {
				var a = this.m;
				a && (this.convertValue = a.convertValue.bind(a), this.convertNumber = a.convertNumber.bind(a), this.setMetric = a.setMetric.bind(a), this.cycleMetric = a.cycleMetric.bind(a))
			},
			paintLegend: function(a) {
				return this.m ? this.m.renderLegend(this.c, a) : ""
			},
			getColor: function() {
				return this.c.getColor()
			},
			getName: function() {
				return b[this.trans] || this.ident
			}
		});
		return Object.defineProperty(c, "metric", {
			get: function() {
				return this.m ? this.m.metric : ""
			}
		}), c
	}), /*! */
	W.define("overlays", ["Overlay", "colors", "metrics"], function(a, b, c) {
		var d = {};
		return d.temp = a.instance({
			ident: "temp",
			trans: "TEMP",
			icon: "",
			c: b.temp,
			m: c.temp
		}), d.dewpoint = d.temp.instance({
			ident: "dewpoint",
			trans: "DEW_POINT",
			icon: ""
		}), d.wind = a.instance({
			ident: "wind",
			trans: "WIND",
			icon: "|",
			hasParticles: !0,
			c: b.wind,
			m: c.wind
		}), d.gust = d.wind.instance({
			ident: "gust",
			trans: "GUST",
			icon: ""
		}), d.rh = a.instance({
			ident: "rh",
			icon: "/",
			trans: "RH",
			c: b.rh,
			m: c.rh
		}), d.pressure = a.instance({
			ident: "pressure",
			trans: "PRESS",
			icon: "",
			fileSuffix: "png",
			c: b.pressure,
			m: c.pressure
		}), d.rain = a.instance({
			ident: "rain",
			dataQuality: "high",
			trans: "RAIN",
			icon: "",
			c: b.rain,
			m: c.rain
		}), d.clouds = a.instance({
			ident: "clouds",
			filename: "testclouds1",
			dataQuality: "high",
			trans: "CLOUDS2",
			icon: "7",
			c: b.clouds,
			c1: b.rainClouds,
			m: c.rain,
			getColor: function() {
				return [this.c.getColor(), this.c1.getColor()]
			},
			paintLegend: function(a) {
				return this.m.renderLegend(d.rain.c, a)
			}
		}), d.lclouds = a.instance({
			ident: "lclouds",
			filename: "lclouds",
			dataQuality: "high",
			trans: "LOW_CLOUDS",
			icon: "",
			c: b.lclouds,
			m: c.clouds
		}), d.mclouds = a.instance({
			ident: "mclouds",
			filename: "mclouds",
			dataQuality: "high",
			trans: "MEDIUM_CLOUDS",
			icon: "",
			c: b.mclouds,
			m: c.clouds
		}), d.hclouds = a.instance({
			ident: "hclouds",
			filename: "hclouds",
			dataQuality: "high",
			trans: "HIGH_CLOUDS",
			icon: "",
			c: b.hclouds,
			m: c.clouds
		}), d.cape = a.instance({
			ident: "cape",
			trans: "CAPE",
			icon: "",
			c: b.cape,
			m: c.cape
		}), d.ozone = a.instance({
			interpolate: "interpolateOverlay",
			ident: "ozone",
			trans: "OZONE",
			icon: "O",
			hasParticles: !1,
			c: b.ozone,
			m: c.ozone
		}), d.cbase = a.instance({
			ident: "cbase",
			trans: "CLOUD_ALT",
			icon: ":",
			dataQuality: "high",
			fileSuffix: "png",
			dataLoading: 23,
			PNGtransparency: !0,
			c: b.cbase,
			m: c.cbase
		}), d.snowAccu = a.instance({
			ident: "snowAccu",
			trans: "SACCU",
			icon: "",
			dataQuality: "high",
			hasParticles: !1,
			interpolate: "interpolateOverlay",
			c: b.snowAccu,
			m: c.snowAccu
		}), d.rainAccu = a.instance({
			ident: "rainAccu",
			trans: "RACCU",
			icon: "9",
			dataQuality: "high",
			hasParticles: !1,
			interpolate: "interpolateOverlay",
			c: b.rainAccu,
			m: c.rainAccu
		}), d.waves = a.instance({
			ident: "waves",
			trans: "WAVES",
			icon: "",
			interpolate: "interpolateWaves",
			hasParticles: !0,
			PNGtransparency: !0,
			sea: !0,
			c: b.waves,
			m: c.waves
		}), d.wwaves = a.instance({
			ident: "wwaves",
			trans: "WWAVES",
			icon: "|",
			interpolate: "interpolateWaves",
			hasParticles: !0,
			PNGtransparency: !0,
			sea: !0,
			c: b.waves,
			m: c.waves
		}), d.swell = d.waves.instance({
			ident: "swell",
			trans: "SWELL",
			icon: "{"
		}), d.swell1 = d.waves.instance({
			ident: "swell1",
			trans: "SWELL1",
			icon: ""
		}), d.swell2 = d.waves.instance({
			ident: "swell2",
			trans: "SWELL2",
			icon: ""
		}), d.swell3 = d.waves.instance({
			ident: "swell3",
			trans: "SWELL3",
			icon: ""
		}), d.swellperiod = a.instance({
			ident: "swellperiod",
			filename: "swell",
			trans: "SWELLPER",
			icon: "",
			sea: !0,
			hasParticles: !0,
			PNGtransparency: !0,
			c: b.period,
			m: c.period
		}), d.sst = a.instance({
			ident: "sst",
			trans: "SST2",
			icon: "",
			filename: "sstcombined",
			interpolate: "interpolateWaves",
			sea: !0,
			PNGtransparency: !0,
			c: b.sst,
			m: c.sst
		}), d.sstanom = a.instance({
			ident: "sstanom",
			trans: "SSTA",
			icon: "",
			interpolate: "interpolateOverlay",
			sea: !0,
			PNGtransparency: !0,
			hasParticles: !1,
			c: b.sstanom,
			m: c.sstanom
		}), d.sstavg = d.sst.instance({
			ident: "sstavg",
			trans: "SSTAVG",
			icon: "",
			filename: null,
			products: ["sstavg"],
			interpolate: "interpolateOverlay",
			PNGtransparency: !0,
			hasParticles: !1
		}), d.currents = a.instance({
			ident: "currents",
			trans: "CURRENT",
			icon: "q",
			filename: "sstcombined",
			sea: !0,
			PNGtransparency: !0,
			hasParticles: !0,
			products: ["sea"],
			c: b.currents,
			m: c.currents
		}), d.visibility = a.instance({
			ident: "visibility",
			trans: "VISIBILITY",
			icon: "c",
			c: b.visibility,
			m: c.visibility
		}), d.wind.getColor(), d.temp.getColor(), d
	}), /*! */
	W.define("colors", ["utils", "colorMaker"], function(a, b) {
		W.Color = function(a, b, c) {
			this.ident = a, this.steps = b, this.gradient = c, this.colors = null, this.setMinMax()
		}, W.Color.prototype = {
			setColors: function(b) {
				this.wasModified || (this.defaultGradient = a.clone(this.gradient)), this.wasModified = !0, this.gradient = b, this.setMinMax(), this.colors && this.forceGetColor()
			},
			toDefault: function() {
				this.defaultGradient && (this.wasModified = !1, this.gradient = a.clone(this.defaultGradient), this.setMinMax(), this.colors && this.forceGetColor())
			},
			setMinMax: function() {
				this.min = this.gradient[0][0], this.max = this.gradient[this.gradient.length - 1][0]
			},
			getColor: function() {
				if (this.colors) return this;
				var a = "undefined" == typeof Uint8ClampedArray ? Uint8Array : Uint8ClampedArray;
				this.colors = new a(4 * (this.steps + 1)), this.startingValue = this.min, this.step = (this.max - this.startingValue) / this.steps;
				for (var c, d = b(this.gradient), e = 0, f = 0; e < this.steps; e++) c = d(this.startingValue + this.step * e), this.colors[f++] = c[0], this.colors[f++] = c[1], this.colors[f++] = c[2], this.colors[f++] = c[3];
				return this.neutralGrayIndex = f, this.colors[f++] = this.colors[f++] = this.colors[f++] = this.colors[f++] = 130, this.value2index = function(a) {
					return isNaN(a) ? this.neutralGrayIndex : Math.max(0, Math.min(4 * (this.steps - 1), (a - this.startingValue) / this.step << 2))
				}, this
			},
			forceGetColor: function() {
				return this.colors = null, this.getColor()
			},
			color: function(a, b, c) {
				var d = this.RGBA(a);
				return "rgba(" + d[0] + "," + d[1] + "," + d[2] + "," + (b || d[3] / (c || 256)) + ")"
			},
			colorDark: function(a, b) {
				var c = this.RGBA(a);
				return "rgba(" + (c[0] - b) + "," + (c[1] - b) + "," + (c[2] - b) + ",1)"
			},
			RGBA: function(a) {
				var b = this.value2index(a);
				return [this.colors[b], this.colors[++b], this.colors[++b], this.colors[++b]]
			}
		};
		var c = {
			temp: new W.Color("temp", 2048, [
				[219, [81, 40, 40, 120.32]],
				[248, [192, 37, 149, 120.32]],
				[268, [70, 215, 215, 120.32]],
				[273.15, [21, 84, 187, 120.32]],
				[275.15, [24, 132, 14, 120.32]],
				[285, [247, 251, 59, 120.32]],
				[291, [235, 167, 21, 120.32]],
				[298, [230, 71, 39, 120.32]],
				[303, [233, 8, 59, 92.16]],
				[328, [88, 27, 67, 120.32]]
			]),
			wind: new W.Color("wind", 2048, [
				// [0, [37, 74, 255, 80]],
				// [1, [0, 100, 254, 80]],
				// [3, [0, 200, 254, 80]],
				// [5, [37, 193, 146, 80]],
				// [7, [0, 230, 0, 80]],
				// [9, [0, 250, 0, 80]],
				// [11, [254, 225, 0, 80]],
				// [13, [254, 174, 0, 80]],
				// [15, [220, 74, 29, 80]],
				// [17, [180, 0, 50, 80]],
				// [19, [254, 0, 150, 80]],
				// [21, [151, 50, 222, 80]],
				// [24, [86, 54, 222, 80]],
				// [27, [42, 132, 222, 80]],
				// [29, [64, 199, 222, 80]],
				// [100, [150, 0, 254, 80]]

                // NOTE: 更改风场背景
				[0, [152, 219, 248, 0]],
				[8.49, [50, 100, 255, 0]],
				[15.79, [254, 0, 3, 100]],
				[30, [209, 103, 211, 100]],
				[70, [238, 200, 239, 100]],
				[100, [55, 255, 255, 100]]
			]),
			rh: new W.Color("rh", 512, [
				[0, [0, 0, 0, 80]],
				[30, [0, 0, 0, 80]],
				[40, [127, 127, 127, 80]],
				[50, [255, 255, 255, 90]],
				[60, [255, 255, 255, 90]],
				[70, [230, 240, 255, 90]],
				[75, [0, 108, 192, 90]],
				[80, [0, 188, 0, 90]],
				[83, [156, 220, 0, 90]],
				[87, [224, 220, 0, 90]],
				[90, [252, 132, 0, 90]],
				[93, [252, 0, 0, 90]],
				[97, [160, 0, 0, 90]],
				[100, [160, 0, 0, 90]]
			]),
			pressure: new W.Color("pressure", 1024, [
				[99e3, [37, 4, 42, 120]],
				[99500, [41, 10, 130, 120]],
				[1e5, [81, 40, 40, 120]],
				[100300, [192, 37, 149, 120]],
				[100600, [70, 215, 215, 120]],
				[100900, [21, 84, 187, 120]],
				[101500, [24, 132, 14, 120]],
				[101900, [247, 251, 59, 120]],
				[102200, [235, 167, 21, 120]],
				[102500, [230, 71, 39, 120]],
				[103e3, [88, 27, 67, 120]]
			]),
			rain: new W.Color("rain", 1024, [
				[0, [80, 80, 80, 89.6]],
				[.2, [80, 80, 80, 89.6]],
				[.3, [0, 108, 192, 89.6]],
				[6, [0, 255, 255, 89.6]],
				[8, [0, 188, 0, 89.6]],
				[10, [156, 220, 0, 89.6]],
				[15, [255, 255, 0, 89.6]],
				[20, [252, 0, 0, 89.6]],
				[31, [255, 0, 255, 89.6]],
				[50, [255, 255, 255, 100]]
			]),
			rainClouds: new W.Color("rainClouds", 800, [
				[0, [0, 52, 255, 81.92]],
				[.8, [0, 88, 255, 76.8]],
				[2, [0, 255, 255, 89.6]],
				[6, [0, 255, 255, 89.6]],
				[8, [0, 188, 0, 89.6]],
				[10, [156, 220, 0, 89.6]],
				[15, [255, 255, 0, 89.6]],
				[20, [252, 0, 0, 89.6]],
				[31, [255, 0, 255, 89.6]],
				[50, [255, 255, 255, 100]]
			]),
			clouds: new W.Color("clouds", 800, [
				[0, [209, 165, 0, 76.8]],
				[10, [169, 133, 0, 76.8]],
				[30, [127, 127, 127, 79.36]],
				[95, [255, 255, 255, 104.96]],
				[100, [255, 255, 255, 104.96]]
			]),
			lclouds: new W.Color("lclouds", 800, [
				[0, [209, 165, 0, 76.8]],
				[10, [169, 133, 0, 76.8]],
				[30, [127, 127, 127, 79.36]],
				[60, [145, 195, 245, 104]],
				[100, [255, 255, 255, 104.96]]
			]),
			hclouds: new W.Color("hclouds", 800, [
				[0, [209, 165, 0, 76.8]],
				[10, [169, 133, 0, 76.8]],
				[30, [116, 209, 208, 79]],
				[50, [154, 217, 216, 104]],
				[100, [255, 255, 255, 104.96]]
			]),
			mclouds: new W.Color("mclouds", 800, [
				[0, [209, 165, 0, 76.8]],
				[10, [169, 133, 0, 76.8]],
				[30, [178, 243, 178, 128]],
				[50, [164, 221, 164, 104]],
				[100, [255, 255, 255, 104.96]]
			]),
			cape: new W.Color("cape", 1024, [
				[0, [0, 0, 0, 120]],
				[100, [0, 108, 192, 120]],
				[800, [0, 188, 0, 120]],
				[1e3, [156, 220, 0, 120]],
				[1500, [224, 220, 0, 90]],
				[2e3, [252, 132, 0, 90]],
				[2500, [252, 0, 0, 90]],
				[3e3, [200, 0, 0, 90]],
				[3500, [160, 0, 0, 90]],
				[5001, [255, 0, 255, 90]]
			]),
			ozone: new W.Color("ozone", 512, [
				[.0048, [37, 4, 42, 120]],
				[.0049, [41, 10, 130, 120]],
				[.005, [81, 40, 40, 120]],
				[.0051, [192, 37, 149, 120]],
				[.0053, [70, 215, 215, 120]],
				[.006, [21, 84, 187, 120]],
				[.007, [24, 132, 14, 120]],
				[.008, [24, 132, 14, 120]]
			]),
			cbase: new W.Color("cbase", 512, [
				[0, [255, 0, 251, 66.56]],
				[129, [255, 0, 249, 58.88]],
				[149, [255, 0, 0, 69.12]],
				[279, [255, 0, 0, 69.12]],
				[299, [0, 97, 255, 56.32]],
				[879, [0, 97, 255, 56.32]],
				[914, [0, 255, 2, 71.68]],
				[1499, [0, 255, 26, 69.12]],
				[7999, [0, 255, 14, 20.48]]
			]),
			snowAccu: new W.Color("snowAccu", 2048, [
				[0, [0, 0, 0, 80]],
				[1, [0, 0, 0, 80]],
				[10, [107, 63, 180, 90]],
				[20, [27, 160, 223, 100]],
				[30, [0, 225, 158, 120]],
				[50, [165, 242, 76, 120]],
				[80, [231, 178, 18, 120]],
				[150, [255, 112, 67, 120]],
				[300, [238, 61, 150, 120]],
				[800, [116, 58, 174, 120]]
			]),
			rainAccu: new W.Color("rainAccu", 4096, [
				[0, [80, 80, 80, 80]],
				[1, [80, 80, 80, 80]],
				[5, [107, 63, 180, 90]],
				[10, [27, 160, 223, 100]],
				[30, [0, 225, 158, 120]],
				[40, [165, 242, 76, 120]],
				[80, [231, 178, 18, 120]],
				[120, [255, 112, 67, 120]],
				[500, [238, 61, 150, 120]],
				[8e3, [116, 58, 174, 120]]
			]),
			waves: new W.Color("waves", 1024, [
				[0, [198, 244, 255, 130]],
				[.5, [0, 194, 243, 130]],
				[1, [0, 89, 166, 130]],
				[1.5, [13, 100, 255, 130]],
				[2, [15, 21, 167, 130]],
				[2.5, [247, 74, 255, 130]],
				[3, [188, 0, 184, 130]],
				[4, [151, 0, 0, 130]],
				[5, [255, 4, 83, 130]],
				[7, [255, 98, 69, 130]],
				[10, [255, 255, 255, 130]],
				[12, [188, 141, 190, 130]]
			]),
			sst: new W.Color("sst", 512, [
				[-2, [37, 4, 42, 120]],
				[0, [41, 10, 130, 120]],
				[1, [81, 40, 40, 120]],
				[2, [192, 37, 149, 120]],
				[5, [70, 215, 215, 120]],
				[9, [21, 84, 187, 120]],
				[16, [24, 132, 14, 120]],
				[19, [247, 251, 59, 120]],
				[22, [235, 167, 21, 120]],
				[25, [230, 71, 39, 120]],
				[28, [192, 37, 149, 120]],
				[31, [41, 10, 130, 120]],
				[40, [255, 255, 255, 120]]
			]),
			sstanom: new W.Color("sstanom", 256, [
				[-10, [255, 255, 255, 120]],
				[-3, [9, 31, 246, 120]],
				[-1, [9, 221, 246, 120]],
				[0, [130, 130, 130, 120]],
				[1, [246, 238, 9, 120]],
				[2, [246, 9, 9, 120]],
				[2.5, [246, 9, 244, 120]],
				[10, [255, 255, 255, 120]]
			]),
			currents: new W.Color("currents", 256, [
				[0, [37, 74, 255, 80]],
				[.02, [0, 100, 254, 80]],
				[.06, [0, 200, 254, 80]],
				[.1, [37, 193, 146, 80]],
				[.15, [0, 230, 0, 80]],
				[.2, [0, 250, 0, 80]],
				[.3, [254, 225, 0, 80]],
				[.4, [254, 174, 0, 80]],
				[.5, [220, 74, 29, 80]],
				[.6, [180, 0, 50, 80]],
				[.7, [254, 0, 150, 80]],
				[.8, [151, 50, 222, 80]],
				[.85, [86, 54, 222, 80]],
				[.9, [42, 132, 222, 80]],
				[1, [64, 199, 222, 80]],
				[1.5, [255, 255, 255, 80]],
				[4, [255, 255, 255, 80]]
			]),
			visibility: new W.Color("visibility", 1024, [
				[0, [255, 0, 255, 79.36]],
				[1600, [248, 0, 255, 79.36]],
				[2200, [255, 0, 0, 87.04]],
				[5e3, [255, 0, 0, 87.04]],
				[6e3, [0, 28, 255, 79.36]],
				[8e3, [0, 40, 255, 79.36]],
				[9e3, [0, 231, 24, 151.04]],
				[15e3, [19, 219, 0, 115.2]],
				[20004, [255, 255, 255, 0]]
			]),
			period: new W.Color("period", 1024, [
				[0, [37, 4, 42, 120]],
				[2, [41, 10, 130, 120]],
				[4, [81, 40, 40, 120]],
				[6, [192, 37, 149, 120]],
				[8, [70, 215, 215, 120]],
				[10, [21, 84, 187, 120]],
				[12, [24, 132, 14, 120]],
				[14, [247, 251, 59, 120]],
				[16, [235, 167, 21, 120]],
				[18, [230, 71, 39, 120]],
				[29, [88, 27, 67, 120]]
			])
		};
		return c
	}), /*! */
	W.define("metrics", ["settings", "broadcast", "Class"], function(a, b) {
		var c = "metric" === a.defaults ? 0 : 1,
			d = W.Class.extend({
				separator: "",
				defaults: [null, null],
				_init: function() {
					var b = a.get(this.ident, {
						doNotCheckValidity: !0
					});
					b && this.conv[b] ? this.metric = b : this.metric = this.defaults[c]
				},
				convertValue: function(a, b) {
					var c = this.conv[this.metric];
					return "undefined" == typeof a ? "" : c.conversion(a).toFixed(c.precision) + (b || this.separator) + (c.label || this.metric)
				},
				convertNumber: function(a) {
					var b = this.conv[this.metric];
					return parseFloat(b.conversion(a).toFixed(b.precision))
				},
				setMetric: function(c, d) {
					this.conv[c] && this.metric !== c && (this.metric = c, a.set(this.ident, c, d || {
						doNotCheckValidity: !0
					}), b.emit("metricChanged", this.ident, c)), b.emit("log", "settings/" + this.ident + "/" + c)
				},
				cycleMetric: function() {
					var a = this.description.indexOf(this.metric) + 1;
					a === this.description.length && (a = 0), this.setMetric(this.description[a])
				},
				renderLegend: function(a, b) {
					if (a.getColor(), !this.description) return "";
					b = b || this.metric;
					var c, d, e, f, g, h, i, j = this.lines,
						k = 100 / (j.length + 1),
						l = this.description.indexOf(b),
						m = "<div>" + b + "</div><div>";
					for (c = 0; c < j.length; c++) g = j[Math.max(c - 1, 0)][0], h = j[c][0], i = j[Math.min(c + 1, j.length - 1)][0], d = a.color(.5 * (h + g), null, 200), e = a.color(h, null, 200), f = a.color(.5 * (h + i), null, 200), c || (m = '<span style="background: ' + d + "; width:" + k + '%">' + b + "</span>"), m += '<span style="background: linear-gradient(to right, ' + d + ", " + e + ", " + f + "); width:" + k + '%">' + this.lines[c][1 + l] + "</span>";
					return m
				}
			}),
			e = {};
		return e.temp = d.instance({
			ident: "temp",
			separator: "",
			defaults: ["°C", "°F"],
			conv: {
				"°C": {
					conversion: function(a) {
						return a - 273.15
					},
					precision: 0
				},
				"°F": {
					conversion: function(a) {
						return 9 * a / 5 - 459.67
					},
					precision: 0
				}
			},
			description: ["°C", "°F"],
			lines: [
				[252, -20, -5],
				[262, -10, 15],
				[272, 0, 30],
				[282, 10, 50],
				[292, 20, 70],
				[302, 30, 85],
				[313, 40, 100]
			]
		}), e.wind = d.instance({
			ident: "wind",
			defaults: ["kt", "kt"],
			conv: {
				kt: {
					conversion: function(a) {
						return 1.943844 * a
					},
					precision: 0
				},
				bft: {
					conversion: function(a) {
						return a < .3 ? 0 : a < 1.5 ? 1 : a < 3.3 ? 2 : a < 5.5 ? 3 : a < 8 ? 4 : a < 10.8 ? 5 : a < 13.9 ? 6 : a < 17.2 ? 7 : a < 20.7 ? 8 : a < 24.5 ? 9 : a < 28.4 ? 10 : a < 32.6 ? 11 : 12
					},
					precision: 0
				},
				"m/s": {
					conversion: function(a) {
						return a
					},
					precision: 1
				},
				"km/h": {
					conversion: function(a) {
						return 3.6 * a
					},
					precision: 0
				},
				mph: {
					conversion: function(a) {
						return 2.236936 * a
					},
					precision: 0
				}
			},
			description: ["kt", "bft", "m/s", "mph", "km/h"],
			lines: [
				[0, 0, 0, 0, 0, 0],
				[3, 5, 2, 3, 6, 10],
				[5, 10, 3, 5, 10, 20],
				[10, 20, 5, 10, 20, 35],
				[15, 30, 7, 15, 35, 55],
				[20, 40, 8, 20, 45, 70],
				[30, 60, 11, 30, 70, 100]
			]
		}), e.rh = d.instance({
			ident: "rh",
			defaults: ["%", "%"],
			conv: {
				"%": {
					conversion: function(a) {
						return a
					},
					precision: 0
				}
			},
			description: ["%"],
			lines: [
				[50, 50],
				[60, 60],
				[70, 70],
				[80, 80],
				[90, 90],
				[100, 100]
			]
		}), e.clouds = d.instance({
			ident: "clouds",
			defaults: ["rules", "rules"],
			conv: {
				rules: {
					conversion: function(a) {
						return a
					},
					precision: 0
				},
				"%": {
					conversion: function(a) {
						return a
					},
					precision: 0
				}
			},
			description: ["rules", "%"],
			lines: [
				[25, "FEW", 25],
				[50, "SCT", 50],
				[70, "BKN", 70],
				[100, "OVC", 100]
			]
		}), e.pressure = d.instance({
			ident: "pressure",
			defaults: ["hPa", "inHg", "mmHg"],
			conv: {
				hPa: {
					conversion: function(a) {
						return a / 100
					},
					precision: 0
				},
				mmHg: {
					conversion: function(a) {
						return a / 133.322387415
					},
					precision: 0
				},
				inHg: {
					conversion: function(a) {
						return a / 3386.389
					},
					precision: 2
				}
			},
			description: ["hPa", "inHg", "mmHg"],
			lines: [
				[99e3, 990, 29.2, 742],
				[1e5, 1e3, 29.6, 750],
				[101e3, 1010, 29.8, 757],
				[102e3, 1020, 30.1, 765],
				[103e3, 1030, 30.4, 772]
			]
		}), e.rain = d.instance({
			ident: "rain",
			defaults: ["mm", "in"],
			conv: { in : {
					conversion: function(a) {
						return .039 * a
					},
					label: "in",
					precision: 2
				},
				mm: {
					conversion: function(a) {
						return a
					},
					label: "mm",
					precision: 1
				}
			},
			description: ["mm", "in"],
			lines: [
				[1.5, 1.5, ".06"],
				[2, 2, ".08"],
				[3, 3, ".11"],
				[7, 7, ".24"],
				[10, 10, ".39"],
				[20, 20, ".78"],
				[30, 30, 1.2]
			]
		}), e.cape = d.instance({
			ident: "cape",
			defaults: ["J/kg", "J/kg"],
			conv: {
				"J/kg": {
					conversion: function(a) {
						return a
					},
					label: "J/kg",
					precision: 0
				}
			},
			description: ["J/kg"],
			lines: [
				[0, 0],
				[500, 500],
				[1500, 1500],
				[2500, 2500],
				[5e3, 5e3]
			]
		}), e.ozone = d.instance({
			ident: "ozone",
			defaults: ["DU", "DU"],
			conv: {
				DU: {
					conversion: function(a) {
						return 46728 * a
					},
					label: "DU",
					precision: 0
				}
			},
			description: ["DU"],
			lines: [
				[.0045, 210],
				[.0051, 240],
				[.006, 280],
				[.007, 330],
				[.008, 370]
			]
		}), e.cbase = d.instance({
			ident: "cbase",
			defaults: ["rules", "rules"],
			conv: {
				rules: {
					conversion: function(a) {
						return 3.28 * a
					},
					label: "ft",
					precision: 0
				},
				m: {
					conversion: function(a) {
						return a
					},
					label: "m",
					precision: 0
				},
				ft: {
					conversion: function(a) {
						return 3.28 * a
					},
					label: "ft",
					precision: 0
				}
			},
			description: ["rules", "m", "ft"],
			lines: [
				[0, "LIFR", 0, 0],
				[200, "IFR", 300, 1e3],
				[500, "MVFR", 500, 1500],
				[1500, "VFR", "1.5k", 5e3]
			]
		}), e.snowAccu = d.instance({
			ident: "snowAccu",
			defaults: ["cm", "in"],
			conv: { in : {
					conversion: function(a) {
						return .39 * a
					},
					precision: 1
				},
				cm: {
					conversion: function(a) {
						return a
					},
					precision: 1
				}
			},
			description: ["cm", "in"],
			lines: [
				[8, 8, 3.1],
				[10, 10, 3.9],
				[20, 20, 8],
				[30, 30, 11],
				[100, "1m", "3ft"],
				[300, "3m", "9ft"]
			]
		}), e.rainAccu = d.instance({
			ident: "rainAccu",
			defaults: ["mm", "in"],
			conv: { in : {
					conversion: function(a) {
						return .039 * a
					},
					precision: 1
				},
				mm: {
					conversion: function(a) {
						return a
					},
					precision: 1
				}
			},
			description: ["mm", "in"],
			lines: [
				[5, 5, ".2"],
				[10, 10, ".4"],
				[20, 20, ".8"],
				[40, 40, 1.5],
				[1e3, "1m", "3ft"]
			]
		}), e.waves = d.instance({
			ident: "waves",
			defaults: ["m", "ft"],
			conv: {
				m: {
					conversion: function(a) {
						return a
					},
					precision: 1
				},
				ft: {
					conversion: function(a) {
						return 3.28 * a
					},
					precision: 0
				}
			},
			description: ["m", "ft"],
			lines: [
				[.5, .5, 1.6],
				[1, 1, 3.3],
				[1.5, 1.5, 5],
				[2, 2, 6.6],
				[6, 6, 20],
				[9, 9, 30]
			]
		}), e.sst = d.instance({
			ident: "sst",
			defaults: ["°C", "°F"],
			conv: {
				"°C": {
					conversion: function(a) {
						return a
					},
					precision: 1
				},
				"°F": {
					conversion: function(a) {
						return 1.8 * a + 32
					},
					precision: 1
				}
			},
			description: ["°C", "°F"],
			lines: [
				[0, 0, 32],
				[4, 4, 39],
				[10, 10, 50],
				[16, 16, 60],
				[20, 20, 68],
				[24, 24, 75],
				[28, 28, 82]
			]
		}), e.sstanom = d.instance({
			ident: "sstanom",
			defaults: ["°C", "°C"],
			conv: {
				"°C": {
					conversion: function(a) {
						return a
					},
					precision: 2
				}
			},
			description: ["°C"],
			lines: [
				[-3, -3],
				[-2, -2],
				[-1, -1],
				[0, 0],
				[1, 1],
				[2, 2],
				[3, 3]
			]
		}), e.currents = d.instance({
			ident: "currents",
			separator: " ",
			defaults: ["kt", "kt"],
			conv: {
				kt: {
					conversion: function(a) {
						return 1.943844 * a
					},
					precision: 1
				},
				"m/s": {
					conversion: function(a) {
						return a
					},
					precision: 2
				},
				"km/h": {
					conversion: function(a) {
						return 3.6 * a
					},
					precision: 1
				},
				mph: {
					conversion: function(a) {
						return 2.236936 * a
					},
					precision: 1
				}
			},
			description: ["kt", "m/s", "mph", "km/h"],
			lines: [
				[0, 0, 0, 0, 0],
				[.2, .4, .2, .4, .7],
				[.4, .8, .4, .9, 1.4],
				[.8, 1.6, .8, 1.8, 2.9],
				[1, 2, 1, 2.2, 3.6],
				[1.6, 3.2, 1.6, 3.6, 5.8]
			]
		}), e.visibility = d.instance({
			ident: "visibility",
			defaults: ["rules", "rules"],
			conv: {
				rules: {
					conversion: function(a) {
						return a / 1e3
					},
					label: "km",
					precision: 1
				},
				km: {
					conversion: function(a) {
						return a / 1e3
					},
					label: "km",
					precision: 1
				},
				sm: {
					conversion: function(a) {
						return 3.28 * a
					},
					label: "sm",
					precision: 1
				}
			},
			description: ["rules", "km", "sm"],
			lines: [
				[0, "LIFR", ".8", ".5"],
				[3e3, "IFR", 2.7, 1.5],
				[7e3, "MVFR", 6, 4],
				[16e3, "VFR", 16, 10]
			]
		}), e.period = d.instance({
			ident: "vperiod",
			defaults: ["sec.", "sec."],
			conv: {
				"sec.": {
					conversion: function(a) {
						return a
					},
					precision: 0
				}
			},
			description: ["sec."],
			lines: [
				[2, 2],
				[4, 4],
				[6, 6],
				[8, 8],
				[12, 12],
				[14, 14],
				[16, 16],
				[18, 18],
				[20, 20]
			]
		}), e
	}),
	/*! 
	Copyright (c) 2014 Cameron Beccario - The MIT License (MIT) */
	W.define("colorMaker", [], function() {
		return function(a) {
			function b(a, b) {
				var c = a[0],
					d = a[1],
					e = a[2],
					f = a[3],
					g = b[0] - c,
					h = b[1] - d,
					i = b[2] - e,
					j = b[3] - f;
				return function(a) {
					return [Math.floor(c + a * g), Math.floor(d + a * h), Math.floor(e + a * i), Math.floor(f + a * j)]
				}
			}

			function c(a, b, c) {
				return (Math.max(b, Math.min(a, c)) - b) / (c - b)
			}
			for (var d = [], e = [], f = [], g = 0; g < a.length - 1; g++) d.push(a[g + 1][0]), e.push(b(a[g][1], a[g + 1][1])), f.push([a[g][0], a[g + 1][0]]);
			return function(a) {
				var b;
				for (b = 0; b < d.length - 1 && !(a <= d[b]); b++);
				var g = f[b];
				return e[b](c(a, g[0], g[1]))
			}
		}
	}), /*! */
	W.define("products", ["rootScope", "productClasses"], function(a, b) {
		var c = {},
			d = (new Date).toISOString().replace(/^\d+-(\d+)-(\d+)T.*$/, "$1$2");
		c.gfs = b.instance({
			model: "gfs",
			modelDesc: "GFS 13km",
			provider: "NOAA",
			interval: "6h - 8h",
			directory: "gfs",
			maxTileZoom: 3,
			dataQuality: "low",
			particlesIdent: "wind",
			particlesOverlay: "wind",
			productReady: !1,
			levels: ["surface", "100m", "975h", "950h", "925h", "900h", "850h", "800h", "700h", "600h", "500h", "400h", "300h", "250h", "200h", "150h"],
			overlays: ["wind", "temp", "pressure", "clouds", "rh", "gust", "dewpoint", "rain", "lclouds", "mclouds", "hclouds"]
		});
		var e = "© 2016 ECMWF: This service is based on data and products of the European Centre for Medium-range Weather Forecasts";
		c.ecmwf = b.instance({
			model: "ecmwf",
			productReady: !1,
			directory: "ecmwf-hres",
			modelDesc: "ECMWF 9km",
			provider: "ECMWF",
			interval: "12h - 14h",
			copy: e,
			particlesOverlay: "wind",
			particlesIdent: "wind",
			levels: ["surface", "100m", "950h", "925h", "900h", "850h", "800h", "700h", "600h", "500h", "400h", "300h", "250h", "200h", "150h"],
			overlays: ["wind", "temp", "pressure", "clouds", "lclouds", "mclouds", "hclouds", "rh", "gust", "cbase", "cape", "rainrate", "dewpoint", "rain", "visibility"]
		}), c.ozone = c.ecmwf.instance({
			productReady: !0,
			levels: ["surface"],
			overlays: ["ozone"],
			dataQuality: "low",
			particlesIdent: null,
			particlesOverlay: null
		}), c.mbeurope = b.instance({
			model: "mbeurope",
			productReady: !1,
			modelDesc: "NEMS 4km",
			provider: "Meteoblue.com",
			interval: "12h - 14h",
			JPGtransparency: !0,
			animation: !0,
			dataQuality: "high",
			particlesIdent: "wind",
			particlesOverlay: "wind",
			directory: "mbeurope",
			forecastSize: 3,
			bounds: {
				west: -19,
				east: 33,
				north: 57,
				south: 33
			},
			levels: ["surface", "975h", "950h", "925h", "900h", "850h"],
			overlays: ["wind", "temp", "clouds", "rh", "gust", "dewpoint", "rain"]
		});
		var f = b.extend({
			provider: "NOAA",
			interval: "6h - 8h",
			dataQuality: "high",
			JPGtransparency: !0,
			animation: !0,
			particlesIdent: "wind",
			particlesOverlay: "wind",
			forecastSize: 3,
			animationSpeed: 2e3,
			levels: ["surface", "975h", "950h", "925h", "900h", "850h", "800h", "700h", "600h", "500h", "400h", "300h", "250h", "200h", "150h"],
			overlays: ["wind", "temp", "clouds", "rh", "gust", "pressure", "dewpoint", "rain"]
		});
		return c.namConus = f.instance({
			model: "namConus",
			productReady: !1,
			modelDesc: "NAM 5km",
			directory: "nam-conus",
			bounds: {
				west: -137,
				east: -55,
				north: 53,
				south: 20
			}
		}), c.namHawaii = f.instance({
			model: "namHawaii",
			productReady: !1,
			modelDesc: "NAM 3km",
			directory: "nam-hawaii",
			bounds: {
				west: -167,
				east: -147,
				north: 30,
				south: 14
			}
		}), c.namAlaska = f.instance({
			model: "namAlaska",
			productReady: !1,
			modelDesc: "NAM 6km",
			directory: "nam-alaska",
			bounds: {
				west: -179,
				east: -129,
				north: 80,
				south: 53
			}
		}), c.accumulations = c.ecmwf.instance({
			model: "ecmwf",
			productReady: !0,
			interval: "12h - 18h",
			animation: !1,
			pathGenerator: function(a) {
				return "{server}ecmwf-hres/{acTime}/<tiles>" + a.overlay.replace("Accu", "accumulation") + "-surface.png"
			},
			refTime: function() {
				return "?" + d
			},
			betterFcst: null,
			calendar: null,
			particlesIdent: null,
			particlesOverlay: null,
			levels: ["surface"],
			overlays: ["snowAccu", "rainAccu"]
		}), c.ecmwf_waves = b.instance({
			model: "ecmwf",
			productReady: !1,
			modelDesc: "ECMWF WAM",
			provider: "ECMWF",
			interval: "12h - 14h",
			copy: e,
			directory: "ecmwf-wam",
			animation: !0,
			overlays: ["waves", "swell", "swellperiod", "swell1", "swell2", "swell3", "wwaves"],
			levels: ["surface"],
			pathGenerator: "{server}ecmwf-wam/{path}/<tiles>{filename}-surface.png",
			betterFcst: null,
			particlesIdent: "waves",
			particlesOverlay: null
		}), c.gfs_waves = b.instance({
			model: "gfs",
			productReady: !1,
			modelDesc: "Wavewatch 3",
			provider: "NOAA",
			interval: "6h - 8h",
			directory: "waves",
			animation: !0,
			overlays: ["waves", "swell", "swellperiod", "wwaves"],
			levels: ["surface"],
			pathGenerator: "{server}waves/{path}/<tiles>{filename}-surface.png",
			betterFcst: null,
			particlesIdent: "waves",
			particlesOverlay: null
		}), c.sea = b.instance({
			model: "sea",
			productReady: !0,
			modelDesc: "NESDIS",
			provider: "NOAA",
			interval: "48h",
			overlays: ["sst", "sstanom", "currents"],
			levels: ["surface"],
			betterFcst: null,
			animation: !1,
			particlesIdent: "currents",
			particlesOverlay: null,
			refTime: function() {
				return "?" + d
			},
			pathGenerator: "{server}sst/latest/<tiles>{filename}.png"
		}), c.sstavg = c.sea.instance({
			model: "sstavg",
			productReady: !0,
			particlesIdent: null,
			particlesOverlay: null,
			interval: "1year",
			overlays: ["sstavg"],
			levels: ["surface"],
			pathGenerator: "{server}sst/{sstTime}/<tiles>{filename}.png"
		}), c
	}), W.define("productClasses", ["$", "utils", "rootScope", "overlays", "broadcast", "calendar", "http", "log"], function(a, b, c, d, e, f, g, h) {
		var i = {
				ref: (new Date).toISOString().replace(/T.*$/, "T00:00:00Z"),
				update: (new Date).toISOString(),
				dst: [
					[3, 3, 144],
					[6, 150, 240]
				]
			},
			j = W.Class.extend({
				model: void 0,
				maxTileZoom: 10,
				animationSpeed: 6e3,
				fileSuffix: "jpg",
				JPGtransparency: !1,
				PNGtransparency: !1,
				particlesOverlay: "wind",
				dataQuality: "normal",
				animation: !0,
				calendar: void 0,
				modelDesc: void 0,
				provider: void 0,
				interval: void 0,
				directory: void 0,
				particlesIdent: "wind",
				productReady: !1,
				highLevelOverlays: ["wind", "temp", "rh", "dewpoint"],
				refTime: function() {
					return this.calendar && this.calendar.refTime && "?" + this.calendar.refTime || ""
				},
				getUpdateTimes: function() {
					return this.calendar ? {
						refTime: this.calendar.refTimeTxt,
						minUpdate: this.calendar.updateTs
					} : {}
				},
				_init: function() {
					if (!this.productReady) {
						try {
							var b = a('meta[name="minifest-' + this.directory + '"]'),
								c = b && b.content;
							c ? (this.minifest = JSON.parse(c), this.calendar = f({
								numOfDays: this.forecastSize,
								minifest: this.minifest
							})) : this.createBackupMinifest("")
						} catch (d) {
							this.createBackupMinifest(d)
						}
						this.productReady = !0
					}
				},
				createBackupMinifest: function(a) {
					this.minifest = i, this.calendar = f({
						numOfDays: this.forecastSize,
						minifest: i
					})
				},
				isInBounds: function(a) {
					return a.west > this.bounds.west && a.east < this.bounds.east && a.north < this.bounds.north && a.south > this.bounds.south
				},
				pointIsInBounds: function(a) {
					return a.lon > this.bounds.west && a.lon < this.bounds.east && a.lat < this.bounds.north && a.lat > this.bounds.south
				},
				overlayParams: function(a) {
					return this.mixOverlay(a, a.overlay)
				},
				vectorParams: function(a) {
					var b = this.particlesOverlay || a.overlay;
					return this.particlesIdent && d[b].hasParticles ? this.mixOverlay(a, b) : null
				},
				mixOverlay: function(a, e) {
					var f = b.clone(a),
						g = d[e];
					b.include(f, {
						overlay: e,
						sea: g.sea,
						server: this.server || c.server,
						JPGtransparency: this.JPGtransparency || g.JPGtransparency,
						PNGtransparency: this.PNGtransparency || g.PNGtransparency,
						particlesIdent: this.particlesIdent,
						isWave: "waves" === this.particlesIdent,
						maxTileZoom: this.maxTileZoom,
						filename: g.filename || e,
						fileSuffix: g.fileSuffix || this.fileSuffix,
						dataQuality: g.dataQuality || this.dataQuality
					}), b.contains(this.levels, f.level) && b.contains(this.highLevelOverlays, f.overlay) || (f.level = "surface"), "100m" === f.level && "wind" !== f.overlay && (f.level = "surface");
					var h = "function" == typeof this.pathGenerator ? this.pathGenerator(f) : this.pathGenerator;
					return f.fullPath = b.template(h, f) + this.refTime(f), f
				},
				pathGenerator: function(a) {
					return "{server}" + this.directory + "/{path}/<tiles>{filename}-{level}." + a.fileSuffix
				}
			});
		return j
	}), /*! */
	W.define("geolocation", ["rootScope", "http", "broadcast", "storage"], function(a, b, c, d) {
		function e(b) {
			a.geoIP = {
				lat: parseFloat(b[1]),
				lon: parseFloat(b[2]),
				country: b[3],
				zoom: 5,
				resolved: !0
			}, a.geoIP.name = b[4] || a.geoIP.lat.toFixed(3) + ", " + a.geoIP.lon.toFixed(3), h = b[3].toLowerCase(), j = function(a) {
				return h === a
			}
		}

		function f() {
			return navigator.geolocation ? new Promise(function(b, c) {
				navigator.geolocation.getCurrentPosition(function(a) {
					b({
						lat: a.coords.latitude,
						lon: a.coords.longitude
					})
				}, function(c) {
					b(a.geoIP)
				})
			}) : Promise.resolve(a.geoIP)
		}

		function g(c, e, f) {
			var g, h = parseFloat(c.lat).toFixed(2) + ", " + parseFloat(c.lon).toFixed(2);
			if (e.fromStartup && (g = d.get("initReverseName")) && c.lat == g.lat && g.lon == g.lon) return f(g), Promise.resolve();
			var i = b.get(a.server2 + "node/reverse/" + c.lat + "/" + c.lon + "?version=2.0&lang=" + a.prefLang);
			return i.then(function(a) {
				var b;
				(b = a.data && a.data.address) ? ("village" === e.detailLevel ? c.name = b.hamlet || b.suburb || b.quarter || b.village || b.town || b.city : c.name = b.town || b.village || b.city || b.hamlet || b.suburb || b.quarter, c.region = b.county || b.district || b.state || "", c.country = b.country || "", !c.name && e.mustBeDefined && (c.name = c.region + " " + h), e.fromStartup && d.put("initReverseName", c), f(c)) : f({
					name: h
				})
			}, f.bind(null, {
				name: h
			})), i
		}
		c.on("locationRqstd", function() {
			f().then(function(a) {
				a.zoom = 9, c.emit("mapsCenter", a), c.emit("mapsPopupRequested", a.lat, a.lon), document.body.classList.remove("mobilemenu-up")
			})
		});
		var h, i = document.querySelector('meta[name="geoip"]'),
			j = function() {
				return !1
			};
		if (i && i.content) {
			var k = i.content.split(",");
			k[1] && k[2] && e(k)
		}
		return {
			sameCountry: j,
			getGPSlocation: f,
			getReverseName: g
		}
	}), W.define("weatherRender", ["utils", "trans", "overlays", "weatherColors", "rootScope", "settings"], function(a, b, c, d, e, f) {
		var g = {
				canvas: document.createElement("canvas"),
				canvasRatio: window.devicePixelRatio || 1,
				init: function(a, b, c) {
					this.ctx = this.canvas.getContext("2d"), this.origW = b * a, this.origH = c, this.tdWidth = b * this.canvasRatio, this.w = this.canvas.width = this.origW * this.canvasRatio, this.h = this.canvas.height = this.origH * this.canvasRatio, this.ctx.transform(1, 0, 0, -1, 0, this.h), this.ctx.fillStyle = "rgba(255, 255, 255, 00)", this.ctx.fillRect(0, 0, this.w, this.h)
				},
				mm2h: function(a) {
					return a -= .2, a = a < 3 ? a / 3 * .25 : a < 10 ? (a - 3) / 7 * .25 + .25 : a < 20 ? (a - 10) / 10 * .25 + .5 : Math.min(.9, (a - 20) / 30 * .25 + .75), a * this.h
				},
				spline: function(a, b, c, d, e) {
					return .5 * (2 * b + (-a + c) * e + (2 * a - 5 * b + 4 * c - d) * e * e + (-a + 3 * b - 3 * c + d) * e * e * e)
				},
				paintRain: function(a, b) {
					var c, d = this,
						e = a * this.tdWidth,
						f = b.map(this.mm2h.bind(this));
					for (this.ctx.fillStyle = "#CEF1FA", this.ctx.beginPath(), this.ctx.moveTo(e, 0), c = .5; c <= 1; c += .1) d.ctx.lineTo(e + d.tdWidth * (c - .5), d.spline(f[0], f[1], f[2], f[3], c));
					for (c = 0; c <= .5; c += .1) d.ctx.lineTo(e + d.tdWidth * (c + .5), d.spline(f[1], f[2], f[3], f[4], c));
					this.ctx.lineTo(e + this.tdWidth, 0), this.ctx.fill()
				},
				getImg: function() {
					return {
						w: this.origW,
						h: this.origH,
						img: this.canvas.toDataURL()
					}
				}
			},
			h = {
				is12hFormat: f.is12hFormat(),
				nightColor: "rgba(240,241,253,1)",
				row2metric: {
					gust: "wind",
					dew_point: "temp",
					swell: "waves",
					swell1: "waves",
					swell2: "waves",
					swell3: "waves",
					wavesPeriod: "swellperiod",
					swellPeriod: "swellperiod",
					swell1Period: "swellperiod",
					swell2Period: "swellperiod"
				},
				row2prop: {
					rain: "mm",
					icon: "icon2"
				},
				rowTrans: {
					clouds: "CLOUDS2",
					hour: "D_HOURS",
					windDir: "WIND_DIR"
				},
				weatherData: function(a, b) {
					var c = Object.keys(a.data),
						d = [];
					return b = b || 7, a.data[c[c.length - 1]].length < 5 && c.pop(), a.summary[c[1]].timestamp < Date.now() && c.shift(), c.length > b && (c = c.slice(0, b)), c.forEach(function(b) {
						d = d.concat(a.data[b])
					}), d
				},
				rtrnSelf: function(a) {
					return a
				},
				computeInterValues: function(a, b) {
					return [this.data[Math.max(a - 2, 0)][b], this.data[Math.max(a - 1, 0)][b], this.data[a][b], this.data[Math.min(a + 1, this.data.length - 1)][b], this.data[Math.min(a + 2, this.data.length - 1)][b]]
				},
				get3colors: function(a, b) {
					return {
						c1: a(.5 * (b[2] + b[1])),
						c2: a(b[2]),
						c3: a(.5 * (b[2] + b[3]))
					}
				},
				giveMeDays: function(b) {
					var c = this;
					for (var d in c.json.data) a.contains(c.usedDays, d) && b(c.json.summary[d], c.json.data[d].length, d)
				},
				renderSliderDays: function() {
					var a = "",
						b = this,
						d = this.options.iconSize || 25;
					return this.giveMeDays(function(e, f) {
						a += '<td width="' + 100 * f / b.data.length + '%"', a += f > 3 ? ' data-afterbegin="' + e.weekday + '2"><img \n\t                src="/img/icons2/png_' + d + "px/" + e.icon2 + '.png"  \n\t                srcset="/img/icons2/png_' + d + "@2x/" + e.icon2 + '.png 2x"><big>\n\t                ' + c.temp.convertNumber(e.tempMax) + "°</big></td>" : ">&nbsp;</td>"
					}), a
				},
				renderTableDays: function() {
					var a = '<tr class="td-days height-days">';
					return this.giveMeDays(function(b, c, d) {
						a += '<td colspan="' + c + '" ', a += c > 3 ? ' data-day="' + b.date + '"><div data-daydiv="' + b.date + '" \n\t            \t\t\tdata-afterbegin="' + b.weekday + '"><span>&nbsp;' + b.day + "</span></div></td>" : ">&nbsp;</td>"
					}), a += "</tr>"
				},
				renderLegend: function() {
					var a = this,
						b = '<div class="legend-days height-days"><span class="legend-left"></span><span class="legend-right"></span></div>';
					return this.rows.forEach(function(d) {
						var e = a.row2metric[d] || d;
						b += '<div class="legend-' + d + " height-" + d + '"><span \n\t            \t\t\t\tdata-t="' + (a.rowTrans[d] || c[d] && c[d].trans || "") + '" \n\t                            class="legend-left"></span><span data-do="metric,' + e + '"\n\t                            class="legend-right">' + (c[e] && c[e].metric || "") + "</span></div>"
					}), b
				},
				renderSlider: function() {
					var a = d("wind");
					return "linear-gradient(to right, " + this.data.map(function(b) {
						return a(b.wind)
					}).join(", ") + ")"
				},
				renderInfo: function() {
					var c = this.json.header,
						d = this.json.celestial,
						e = "";
					if (this.params.link) {
						var f = /([^.\/]+\.[^.\/]+)\//.exec(this.params.link);
						e += '<a href="' + this.params.link + '" class="my-button">Spot info on ' + f[1] + "</a>&nbsp;&nbsp;"
					}
					return e += " " + a.DD2DMS(this.params.lat, this.params.lon) + " - \n\t        \t" + b.D_TIMEZONE + ": " + c.tzName + " (" + a.utcOffsetStr(c.utcOffset) + ") - \n\t        \t" + b.D_SUNRISE + ": " + d.sunrise + ", " + b.D_SUNSET + ": " + d.sunset + " -\t\n                Elev: " + parseInt(c.elevation) + "m (" + parseInt(3.28 * c.elevation) + "ft) - \n                (v " + W.version + ") \n\t        \t" + ("nems" === c.model ? "Forecast by Meteoblue " : "")
				},
				renderTable: function(a, b) {
					this.is12hFormat = f.is12hFormat(), this.data = this.weatherData(a, b.days || 7), this.json = a, this.options = b, this.params = b && b.params || {}, this.rows = b.rows || "wind", this.usedDays = this.data.map(function(a) {
						return a.day
					}), g.init(this.data.length, b.tdWidth || 38, 30);
					var e = this.renderTableDays(),
						h = this;
					return this.rows.forEach(function(a) {
						var b = h.row2metric[a] || a,
							f = d(b),
							g = c[b] && c[b].metric || "",
							i = c[b] && c[b].convertNumber.bind(c[b]) || h.rtrnSelf,
							j = h.row2prop[a] || a;
						e += '<tr class="td-' + a + " height-" + a + '"> \n\t            \t' + h.data.map(h.renderTD.bind(h, a, b, f, g, i, j)).join("") + "</tr>"
					}), {
						bgImage: g.getImg(),
						modelInfo: this.renderInfo(),
						legend: this.renderLegend(),
						start: this.data[0].ts,
						hours: this.data.length,
						slider: this.renderSlider(),
						sliderDays: this.renderSliderDays(),
						html: e,
						data: this.data
					}
				},
				renderTD: function(a, b, d, e, f, h, i, j) {
					var k = "",
						l = i[h],
						m = [];
					if (null === l || isNaN(l) || "undefined" == typeof l) return "<td></td>";
					var n = this.computeInterValues(j, h),
						o = f(l),
						p = d && this.get3colors(d, n),
						q = p && 'style="background: linear-gradient(to right,' + p.c1 + "," + p.c2 + "," + p.c3 + ')"';
					switch (this.data[j].day !== this.data[Math.min(j + 1, this.data.length - 1)].day && m.push("day-end"), a) {
						case "hour":
						case "icon":
							if (0 === i.isDay) m.push("isnight");
							else if (1 !== i.isDay) {
								var r = this.nightColor,
									s = parseInt(Math.abs(100 * i.isDay));
								k += ' style="background: linear-gradient(to right, ' + (i.isDay < 0 ? "  transparent, transparent " + s + "%, " + r + " " + s + "%, " + r + ')"' : " " + r + ", " + r + " " + s + "%, transparent " + s + '%, transparent)"')
							}
							if ("hour" === a) this.is12hFormat && (l = (l + 11) % 12 + 1 + "<small>" + (l >= 12 ? "PM" : "AM") + "</small>"), k += ">" + l + "</td>";
							else {
								var t = i.isDay,
									u = 1 > t && t > .5 || -.5 < t && t <= 0 ? "_night" : "";
								k += '><img src="/img/icons2/png_25px/' + l + u + '.png"  \n\t                    \t\tsrcset="/img/icons2/png_25@2x/' + l + u + '.png 2x"></td>'
							}
							break;
						case "windDir":
							k += '><div style="transform: rotate(' + l + "deg); -webkit-transform:rotate(" + l + 'deg);">4</div></td>';
							break;
						case "rain":
							g.paintRain(j, n), i.snow && l > .1 ? (m.push("snow"), l = c.snowAccu.convertNumber(l), l > 1 && (l = Math.round(l)), l += c.snowAccu.metric) : !i.snow && l > .1 ? (l = f(l), l > 5 && (l = Math.round(l))) : l = "", k += ">" + l + "</td>";
							break;
						case "waves":
						case "swell":
						case "swell1":
						case "swell2":
							var v = i[h + "Dir"];
							k += " " + q + '><div style="transform: rotate(' + v + "deg);  \n\t                \t-webkit-transform:rotate(" + v + 'deg);">#</div>' + o + "</td>";
							break;
						default:
							var w = "";
							"temp" === a ? w = "°" : /Period/.test(a) && (w = "s"), k += " " + q + ">" + o + w + "</td>"
					}
					return "<td " + (m.length ? ' class="' + m.join(" ") + '"' : "") + " " + k
				}
			};
		return {
			table: h.renderTable.bind(h)
		}
	}), /*! */
	W.define("weatherColors", ["colorMaker"], function(a) {
		var b = {
				temp: [
					[193, [37, 4, 42, 100]],
					[206, [41, 10, 130, 100]],
					[219, [81, 40, 40, 100]],
					[233.15, [192, 37, 149, 100]],
					[255.372, [70, 215, 215, 100]],
					[273.15, [21, 84, 187, 100]],
					[275.15, [24, 132, 14, 100]],
					[291, [247, 251, 59, 100]],
					[298, [235, 167, 21, 100]],
					[311, [230, 71, 39, 100]],
					[328, [88, 27, 67, 100]]
				],
				wind: [
					[0, [248, 248, 248, 255]],
					[3, [248, 248, 248, 255]],
					[4, [0, 200, 254, 255]],
					[6, [0, 230, 0, 255]],
					[10, [254, 174, 0, 255]],
					[19, [254, 0, 150, 255]],
					[100, [151, 50, 222, 255]]
				],
				waves: [
					[0, [255, 255, 255, 0]],
					[1, [255, 255, 255, 0]],
					[2, [180, 180, 255, 255]],
					[2.5, [254, 174, 0, 255]],
					[20, [255, 255, 255, 255]]
				],
				swellperiod: [
					[0, [255, 255, 255, 0]],
					[9, [255, 255, 255, 0]],
					[10, [255, 237, 180, 255]],
					[20, [180, 255, 180, 255]]
				]
			},
			c = {};
		for (var d in b) c[d] = a(b[d]);
		return function(a) {
			return c[a] ? function(b) {
				var d = c[a](b);
				return "rgba(" + d[0] + "," + d[1] + "," + d[2] + "," + d[3] / 255 + ")"
			} : null
		}
	}), /*! */
	W.define("plugins", ["$", "utils", "broadcast", "rootScope", "plugin"], function(a, b, c, d) {
		function e() {
			f(null, "rhpane") || k.menu.open()
		}

		function f(a, c) {
			var d = !1;
			return b.each(k, function(b, e) {
				b.pane && b.pane === c && b.isOpen && e !== a && (b.close(), d = !0)
			}), d
		}

		function g(a, c) {
			var d = k[a];
			d && (d.exclusive ? b.each(k, function(b, c) {
				b.isOpen && c !== a && h(c)
			}) : d.pane && f(a, d.pane), d.open(c))
		}

		function h(a) {
			var b = k[a];
			b && b.close()
		}

		function i(a, b) {
			var c = k[a];
			c && (c.isOpen ? h(a) : g(a, b))
		}

		function j() {
			b.each(k, function(a, b) {
				a.isOpen && h(b)
			})
		}
		var k = {
			riot: W.Plugin.instance({
				ident: "riot"
			}),
			geodesic: W.Plugin.instance({
				ident: "geodesic"
			}),
			geolib: W.Plugin.instance({
				ident: "geolib"
			}),
			d3: W.Plugin.instance({
				ident: "d3"
			}),
			topojson: W.Plugin.instance({
				ident: "topojson"
			}),
			mcluster: W.Plugin.instance({
				ident: "mcluster"
			}),
			colorpicker: W.Plugin.instance({
				ident: "colorpicker"
			}),
			nouislider: W.Plugin.instance({
				ident: "nouislider"
			}),
			leaflet077: W.Plugin.instance({
				ident: "leaflet077"
			}),
			globe: W.TagPlugin.instance({
				dependencies: ["d3", "topojson"],
				ident: "globe",
				attachPoint: a("#globe_container"),
				exclusive: !1
			}),
			menu: W.TagPlugin.instance({
				ident: "menu",
				title: "MENU",
				exclusive: !0,
				pane: "rhpane"
			}),
			info: W.TagPlugin.instance({
				ident: "info",
				hasURL: !1,
				exclusive: !1,
				attachPoint: a("#model-info")
			}),
			meteogram: W.TagPlugin.instance({
				ident: "meteogram",
				exclusive: !1,
				hasURL: !1,
				attachPoint: a("#detail")
			}),
			lookr: W.TagPlugin.instance({
				ident: "lookr",
				exclusive: !1,
				hasURL: !1,
				attachPoint: a("#detail")
			}),
			overlays: W.TagPlugin.instance({
				title: "S_ADD_OVERLAYS",
				ident: "overlays",
				pane: "rhpane",
				mobileFullscreen: !1
			}),
			pois: W.TagPlugin.instance({
				title: "SHOW_ON_MAP",
				ident: "pois",
				pane: "rhpane",
				mobileFullscreen: !1
			}),
			login: W.TagPlugin.instance({
				title: "U_LOGIN",
				ident: "login"
			}),
			distance: W.RiotPlugin.instance({
				ident: "distance",
				title: "MENU_DISTANCE",
				exclusive: !0,
				keyboard: !1,
				dependencies: ["riot", "geodesic"]
			}),
			commons: W.RiotPlugin.instance({
				ident: "commons"
			}),
			ad: W.RiotPlugin.instance({
				ident: "ad",
				pane: "lhpane",
				hasURL: !1,
				dependencies: ["riot", "commons"],
				exclusive: !0
			}),
			user: W.RiotPlugin.instance({
				ident: "user",
				title: "POI_FAVS",
				pane: "rhpane",
				dependencies: ["riot", "geolib"],
				keyboard: !0,
				exclusive: !0,
				open: function(a, b) {
					d.user ? W.RiotPlugin.open.call(this, a, b) : (W.location.url(""), "emitLogin" === a && g("login"))
				}
			}),
			adWidget: W.RiotPlugin.instance({
				ident: "ad",
				dependencies: ["leaflet077", "riot", "commons"],
				exclusive: !1,
				url: b.emptyFun
			}),
			station: W.RiotPlugin.instance({
				ident: "station",
				pane: "lhpane",
				exclusive: !0,
				dependencies: ["riot", "commons", "nouislider", "d3"]
			}),
			settings: W.RiotPlugin.instance({
				ident: "settings",
				title: "MENU_SETTINGS",
				exclusive: !0,
				keyboard: !0,
				pane: "rhpane"
			}),
			colors: W.RiotPlugin.instance({
				ident: "colors",
				dependencies: ["riot", "colorpicker"],
				exclusive: !1,
				pane: "rhpane",
				keyboard: !0
			}),
			history: W.RiotPlugin.instance({
				ident: "history",
				exclusive: !1,
				pane: "rhpane"
			}),
			widgets: W.RiotPlugin.instance({
				ident: "widgets",
				exclusive: !0,
				keyboard: !0,
				pane: "rhpane"
			}),
			hiring: W.RiotPlugin.instance({
				ident: "hiring",
				pane: "rhpane",
				keyboard: !0
			}),
			multimodel: W.RiotPlugin.instance({
				ident: "multimodel",
				exclusive: !1,
				keyboard: !1
			})
		};
		return c.on("rqstOpen", g), c.on("rqstClose", h), c.on("toggle", i), c.on("closeAll", j), c.on("burgerClicked", e), k
	}), /*! */
	W.define("plugin", ["$", "utils", "rootScope", "log", "trans", "broadcast"], function(a, b, c, d, e, f) {
		W.Plugin = W.Class.extend({
			ident: "",
			dependencies: [],
			_init: function() {
				this.isLoaded = !1, this.loading = !1
			},
			load: function() {
				var a, b, e = this,
					f = [];
				return this.isLoaded ? Promise.resolve(this) : this.loading ? this.promise : (this.loading = !0, this.promise = new Promise(function(g, h) {
					for (b = 0; b < e.dependencies.length; b++) a = W.plugins[e.dependencies[b]], a && !a.isLoaded && f.push(a.load());
					Promise.all(f).then(function() {
						var a = document.createElement("script");
						a.type = "text/javascript", a.async = !0, a.onload = function() {
							e.isLoaded = !0, e.loading = !1, "function" == typeof e.onloaded && e.onloaded.call(e), g(e)
						}, a.onerror = function() {
							d.event("Failed to load plugin:" + e.ident), e.loading = !1, h(e)
						}, document.head.appendChild(a), a.src = "v" + c.version + "/plugins/" + e.ident + ".js"
					}).catch(function(a) {
						d.event("plugin error: " + e.ident), h()
					})
				}), this.promise)
			},
			open: function() {},
			close: function() {},
			toggle: function() {}
		}), W.TagPlugin = W.Plugin.extend({
			attachPoint: a("#plugins"),
			exclusive: !0,
			keyboard: !1,
			hasURL: !0,
			pane: null,
			mobileFullscreen: !0,
			_init: function() {
				this.isLoaded = !1, this.loading = !1, this.isOpen = !1, this.isMounted = !1, this.closingTimer = null
			},
			close: function() {
				this.isOpen && (this.isOpen = !1, document.body.classList.remove("on" + this.ident), this.node.classList.remove("open"), this.closingTimer = setTimeout(function() {
					this.node.style.display = "none", f.emit("pluginClosed", this.ident)
				}.bind(this), 500), this.onclose(), this.keyboard && W.keyboard && W.keyboard.disable(), W.location.reset())
			},
			createNode: function(b) {
				this.node = this.el = this.element = document.createElement("div"), this.node.id = "plugin-" + this.ident, this.node.innerHTML = '<div class="closing-x">&#xe013;</div>' + b, this.pane && (this.node.classList.add("plugin-" + this.pane.toLowerCase()), this.mobileFullscreen && this.node.classList.add("plugin-mobile-fullscreen")), this.attachPoint.appendChild(this.node), a(".closing-x", this.node).onclick = this.close.bind(this)
			},
			open: function(a) {
				this.closingTimer && clearTimeout(this.closingTimer), this.isLoaded ? (this.isMounted || this._mount(), this._open(a)) : this.loading || this.load(a).then(function() {
					this._mount(), this._open(a)
				}.bind(this))
			},
			_mount: function() {
				var a = W.tags[this.ident];
				a || d.event("Error, tag: " + this.ident + " was not registered"), a.css && document.head.insertAdjacentHTML("beforeend", "<style>" + a.css + "</style>"), this.createNode(a.html), e.translateDocument(this.node), a.callback && "function" == typeof a.callback && (W["tag-" + this.ident] = a.callback.call(this)), this.isMounted = !0
			},
			_open: function(a) {
				var b = this;
				this.isOpen || (document.body.classList.add("on" + this.ident), this.node.style.display = "block", setTimeout(function() {
					b.node.classList.add("open"), f.emit("pluginOpened", b.ident)
				}, 50), this.isOpen = !0, b.keyboard && W.keyboard && W.keyboard.enable()), this.onopen(a), this.hasURL && this.url(a)
			},
			url: function(a) {
				var b = W.location,
					c = this.onurl(a);
				b.url(c.url), c.title && b.title(c.title)
			},
			onurl: function(a) {
				return {
					url: this.ident,
					title: e[this.title] || null
				}
			},
			onopen: function() {},
			onclose: function() {}
		}), W.RiotPlugin = W.TagPlugin.extend({
			dependencies: ["riot"],
			_init: function() {
				W.TagPlugin._init.call(this), this.riotTag = null
			},
			onclose: function() {
				this.riotTag && "function" == typeof this.riotTag.onclose && this.riotTag.onclose(), W.location.reset()
			},
			open: function(a, b) {
				this.isLoaded ? this._open(a, b) : this.loading || this.load(a).then(function() {
					this.createNode("<" + this.ident + "></" + this.ident + ">"), this._open(a, b)
				}.bind(this))
			},
			_open: function(a) {
				var b = this.isOpen,
					c = this;
				this.isOpen || (document.body.classList.add("on" + this.ident), this.node.style.display = "block", setTimeout(function() {
					c.node.classList.add("open"), f.emit("pluginOpened", c.ident)
				}, 0), this.isOpen = !0, this.riotTag || (this.riotTag = riot.mount(this.ident)[0]), c.keyboard && W.keyboard && W.keyboard.enable()), this.riotTag && (this.riotTag.onopen && this.riotTag.onopen(a, b), this.riotTag.onurl && (this.onurl = this.riotTag.onurl), this.hasURL && this.url(a))
			}
		})
	}), /*! */
	W.define("windytyUI", ["rhpane", "calendar", "utils", "rootScope", "progressBar", "broadcast", "products", "calendarUI", "components", "location", "UIcomponents", "renderCtrl"], function(a, b, c, d, e, f, g, h, i) {
		function j(a, b, d) {
			var e, f, h = [];
			for (f in g) c.contains(g[f].overlays, a) && h.push(f);
			for (e = 0; e < h.length; e++)
				if (g[h[e]].model === b) return {
					product: h[e],
					model: b
				};
			for (e = 0; e < h.length; e++)
				if (g[h[e]].model === d) return {
					product: h[e],
					model: d
				};
			return {
				product: h[0],
				model: g[h[0]].model
			}
		}
		var k = d.params,
			l = W.Class.instance({
				calendar: g.ecmwf.calendar,
				start: g.ecmwf.calendar.start,
				productObj: null,
				historical: !1,
				preferedGlobalModel: "ecmwf",
				histCalendar: null,
				timestampTimer: null,
				_init: function() {
					var b = this,
						d = j(k.overlay, k.model, "ecmwf");
					k.model = d.model, k.timestamp < this.start && (k.timestamp = Date.now()), this.switchProduct(d.product), this.emitOut = c.debounce(this.bcastParams.bind(this), 100), i.on("acTime", this.set.bind(this, "acTime")), i.on("sstTime", this.set.bind(this, "sstTime")), a.on("model", this.set.bind(this, "model")), i.on("overlay", this.set.bind(this, "overlay")), a.on("level", this.set.bind(this, "level")), a.on("overlay", this.set.bind(this, "overlay")), h.on("timestamp", this.setTs.bind(this)), e.on("timestamp", this.setTs.bind(this)), f.on("modelChanged", function(a) {
						b.set("model", a)
					}), f.on("resetUI", this.toUIparams.bind(this)), this.bcastParams("init")
				},
				setTs: function(a) {
					k.timestamp = a, this.set("path", this.calendar.ts2path(a))
				},
				createHistCalendar: function(d) {
					var e = ["wind", "temp", "pressure", "clouds", "rh", "gust", "waves", "swell", "wwaves", "swellperiod"],
						f = b({
							numOfDays: 10,
							calendarDays: 10,
							startOfTimeline: new Date(d - 432e6).midnight()
						});
					k.timestamp > f.end || k.timestamp < f.start ? k.timestamp = (f.end - f.start) / 2 + f.start : k.timestamp = d, this.histCalendar = f, k.historical = !0, a.model.set("gfs"), c.contains(e, k.overlay) || i.overlays.set("wind"), this.newCalendar(f), document.body.classList.add("historical")
				},
				set: function(b, c) {
					if (k[b] !== c) {
						if (k[b] = c, "overlay" !== b && "model" !== b) return void this.emitOut(b);
						var d = j(k.overlay, k.model, a.model.prefered);
						d.model !== k.model && (a.model.set(d.model, "noEmit"), k.model = d.model), d.product !== k.product && this.switchProduct(d.product), this.emitOut("overlay")
					}
				},
				switchProduct: function(a) {
					c.replaceClass(/product-\S+/, "product-" + a), k.product = a, this.productObj = g[a], f.emit("productChanged", a), this.productObj.calendar && !k.historical && this.newCalendar(this.productObj.calendar)
				},
				newCalendar: function(a) {
					this.calendar = a, k.timestamp = e.init(a, k.timestamp), h.init(a, k.timestamp), k.path = a.ts2path(k.timestamp)
				},
				hasCalendar: function() {
					return !!this.productObj.calendar
				},
				bcastParams: function(a) {
					f.emit("paramsChanged", c.clone(d.params), a)
				},
				toUIparams: function(b) {
					h.set(b.timestamp), a.levels.set(b.level), a.model.set(b.model), a.overlays.set(b.overlay), this.emitOut()
				}
			});
		return W.EventCatcher.instance({
			el: document.body,
			click: function(b, c, e, g) {
				switch (b) {
					case "initCalendar":
						k.timestamp = Date.now(), k.historical = !1, k.model = "ecmwf", a.model.set("ecmwf", "noEmit");
						var h = k.overlay;
						k.overlay = null, k.set("overlay", h), document.body.classList.remove("historical");
						break;
					case "particles":
						var i = document.getElementById("particles");
						i.classList.toggle("off"), f.emit("particlesAnimation", i.className);
						break;
					case "title":
						f.emit("closePopup"), f.emit("closeAll"), d.geoIP && f.emit("mapsCenter", d.geoIP), l.toUIparams({
							timestamp: Date.now(),
							level: "surface",
							model: "ecmwf",
							overlay: "wind"
						});
						break;
					case "navmenu":
						f.emit("mobileMenu"), document.body.classList.add("mobilemenu-up");
						break;
					case "navmenuClose":
						document.body.classList.remove("mobilemenu-up"), f.emit("closeAll");
						break;
					case "rqstOpen":
					case "rqstClose":
					case "toggle":
						f.emit(b, c, e, g);
						break;
					default:
						f.emit(b)
				}
			}
		}), f.on("closeAll", function() {
			document.body.classList.remove("mobilemenu-up")
		}), l
	}), /*! */
	W.define("progressBar", ["broadcast", "settings", "utils", "trans", "Evented", "products", "UIcomponents"], function(a, b, c, d, e, f) {
		var g = e.instance(W.Resizable, W.Drag, {
			ident: "progressBar",
			el: document.getElementById("timecode"),
			progressBar: document.getElementById("progress-bar"),
			timecode: document.getElementById("timecode"),
			text: document.getElementById("timecode-box"),
			progressLine: document.querySelector("#bottom .progress-line"),
			played: document.querySelector("#bottom .progress-line .played"),
			b: document.querySelector("#bottom .progress-line i"),
			ghost: document.getElementById("ghost-timecode"),
			ghostTxt: document.getElementById("ghost-box"),
			left: null,
			calendar: f.ecmwf.calendar,
			calendarDays: 0,
			timestamp: Date.now(),
			maxWidth: 0,
			offset: 45,
			borderOffset: 10,
			ondrag: function(a) {
				this.update(a + 20 - this.offset), this.debouncedBcast()
			},
			update: function(a) {
				return this.left = c.bound(a, 0, this.maxWidth), this.played.style.width = this.left + "px", this.timecode.style.left = this.left + this.offset + "px", this.text.textContent = this.createText(), this.left
			},
			createText: function() {
				var a = "",
					b = this.calendar.days[Math.floor(this.calendar.calendarDays * this.left / this.progressWidth)];
				return b && (a = b.display ? d[b.displayLong] + (b.day && " " + b.day) + " - " : b.day + "." + b.month + ": "), a += this.displayHour(Math.round(this.numberOfHours * this.left / this.progressWidth) % 24)
			},
			bcast: function() {
				this.timestamp = this.calendar.start + this.left / this.pxRatio, this.emit("timestamp", this.timestamp)
			},
			onKeyboard: function(a) {
				var b = this.calendar.paths.indexOf(this.calendar.ts2path(this.timestamp)),
					c = this.calendar.timestamps[b + (a ? 1 : -1)];
				if (c) return this.set(c), c
			},
			addAnimation: function() {
				this.progressBar.classList.add("anim-allowed")
			},
			removeAnimation: function() {
				window.setTimeout(function() {
					this.progressBar.classList.remove("anim-allowed")
				}.bind(this), 300)
			},
			click: function(a) {
				this.dragging || (this.addAnimation(), this.update(a.pageX - this.offset - this.borderOffset), this.bcast(), this.removeAnimation())
			},
			set: function(a, b) {
				b || this.addAnimation(), this.timestamp = a, this.update((a - this.calendar.start) * this.pxRatio), this.emit("timestamp", this.timestamp), b || this.removeAnimation()
			},
			init: function(a, b) {
				if (a) return this.timestamp = b > a.end ? a.end : b, this.numberOfHours = 24 * a.calendarDays, this.calendar = a, this.onresize(), this.timestamp
			},
			getHoursFunction: function() {
				this.displayHour = b.getHoursFunction()
			},
			onresize: function() {
				this.progressWidth = this.progressBar.offsetWidth - this.offset, this.pxRatio = this.progressWidth / (this.calendar.endOfCal - this.calendar.start), this.maxWidth = (this.calendar.end - this.calendar.start) * this.pxRatio, this.progressLine.style.width = this.maxWidth + "px", this.borderOffset = this.elLeft;
				var a = (Date.now() - this.calendar.start) * this.pxRatio;
				this.b.style.left = a + "px", this.set(this.timestamp)
			},
			_init: function() {
				var b = this;
				this.getHoursFunction(), this.resizableEl = this.progressBar, W.Evented._init.call(this), W.Drag._init.call(this), W.Resizable._init.call(this), this.progressLine.addEventListener("mouseup", this.click.bind(this)), this.ondragend = this.bcast.bind(this), this.debouncedBcast = c.debounce(this.bcast.bind(this), 100), a.on("langChanged", function() {
					b.text.textContent = b.createText()
				}), a.on("moveTs", this.set.bind(this)), a.on("settingsChanged", this.getHoursFunction.bind(this)), this.progressLine.addEventListener("mouseenter", function() {
					g.dragging || (b.ghost.style.opacity = 1)
				}), this.progressLine.addEventListener("mousemove", function(a) {
					g.dragging ? b.ghost.style.opacity = 0 : b.updateGhost(a)
				}), this.progressLine.addEventListener("mouseleave", function() {
					b.ghost.style.opacity = 0
				})
			},
			updateGhost: function(a) {
				var b = c.bound(a.clientX - this.offset - this.borderOffset, 0, this.maxWidth);
				this.ghost.style.left = b + this.offset + "px", this.ghost.style["margin-top"] = this.left - b < 30 && b - this.left < 100 ? "-15px" : "0px", this.ghostTxt.textContent = this.displayHour(parseInt(b / this.progressWidth * this.numberOfHours) % 24)
			}
		});
		return g
	}), /*! */
	W.define("components", ["$", "utils", "storage", "rootScope", "Evented", "broadcast", "overlays", "products", "trans", "location", "UIcomponents"], function(a, b, c, d, e, f, g, h, i) {
		var j = e.instance({
			ident: "components"
		});
		return j.accumulations = W.Menu.instance({
			emiter: j,
			initValue: d.params.acTime,
			emitIdent: "acTime",
			prevValue: d.params.acTime,
			ident: "accumulations",
			_init: function() {
				W.Menu._init.call(this), j.on("overlay", this.onchange.bind(this))
			},
			onchange: function(a) {
				"snowcover" === a && this.selected !== -1 ? (this.prevValue = this.selected, this.set(-1, "noEmit")) : this.selected === -1 && this.set(this.prevValue, "noEmit")
			}
		}), j.sstSstanom = W.Menu.instance({
			emiter: j,
			ident: "sst-sstanom",
			emitIdent: "overlay",
			initValue: "sst",
			_init: function() {
				W.Menu._init.call(this), j.on("sstavg", this.set.bind(this, -1, "noEmit"))
			}
		}), j.sstavg = W.Menu.instance({
			emiter: j,
			ident: "sstavg",
			emitIdent: "sstTime",
			initValue: -1,
			_init: function() {
				W.Menu._init.call(this), j.on("overlay", this.set.bind(this, -1, "noEmit"))
			},
			set: function(a, b) {
				this.selected === -1 && a !== -1 && j.emit("overlay", "sstavg"), W.Menu.set.call(this, a, b)
			}
		}), j.legend = {
			el: document.getElementById("legend"),
			renderedOverlay: null,
			init: function() {
				f.on("paramsChanged", this.render.bind(this)), f.on("metricChanged", this.metricChanged.bind(this)), this.el.onclick = this.onclick.bind(this), this.render(d.params)
			},
			onclick: function() {
				var a = g[this.renderedOverlay];
				a.cycleMetric()
			},
			render: function(a) {
				var b = this,
					c = a.overlay;
				c !== this.renderedOverlay && (this.el.classList.add("animate"), setTimeout(function() {
					b.el.innerHTML = g[c].paintLegend(), b.el.classList.remove("animate"), f.emit("uiChanged")
				}, 400), this.renderedOverlay = c)
			},
			metricChanged: function() {
				this.el.innerHTML = g[d.params.overlay].paintLegend()
			}
		}, j.legend.init(), j.productInfo = {
			infoLink: a("#model-info"),
			openTimer: null,
			init: function() {
				this.infoLink.onmouseenter = this.onenter.bind(this), this.infoLink.onmouseleave = this.onleave.bind(this), f.on("redrawFinished", this.render.bind(this)), this.render(d.params)
			},
			render: function() {
				a("#model-info .inn-txt").textContent = i.ABOUT_OVERLAY + ": " + g[d.params.overlay].getName()
			},
			onenter: function() {
				this.openTimer || (this.openTimer = setTimeout(f.emit.bind(f, "rqstOpen", "info"), 500))
			},
			onleave: function() {
				this.openTimer && clearTimeout(this.openTimer), f.emit("rqstClose", "info"), this.openTimer = null
			}
		}, j.productInfo.init(), j
	}), /*! */
	W.define("UIcomponents", ["$", "utils", "broadcast", "Class"], function(a, b, c, d) {
		return W.Resizable = d.extend({
			resizableEl: null,
			_init: function() {
				window.addEventListener("resize", b.debounce(this.resize.bind(this), 300)), c.on("pluginOpened", this.uiChanged.bind(this)), c.on("pluginClosed", this.uiChanged.bind(this)), c.on("detailRendered", this.resize.bind(this)), c.on("uiChanged", this.uiChanged.bind(this)), this.rects = {
					left: -1
				}, this.resize()
			},
			uiChanged: function() {
				setTimeout(this.resize.bind(this), 200), setTimeout(this.resize.bind(this), 500), setTimeout(this.resize.bind(this), 1500)
			},
			resize: function() {
				var a = this.resizableEl.getBoundingClientRect();
				b.compare(a, this.rects, ["left", "right", "top", "bottom"]) || (this.height = Math.max(1, a.height), this.width = Math.max(1, a.width), this.rects = a, this.elTop = a.top, this.elBottom = a.bottom, this.elLeft = a.left, this.elRight = a.right, this.onresize(this.rects))
			},
			onresize: function() {}
		}), W.Drag = d.extend({
			supportTouch: !0,
			_init: function() {
				this.el.addEventListener("mousedown", this.startDrag.bind(this)), this.supportTouch && this.el.addEventListener("touchstart", this.startDrag.bind(this)), this.dragging = !1
			},
			getXY: function(a) {
				return a.touches ? [a.touches[0].pageX, a.touches[0].pageY] : [a.pageX, a.pageY]
			},
			startDrag: function(a) {
				function b(a) {
					var b = d.getXY(a);
					d.ondrag.call(d, b[0] - e[0] - f, b[1] - e[1] - g, a)
				}

				function c(a) {
					window.removeEventListener("mousemove", b), window.removeEventListener("touchmove", b), window.removeEventListener("mouseup", c), d.supportTouch && (window.removeEventListener("touchend", c), window.removeEventListener("touchcancel", c)), d.ondragend && d.ondragend.call(d, a), d.dragging = !1
				}
				var d = this,
					e = d.getXY(a),
					f = -this.el.offsetLeft,
					g = -this.el.offsetTop;
				d.dragging = !0, d.ondrastart && d.ondragstart.call(d), window.addEventListener("mousemove", b), window.addEventListener("mouseup", c), d.supportTouch && (window.addEventListener("touchmove", b), window.addEventListener("touchend", c), window.addEventListener("touchcancel", c))
			}
		}), W.Swipe = d.extend({
			_init: function() {
				this.xDown = null, this.yDown = null, this.el.addEventListener("touchstart", this.touchStart.bind(this)), this.el.addEventListener("touchmove", this.touchMove.bind(this)), this.el.addEventListener("touchend", this.touchEnd.bind(this))
			},
			touchStart: function(a) {
				this.xDown = a.touches[0].clientX, this.yDown = a.touches[0].clientY
			},
			touchMove: function(a) {
				this.xFinal = a.touches[0].clientX, this.yFinal = a.touches[0].clientY
			},
			touchEnd: function(a) {
				var b = this.xDown - this.xFinal,
					c = this.yDown - this.yFinal;
				Math.abs(b) > Math.abs(c) && Math.abs(b) > 50 ? this.onswipe(b > 0 ? "left" : "right", b, a) : Math.abs(c) > 50 && this.onswipe(c > 0 ? "up" : "down", c, a)
			},
			onswipe: function(a, b, c) {}
		}), W.EventCatcher = d.extend({
			events: ["click"],
			_init: function() {
				var a = this;
				this.events.forEach(function(b) {
					a.el.addEventListener(b, a.onevent.bind(a, b))
				})
			},
			onevent: function(a, b) {
				var c, d = b.target;
				for (this.stopPropagation && (b.preventDefault(), b.stopPropagation()); d && d !== this.el;) {
					if (d && d.dataset && (c = d.dataset.do)) {
						var e = this[a] || this.click;
						return void e.apply(this, c.split(","))
					}
					d = d.parentNode
				}
			}
		}), W.Switch = W.EventCatcher.extend({
			el: null,
			initValue: null,
			stopPropagation: !0,
			_init: function() {
				var a;
				this.el && this.initValue && (a = this.getEl(this.initValue)) && a.classList.add("selected"), this.selected = this.initValue, W.EventCatcher._init.call(this)
			},
			getEl: function(b) {
				return a('*[data-do="set,' + b + '"]', this.el)
			},
			set: function(a, b) {
				this.click(null, a, b)
			},
			click: function(b, c, d) {
				var e = a(".selected", this.el),
					f = this.getEl(c);
				e && e.classList.remove("selected"), f && f.classList.add("selected"), this.selected = c, d || this.onset(c)
			},
			onset: function() {}
		}), W.Menu = W.Switch.extend({
			ident: null,
			emitIdent: null,
			emiter: null,
			initValue: null,
			stopPropagation: !0,
			_init: function() {
				this.selected = null, this.selectedEl = null, !this.el && this.ident && (this.el = document.getElementById(this.ident)), this.emiter ? this.emit = this.emiter.emit.bind(this.emiter) : this.emit = function() {}, this.initValue && this.set(this.initValue), W.EventCatcher._init.call(this)
			},
			init: function(a) {
				this.el.innerHTML = a, this.selected = null, this.selectedEl = null
			},
			click: function(a, b) {
				this[a](b)
			},
			set: function(a, b) {
				if (a !== this.selected) {
					var c;
					this.selectedEl && this.selectedEl.classList.remove("selected"), this.selected = a, (c = this.getEl(a)) && (this.selectedEl = c, this.selectedEl.classList.add("selected")), b || this.emit(this.emitIdent || this.ident, a)
				}
			}
		}), null
	}), /*! */
	W.define("keyboard", ["components", "progressBar", "windytyUI", "broadcast", "rhpane", "rootScope"], function(a, b, c, d, e, f) {
		function g(a) {
			var g = a.keyCode;
			37 !== g && 39 !== g || !c.hasCalendar() ? 38 === g || 40 === g ? e.overlays.onKeyboard(40 === g) : 33 !== g && 34 !== g || !/wind|rh|temp/.test(f.params.overlay) ? 9 !== g && 70 !== g || d.emit("focusRqstd") : e.levels.onKeyboard(33 !== g) : b.onKeyboard(39 === g), a.preventDefault()
		}
		var h = {
			disable: function() {
				document.body.addEventListener("keydown", g)
			},
			enable: function() {
				document.body.removeEventListener("keydown", g)
			}
		};
		return h.disable(), h
	}), /*! */
	W.define("calendarUI", ["utils", "rootScope", "broadcast", "trans", "progressBar", "Evented", "calendar", "products", "settings"], function(a, b, c, d, e, f, g, h, i) {
		var j = i.getHoursFunction(),
			k = W.Evented.instance(W.EventCatcher, {
				ident: "calendar",
				el: document.getElementById("calendar"),
				calendar: h.ecmwf.calendar,
				timestamp: b.params.timestamp || Date.now(),
				short: !1,
				mobileDaysUI: document.getElementById("days"),
				mobileHoursUI: document.getElementById("hours"),
				_init: function() {
					var a = this;
					W.Evented._init.call(this), W.EventCatcher._init.call(this), c.on("progressbarResized", function() {
						setTimeout(a.render.bind(a), 1500)
					}), c.on("langChanged", a.render.bind(a, "forceRepaint")), this.mobileInit(), this.click = this.set.bind(this), c.on("moveTs", this.setMobileUI.bind(this))
				},
				setMobileUI: function(a) {
					this.timestamp = a, this.setMobileTs(a), this.emitOut()
				},
				init: function(a, b) {
					this.calendar = a, this.timestamp = b, this.render("forceRepaint")
				},
				set: function(a, b) {
					this.timestamp = a, e.set(a), b || this.emitOut()
				},
				emitOut: function() {
					this.emit("timestamp", this.timestamp, {
						historical: this.historical
					})
				},
				render: function(a) {
					this.width = this.el.offsetWidth, b.isMobile ? (this.paintMobile(), this.paint("shortVersion")) : this.width ? this.width < 700 && (!this.short || a) ? (this.short = !0, this.paint("shortVersion")) : this.width >= 700 && (this.short || a) && (this.short = !1, this.paint()) : this.paint()
				},
				paint: function(a) {
					for (var b, c = a ? this.createShortDayString : this.createDayString, d = "", e = this.calendar.days, f = this.calendar.end, g = e.length, h = 100 / g, i = 0; i < g; i++) b = e[i], d += (b.middayTs < f ? '<div data-do="' + b.middayTs + '" class="clickable"' : "<div") + ' style="width: calc(' + h + '% - 1px );">' + c(b) + "</div>";
					this.el.innerHTML = d
				},
				createDayString: function(a) {
					return a.display ? d[a.display] + (a.day ? " " + a.day : "") : a.day + "." + a.month + "." + a.year
				},
				createShortDayString: function(a) {
					return a.display ? d[a.displayShort] : a.day + "." + a.month + "."
				},
				hoursHtml: "",
				scrolling: !1,
				scrollTimer: null,
				noAnimation: !1,
				mobileEl: document.getElementById("days"),
				box: document.getElementById("mobile_box"),
				nowBar: document.getElementById("now-bar"),
				tsPx: 54e4,
				paintMobile: function() {
					for (var a, b = this, c = this.calendar.days.filter(function(a) {
							return a.start < b.calendar.end
						}), e = "<b></b>", f = 0; f < c.length; f++) a = c[f], e += "<div>&nbsp;&nbsp;" + d[a.displayLong] + "&nbsp;" + a.day + '<span class="hours">' + this.hoursHtml + "</span></div>";
					this.mobileEl.innerHTML = e, this.setMobileTs(k.timestamp);
					var g = this.mobileEl.querySelector("b");
					g.style.left = window.screen.width / 2 + (Date.now() - this.calendar.start) / this.tsPx + "px"
				},
				mobileInit: function() {
					this.mobileEl.onscroll = this.scroll.bind(this), this.bindedScrollEnd = this.scrollEnd.bind(this), window.addEventListener("resize", this.paintMobile.bind(this));
					for (var b = 0; b < 8; b++) this.hoursHtml += "<span>" + a.pad(3 * b) + "</span>"
				},
				scroll: function(a) {
					this.scrolling || this.noAnimation || (this.scrolling = !0, document.body.classList.add("mobile-scroll")), this.noAnimation && (this.scrolling = !0, this.noAnimation = !1), this.scrollTimer && clearTimeout(this.scrollTimer), this.scrollTimer = setTimeout(this.bindedScrollEnd, 200), this.timestamp = this.tsPx * a.target.scrollLeft + this.calendar.start, this.box.innerHTML = j(new Date(this.timestamp).getHours())
				},
				scrollEnd: function() {
					this.emitOut(), this.scrolling = !1, this.scrollTimer = null, document.body.classList.remove("mobile-scroll")
				},
				setMobileTs: function(a) {
					var b = (a - this.calendar.start) / this.tsPx;
					this.noAnimation = !0, this.mobileEl.scrollLeft = b
				}
			});
		return k
	}), /*! */
	W.define("Sticky", [], function() {
		function a(a, b, c, d) {
			this.ident = a, this.el = b, this.position = "left", this.offsetRight = 0 | d, this.offsetLeft = 0 | c
		}
		return a.prototype = {
			getBounds: function() {
				this.bounds = this.el.getBoundingClientRect();
				var a = this.el.parentElement.getBoundingClientRect();
				this.limitRight = a.right - this.offsetRight, this.limitLeft = a.left, this.tdRight = a.right - this.offsetLeft
			},
			stickRight: function() {
				"right" !== this.position && (this.position = "right", this.el.style.position = "static", this.el.style.float = "right", this.el.style.top = "inherit", this.el.style.opacity = .3)
			},
			floatLeft: function() {
				"floating" !== this.position && (this.position = "floating", this.el.style.position = "fixed", this.el.style.left = this.offsetLeft + "px", this.el.style.top = this.bounds.top + "px", this.el.style.opacity = 1)
			},
			stickLeft: function() {
				"left" !== this.position && (this.position = "left", this.el.style.position = "static", this.el.style.float = "left", this.el.style.opacity = 1, this.el.style.top = "inherit")
			},
			scrollLeft: function() {
				return this.getBounds(), this.bounds.right >= this.limitRight ? (this.stickRight(), -1) : this.bounds.left < this.offsetLeft ? (this.floatLeft(), 1) : void 0
			},
			scrollRight: function() {
				return this.getBounds(), this.limitLeft >= this.offsetRight ? (this.stickLeft(), -1) : this.bounds.left > this.offsetRight && this.bounds.width <= this.tdRight ? (this.floatLeft(), 1) : void 0
			}
		}, a
	}), /*! */
	W.define("loadersUI", ["broadcast", "utils"], function(a, b) {
		function c(a, c) {
			b.contains(h, c) && (g(), k = !1, setTimeout(d.bind(null, c), 200))
		}

		function d(a) {
			k || (document.body.classList.add("loading-" + a), document.body.classList.add("loading-all"), j = 10, i || e())
		}

		function e() {
			i = setTimeout(f, 2e3)
		}

		function f() {
			k || !j-- ? (i = null, document.body.classList.remove("loading-all")) : e()
		}

		function g() {
			k = !0, document.body.classList.remove("loading-overlay"), document.body.classList.remove("loading-path"), document.body.classList.remove("loading-level")
		}
		var h = ["overlay", "path", "level"],
			i = null,
			j = 0,
			k = !1;
		a.on("paramsChanged", c), a.on("redrawFinished", g), a.on("loadingFailed", g)
	}), /*! */
	W.define("rhpane", ["storage", "pois", "settings", "$", "utils", "trans", "rootScope", "products", "overlays", "broadcast", "components", "VerticalBar", "Evented"], function(a, b, c, d, e, f, g, h, i, j, k) {
		var l = W.Evented.instance({
			ident: "rhpane"
		});
		return l.levels = W.VerticalBar.instance({
			ident: "level",
			emitter: l,
			data: {
				"150h": ["150hPa", "13,5km FL450"],
				"200h": ["200hPa", "11.7km FL390"],
				"250h": ["250hPa", "10km FL340"],
				"300h": ["300hPa", "9000m FL300"],
				"400h": ["400hPa", "7000m FL240"],
				"500h": ["500hPa", "5500m FL180"],
				"600h": ["600hPa", "4200m FL140"],
				"700h": ["700hPa", "3000m FL100"],
				"800h": ["800hPa", "2000m 6400ft"],
				"850h": ["850hPa", "1500m 5000ft"],
				"900h": ["900hPa", "900m 3000ft"],
				"925h": ["925hPa", "750m 2500ft"],
				"950h": ["950hPa", "600m 2000ft"],
				"975h": ["975hPa", "300m 1000ft"],
				"100m": ["100m AGL", "330ft AGL"],
				surface: ["", ""]
			},
			getAllowedValues: function() {},
			renderItem: function(a) {
				var b = this.data[a];
				return ("surface" === a ? f.SFC : b[0]) + " " + b[1]
			},
			_init: function() {
				W.VerticalBar._init.call(this), this.fillAllowed(), this.set(g.params.level, "noEmit"), j.on("productChanged", this.fillAllowed.bind(this))
			},
			render: function() {
				this.elTxt && (this.elTxt.innerHTML = this.renderItem(g.params.level))
			},
			fillAllowed: function() {
				var a = h[g.params.product],
					b = a && a.levels && a.levels.length > 2 ? a.levels : h.ecmwf.levels;
				this.allowed = Object.keys(this.data).filter(function(a) {
					return e.contains(b, a)
				}), this.resize(), e.contains(this.allowed, this.latestCode) ? this.set(this.latestCode) : this.set("surface")
			}
		}), l.overlays = W.OverlaysBar.instance({
			ident: "overlay",
			emitter: l,
			allowed: c.get("quickOverlays"),
			_init: function() {
				W.VerticalBar._init.call(this), this.render(), this.set(g.params.overlay), this.emitter.on("overlaysUpdated", this.updatedOvrs.bind(this)), this.emitter.on("overlayExternalChange", this.onchange.bind(this))
			},
			onresize: function() {
				var a = 100 * Math.floor(this.height / 100);
				e.replaceClass(/rhpanesize-\S+/, "rhpanesize-" + a)
			},
			updatedOvrs: function(a) {
				this.allowed = a, e.contains(this.allowed, self.latestCode) || (self.latestCode = this.allowed[0]), this.render(), this.set(this.latestCode)
			}
		}), W.SecondaryBar = W.OverlaysBar.extend({
			emitter: l,
			_init: function() {
				W.OverlaysBar._init.call(this), this.render(), this.set(this.ident, "noEmit"), j.on("overlayChanged", this.syncSelf.bind(this))
			},
			syncSelf: function() {
				var a = g.params.overlay;
				this.latestCode !== a && e.contains(this.allowed, a) && this.set(a, "noEmit")
			},
			renderItem: function(a) {
				return a === this.ident ? f[this.basicTransString] : i[a] && i[a].getName()
			}
		}), l.clouds = W.SecondaryBar.instance({
			ident: "clouds",
			allowed: ["visibility", "cbase", "hclouds", "mclouds", "lclouds", "clouds"],
			basicTransString: "TOTAL_CLOUDS"
		}), l.waves = W.SecondaryBar.instance({
			ident: "waves",
			allowed: ["swell3", "swell2", "swell1", "swellperiod", "swell", "wwaves", "waves"],
			basicTransString: "ALL_WAVES"
		}), l.pois = W.Switch.instance({
			el: d("#poismodel .pois-switch"),
			stopPropagation: !0,
			initValue: g.pois,
			poisUsed: c.get("poisUsed"),
			pois: ["wind", "temp", "cities"],
			init: function() {
				j.on("poisExternalChange", this.set.bind(this)), !this.poisUsed && !g.isMobile && +a.get("visitCounter70") > 1 && this.promoPois()
			},
			promoPois: function() {
				var a = this,
					b = g.pois,
					c = 1500;
				document.body.classList.add("pois-promo");
				for (var d = 0; d < this.pois.length; d++) this.pois[d], setTimeout(a.set.bind(a, this.pois[d]), (d + 1) * c);
				setTimeout(function() {
					document.body.classList.remove("pois-promo"), a.set.call(a, b)
				}, (d + 2) * c)
			},
			onevent: function() {
				W.Switch.onevent.apply(this, arguments), this.poisUsed || c.set("poisUsed", !0)
			},
			onset: function(a) {
				j.emit("pois", a)
			}
		}), l.model = W.Switch.instance({
			el: d("#poismodel .model-switch"),
			initValue: g.params.model,
			stopPropagation: !0,
			prefered: "ecmwf",
			onset: function(a) {
				l.emit("model", a), "gfs" !== a && "ecmwf" !== a || (this.prefered = a)
			},
			init: function() {
				var a = this;
				j.once("dependenciesResolved", function() {
					a.checkBetterFcst(), j.on("mapChanged", a.checkBetterFcst.bind(a)), j.on("modelChanged", a.set.bind(a)), j.on("productChanged", a.set.bind(a))
				})
			},
			checkBetterFcst: function() {
				var a = this.betterModel() || "notAvbl";
				e.replaceClass(/better-model-\S+/, "better-model-" + a), e.contains([a, "gfs", "ecmwf"], g.params.model) ? this.set(g.params.model, "noEmit") : (this.set(this.prefered), j.emit("modelChanged", this.prefered))
			},
			betterModel: function() {
				for (var a, b = 0; b < g.localModels.length; b++)
					if (a = g.localModels[b], h[a].pointIsInBounds(g.map)) return a;
				return null
			}
		}), l.pois.init(), l.model.init(), j.on("langChanged", e.each.bind(null, l, function(a) {
			a && a.render && a.render()
		})), l
	}), /*! */
	W.define("VerticalBar", ["rootScope", "overlays", "$", "utils", "broadcast", "UIcomponents"], function(a, b, c, d, e) {
		var f = W.Drag.extend(W.Resizable, {
			_init: function() {
				var a = this,
					b = this.resizableEl = c("#" + this.ident);
				this.el = c(".main-timecode", b), this.elTxt = c(".main-timecode .box", b), this.contentEl = c("span", b), this.ghost = c(".ghost-timecode", b), this.ghostTxt = c(".ghost-timecode .box", b), this.latestCode = null, this.latestGhost = null, this.updateTimecode = this.update.bind(this, "latestCode", this.el, this.elTxt), this.updateGhost = this.update.bind(this, "latestGhost", this.ghost, this.ghostTxt), this.emitOut = d.debounce(this.emit, 200), this.mouseInside = !1, b.addEventListener("mouseup", this.click.bind(this)), b.addEventListener("mouseenter", function(b) {
					a.dragging || (a.updateGhost.call(a, b.clientY - a.elTop), a.ghost.style.opacity = 1), a.mouseInside = !0
				}), b.addEventListener("mousemove", function(b) {
					a.dragging ? a.ghost.style.opacity = 0 : a.updateGhost.call(a, b.clientY - a.elTop)
				}), b.addEventListener("mouseleave", function() {
					a.ghost.style.opacity = 0, a.mouseInside = !1
				}), W.Drag._init.call(this), W.Resizable._init.call(this)
			},
			click: function(a) {
				this.dragging || (this.addAnimation(), this.updateTimecode(a.pageY - this.elTop), this.removeAnimation())
			},
			ondragend: function(a) {
				this.mouseInside && (this.updateGhost(a.clientY - this.elTop), this.ghost.style.opacity = 1)
			},
			onKeyboard: function(a) {
				var b = this.allowed.indexOf(this.latestCode);
				b > -1 && (a && b < this.allowed.length - 1 ? b++ : !a && b > 0 && b--, this.set(this.allowed[b]))
			},
			addAnimation: function() {
				this.el.classList.add("anim-allowed")
			},
			removeAnimation: function() {
				window.setTimeout(function() {
					this.el.classList.remove("anim-allowed")
				}.bind(this), 300)
			},
			px2pct: function(a) {
				return 100 * a / this.height
			},
			pct2px: function(a) {
				return a * this.height / 100
			},
			ident2pct: function(a) {
				return 100 * (this.allowed.indexOf(a) + .5) / this.allowed.length
			},
			pct2ident: function(a) {
				var b = this.allowed.length * a / 100 - .5;
				return b = d.bound(Math.round(b), 0, this.allowed.length - 1), this.allowed[b]
			},
			set: function(a, b) {
				var c = this.ident2pct(a);
				this.addAnimation(), this.updateTimecode(this.pct2px(c), b), this.removeAnimation()
			},
			ondrag: function(a, b) {
				this.updateTimecode(b + 10)
			},
			renderItem: function(a) {},
			emit: function(a) {
				this.emitter.emit(this.ident, a)
			},
			update: function(a, b, c, e, f) {
				if (this.height && !isNaN(e)) {
					var g = this.px2pct(d.bound(e, 0, this.height)),
						h = this.pct2ident(g);
					b.style.top = g + "%", b.style.bottom = "inherit", this[a] !== h && (c.textContent = this.renderItem(h), this[a] = h, "latestCode" !== a || f || this.emitOut(h))
				}
			}
		});
		return W.OverlaysBar = f.extend({
			renderItem: function(a) {
				return b[a] && b[a].getName()
			},
			render: function() {
				var a = this;
				this.contentEl.innerHTML = this.allowed.map(function(c) {
					return d.template('<div class="side-icons {selected} {ident}" data-ident="{ident}" style="top:{ percent }%;">{ icon }</div>', {
						percent: a.ident2pct(c),
						ident: c,
						icon: b[c] && b[c].icon
					})
				}).join(""), this.elTxt && this.latestCode && (this.elTxt.innerHTML = this.renderItem(this.latestCode)), this.resize()
			},
			onchange: function(a) {
				this.emit(a), this.set(a)
			},
			set: function(a, c) {
				d.contains(this.allowed, a) ? f.set.call(this, a, c) : (this.addAnimation(), this.elTxt.textContent = b[a].getName(), this.el.style.cssText = "top: inherit; bottom: -35px;", this.latestCode = a, this.removeAnimation())
			},
			emit: function(a) {
				var b;
				this.emitter.emit("overlay", a), d.replaceClass(/overlay-\S+/, "overlay-" + a), (b = c(".selected", this.resizableEl)) && b.classList.remove("selected"), (b = c(".side-icons." + a, this.resizableEl)) && b.classList.add("selected")
			}
		}), f
	}), /*! */
	W.define("loader", ["lruCache", "rootScope", "utils", "broadcast"], function(a, b, c, d) {
		function e(a) {
			var b = a.url,
				c = h.get(b);
			if (!c) return c = new f(b, a), h.put(b, c), c.load();
			switch (c.status) {
				case "loaded":
					return Promise.resolve(c);
				case "loading":
					return c.promise;
				case "failed":
					return c.failCounter < 2 ? c.load() : Promise.reject("Failed to load tile repeatedly. Giving up.")
			}
		}

		function f(a, b) {
			return this.failCounter = 0, this.url = a, this.status = "undefined", this.data = null, this.x = b.x, this.y = b.y, this.z = b.z, this
		}

		function g(a, b) {
			var c, d, e, f, g = new ArrayBuffer(28),
				h = new Uint8Array(g),
				i = new Float32Array(g),
				j = 4 * (4 * b) + 8;
			for (f = 0; f < 28; f++) c = a[j], d = a[j + 1], e = a[j + 2], c = Math.round(c / 64), d = Math.round(d / 16), e = Math.round(e / 64), h[f] = (c << 6) + (d << 2) + e, j += 16;
			return i
		}
		var h = new a(50),
			i = document.createElement("canvas"),
			j = i.getContext("2d");
		return f.prototype.load = function() {
			var a = this;
			return this.status = "loading", this.promise = new Promise(function(e, f) {
				var h = new Image;
				h.crossOrigin = "Anonymous", h.onload = function() {
					i.width = h.width, i.height = h.height, j.drawImage(h, 0, 0, h.width, h.height);
					var c = j.getImageData(0, 0, h.width, h.height);
					a.data = c.data, a.status = "loaded";
					var d = g(a.data, 257),
						f = d[0],
						k = (d[1] - d[0]) / 255,
						l = d[2],
						m = (d[3] - d[2]) / 255,
						n = d[4],
						o = (d[5] - d[4]) / 255;
					b.params.lastModified = parseInt(d[6]), a.decodeR = function(a) {
						return a * k + f
					}, a.decodeG = function(a) {
						return a * m + l
					}, a.decodeB = function(a) {
						return a * o + n
					}, e(a)
				}, h.onerror = function() {
					a.failCounter++, a.status = "failed", d.emit("loadingFailed", a.url), f("Failed to load tile, times:" + a.failCounter)
				}, h.src = a.url, (h.complete || void 0 === h.complete) && (h.src = c.emptyGIF, h.src = a.url)
			}), this.promise
		}, {
			loadTile: e
		}
	}), /*! */
	W.define("render", [], function() {
		var a = {};
		return a.zoom2zoom = {
			high: [0, 0, 0, 2, 3, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4],
			normal: [0, 0, 0, 2, 2, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4],
			low: [0, 0, 0, 1, 1, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3],
			history: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
		}, a.getTrans = function(b, c) {
			return a.tileW(b) / a.tileW(c)
		}, a.tileW = function(a) {
			return Math.pow(2, a)
		}, a.whichTile = function(b, c) {
			var d = b.z,
				e = Math.min(c.maxTileZoom, a.zoom2zoom[c.dataQuality][d]),
				f = a.tileW(e),
				g = a.getTrans(d, e),
				h = Math.floor(b.x / g),
				i = Math.floor(b.y / g),
				j = b.x % g,
				k = b.y % g,
				l = d - e,
				m = c.fullPath.replace("<tiles>", "257w" + e + "/" + i + "/" + h + "/");
			return h < 0 || i < 0 || h >= f || i >= f ? null : {
				url: m,
				x: h,
				y: i,
				z: e,
				intX: j,
				intY: k,
				intZ: l,
				trans: g
			}
		}, a.testJPGtransparency = function(a, b) {
			return 192 & a[b + 2] || 192 & a[b + 6] || 192 & a[b + 1030] || 192 & a[b + 1034]
		}, a.testPNGtransparency = function(a, b) {
			return !(a[b + 3] && a[b + 7] && a[b + 1028 + 3] && a[b + 1028 + 7])
		}, a.wTables = {}, a.getWTable = function(b) {
			if (b in a.wTables) return a.wTables[b];
			var c, d = 4 * b * b,
				e = 0;
			if (b <= 256) c = new Uint16Array(d);
			else {
				if (!(b <= 1024)) return null;
				c = new Uint32Array(d)
			}
			for (var f = 0; f < b; f++)
				for (var g = 0; g < b; g++) c[e++] = (b - f) * (b - g), c[e++] = (b - f) * g, c[e++] = f * (b - g), c[e++] = g * f;
			return a.wTables[b] = c, c
		}, a.createCombinedFillFun = function(b, c, d) {
			var e = c.colors,
				f = d.colors,
				g = c.value2index.bind(c),
				h = d.value2index.bind(d),
				i = a.createFillFun(b, 2, c),
				j = a.createFillFun(b, 2, d),
				k = function(a, c, d, e, f) {
					b[a] = c, b[a + 1] = d, b[a + 2] = e, b[a + 3] = f
				};
			return function(a, b, c, d, l) {
				if (c > 0 && c < 4) var m = (b << 8) + a << 2,
					n = g(d),
					o = h(l),
					p = e[n++],
					q = e[n++],
					r = e[n++],
					s = e[n],
					t = f[o++],
					u = f[o++],
					v = f[o++],
					w = f[o];
				switch (c) {
					case 0:
						i(a, b, d);
						break;
					case 1:
						k(m, t, u, v, w), k(m + 4, p, q, r, s), k(m + 1024, p, q, r, s), k(m + 1028, p, q, r, s);
						break;
					case 2:
						k(m, t, u, v, w), k(m + 4, t, u, v, w), k(m + 1024, p, q, r, s), k(m + 1028, p, q, r, s);
						break;
					case 3:
						k(m, t, u, v, w), k(m + 4, t, u, v, w), k(m + 1024, t, u, v, w), k(m + 1028, p, q, r, s);
						break;
					case 4:
						j(a, b, l)
				}
			}
		}, a.createFillFun = function(a, b, c) {
			var d = c.colors,
				e = c.value2index.bind(c);
			switch (b) {
				case 1:
					return function(b, c, f) {
						var g = (c << 8) + b << 2,
							h = e(f);
						a[g++] = d[h++], a[g++] = d[h++], a[g++] = d[h++], a[g++] = d[h]
					};
				case 2:
					return function(b, c, f) {
						var g = (c << 8) + b << 2,
							h = e(f),
							i = d[h++],
							j = d[h++],
							k = d[h++],
							l = d[h];
						a[g] = a[g + 4] = i, a[g + 1] = a[g + 5] = j, a[g + 2] = a[g + 6] = k, a[g + 3] = a[g + 7] = l, g += 1024, a[g] = a[g + 4] = i, a[g + 1] = a[g + 5] = j, a[g + 2] = a[g + 6] = k, a[g + 3] = a[g + 7] = l
					}
			}
		}, a
	}), /*! */
	W.define("overlayLayer", ["render", "rootScope", "utils", "maps", "loader", "broadcast", "overlays"], function(a, b, c, d, e, f, g) {
		var h = document.createElement("canvas"),
			i = h.getContext("2d"),
			j = i.createImageData(256, 256),
			k = L.TileLayer.Canvas.extend({
				tilesToReload: 0,
				latestParams: {},
				options: {
					async: !1,
					maxZoom: 11
				},
				syncCounter: 0,
				onAdd: function(a) {
					this._map = a, this._animated = a._zoomAnimated, this._initContainer(), this._container.classList.add("overlay-layer"), a.on({
						viewreset: this._reset,
						moveend: this._update
					}, this), this._animated && a.on({
						zoomanim: this._animateZoom,
						zoomend: this._endZoomAnim
					}, this), this.options.updateWhenIdle || (this._limitedUpdate = L.Util.limitExecByInterval(this._update, 150, this), a.on("move", this._limitedUpdate, this)), this._reset()
				},
				_prepareBgBuffer: function() {
					var a = this._tileContainer,
						b = this._bgBuffer;
					b.style.visibility = "", b.style.opacity = .3, b.style[L.DomUtil.TRANSFORM] = "", a.style.opacity = 1, this._tileContainer = b, b = this._bgBuffer = a, clearTimeout(this._clearBgBufferTimer)
				},
				_tileLoaded: function() {
					this._tilesToLoad--, L.DomUtil.addClass(this._tileContainer, "leaflet-zoom-animated"), this._tilesToLoad || (this._tileContainer.style.opacity = 1, this._bgBuffer.style.opacity = .3, clearTimeout(this._clearBgBufferTimer), this._clearBgBufferTimer = setTimeout(this._clearBgBuffer.bind(this), 500))
				},
				redrawOverlay: function() {
					var a, b, c = this._map,
						d = c.getPixelBounds(),
						e = L.bounds(d.min.divideBy(256)._floor(), d.max.divideBy(256)._floor());
					this._removeOtherTiles(e);
					var g = this.sortTilesFromCenterOut(e);
					this.tilesToReload = g.length;
					for (var h = [], i = 0; i < g.length; i++) b = g[i], a = b.x + ":" + b.y, a in this._tiles && (this._redrawTile(this._tiles[a]), h.push(a));
					var i;
					f.emit("overlayChanged")
				},
				paramsChanged: function(a) {
					a.fullPath === this.latestParams.fullPath && a.overlay === this.latestParams.overlay || (this.latestParams = c.clone(a), this.syncCounter++, this.redrawOverlay())
				},
				sortTilesFromCenterOut: function(a) {
					var b, c, d = [],
						e = a.getCenter();
					for (b = a.min.y; b <= a.max.y; b++)
						for (c = a.min.x; c <= a.max.x; c++) d.push(new L.Point(c, b));
					return d.sort(function(a, b) {
						return a.distanceTo(e) - b.distanceTo(e)
					}), d
				},
				tileLoaded: function() {
					--this.tilesToReload || this.redrawFinished()
				},
				redrawFinished: function() {
					this.latestParams.sea ? document.body.classList.add("sea") : document.body.classList.remove("sea")
				},
				drawTile: function(b, c) {
					this._adjustTilePoint(c);
					var d = a.whichTile(c, this.latestParams);
					e.loadTile(d).then(this.renderTile.bind(this, 2, b, this.syncCounter, d))
				},
				renderTile: function(b, c, d, e, f) {
					if (d === this.syncCounter) {
						Date.now();
						b |= 0;
						var h = f.data,
							i = c.getContext("2d"),
							k = j.data,
							l = !1;
						this.latestParams.JPGtransparency ? l = a.testJPGtransparency : this.latestParams.PNGtransparency && (l = a.testPNGtransparency);
						var m, n, o, p, q = !1,
							r = 0 | e.trans,
							s = 0 | Math.log2(r),
							t = 0 | Math.log2(r * r),
							u = 0 | e.intX,
							v = 0 | e.intY,
							w = 2056,
							x = 256 >> s,
							y = a.getWTable(r),
							z = 0,
							A = 0,
							B = u * x | 0,
							C = v * x | 0,
							D = 0,
							E = 0,
							F = 256,
							G = 0,
							H = 0,
							I = 0,
							J = 0,
							K = 0,
							L = 0,
							M = 0,
							N = 0,
							O = 0,
							P = 0,
							Q = 0,
							R = 0,
							S = 0,
							T = 0,
							U = g[this.latestParams.overlay],
							V = "clouds" === U.ident,
							W = !(!this.latestParams.isWave || "swellperiod" === U.ident) || "sst" === U.ident,
							X = !(!U.hasParticles || W) || V,
							Y = f.decodeR,
							Z = f.decodeG,
							$ = U.getColor();
						V ? (o = a.createCombinedFillFun(k, $[0], $[1]), p = a.createFillFun(k, b, $[0])) : o = p = a.createFillFun(k, b, $), W && (Y = f.decodeB);
						for (var _ = 0; _ < 256; _ += b) {
							E = _ >> s, I = _ - (E << s);
							for (var aa = 0; aa < 256; aa += b) D = aa >> s, H = aa - (D << s), F !== D && (G = E + C, A = w + D + B + ((G << 8) + G) << 2, l && (q = l(h, A)), W && (A += 2), J = h[A], K = h[A + 4], L = h[A + 1028], M = h[A + 1032], X && (N = h[A + 1], O = h[A + 5], P = h[A + 1029], Q = h[A + 1033]), F = D), q ? p(aa, _, NaN) : (z = H + (I << s) << 2, R = J * y[z] + K * y[z + 1] + L * y[z + 2] + M * y[z + 3] >> t, m = Y(R), X && (S = N * y[z] + O * y[z + 1] + P * y[z + 2] + Q * y[z + 3] >> t, n = Z(S)), V ? (T = n < .3 ? 0 : n < 3 ? 1 : n < 6 ? 2 : 3, o(aa, _, T, m, n)) : X ? o(aa, _, Math.sqrt(m * m + n * n)) : o(aa, _, m))
						}
						return i.putImageData(j, 0, 0), this.tileLoaded(), this.tileDrawn(c), this
					}
				},
				init: function(a) {
					this.latestParams = c.clone(a), this._update(), this.redrawFinished()
				}
			}),
			l = new k({
				tileSize: 256,
				async: !0
			});
		return l.addTo(d), l
	}), /*! */
	W.define("renderCtrl", ["rootScope", "overlayLayer", "vectors", "products", "broadcast"], function(a, b, c, d, e) {
		function f(a) {
			e.on("maps-paramsChanged", g), e.on("redrawAnimation", function() {
				c.redrawVectors(), b.redrawOverlay()
			});
			var f = d[a.product];
			b.init(f.overlayParams(a)), c.init(f.vectorParams(a)), g(a)
		}

		function g(a) {
			var e = d[a.product];
			b.paramsChanged(e.overlayParams(a)), c.paramsChanged(e.vectorParams(a))
		}
		e.once("maps-paramsChanged", f);
		var h = {
			isRunning: !1,
			semaphore: !1,
			timer: null,
			tick: 50,
			button: document.getElementById("playpause"),
			buttonMobile: document.getElementById("playpause-mobile"),
			pbWrapper: document.getElementById("progress-bar"),
			start: function() {
				a.params.timestamp && (this.product = d[a.params.product], this.product.animation && (this.isRunning = !0, this.button.className = "pause", this.buttonMobile.className = "pause", this.pbWrapper.className = "onanimation", this.run(), e.emit("animationStarted")))
			},
			stop: function() {
				this.isRunning = !1, this.button.className = "play", this.buttonMobile.className = "play", this.pbWrapper.className = "", clearTimeout(this.timer), e.emit("animationStopped")
			},
			toggle: function() {
				this.isRunning ? this.stop() : this.start()
			},
			run: function() {
				var b = +a.params.timestamp + this.tick * this.product.animationSpeed;
				this.product.animation && b < this.product.calendar.end ? (e.emit("moveTs", b), this.timer = setTimeout(this.run.bind(this), this.tick)) : this.stop()
			}
		};
		e.on("playPauseClicked", h.toggle.bind(h))
	}), /*! */
	W.define("vectors", ["maps", "broadcast", "loader", "render", "animation", "particles", "utils", "rootScope", "DataTiler"], function(a, b, c, d, e, f, g, h) {
		var i = (a.canvas, a.canvasOverlay),
			j = new Float32Array(3 * (screen.width >> 1) * ((screen.height >> 1) + 10)),
			k = W.DataTiler.instance({
				cancelRqstd: !1,
				latestParams: null,
				enabled: !0,
				cancelTasks: function() {
					this.syncCounter++
				},
				tilesReady: function(a, b, c) {
					g.include(b, c), g.include(b, {
						vectors: j,
						partObj: f[c.particlesIdent]
					}), this.computeVectors(b, a)
				},
				redrawVectors: function() {
					this.mapMoved = !0, this.latestParams && this.getTiles(this.latestParams)
				},
				init: function(b) {
					this.latestParams = g.clone(b), this.redrawVectors(), a.on("moveend", this.redrawVectors.bind(this)), a.on("movestart", this.cancelTasks.bind(this))
				},
				paramsChanged: function(a) {
					a ? this.latestParams && this.latestParams.fullPath === a.fullPath && this.latestParams.overlay === a.overlay ? this.emitFinished() : (e.enable(), this.latestParams = g.clone(a), this.getTiles(this.latestParams)) : (this.latestParams = null, e.suspend(), this.emitFinished())
				},
				emitFinished: function() {
					setTimeout(function() {
						b.emit("redrawFinished")
					}, 200)
				},
				computeVectors: function(a, c) {
					var f = this.shift,
						g = this.lShift,
						h = this.offsetX,
						k = this.offsetY,
						l = this.trans,
						m = this.trans * this.trans,
						n = !1;
					this.latestParams.JPGtransparency ? n = d.testJPGtransparency : this.latestParams.PNGtransparency && (n = d.testPNGtransparency);
					var o, p, q, r, s, t, u, v, w, x, y = !1,
						z = this.w,
						A = 0,
						B = 0,
						C = 0,
						D = 0 | a.height,
						E = 0 | a.width,
						F = 0 | Math.ceil(E / 2),
						G = j,
						H = 0,
						I = 0,
						J = 0,
						K = 0,
						L = this.offset,
						M = 256,
						N = 0,
						O = 0,
						P = 0,
						Q = 0,
						R = 0,
						S = 0,
						T = 0,
						U = 0,
						V = 0,
						W = 0,
						X = 0,
						Y = 0,
						Z = 0,
						$ = 0,
						_ = 0,
						aa = 0,
						ba = 0,
						ca = 0,
						da = a.partObj.getVelocityFun(a),
						ea = a.partObj.getIntensityFun(),
						fa = 0;
					for (B = 0, Q = k; B < D;) {
						for (O = Q >> f, K = O >> 8, S = O - (K << 8), U = Q - (O << f), C = 0, P = h; C < E; C += 2, P += 2) N = P >> f, T = P - (N << f), M !== N && (J = N >> 8, R = N - (J << 8), o = c[K][J], p = o.data, H = L + R + ((S << 8) + S) << 2, n && (y = n(p, H)), V = p[H], W = p[H + 4], Z = p[H + 1], $ = p[H + 5], H += 1028, X = p[H], Y = p[H + 4], _ = p[H + 1], aa = p[H + 5], M = N), y ? (G[I++] = 0, G[I++] = 0, G[I++] = 0) : (z ? (A = T + (U << f) << 2, ba = V * z[A] + W * z[A + 1] + X * z[A + 2] + Y * z[A + 3] >> g, ca = Z * z[A] + $ * z[A + 1] + _ * z[A + 2] + aa * z[A + 3] >> g) : (t = (l - U) * (l - T), u = (l - U) * T, v = U * (l - T), w = T * U, ba = (V * t + W * u + X * v + Y * w) / m, ca = (Z * t + $ * u + _ * v + aa * w) / m), q = o.decodeR(ba), r = o.decodeG(ca), s = Math.sqrt(q * q + r * r), x = da(s), G[I++] = q * x, G[I++] = r * -x, G[I++] = ea(s), fa += s);
						B += 2, Q += 2, I = 3 * (B >> 1) * F
					}
					this.mapMoved && (i.reset.call(i), this.mapMoved = !1), a.speed2pixel = fa / (E * D), e.run(a), b.emit("redrawFinished", this.latestParams)
				}
			});
		return k
	}), /*! */
	W.define("particles", ["rootScope", "broadcast", "Class", "settings", "utils", "location"], function(a, b, c, d, e) {
		W.Particles = c.extend({
			configurable: !1,
			animation: "dot",
			stylesBlue: ["rgba(200,0,150,1)", "rgba(200,0,150,1)", "rgba(200,0,150,1)", "rgba(200,0,150,1)"],
			// lineWidth: [.6, .6, .6, 1, 1.2, 1.6, 1.8, 2, 2.2, 2.4, 2.4, 2.4, 2.4, 2.6, 2.8, 3, 3, 3, 3, 3, 3, 3, 3, 3],
            lineWidth: (function() {
                // NOTE: 控制线的粗细
                var conf = [.6, .6, .6, 1, 1.2, 1.6, 1.8, 2, 2.2, 2.4, 2.4, 2.4, 2.4, 2.6, 2.8, 3, 3, 3, 3, 3, 3, 3, 3, 3];
                // 只对大屏进行处理
                if (IS_BIG_SCREEN) {
                    conf.forEach(function(v, i) {
                        conf[i] = v * 3;
                    });
                }
                return conf;
            })(),
			zoom2speed: [.5, .5, .5, .6, .7, .8, .9, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
			level2reduce: {
				surface: 1,
				"100m": 1,
				"975h": 1,
				"950h": 1,
				"925h": .98,
				"900h": .9,
				"850h": .8,
				"800h": .77,
				"750h": .75,
				"700h": .7,
				"600h": .65,
				"500h": .6,
				"400h": .55,
				"300h": .5,
				"250h": .45,
				"200h": .45,
				"150h": .35
			},
			colors: [
				[200, 215, 235, 255],
				[215, 235, 255, 255],
				[235, 255, 255, 255],
				[255, 255, 255, 255]
			],
			getIntensityFun: function() {
				return function(a) {
					return Math.min(3, Math.floor(a / 40))
				}
			},
			getVelocityFun: function(a) {
				var b = this.zoom2speed[a.zoom],
					c = this.configurable ? f.config.velocity : 1,
					d = b * c * this.level2reduce[a.level] * this.velocity.max,
					e = b * c * this.velocity.damper;
				return function(a) {
					return d * (1 - 1 / (e * d * a - 1))
				}
			},
			getAmount: function(a) {
				var b = a.speed2pixel < 1 ? 1 + 1.5 * (1 - a.speed2pixel) : 1,
					c = this.configurable ? f.config.multiplier : 1,
					d = 1 / (this.multiplier.constant * Math.pow(c * this.multiplier.pow, a.zoom - this.multiplier.zoom));
				return 0 | Math.min(15e3, Math.round(b * a.width * a.height * d))
			},
			getLineWidth: function(a) {
				var b = this.configurable ? f.config.width : 1;
				return b * this.lineWidth[a.zoom]
			},
			getStyles: function(a) {
				var b = this.configurable ? f.config.opacity : 1;
				if (a.zoom >= 12) return this.stylesBlue;
				if (b <= 1) return this.colors[0].map(function(a) {
					return "rgba(" + a + "," + a + "," + a + "," + b.toFixed(1) + ")"
				});
				var c = Math.min(3, Math.round(1.5 * b));
				return this.colors[c].map(function(a) {
					return "rgba(" + a + "," + a + "," + a + ",1)"
				})
			},
			getMaxAge: function() {
				return 100
			},
			getBlendingAlpha: function(a) {
				var b = this.configurable && 1 != f.config.blending ? f.config.blending : 1,
					c = a.speed2pixel < .8 ? 1 + (.8 - a.speed2pixel) / 7 : 1,
					d = .9 * b * c;
				return Math.min(.98, 2 * Math.round(100 * d / 2) / 100).toFixed(2)
			}
		});
		var f = {
			defaultConfig: d.getDefault("particles"),
			config: {},
			dirtyFlag: !1,
			URLfrag: "",
			update: function() {
				d.set("particles", this.config), this.updateFragment()
			},
			updateFragment: function() {
				var b = this;
				this.dirtyFlag = !e.compare(this.defaultConfig, this.config), this.URLfrag = "an" + Object.keys(this.defaultConfig).map(function(a) {
					return e.num2char(Math.floor(30 * b.config[a]))
				}).join(""), a.customAnimation = this.dirtyFlag ? this.URLfrag : null
			},
			configFromURL: function(a) {
				this.URLfrag = a, this.dirtyFlag = !0;
				var b, c = 0;
				for (var d in this.defaultConfig) b = e.char2num(a.replace("an", "").charAt(c++)) / 30, b >= 0 && b < 2 && (this.config[d] = b)
			},
			init: function() {
				a.customAnimation ? this.configFromURL(a.customAnimation) : this.config = d.get("particles"), this.updateFragment()
			},
			wind: W.Particles.instance({
				configurable: !0,
				multiplier: {
					constant: 50,
					pow: 1.6,
					zoom: 2
				},
				velocity: {
					max: .1,
					damper: 1e-5
				}
			}),
			currents: W.Particles.instance({
				multiplier: {
					constant: 50,
					pow: 1.5,
					zoom: 2
				},
				velocity: {
					max: .4,
					damper: .35
				},
				getBlendingAlpha: function() {
					return .96
				}
			}),
			waves: W.Particles.instance({
				animation: "wavecle",
				styles: ["rgba(100,100,100,0.25)", "rgba(150,150,150,0.3)", "rgba(200,200,200,0.35)", "rgba(255,255,255,0.4)"],
				lineWidth: [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
				multiplier: {
					constant: 50,
					pow: 1.3,
					zoom: 2
				},
				velocity: {
					max: .02,
					damper: .015
				},
				getIntensityFun: function() {
					return function(a) {
						return a < 12 ? 0 : a < 25 ? 1 : a < 37 ? 2 : a < 62 ? 3 : a < 75 ? 2 : a < 85 ? 1 : 0
					}
				},
				getStyles: function() {
					return this.styles
				},
				getBlendingAlpha: function() {
					return .9
				}
			})
		};
		return f.init(), f
	}), /*! */
	W.define("animation", ["broadcast", "maps"], function(a, b) {
		function c() {
			m = !0, f();
			var a = o.getContext("2d");
			a.clearRect(0, 0, o.width, o.height)
		}

		function d() {
			m = !1
		}

		function e(a) {
			"off" === a ? (n = !0, o.style.opacity = 0, f()) : n && (n = !1, o.style.opacity = 1, m || h())
		}

		function f() {
			cancelAnimationFrame(l)
		}

		function g(a, b, c) {
			return function(d) {
				var e = j;
				e[d++] = Math.random() * a, e[d++] = Math.random() * b, e[d++] = 0, e[d++] = 0, e[d++] = Math.floor(Math.random() * c), e[d] = 0
			}
		}

		function h(a) {
			function b(a) {
				if (l = requestAnimationFrame(b), !(a - w < 35)) {
					w = a;
					var d, g, i, n, o, t, u, x, y, z = c,
						A = j,
						B = k,
						C = 6 * m | 0,
						D = h,
						E = 0 | e,
						F = 0 | Math.ceil(e / 2),
						G = 0 | f,
						H = r,
						I = 0,
						J = 0,
						K = 0;
					if (q)
						for (I = 0; I < C; I += 6) A[I + 4] > p && s(I), d = A[I], g = A[I + 1], K = 3 * (Math.round(g / 2) * F + Math.round(d / 2)), d > E || g > G || d < 0 || g < 0 ? (A[I + 4] = p + 1, B[I + 5] = 10) : (i = D[K], n = D[K + 1], o = d + i, t = g + n, A[I] = o, A[I + 1] = t, A[I + 4]++, u = Math.sqrt(i * i + n * n) / 2.5, x = i / u, y = n / u, B[I] = d - y, B[I + 1] = g + x, B[I + 2] = d + y, B[I + 3] = g - x, B[I + 5] = v(A[I + 4]));
					else
						for (I = 0; I < C; I += 6) A[I + 4] > p && s(I), d = A[I], g = A[I + 1], K = 3 * (Math.round(g / 2) * F + Math.round(d / 2)), d > E || g > G || d < 0 || g < 0 ? (A[I + 4] = p + 1, A[I + 5] = 10) : (A[I + 2] = d + D[K], A[I + 3] = g + D[K + 1], A[I + 4]++, A[I + 5] = D[K + 2]);
					if (z.globalCompositeOperation = "destination-in", z.fillRect(0, 0, e, f), z.globalCompositeOperation = "source-over", q)
						for (I = 0; I < 4; I++) {
							for (z.beginPath(), z.strokeStyle = H[I], J = 0; J < C; J += 6) B[J + 5] === I && (z.moveTo(B[J], B[J + 1]), z.lineTo(B[J + 2], B[J + 3]));
							z.stroke()
						} else
							for (I = 0; I < 4; I++) {
								for (z.beginPath(), z.strokeStyle = H[I], J = 0; J < C; J += 6) A[J + 5] === I && (z.moveTo(A[J], A[J + 1]), z.lineTo(A[J + 2], A[J + 3]), A[J] = A[J + 2], A[J + 1] = A[J + 3]);
								z.stroke()
							}
				}
			}
			if (a ? i = a : a = i, cancelAnimationFrame(l), !n) {
				var c = o.getContext("2d"),
					d = a.partObj,
					e = a.width,
					f = a.height,
					h = a.vectors,
					m = 0 | d.getAmount.call(d, a);
				(!j || j.length < 3 * m) && (j = new Float32Array(3 * m), k = new Float32Array(3 * m));
				var p = d.getMaxAge(),
					q = "wavecle" === d.animation,
					r = d.getStyles.call(d, a);
				c.clearRect(0, 0, a.width, a.height);
				for (var s = g(e, f, p), t = 0, u = 0; t < m; t++, u += 6) s(u);
				c.lineWidth = d.getLineWidth.call(d, a), c.fillStyle = "rgba(0, 0, 0," + d.getBlendingAlpha.call(d, a) + ")";
				var v = d.getIntensityFun.call(d, a),
					w = 0;
				b()
			}
		}
		var i, j = null,
			k = null,
			l = null,
			m = !1,
			n = !1,
			o = b.canvas;
		return a.on("particlesAnimation", e), {
			suspend: c,
			enable: d,
			// run: h,
            run: function() {
                // NOTE: 这里通过全局变量IS_SHOW_WIND控制是否对风场进行处理
                // 		 主要是为了优化不显示风场时整个页面的性能
                var argv = [].slice.apply(arguments);
                if (argv.length < 1 && argv_run) {
                    argv = argv_run;
                } else {
                    argv_run = argv;
                }
                if (window.IS_SHOW_WIND) {
                    h.apply(this, argv);
                } else {
                    f();
                }
            },
			stop: f,
			toggle: e
		}
	}), /*! */
	W.define("DataTiler", ["utils", "maps", "loader", "render", "Class"], function(a, b, c, d, e) {
		var f = e.extend({
			syncCounter: 0,
			getTiles: function(e) {
				this.syncCounter++;
				var f, g, h, i = b.getPixelBounds(),
					j = b.getZoom(),
					k = [],
					l = i.min.x >> 8,
					m = i.max.x >> 8,
					n = i.min.y >> 8,
					o = i.max.y >> 8;
				for (g = n; g <= o; g++)
					for (f = l; f <= m; f++) h = {
						x: f,
						y: g,
						z: j
					}, b.adjustTilePoint(h), k.push(h);
				var p, q = a.include(b.info(), {
						pixelOriginX: i.min.x,
						pixelOriginY: i.min.y,
						dZoom: d.zoom2zoom[e.dataQuality][j],
						origTiles: {
							minX: l,
							minY: n,
							maxX: m,
							maxY: o
						}
					}),
					r = {},
					s = [];
				k.forEach(function(a) {
					p = d.whichTile(a, e), p && !r[p.url] && (r[p.url] = 1, s.push(c.loadTile(p)))
				}), Promise.all(s).then(this.postProcess.bind(this, this.syncCounter, q, e))
			},
			postProcess: function(a, b, c, e) {
				if (a === this.syncCounter) {
					var f = this.sortTiles(b, c, e);
					this.trans = 0 | d.getTrans(b.zoom, b.dZoom), this.shift = 0 | Math.log2(this.trans), this.lShift = 0 | Math.log2(this.trans * this.trans);
					var g = b.pixelOriginX / this.trans % 256,
						h = b.pixelOriginY / this.trans % 256;
					g < 0 && (g = 256 + g), this.offsetX = g * this.trans | 0, this.offsetY = h * this.trans | 0, this.offset = 2056, this.width = b.width, this.height = b.height, this.w = d.getWTable(this.trans), this.tilesReady.call(this, f, b, c)
				}
			},
			tilesReady: function(a, b, c) {},
			sortTiles: function(a, c, e) {
				function f(a, e, f) {
					var g = {
						x: a,
						y: e,
						z: f.z
					};
					return b.adjustTilePoint(g), d.whichTile(g, c)
				}
				for (var g, h, i, j, k = [], l = a.origTiles.minY; l <= a.origTiles.maxY; l++)
					if (g = f(a.origTiles.minX, l, a), !g || g.y !== i) {
						h = null;
						for (var m = [], n = a.origTiles.minX; n <= a.origTiles.maxX; n++) g = f(n, l, a), g && g.x !== h && (j = e.filter(function(a) {
							return a.x === g.x && a.y === g.y
						})[0], m.push(j), h = g.x, i = g.y);
						k.push(m)
					}
				return k
			}
		});
		return f
	}), /*! */
	W.define("interpolator", ["overlayLayer", "maps", "render", "DataTiler"], function(a, b, c) {
		var d = W.DataTiler.instance({
			createFun: function(b) {
				return this.cb = b, a.latestParams ? void this.getTiles(a.latestParams) : null
			},
			tilesReady: function(a, d, e) {
				var f = function(d) {
					var f = b.latLngToContainerPoint(d),
						g = f.x,
						h = f.y;
					if (g < 0 || h < 0 || g > this.width || h > this.height) return null;
					var i = h + this.offsetY >> this.shift,
						j = i >> 8,
						k = i - (j << 8),
						l = k % this.trans,
						m = g + this.offsetX >> this.shift,
						n = m >> 8,
						o = m - (n << 8),
						p = o % this.trans,
						q = this.trans,
						r = a && a[j] && a[j][n];
					if (!r) return console.warn("interpolator: Undefined dTile"), NaN;
					var s = r.data,
						t = this.offset + o + (k << 8) + k << 2;
					if (e.PNGtransparency && c.testPNGtransparency(s, t)) return NaN;
					if (e.JPGtransparency && c.testJPGtransparency(s, t)) return NaN;
					var u = s[t],
						v = s[t + 4],
						w = s[t + 1],
						x = s[t + 5],
						y = s[t + 2],
						z = s[t + 6];
					t += 1028;
					var A = s[t],
						B = s[t + 4],
						C = s[t + 1],
						D = s[t + 5],
						E = s[t + 2],
						F = s[t + 6],
						G = (q - l) * (q - p),
						H = (q - l) * p,
						I = l * (q - p),
						J = p * l,
						K = q * q,
						L = (u * G + v * H + A * I + B * J) / K,
						M = (w * G + x * H + C * I + D * J) / K,
						N = (y * G + z * H + E * I + F * J) / K;
					return [r.decodeR(L), r.decodeG(M), r.decodeB(N)]
				};
				this.cb(f)
			}
		});
		return d
	}),
	/*!
	(c)  Stanislav Sumbera, April , 2014, Licenced under MIT */
	L.CanvasOverlay = L.Class.extend({
		canvas: function() {
			return this._canvas
		},
		redraw: function() {
			return this._frame || (this._frame = L.Util.requestAnimFrame(this._redraw, this)), this
		},
		reset: function() {
			this._reset()
		},
		onAdd: function(a) {
			this._map = a, this._canvas = L.DomUtil.create("canvas", "leaflet-canvas");
			var b = this._map.getSize();
			this._canvas.width = b.x, this._canvas.height = b.y;
			var c = this._map.options.zoomAnimation && L.Browser.any3d;
			L.DomUtil.addClass(this._canvas, "leaflet-layer particles-layer leaflet-zoom-" + (c ? "animated" : "hide")), a._panes.tilePane.appendChild(this._canvas), a.on("moveend", this._redraw, this), a.on("resize", this._resize, this), a.options.zoomAnimation && L.Browser.any3d && a.on("zoomanim", this._animateZoom, this), this._reset(), this._redraw()
		},
		addTo: function(a) {
			return a.addLayer(this), this
		},
		_resize: function(a) {
			this._canvas.width = a.newSize.x, this._canvas.height = a.newSize.y
		},
		_reset: function() {
			var a = this._map.containerPointToLayerPoint([0, 0]);
			L.DomUtil.setPosition(this._canvas, a)
		},
		_redraw: function() {
			this._frame = null
		},
		_animateZoom: function(a) {
			var b = this._map.getZoomScale(a.zoom),
				c = this._map._getCenterOffset(a.center)._multiplyBy(-b).subtract(this._map._getMapPanePos());
			this._canvas.style[L.DomUtil.TRANSFORM] = L.DomUtil.getTranslateString(c) + " scale(" + b + ")"
		}
	}), L.canvasOverlay = function() {
		return new L.CanvasOverlay
	}, /*! */
	W.define("maps", ["rootScope", "utils", "settings", "broadcast", "geolocation", "location", 'storage'], function(a, b, c, d, _, _, storage) {
		function e() {
			a.useRetina = a.isRetina && c.get("retina")
		}

		function f() {
			var b = a.useRetina ? window.devicePixelRatio || 1 : 1,
				c = i.getSize(),
				d = c.x,
				e = c.y;
			i.canvas.width = d * b, i.canvas.height = e * b, i.canvas.style.width = d + "px", i.canvas.style.height = e + "px", i.canvas.getContext("2d").scale(b, b)
		}
		var g = {
			isGlobe: !1,
			init: function() {
				d.on("zoomIn", this.wrapper.bind(this, "zoomIn")), d.on("zoomOut", this.wrapper.bind(this, "zoomOut")), d.on("paramsChanged", this.wrapper.bind(this, "paramsChanged")), d.on("globeOpened", this.onGlobe.bind(this)), d.on("globeClosed", this.onMap.bind(this, null)), d.on("globeFailed", this.onMap.bind(this, "error"))
			},
			wrapper: function(a, b, c, e) {
				d.emit((this.isGlobe ? "globe-" : "maps-") + a, b, c, e)
			},
			onGlobe: function() {
				this.isGlobe = !0
			},
			onMap: function(a, b) {
				d.emit("rqstClose", "globe"), this.isGlobe = !1, b && !a && (b.zoom = 4, i.center(b))
			}
		};
		g.init(), L.Map.addInitHook(function() {
			function a(a) {
				function e() {
					d.fire("singleclick", L.Util.extend(a, {
						type: "singleclick"
					}))
				}
				b(), c = setTimeout(e, 500)
			}

			function b() {
				c && (clearTimeout(c), c = null)
			}
			var c, d = this;
			d.on && (d.on("click", a), d.on("dblclick", function() {
				setTimeout(b, 0)
			}))
		});
		var h = a.sharedCoords || a.geoIP,
			i = L.map("map_container", {
				zoomControl: !1,
				keyboard: !1,
				worldCopyJump: !0,
				center: [h.lat, h.lon],
				zoom: h.zoom,
				minZoom: 3,
				maxZoom: 17
			});
		return b.include(i, {
			ident: "maps",
			prevZoom: null,
			graticule: [],
			minZoom: 3,
			myMarkers: {
				icon: L.divIcon({
					className: "icon-dot",
					html: '<div class="pulsating-icon"></div>',
					iconSize: [10, 10],
					iconAnchor: [5, 5]
				}),
				station: L.divIcon({
					className: "icon-station",
					iconSize: [15, 15],
					iconAnchor: [7, 8]
				}),
				other: L.divIcon({
					className: "icon-other",
					iconSize: [16, 16],
					iconAnchor: [8, 8]
				})
			},
			init: function() {
				var c = this.createTileLayer();
				c.addTo(i), i.adjustTilePoint = c._adjustTilePoint.bind(c), this.drawGraticule(), this.zoomEnd(), a.map = this.info(), this.on("zoomend", this.zoomEnd.bind(this)), this.on("moveend", this.moveEnd.bind(this)), this.on("movestart", d.emit.bind(d, "movestart")), this.on("resize", b.debounce(this.resizeEnd.bind(this), 500)), d.on("mapsCenter", this.center.bind(this)), d.on("maps-zoomIn", this.zoomIn.bind(this)), d.on("maps-zoomOut", this.zoomOut.bind(this)), d.on("settingsChanged", this.settingsChanged.bind(this))
			},
			settingsChanged: function(a) {
				switch (a) {
					case "map":
						this.createTileLayer().addTo(i);
						break;
					case "retina":
						e(), f(), d.emit("redrawAnimation");
						break;
					case "graticule":
						i.drawGraticule()
				}
			},
			zoomEnd: function(a) {
				var c = this.getZoom();
				c !== this.prevZoom && (b.replaceClass(/zoom\d+/, "zoom" + c), this.prevZoom = c)
			},
			drawGraticule: function() {
				if (c.get("graticule")) {
					for (var a = {
							stroke: !0,
							color: "#a0a0a0",
							opacity: .8,
							weight: .8,
							clickable: !1
						}, b = -80; b < 81; b += 10) i.graticule.push(L.polyline([
						[b, -180],
						[b, 180]
					], a).addTo(i));
					for (var d = -180; d < 181; d += 10) i.graticule.push(L.polyline([
						[-90, d],
						[90, d]
					], a).addTo(i))
				} else
					for (var e = 0; e < i.graticule.length; e++) i.removeLayer(i.graticule[e])
			},
			createTileLayer: function() {
				// var b = {
				// 	sznmap: "https://m{s}.mapserver.mapy.cz/wturist-m/{z}-{x}-{y}",
				// 	sat: "https://{s}.aerial.maps.api.here.com/maptile/2.1/maptile/newest/satellite.day/{z}/{x}/{y}/256/jpg?" + a.hereMapsID
				// };
				// b.esritopo = b.sznmap;
				// var d = b[c.get("map")];
				// return L.TileLayer.multi({
				// 	11: {
				// 		url: a.tileServer + "v6/{z}/{x}/{y}.jpg",
				// 		subdomains: "1234"
				// 	},
				// 	17: {
				// 		url: d,
				// 		subdomains: "1234"
				// 	}
				// }, {
				// 	detectRetina: !1,
				// 	minZoom: 3,
				// 	maxZoom: a.maxZoom
				// })

                var _c = b[c.get("map")];
                // NOTE: 更改地图瓦片
                var map_conf = storage.get('_map_conf');
                var conf;
                if (map_conf) {
                    conf = map_conf
                } else {
                    conf = {
                        url: 'http://api.tiles.mapbox.com/v4/ludawei.mn69agep/{z}/{x}/{y}.png?access_token=pk.eyJ1IjoibHVkYXdlaSIsImEiOiJldzV1SVIwIn0.-gaUYss5MkQMyem_IOskdA&v=1.1',
                        subdomains: "1234"
                    }
                }
                return L.TileLayer.multi({
                    // 11: {
                    // 	url: a.tileServer + (a.useRetina ? "rtnv3" : "v5") + "/{z}/{x}/{y}.jpg",
                    // 	subdomains: "1234"
                    // },
                    17: {
                        url: _c,
                        subdomains: "1234"
                    },
                    11: conf
                }, {
                    detectRetina: !1,
                    minZoom: 3,
                    maxZoom: a.maxZoom
                })
			},
			center: function(a, c) {
				var d = a.zoom ? b.bound(a.zoom, i.minZoom, 20) : i.getZoom();
				if (a.paddingLeft || a.paddingTop) {
					var e = a.paddingLeft || 0,
						f = a.paddingTop || 0,
						g = i.project([a.lat, a.lon], d).subtract([e / 2, f / 2]),
						h = i.unproject(g, d);
					i.setView(h, d, {
						animate: c
					})
				} else i.setView([a.lat, a.lon], d, {
					animate: c
				})
			},
			ensurePointVisible: function(a, b, c) {
				var d = this.latLngToContainerPoint([a, b]).x;
				d < c && this.panBy([d - 80 - c, 0])
			},
			ensurePointVisibleY: function(b, c, d) {
				var e = this.latLngToContainerPoint([b, c]).y;
				e > a.map.height - d && this.panBy([0, e - 80 - d])
			},
			moveEnd: function() {
				a.map = this.info(), d.emit("mapChanged", b.clone(a.map))
			},
			resizeEnd: function() {
				this.fire("mapsMoveend", this.info()), f(), d.emit("redrawAnimation")
			},
			info: function() {
				var a = i.getCenter(),
					b = i.getBounds(),
					c = i.getSize();
				return {
					source: "maps",
					lat: a.lat,
					lon: a.wrap().lng,
					south: b._southWest.lat,
					north: b._northEast.lat,
					east: b._northEast.lng,
					west: b._southWest.lng,
					width: c.x,
					height: c.y,
					zoom: i.getZoom()
				}
			}
		}), i.init(), i.canvasOverlay = L.canvasOverlay().addTo(i), i.canvas = i.canvasOverlay.canvas(), e(), f(), i
	}), /*! */
	W.define("pois", ["utils", "http", "rootScope", "maps", "overlays", "trans", "broadcast", "favs", "interpolator", "Poi"], function(a, b, c, d, e, f, g, h, i) {
		function j(b) {
			n !== b && (a.replaceClass(/pois-\S+/, "pois-" + b), c.pois = b, m[n].deactivate(), g.emit("poisChanged", b)), n = b, m[n].activate()
		}

		function k() {
			m[n].cancel(), m[n].delete(), m[n].download()
		}

		function l() {
			m[n].cancel(), m[n].download()
		}
		var m = {};
		m.empty = W.Poi.instance({
			trans: "POI_EMPTY",
			icon: "t"
		}), m.favs = W.Poi.instance({
			displayed: !1,
			markers: [],
			icon: "o",
			trans: "POI_FAVS",
			_init: function() {
				W.Poi._init.call(this), g.on("toggleFav", setTimeout.bind(null, this.repaint.bind(this), 800))
			},
			repaint: function() {
				this.isActive && (this.delete(), this.download())
			},
			download: function() {
				this.data = h.favs, this.render(h.favs)
			},
			display: function(a, b) {
				var c = '<span class="point iconfont">o</span><span class="txt">' + b.name + "</span>",
					d = L.divIcon({
						className: "favs-icon",
						html: c,
						iconSize: [12, 12],
						iconAnchor: [6, 6]
					});
				return L.marker([b.lat, b.lon], {
					icon: d
				})
			},
			cancel: function() {}
		}), m.metars = W.Poi.instance({
			ident: "metars",
			icon: "Q",
			trans: "POI_AD",
			icons: function() {
				var a = {};
				return ["U", "M", "V", "I", "L"].forEach(function(b) {
					a[b] = L.divIcon({
						className: "metar-icon" + b,
						iconSize: [20, 20]
					})
				}), a
			}(),
			heliportIcon: L.divIcon({
				className: "heliport-icon",
				iconSize: [20, 20]
			}),
			renderPopup: function(a, b) {
				var c, d = b.flight_category || null;
				return c = "<b>" + a + "</b>" + (d ? '&nbsp;<span class="adtype' + d + '"></span>' : "") + (b.diff ? "<small>" + this.howOld(b.diff) + "</small>" : "") + "<br/>" + (b.name ? b.name + "<br/>" : "") + (d ? this.wx2string(b) : "")
			},
			display: function(a, b) {
				return b.icao = a, L.marker([b.lat, b.lon], {
					icon: b.heli ? this.heliportIcon : this.icons[b.flight_category || "U"]
				})
			}
		}), W.PoiStation = W.Poi.extend({
			ident: "stations",
			type2type: {
				madis: "other station",
				ad: "airport",
				wmo: "wmo station"
			},
			download: function() {
				W.Poi.download.call(this)
			},
			renderPopup: function(a, b) {
				return "<small>" + this.type2type[b.type] + ": " + this.howOld(b.diff) + "</small><br />" + b.name + "<br />" + this.wx2string(b)
			},
			click: function(a, b) {
				b.id = a, g.emit("rqstOpen", "station", b)
			}
		}), m.wind = W.PoiStation.instance({
			overlay: e.wind,
			ovrIdent: "wind",
			trans: "POI_WIND",
			icon: "",
			display: function(a, b) {
				if ("number" != typeof b.wind) return null;
				var c = this.wx2html(b);
				return L.marker([b.lat, b.lon], {
					icon: L.divIcon({
						className: "weather-icon",
						html: c
					})
				})
			}
		}), m.temp = W.PoiStation.instance({
			overlay: e.temp,
			ovrIdent: "temp",
			trans: "POI_TEMP",
			icon: "",
			display: function(a, b) {
				if ("number" != typeof b.temp) return null;
				var c = this.wx2html(273.15 + b.temp);
				return L.marker([b.lat, b.lon], {
					icon: L.divIcon({
						className: "weather-icon",
						html: c
					})
				})
			}
		}), m.cams = W.Poi.instance({
			ident: "cams",
			trans: "POI_CAMS",
			icon: "l",
			mapIcon: L.divIcon({
				className: "webcam-icon",
				html: "l"
			}),
			popupOffset: [0, -15],
			renderPopup: function(a, b) {
				return '<small>webcams.travel</small><img src="' + b.img + '"><div>' + this.howOld(b.diff) + "</div>"
			},
			display: function(a, b) {
				return L.marker([b.lat, b.lon], {
					icon: this.mapIcon
				})
			}
		}), m.cities = W.Poi.instance({
			ident: "cities",
			trans: "POI_FCST",
			icon: "&",
			_init: function() {
				W.Poi._init.call(this), g.on("maps-paramsChanged", a.debounce(this.paramsChange.bind(this), 800))
			},
			download: function() {
				var a = this;
				i.createFun(function(b) {
					a.interpolate = b.bind(i), a.ovrIdent = c.params.overlay, a.overlay = e[c.params.overlay], W.Poi.download.call(a)
				})
			},
			paramsChange: function() {
				this.isActive && (this.delete(), this.download())
			},
			mixinFavs: function(a) {
				var b = h.getAll();
				for (var c in b) a[c] = b[c];
				return a
			},
			render: function(a) {
				var b, c, e, f;
				a = this.mixinFavs(a);
				for (b in a)
					if (f = a[b], e = this.getHtml(f), b in this.markers) {
						if (!e) {
							this.deleteMarker(b);
							continue
						}
						c = this.markers[b], c._icon && (c._icon.innerHTML = e)
					} else c = L.marker([f.lat, f.lon], {
						icon: L.divIcon({
							className: "weather-icon weather-icon-noamin",
							html: e
						})
					}), this.markers[b] = c, c.poi_id = b, c.on("click", this.onclick.bind(this)).addTo(d)
			},
			getHtml: function(b) {
				var c, d = this.interpolate(b);
				if (!d) return null;
				if ("wind" === this.ovrIdent) c = a.wind2obj(d);
				else {
					if ("rain" === this.ovrIdent && d[0] < .1) return null;
					c = d[0]
				}
				return this.wx2html(c)
			}
		}), m.pgspots = W.ClusterPoi.instance({
			ident: "pgspots",
			icon: "&#xe009;",
			trans: "POI_PG",
			renderPopup: function(b, c) {
				var d = [];
				a.each(c.orientations, function(a, b) {
					+a && (b = b && b.toUpperCase(), d.push(+a > 1 ? "<b>" + b + "</b>" : b))
				});
				var e = ["paragliding", "hanggliding", "thermals", "soaring", "winch"].filter(function(a) {
						return +c[a]
					}).join(", "),
					f = "<p><small>Courtesy of paraglidingearth.com</small></p><b>" + c.name + "</b><p>" + [c.area, c.countrycode].join(", ") + "</p><p>Elevation: " + c.takeoff_altitude + "m (" + Math.floor(3.28 * c.takeoff_altitude) + "ft)</p>" + (d.length ? "<p>Directions: " + d.join(", ") + "</p>" : "") + (e ? "<p>Activities: " + e + "</p>" : "") + (c.takeoff_description ? "<p>Takeoff: " + c.takeoff_description + "</p>" : "") + "<p><small>Click for forecast and link to spot detail</small></p>";
				return f
			},
			handleClick: function(a, b) {
				g.emit("rqstOpen", "detail", {
					lat: b.lat,
					lon: b.lng,
					source: "poi-icon",
					type: "pgspots",
					link: b.pge_link,
					name: b.name
				})
			}
		});
		var n = "empty";
		return g.on("redrawFinished", a.debounce(l, 800)), g.on("pois", j), g.on("metricChanged", k), j(c.pois), m
	}), /*! */
	W.define("Poi", ["http", "rootScope", "maps", "broadcast", "Class", "plugins", "trans", "utils", "overlays"], function(a, b, c, d, e, f, g, h, i) {
		var j = e.extend({
			minZoom: 5,
			popupOffset: [20, -15],
			_init: function() {
				this.markers = {}, this.task = null, this.prevZoom = 0, this.isActive = !1
			},
			activate: function() {
				this.isActive = !0, this.download()
			},
			deactivate: function() {
				this.isActive = !1, this.cancel(), this.delete()
			},
			download: function() {
				if (this.ident) {
					var c = this,
						d = b.map;
					return this.cancelRqstd = !1, d.zoom < this.minZoom ? void c.delete() : void(this.task = a.get("node/" + [c.ident, d.zoom, d.north.toFixed(2), d.east.toFixed(2), d.south.toFixed(2), d.west.toFixed(2)].join("/")).then(function(a) {
						c.cancelRqstd || (c.data = a.data, this.prevZoom !== d.zoom && (c.deleteNonVisible.call(c, c.data), this.prevZoom = d.zoom), c.render.call(c, c.data))
					}))
				}
			},
			deleteNonVisible: function(a) {
				for (var b in this.markers) b in a || this.deleteMarker(b)
			},
			deleteMarker: function(a) {
				c.removeLayer(this.markers[a]), delete this.markers[a]
			},
			render: function(a) {
				var b, d;
				for (b in a) b in this.markers || (d = this.display(b, a[b])) && (this.markers[b] = d, d.poi_id = b, d.on("mouseover", this.onmouse.bind(this)).on("click", this.onclick.bind(this)).addTo(c))
			},
			onclick: function(a) {
				var b = a && a.target || {},
					c = b.poi_id,
					d = this.data[c];
				d && this.click(c, d)
			},
			renderPopup: function() {},
			click: function(a, b) {
				var c = b.icao ? "ad" : "detail";
				d.emit("rqstOpen", c, {
					lat: b.lat,
					lon: b.lon,
					icao: b.icao,
					source: "poi-icon"
				})
			},
			onmouse: function(a) {
				var b = a && a.target || {},
					c = b.poi_id,
					d = this.data[c];
				if (d) {
					var e = this.renderPopup(c, d);
					e && b.bindPopup(e, {
						className: this.ident + "-popup",
						offset: this.popupOffset,
						closeButton: !1,
						minWidth: 120,
						autoPan: !1
					}).on("mouseout", b.closePopup).openPopup()
				}
			},
			delete: function() {
				for (var a in this.markers) c.removeLayer(this.markers[a]);
				this.markers = {}
			},
			cancel: function() {
				this.task && "function" == typeof this.task.cancel && this.task.cancel(), this.cancelRqstd = !0
			},
			howOld: function(a) {
				return a < 60 ? h.template(g.METAR_MIN_AGO, {
					DURATION: a
				}) : h.template(g.METAR_HOURS_AGO, {
					DURATION: Math.floor(a / 60)
				})
			},
			wx2html: function(a) {
				var b;
				return "wind" === this.ovrIdent ? (b = '<span style="background-color:' + this.overlay.c.colorDark(a.wind, 100) + ';">', "number" == typeof + a.dir && a.dir <= 360 && null != a.dir && a.wind > 0 && (b += '<div class="iconfont" style="transform: rotate(' + a.dir + "deg); -webkit-transform:rotate(" + a.dir + 'deg);">"</div>'), b += this.overlay.convertValue(a.wind, " ") + ("number" == typeof a.gust ? ", g:" + i.wind.convertNumber(a.gust) : "") + "</span>") : /clouds/.test(this.ovrIdent) ? b = '<span style="background-color:' + this.overlay.c.colorDark(a, 100) + ';">' + parseInt(a) + "%</span>" : "number" == typeof a && (b = '<span style="background-color:' + this.overlay.c.colorDark(a, 100) + ';">' + this.overlay.convertValue(a, " ") + "</span>"), b
			},
			wx2string: function(a) {
				var b = "<b>" + ("number" == typeof + a.dir && a.wind > 0 && a.dir <= 360 ? a.dir + "° / " : "") + ("VAR" === a.dir ? g.METAR_VAR + " " : "") + ("number" == typeof a.wind ? i.wind.convertValue(a.wind) : "") + ("number" == typeof a.gust ? ", g:" + i.wind.convertValue(a.gust) : "") + ("number" == typeof a.temp ? ("number" == typeof a.wind ? ", " : "") + i.temp.convertValue(a.temp + 273.15) : "") + "</b>";
				return b
			}
		});
		return W.ClusterPoi = j.extend({
			_init: function() {
				return j._init.call(this), this.cluster = null, this.divIcon = L.divIcon({
					className: "spot-icon",
					html: this.icon
				}), this
			},
			activate: function() {
				var a = f.mcluster,
					b = this;
				a.isLoaded ? this.onactivate() : a.load().then(b.onactivate.bind(b))
			},
			onactivate: function() {
				this.isActive = !0;
				var a = this;
				this.cluster = L.markerClusterGroup({
					polygonOptions: {
						weight: 1,
						color: "#fff",
						opacity: .5
					},
					disableClusteringAtZoom: 11,
					iconCreateFunction: function(b) {
						return L.divIcon({
							className: "spot-cluster",
							html: "<span>" + a.icon + "</span>" + b.getChildCount()
						})
					}
				}), this.download(), c.addLayer(this.cluster)
			},
			onmouse: function(b, c) {
				var d = c && c.target || {},
					e = d.poi_id,
					f = this;
				e && a.get("/node/" + this.ident + "/" + e).then(function(a) {
					if (a.data) {
						if ("click" === b) return void f.handleClick(e, a.data);
						var c = f.renderPopup(e, a.data);
						c && d.bindPopup(c, {
							className: f.ident + "-popup",
							offset: f.popupOffset,
							closeButton: !1,
							minWidth: 200,
							autoPan: !1
						}).on("mouseout", d.closePopup).openPopup()
					}
				})
			},
			display: function(a, b) {
				var c = L.marker([b[0], b[1]], {
					icon: this.divIcon
				});
				return c.poi_id = a, c.on("mouseover", this.onmouse.bind(this, "mouseover")).on("click", this.onmouse.bind(this, "click")), c
			},
			render: function(a) {
				var b, c;
				for (b in a) b in this.markers || (c = this.display(b, a[b]), c && (this.markers[b] = c, this.cluster.addLayer(c)))
			},
			deleteMarker: function(a) {
				this.cluster.removeLayer(this.markers[a]), delete this.markers[a]
			},
			delete: function() {
				this.visible = !1, this.markers = {}, this.cluster && c.removeLayer(this.cluster)
			}
		}), j
	}), /*! */
    // NOTE: 重写地图点击查看详细信息逻辑
    W.define("picker", [], function() {
        return;
    })
	// W.define("picker", ["$", "utils", "broadcast", "maps", "trans", "overlays", "rootScope", "settings", "interpolator"], function(a, b, c, d, e, f, g, h, i) {
	// 	function j() {
	// 		var a = '<div class="popup"></div><div class="popup-content"><span></span><a class="popup-link shy">' + e.D_FCST + '</a><a class="popup-close-button shy">&#xe013;</a></div>' + (G ? "" : '<div class="popup-drag-me">' + e.DRAG_ME + "</div>");
	// 		return L.divIcon({
	// 			className: "popup-wrapper",
	// 			html: a,
	// 			iconSize: [0, 125],
	// 			iconAnchor: [0, 125]
	// 		})
	// 	}

	// 	function k(a) {
	// 		a && a.stopPropagation(), H && (E.classList.remove("moooving"), c.off(F), G = !0, d.removeLayer(H), H = null)
	// 	}

	// 	function l(a) {
	// 		var b = 60,
	// 			c = a.containerPoint.x,
	// 			d = a.containerPoint.y,
	// 			e = a.latlng.lat,
	// 			f = a.latlng.lng;
	// 		d < b || d > g.map.height - b || c < b || c > g.map.width - b || m(e, f)
	// 	}

	// 	function m(a, b, c) {
	// 		C = h.get("latlon"), H ? r(a, b, c) : n(a, b, c)
	// 	}

	// 	function n(b, e, f) {
	// 		i.createFun(function(g) {
	// 			I = g.bind(i), H = L.marker([b, e], {
	// 				icon: j(),
	// 				draggable: !0
	// 			}).on("dragstart", s).on("drag", u).on("dragend", t).addTo(d), z = a(".popup-drag-me", D) || null, y = a(".popup-content", D), x = a(".popup-link", D), u(), x.onclick = q, a(".popup-close-button", D).onmousedown = k, y.onmousedown = o, F = c.on("redrawFinished", p), f || c.emit("popupOpened", {
	// 				lat: b,
	// 				lon: e,
	// 				source: "picker"
	// 			})
	// 		})
	// 	}

	// 	function o(b) {
	// 		if (b && "coords-to-clipboard" === b.target.id) {
	// 			var c = a("textarea", y);
	// 			c.select();
	// 			try {
	// 				document.execCommand("copy")
	// 			} catch (d) {
	// 				console.error(d)
	// 			}
	// 			b.preventDefault(), b.stopPropagation()
	// 		}
	// 	}

	// 	function p() {
	// 		i.createFun(function(a) {
	// 			I = a.bind(i), u()
	// 		})
	// 	}

	// 	function q(a) {
	// 		var b = H.getLatLng().wrap();
	// 		c.emit("rqstOpen", "detail", {
	// 			lat: b.lat,
	// 			lon: b.lng,
	// 			source: "picker",
	// 			zoom: d.getZoom(),
	// 			x: A,
	// 			y: B
	// 		}), a.stopPropagation()
	// 	}

	// 	function r(a, b, d) {
	// 		H.setLatLng([a, b]), u(), d || c.emit("popupMoved", {
	// 			source: "picker",
	// 			lat: a,
	// 			lon: b
	// 		})
	// 	}

	// 	function s() {
	// 		G || (z.style.opacity = 0, z.style.visibility = "hidden", h.set("wasDragged", !0), G = !0), E.classList.add("moooving")
	// 	}

	// 	function t() {
	// 		if (H) {
	// 			var a = H.getLatLng().wrap();
	// 			E.classList.remove("moooving"), c.emit("popupMoved", {
	// 				source: "picker",
	// 				lat: a.lat,
	// 				lon: a.lng
	// 			})
	// 		}
	// 	}

	// 	function u() {
	// 		if (H) {
	// 			var a = H.getLatLng().wrap(),
	// 				b = I(a);
	// 			null == b ? k() : Array.isArray(b) ? (y.classList.remove("p-empty"), y.firstChild.outerHTML = w(b, a)) : (y.classList.add("p-empty"), y.firstChild.outerHTML = "<span></span>")
	// 		}
	// 	}

	// 	function v(a) {
	// 		var c = b.DD2DMS(a.lat, a.lng);
	// 		return '<b id="coords-to-clipboard" data-tooltip="' + e.COPY_TO_C + '">' + c + "</b><textarea>" + c + "</textarea>"
	// 	}

	// 	function w(a, c) {
	// 		var d, h = "",
	// 			i = g.params.overlay,
	// 			j = a[0],
	// 			k = f[i];
	// 		switch (i) {
	// 			case "wind":
	// 			case "currents":
	// 				d = b.wind2obj(a), h = k.getName() + "<div>" + d.dir + "° / " + k.convertValue(d.wind) + "</div>";
	// 				break;
	// 			case "waves":
	// 			case "swell":
	// 			case "swell1":
	// 			case "swell2":
	// 			case "swell3":
	// 			case "wwaves":
	// 				d = b.wave2obj(a), h = k.getName() + "<div>" + d.dir + "° / " + k.convertValue(d.size) + "</div>" + e.PERIOD + " " + Math.round(d.period) + " s.<br>";
	// 				break;
	// 			case "swellperiod":
	// 				d = b.wave2obj(a), h = k.getName() + "<div>" + k.convertValue(d.period) + "</div>";
	// 				break;
	// 			case "cape":
	// 				h = e.THUNDER + " <br />(CAPE Index)<div>" + k.convertValue(j) + "</div>";
	// 				break;
	// 			case "cbase":
	// 				j < 1e4 && (h = e.CLOUD_ALT + "<div>" + k.convertValue(j) + "</div>");
	// 				break;
	// 			case "clouds":
	// 			case "lclouds":
	// 			case "hclouds":
	// 			case "mclouds":
	// 				h = k.getName() + "<div>" + Math.floor(j) + "%</div>" + (a[1] > .3 ? f.rain.convertValue(a[1]) + "<br>" : "");
	// 				break;
	// 			case "sst":
	// 				h = k.getName() + "<div>" + k.convertValue(a[2]) + "</div>";
	// 				break;
	// 			default:
	// 				k.getName() && (h = k.getName() + "<div>" + k.convertValue(j) + "</div>")
	// 		}
	// 		return C && c && (h += v(c)), "<span>" + h + "</span>"
	// 	}
	// 	var x, y, z, A, B, C, D = a("#map_container"),
	// 		E = document.body,
	// 		F = null,
	// 		G = h.get("wasDragged"),
	// 		H = null,
	// 		I = null;
	// 	return c.on("closePopup", k), c.on("mapsPopupRequested", m), d.on("singleclick", l), {
	// 		createHTML: w
	// 	}
	// }), /*! */
	W.define("favs", ["http", "storage", "broadcast", "maps", "utils"], function(a, b, c, d, e) {
		W.Favs = W.Class.extend({
			ident: null,
			key: function(a) {
				return "string" == typeof a.icao && a.icao ? a.icao : parseFloat(a.lat).toFixed(3) + "/" + parseFloat(a.lon).toFixed(3)
			},
			add: function(a) {
				this.favs[this.key(a)] = {
					icao: a.icao,
					lat: parseFloat(a.lat),
					lon: parseFloat(a.lon),
					name: a.name,
					type: a.type || null,
					timestamp: Date.now(),
					counter: 1
				}, this.onchange(), this.save()
			},
			isFav: function(a) {
				return "object" == typeof this.favs[this.key(a)]
			},
			save: function() {
				this.lastModified = Date.now(), b.put(this.ident, this.favs), b.put(this.ident + "_ts", this.lastModified)
			},
			load: function() {
				this.favs = b.get(this.ident) || {}
			},
			onchange: function() {},
			rename: function(a, b) {
				var c = this.favs[a];
				c && (c.name = c.title = b, c.timestamp = Date.now()), this.onchange(), this.save()
			},
			remove: function(a) {
				var b = this.key(a);
				this.favs[b] && delete this.favs[b], this.onchange(), this.save()
			},
			getAll: function() {
				return this.favs
			},
			hit: function(a) {
				var b = this.favs[this.key(a)];
				b && (b.counter ? b.counter++ : b.counter = 1, b.timestamp = Date.now(), this.save())
			},
			sortFavs: function(a, b, c) {
				var d = this,
					e = Object.keys(this.favs);
				if (b = b || "counter", a) {
					var f = new RegExp("(?: |^)" + a, "i");
					e = e.filter(function(a) {
						return f.test(d.favs[a].name) || f.test(d.favs[a].icao) || f.test(d.favs[a].query)
					})
				}
				return c && (e = e.filter(function(a) {
					return c.indexOf(a) < 0
				})), e.sort(function(a, c) {
					return d.favs[c][b] - d.favs[a][b]
				})
			},
			get: function(a, b, c, d) {
				for (var e, f, g = [], h = this.sortFavs(b, c, d ? d.map(function(a) {
						return a.key
					}) : null), i = 0; i < Math.min(a, h.length); i++) f = h[i], e = this.favs[f], e.key = f, e.title || (e.title = e.name), e.type || (e.type = "fav"), g[i] = e;
				return g
			}
		});
		var f = W.Favs.instance({
			ident: "favs",
			_init: function() {
				this.load(), this.debouncedSave = e.debounce(this.save2cloud.bind(this), 3e3), c.on("detailOpened", this.hit.bind(this)), c.on("userLoggedIn", this.loadAndMerge.bind(this))
			},
			checkAndStore: function(a, b) {
				"object" == typeof b && b.lat && b.lon && (this.favs[a] = b)
			},
			loadAndMerge: function() {
				var b, d = this;
				a.get("/users/favs").then(function(a) {
					a && a.data && "object" == typeof a.data && (e.each(a.data, function(a, c) {
						c in d.favs ? (b = d.favs[c], b.timestamp && a.timestamp && a.timestamp > b.timestamp && d.checkAndStore.call(d, c, a)) : d.checkAndStore.call(d, c, a)
					}), d.save(), c.emit("favsUpdated"))
				}).catch(function(a) {
					c.emit("logEvent", "Unable to lad and merge favs:", a)
				})
			},
			save2cloud: function() {
				a.post("/users/favs", {
					data: this.favs,
					lastModified: this.lastModified
				})
			},
			onchange: function() {
				this.debouncedSave()
			}
		});
		return f
	});