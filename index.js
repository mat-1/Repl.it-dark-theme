
/*
api docs:
	/api/themes
	Shows all the themes

	/theme.user.js?querystring
	Shows the tampermonkey js

	/theme.css?querystring
	shows the css

	/preview?querystring
	shows the preview of the theme in repl talk
*/


const express = require('express');
const ejs = require('ejs')
const request = require('request')
const app = express();
const compression = require('compression')
const querystring = require('querystring');

app.use(compression({
	filter: shouldCompress,
	level:9
}))

app.disable('x-powered-by')


function shouldCompress (req, res) {
  if (req.headers['x-no-compression']) {
    // don't compress responses with this request header
    return false
  }

  // fallback to standard filter function
  return compression.filter(req, res)
}

// const defaults = {
// 	text: 'c0c0c0',
// 	text2: 'adadad',
// 	text3: 'a8a8a8',
// 	bg: '232528',
// 	main: '393c42',
// 	bright: 'fffff',
// 	confirm: '63C090',
// 	upvote: '',
// 	fallback: '',
// 	graylogo: 'on',
// 	grayscale: 'false',
// 	rainbow: 'false',
// 	pewdiepie: 'false',
// 	monospace: 'false',
// 	announcements: '232528',
// }


const defaults = { // blue theme
	text: 'c0c0c0',
	text2: 'adadad',
	text3: 'a8a8a8',
	bg: '111c31',
	main: '212e44',
	bright: 'fffff',
	confirm: '63C090',
	upvote: '',
	fallback: '',
	graylogo: 'on',
	grayscale: 'false',
	rainbow: 'false',
	pewdiepie: 'false',
	monospace: 'false',
	announcements: '232528',
	timchen: 'false'
}


function editHtml(html, query='') {
	var html = html.toString()
	return html
		.replace(/src="\/(?!\/)/gi, 'src="https://repl.it/') // make all scripts absolute
		.replace(/href="\/(?!\/)(.{1,}?)(?="| )/gi, 'href="/proxy/$1'+query) // make all links absolute
		.replace(/(?<=<meta property="og:title" content=")(\S+)(?=".+>)/gi, 'Repl Talk Dark Theme Preview') // change opengraph description
		.replace(/(?<=<meta property="og:description" content=")(\S+)(?=".+>)/gi, 'Preview a custom Repl.it dark theme.') // change opengraph title
		// remove unnecessary scripts
		.replace(/<script ([^<]{1,})analytics([^\\]{1,}?)<\/script>/gi, '') // remove tracking scripts
		.replace(/<script ([^<]{1,})recaptcha([^\\]{1,}?)<\/script>/gi, '') // remove recaptcha
		.replace(/<script ([^<]{1,}?)cloudflare([^\\]{1,}?)<\/script>/gi, '') // remove cloudflare stuff
		.replace(/<link ([^<]{1,}?)cloudflare([^>]{1,}?)>/gi, '') // remove cloudflare stuff
		.replace(/<script ([^<]{1,}?)https:\/\/repl.it\/_next([^\\]{1,}?)<\/script>/gi, '') // remove _next stuff
		.replace(/<link ([^<]{1,}?)https:\/\/repl.it\/_next([^>]{1,}?)>/gi, '') // remove _next stuff
		.replace(/<script async=\"\" id=\"__NEXT_PAGE__\/([^<]{1,})<\/script>/gi, '') // remove recaptcha

}

var requests = request.defaults({
	headers: {'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/71.0.3578.98 Safari/537.36'},
	encoding: null
})
requests.get('https://repl.it/talk/all', 
	function(error, response, body) {
		html = editHtml(body)

		global.cached_repltalk = html
		console.log('gotten repl talk')
	}
)
requests.get('https://repl.it/talk/share/Replit-site-wide-dark-theme/6198', 
	function(error, response, body) {
		html = editHtml(body)

		global.cached_repltalk_post = html
		console.log('gotten repl talk post')
	}
)

function generateCss(query, func) {
	const defaultsCopy = JSON.parse(JSON.stringify(defaults))
	var outputQuery = defaultsCopy
	for (const q in query) {
		outputQuery[q] = query[q]
	}
	ejs.renderFile('custom.css', outputQuery, function (err, str) {
		console.log(defaults)
		func(str)
	})
}

app.use('/', express.static(__dirname + '/static'));

app.get('/custom', (req, res) => {
	const defaultsCopy = JSON.parse(JSON.stringify(defaults))
	var query = defaultsCopy
	for (const q in req.query) {
		query[q] = req.query[q]
	}
	if (query.graylogo=='')
		query.graylogo = 'on'
	ejs.renderFile('edit.html', query, function (err, str) {
		res.send(str)
	})
})

const publicThemes = {
	'Blue': 'bg=111c31&main=212e44',
	'Gray': 'bg=232528&main=393c42',
	'Bluer Blue': 'text=c0c0c0&text2=adadad&text3=a8a8a8&bg=10182b&main=0d101e&upvote=&graylogo=on&announcements=0d101e',
	'Solarized Dark': 'text=839496&text2=819090&text3=839496&bg=002b36&main=073642&upvote=586e75&fallback=586e75&announcements=073642&announcements=073642',
	'Black Contrast': 'text=fff&text2=fff&text3=fff&bg=000&main=000&upvote=fff&graylogo=on&announcements=000',
	'Volcano': 'text=ffff64&text2=ffd932&text3=ffd932&bg=2c0400&main=f05b00&upvote=ffe93e&graylogo=on&announcements=f05b00',
	'Actually Bad': 'text=0f0&text2=fff&text3=fff&bg=f00&main=00f&upvote=fff&fallback=ff0&graylogo=off&announcements=00f',
	'Purple Night': 'text=d321b2&text2=900376&text3=611d55&bg=231e22&main=393c42&upvote=f848d8&fallback=ac2493&announcements=393c42',
	'Mint Breeze': 'text=b4f7f4&text2=8ece44&text3=358c07&bg=10da82&main=7cda10&upvote=358c07&announcements=7cda10&fallback=',
	'Monokai': 'text=ffd866&text2=fc9867&text3=ab9df2&bg=2c292d&main=2c292d&upvote=a9dc76&fallback=78dce8&announcements=2c292d',
	'Grayscale (special)': 'grayscale=true',
	'Rainbow [Epilepsy warning] (special)': 'rainbow=true',
	'Timchen (special)': 'timchen=true&text=fff&upvote=fff&main=000&bg=000&announcements=000',
	'Pewdiepie (special)': 'pewdiepie=true&text=fff&upvote=fff&main=000&bg=000&announcements=000',
	'Terminal (special)': 'monospace=true&text=00aa00&text2=00ff00&text3=00aa00&bg=000000&main=111111&upvote=005500&announcements=121212',
}

app.get('/themes', (req, res) => {
	query = {'themes': publicThemes
	}
	ejs.renderFile('themes.html', query, function (err, str) {
		res.send(str)
	})
});

app.get('/themes.json', (req, res) => {
	res.send(publicThemes)
});

app.get('/api/themes', (req, res) => {
	var themesList = []
	let i = 0
	const defaultsCopy = JSON.parse(JSON.stringify(defaults))
	for (const themeName in publicThemes) {
		let parsedThemeData = querystring.parse(publicThemes[themeName])
		var parsedThemeDataWithDefaults = defaultsCopy
		for (const data in parsedThemeData) {
			parsedThemeDataWithDefaults[data] = parsedThemeData[data]
		}
		themesList.push({
			name: themeName,
			queryString: publicThemes[themeName],
			id: i,
			cssUrl: 'https://darktheme.matdoes.dev/theme.css?' + publicThemes[themeName],
			installUrl: 'https://darktheme.matdoes.dev/theme.user.js?' + publicThemes[themeName],
			previewUrl: 'https://darktheme.matdoes.dev/proxy/talk/all?' + publicThemes[themeName],
			themeData: parsedThemeDataWithDefaults
		})
		i++
	}
	res.send(themesList)
});


app.get('/theme.user.js', (req, res) => {
	generateCss(req.query, function(rendered_css) {
		const q = { url: req.url, css: rendered_css }
		ejs.renderFile('custom.user.js', q, function (err, str) {
			res.setHeader('content-type', 'text/javascript')
			res.send(str)
		})
	})
})

app.get('/theme.css', (req, res) => {
	generateCss(req.query, function(rendered_css) {
		res.setHeader('content-type', 'text/css')
		res.send(rendered_css)
	})
})

app.get('/preview', (req, res) => {
	console.log(req.query)
	generateCss(req.query, function(rendered_css) {
		var html = global.cached_repltalk.replace(/<\/head>/gi,`<style>${rendered_css}</style></head>`)
		res.send(html)
	})
})
app.get('/preview-post', (req, res) => {
	generateCss(req.query, function(rendered_css) {
		var html = global.cached_repltalk_post.replace(/<\/head>/gi,`<style>${rendered_css}</style></head>`)
		res.send(html)
	})
})
app.get('/proxy/*', (req, res) => {
	requests.get('https://repl.it/'+req.url.slice(7), 
		function(error, response, body) {
			var qpos = req.url.indexOf('?')
			var querystring
			if (qpos > 0) {
				querystring = req.url.substr(qpos)
			} else {
				querystring = ''
			}
			const contentType = response.headers['content-type']
			if (contentType.startsWith('text/html')) {
				html = editHtml(body, querystring)
				generateCss(req.query, function(rendered_css) {
					html = html.replace(/<\/head>/gi,`<style>${rendered_css}</style></head>`)
					res.send(html)
				})
			} else {
				res.set('Content-Type', contentType);
				res.send(body)
			}
		}
	)
})

app.get('/', (req, res) => {
	let ua = req.get('User-Agent');
	browser = ua.includes('Firefox')?'firefox':'other' // firefox is best browser ;)
	ejs.renderFile('index.html', { browser: browser }, function (err, str) {
		res.send(str)
	})
})
app.listen(3002, () => {
  console.log('server started');
});
