// application specific function stuff
import { get as storage_get, set as storage_set } from 'idb-keyval'


// Svelte doesn't work well with updating DOM based on object stuff, which is what I need, so I use this instead to do it manually.
// it's kind of like computed but with a manual way of updating, because svelte computed stuff suffers from the same fate.
const reactive = {}
export function declare(name, fn) {reactive[name] = fn}
export function recompute(name, val) {reactive[name](val)}


export function storeAllSetsIntoBrowserStorage(state) {
	return new Promise(function(resolve, reject) {
		storage_set('flashcardSets', state.flashcardSets).then(function() {
			resolve()
		}).catch(function(err) {
			state.storageErrors = err
			resolve()
		})
	})
}

export function getAllSetsFromBrowserStorage(state, cb) {
	storage_get('flashcardSets').then(function getSets(value) {
		if(value == undefined || value.length == 0) {
			addExampleSet(state)
		} else {
			state.flashcardSets = value
		}
		cb()
	})
}

function addExampleSet(state) {
	const exampleSet = {
		name: 'Example set',
		settings: {
			icase: true,
			iwhitespace: true,
			ipunctuation: true,
		},
		questions: [
			{q: 'How many notes are there in 1 octave', a: '12'}, 
			{q: 'How many keys does a full size piano have', a: '88'}, 
			{q: 'Which notes does a major C chord contain (no inversions)', a: 'C E G'}
		],
	}
	
	state.flashcardSets.push(exampleSet)
	storeAllSetsIntoBrowserStorage(state)
}



export function removeAllSets(e) {
	const state = this
	state.flashcardSets = []
	storeAllSetsIntoBrowserStorage(state)
	recompute('flashcardSets')
	hideDialog.call(state, e)
}

export function dialogClick(e) {
	const target = e.target
	const dialogMainEl = target.closest('.dialog-main')
	if(dialogMainEl == null) {
		hideDialog.call(this, e)
	}
}

export function hideDialog(e) {
	const target = e.target
	const state = this
	const dialogEl = target.closest('dialog')
	const dialogName = dialogEl.dataset.name
	dialogEl.close()
	state.dialog[dialogName].show = false
	state.dialog.prevFocusEl.focus()
}


export function registerServiceWorker(appState) {
	if ('serviceWorker' in navigator) {
		navigator.serviceWorker.register('sw.js')
		.then(function (reg) {
			
			reg.addEventListener('updatefound', function () {
				const installingWorker = reg.installing
				// console.log('state: ' + installingWorker.state)
				
				installingWorker.onstatechange = function workerInstallStateChange() {
					// console.log('state: ' + installingWorker.state)
					if(installingWorker.state == 'activated') {
						appState.showUpdateButton = true
						recompute('showUpdateButton')
					}
				}
				
			})
		})
	}
}