// ==UserScript==
// @name Repl.it Dark Theme
// @namespace https://repl.it/
// @version 2.4.19
// @description Custom Repl.it dark themes
// @author mat
// @match http*://*.repl.it/*
// @grant https?://repl.it/*
// @connect https?://repl.it/*
// @connect https?://widget.canny.io/*
// @grant https?://widget.canny.io/*
// @match https*://widget.canny.io/*
// @run-at document-start
// @homepageURL https://darktheme.matdoes.dev
// @downloadURL https://darktheme.matdoes.dev<%- url %>
// @updateURL https://darktheme.matdoes.dev<%- url %>
// ==/UserScript==

var loadDarktheme = (function() {
	if (document.getElementById('dark-theme')) return
	var head, style, css, darkThemeScripts;
	head = document.getElementsByTagName('head')[0];
	style = document.createElement('style');
	style.type = 'text/css';
	head = document.getElementsByTagName('head')[0];
	darkThemeScripts = document.createElement('script');
	style.type = 'text/css';
	style.id = 'dark-theme';
	css = `<%- css %>`;
	style.innerHTML = css;
	if (head) {
		head.appendChild(style);
		console.log('Loaded @mat1\'s dark theme 👌')

		const observer = new MutationObserver((e) => {
			for (const record of e) {
				if (record.removedNodes.length) {
					for (const node of record.removedNodes) {
						if (node.id == 'dark-theme')
							loadDarktheme()
					}
				}
			}
		});
		observer.observe(style.parentElement, {
			childList: true
		})

	} else {
			console.log('head element not found')
			document.addEventListener('DOMContentLoaded', loadDarktheme)
	}

});

loadDarktheme()
