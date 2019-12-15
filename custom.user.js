// ==UserScript==
// @name Repl.it Dark Theme
// @namespace https://repl.it/
// @version 2.4.9
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
	head.appendChild(style);
	console.log('Loaded @mat1\'s dark theme 👌')
});

try {
	loadDarktheme()
} catch(e) {
	window.addEventListener('load', loadDarktheme, false); // if loading failed, wait until the page fully loads and try again
}