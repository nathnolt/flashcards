// application specific function stuff
import { get as storage_get, set as storage_set } from 'idb-keyval'

import { hglobal } from './global.js'



export function storeAllSetsIntoBrowserStorage(state) {
	storage_set('flashcardSets', state.flashcardSets).catch(function(err) {
		state.storageErrors = err
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
		name: 'Music questions',
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
}