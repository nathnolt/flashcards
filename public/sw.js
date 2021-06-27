const curVersion = 'v1.5'

self.addEventListener('install', e => {
	// we can do this here.
	self.skipWaiting()
	e.waitUntil(
		caches.open(curVersion)
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
	const cachesToKeep = [curVersion]

	e.waitUntil(
	  caches.keys().then(function(keyList) {
	    return Promise.all(keyList.map(function(key) {
	      if (cachesToKeep.indexOf(key) === -1) {
	        return caches.delete(key)
	      }
	    }))
	  })
	)
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