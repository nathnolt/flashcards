<script>
import {onMount, tick} from 'svelte'
import {getAllSetsFromBrowserStorage, storeAllSetsIntoBrowserStorage, recompute, declare} from './functions.js'

export let s
const pageSettings = s.pageSettings[s.pageName]
function createSet() {
	s.pageSettings.Create.mode = 'new'
	s.pageSettings.Create.from = 'Home'
	s.changePage('Create')
}

function openSet(e) {
	var buttonEl = e.target.closest('button')
	s.curSetIndex = Number(buttonEl.dataset.index)
	s.changePage('Set')
}

let flashcardSets = []
declare('flashcardSets', function() {
	flashcardSets = s.flashcardSets
})


let setTextAreaEl
let setData
let showExportImport = false
let importError
async function exportSets() {
	showExportImport = true
	setData = JSON.stringify(s.flashcardSets)
	await tick()
	setTextAreaEl.select()
}

function importSets() {
	let obj
	try {
		obj = JSON.parse(setData)
	} catch(err) {
		importError = 'Import data is invalid: "' + err + '"'
		return
	}
	
	if(obj != undefined) {
		importError = null
	} else if(importError == undefined) {
		importError = 'Import data is invalid'
		return
	}
	
	// check obj for errors
	if(!Array.isArray(obj)) {
		obj = [obj]
	}
	
	// attempt to fix certain fields
	const validSets = []
	let i
	for(i = 0; i < obj.length; i++) {
		const objSet = obj[i]
		
		if(!(objSet instanceof Object)) {
			continue
		}
		
		// fix name
		if(typeof objSet.name != 'string') {
			objSet.name = 'tempSet ' + i
		}
		
		// fix settings
		if(!(objSet.settings instanceof Object)) { objSet.settings = {} }
		if(typeof objSet.settings.icase != 'boolean') { objSet.settings.icase = false }
		if(typeof objSet.settings.iwhitespace != 'boolean') { objSet.settings.iwhitespace = false }
		if(typeof objSet.settings.ipunctuation != 'boolean') { objSet.settings.ipunctuation = false }
		
		const validSettings = {
			icase: objSet.settings.icase,
			iwhitespace: objSet.settings.iwhitespace,
			ipunctuation: objSet.settings.ipunctuation,
		}
		
		
		// Questions
		if(!Array.isArray(objSet.questions)) {
			continue
		}
		
		const validQuestions = []
		let j
		for(j = 0; j < objSet.questions.length; j++) {
			const question = objSet.questions[j]
			if(typeof question.q != 'string') {
				continue
			}
			if(typeof question.a == 'number') {
				question.a = '' + question.a
			}
			if(typeof question.a != 'string') {
				continue
			}
			validQuestions.push({q: question.q, a: question.a})
		}
		
		if(validQuestions.length == 0){
			continue
		}
		
		// set only the fields
		validSets.push({
			name: objSet.name,
			settings: validSettings,
			questions: validQuestions,
		})
	}
	
	if(validSets.length == 0) {
		importError = 'No valid sets inside of importdata'
		return
	}
	
	// Actually put the sets into the setData and call the store into indexedDB function
	s.flashcardSets = s.flashcardSets.concat(validSets)
	storeAllSetsIntoBrowserStorage(s)
	flashcardSets = s.flashcardSets
}

function hideExportImport() {
	showExportImport = false
	importError = null
}

async function showConfirmDialog() {
	s.dialog.confirmRemoveAll.show = true
	recompute('dialogConfirmRemoveAllShow')
	await tick()
	s.dialog.confirmRemoveAll.el.showModal()
}


// Actually do things and Handle loading
let setsEl
let createButtonEl
async function homeLoaded() {
	flashcardSets = s.flashcardSets
	await tick()
	if(s.flashcardSets.length) {
		setsEl.firstElementChild.focus()
	} else {
		createButtonEl.focus()
	}
}

let counter = 0
function loadQueue() {
	counter++
	if(counter == 2) {
		homeLoaded()
	}
}
onMount(loadQueue)
getAllSetsFromBrowserStorage(s, loadQueue)

</script>



<h1>Flashcards</h1>
<p class="plr">
	This tool allows you to make flashcards. These are stored locally, using indexedDB. You can export and import again to use them on multiple devices.
	You can also import from CSV data in the Create subpage.
</p>

<h2>Your flashcards:</h2>

<div class="plr">
	<div bind:this={setsEl} class="flashcard-sets">
	{#each flashcardSets as flashcardSet, index}
		<button on:click="{openSet}" data-index={index} class="flashcard-set">
			<h3>{flashcardSet.name}</h3>
			Questions: {flashcardSet.questions.length}
		</button>
	{:else}
		<p>No flashcard sets yet.</p>
	{/each}
	</div>

	<div class="button-row">
		<button bind:this={createButtonEl} on:click={createSet}>Create a flashcards set</button>
		<button on:click={exportSets}>Export / Import sets</button>
		<button on:click={showConfirmDialog}>Remove all sets</button>
	</div>

	{#if showExportImport}
		<textarea class="mt" cols="60" rows="10" bind:this={setTextAreaEl} bind:value={setData}></textarea>
		{#if importError != undefined}
			<div><strong>{importError}</strong></div>
		{/if}
		<div class="button-row">
			<button on:click={importSets}>Import sets</button>
			<button on:click={hideExportImport}>Hide Export / Import</button>
		</div>
	{/if}
</div>

<style>
.flashcard-sets {
	text-align: center;
}
.flashcard-set {
	margin-top: 1rem;
	margin-left: .5rem;
	margin-right: .5rem;
}

</style>