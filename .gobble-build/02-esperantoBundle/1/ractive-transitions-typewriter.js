(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
	typeof define === 'function' && define.amd ? define(factory) :
	global.Ractive.transitions.typewriter = factory()
}(this, function () { 'use strict';

	// TODO differentiate between intro and outro
	var ractive_transitions_typewriter = typewriter;

	var PROPS = ["width", "height", "visibility"];function typewriter(t, params) {
		var interval, currentStyle, hide;

		params = t.processParams(params);

		// Find the interval between each character. Default
		// to 4 milliseconds
		interval = params.interval || (params.speed ? 1000 / params.speed : params.duration ? t.node.textContent.length / params.duration : 4);

		currentStyle = t.getStyle(PROPS);

		hide = function (node) {
			var children, i, computedStyle;

			if (node.nodeType === 1) {
				node._style = node.getAttribute("style");
				computedStyle = window.getComputedStyle(node);
				node._display = computedStyle.display;
				node._width = computedStyle.width;
				node._height = computedStyle.height;
			}

			if (node.nodeType === 3) {
				node._hiddenData = "" + node.data;
				node.data = "";

				return;
			}

			children = Array.prototype.slice.call(node.childNodes);
			i = children.length;
			while (i--) {
				hide(children[i]);
			}

			node.style.display = "none";
		};

		if (t.isIntro) {
			hide(t.node);
		}

		setTimeout(function () {
			// make style explicit...
			t.setStyle(currentStyle);

			typewriteNode(t.node, t.isIntro, t.complete, interval, params.jitter !== false);
		}, params.delay || 0);
	}function typewriteNode(node, isIntro, complete, interval, jitter) {
		var children, next, method;

		if (node.nodeType === 1 && isIntro) {
			node.style.display = node._display;
			node.style.width = node._width;
			node.style.height = node._height;
		}

		if (node.nodeType === 3) {
			typewriteTextNode(node, isIntro, complete, interval, jitter);
			return;
		}

		children = Array.prototype.slice.call(node.childNodes);
		method = isIntro ? "shift" : "pop";

		next = function () {
			if (!children.length) {
				if (node.nodeType === 1 && isIntro) {
					if (node._style) {
						node.setAttribute("style", node._style);
					} else {
						node.getAttribute("style");
						node.removeAttribute("style");
					}
				}

				complete();
				return;
			}

			typewriteNode(children[method](), isIntro, next, interval, jitter);
		};

		next();
	}

	function typewriteTextNode(node, isIntro, complete, interval, jitter) {
		var str, len, loop, i, d, targetLen;

		// text node
		str = isIntro ? node._hiddenData : "" + node.data;
		len = str.length;

		if (!len) {
			complete();
			return;
		}

		i = isIntro ? 0 : len;
		d = isIntro ? 1 : -1;
		targetLen = isIntro ? len : 0;

		loop = function () {
			var substr, remaining, match, remainingNonWhitespace, filler, delay;

			substr = str.substr(0, i);
			remaining = str.substring(i);

			match = /^\w+/.exec(remaining);
			remainingNonWhitespace = match ? match[0].length : 0;

			// add some non-breaking whitespace corresponding to the remaining length of the
			// current word (only really works with monospace fonts, but better than nothing)
			filler = new Array(remainingNonWhitespace + 1).join(" ");

			node.data = substr + filler;
			if (i === targetLen) {
				delete node._hiddenData;
				complete();
			} else {
				i += d;

				delay = jitter ? 2 * Math.random() * interval : interval;
				setTimeout(loop, interval);
			}
		};

		loop();
	}

	return ractive_transitions_typewriter;

}));