import App from './App.svelte'

const app = new App({
	target: document.body,
})


export default app

if(navigator.serviceWorker) {
	navigator.serviceWorker.register('sw.js')
}
// register service worker