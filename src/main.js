import App from './App.svelte'

const app = new App({
	target: document.body,
})

export default app

// Register service worker
if(navigator.serviceWorker) {
	navigator.serviceWorker.register('sw.js')
}