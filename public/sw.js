self.addEventListener('install', e => {
	console.log('sw installed')
	e.waitUntil(
		caches.open('v2')
		.then(cache => cache.addAll([
			'index.html',
			'build/global.css',
			'build/bundle.js',
			'manifest.json',
			'favicon.png',
			'icon-512x512.png',
			'apple-touch-icon.png'
		]))
	)
})

self.addEventListener('activate', e => {
	console.log('sw activated')
})

self.addEventListener('fetch', e => {
	const url = new URL(e.request.url)
	
	const lastUrlPathNameChar = url.pathname.charAt(url.pathname.length-1)
	if(lastUrlPathNameChar == '/') {
		e.respondWith(caches.match('index.html'))
		return
	}
	
	e.respondWith(
		caches.match(e.request)
		.then(response => response || fetch(e.request))
	)
})