<script>
// 1. imports
import SetSettings from './SetSettings.svelte'
import {onMount, tick} from 'svelte'
import {storeAllSetsIntoBrowserStorage} from './functions.js'

// props
export let s

// setup local vars
const pageSettings = s.pageSettings[s.pageName]

let set
if(pageSettings.mode == 'new') {
	set = {
		name: '',
		settings: {
			icase: false,
			iwhitespace: false,
			ipunctuation: false,
		},
		questions: [],
	}
	s.flashcardSets.push(set)
} else
if(pageSettings.mode == 'edit') {
	set = s.flashcardSets[s.curSetIndex]
} else {
	console.warn('no support')
}

let setNameEl
onMount(function createMounted() {
	setNameEl.focus()
})

function createCard() {
	var cardObj = {
		q: '',
		a: '',
	}
	set.questions.push(cardObj)
	set.questions = set.questions
	
	focusLastQuestionInput()
}

function deleteCard(e) {
	var cardEl = e.target.closest('.card')
	var cardIndex = Number(cardEl.dataset.index)
	set.questions.splice(cardIndex, 1)
	set.questions = set.questions
}

let csvTextAreaEl
let csvContent
let showCSVImport = false
async function showImportFromCSV() {
	showCSVImport = true
	await tick()
	csvTextAreaEl.focus()
}
function hideImportFromCSV() {
	showCSVImport = false
}

let csvImportError
function importFromCSV() {
	csvImportError = ''
	if(csvContent == undefined) {
		return
	}
	const lines = csvContent.split('\n')
	
	const regexPossibilities = {
		tab: /\t+/,
		comma: /\,+/,
		semicolon: /\;+/,
	}
	
	let i
	const lengths = {}
	let found = false
	// First go through the lines to check which regex is the correct one for splitting.
	for(i = 0; i < lines.length; i++) {
		const line = lines[i]
		let key
		for(key in regexPossibilities) {
			const regex = regexPossibilities[key]
			if(i == 0) { // yes we need i here.
				lengths[key] = line.split(regex).length
			} else {
				const itemAmount = line.split(regex).length
				if(lengths[key] != itemAmount || itemAmount == 1) {
					delete regexPossibilities[key]
				}
				
				if(Object.keys(regexPossibilities).length == 1) {
					found = true
					break
				}
			}
			if(found == true) {
				break
			}
		}
	}
	
	if(!found) {
		csvImportError = 'No consistent splitting symbol could be found.'
		return
	}
	
	// Get the result regex
	let regex
	let key
	for(key in regexPossibilities) {
		regex = regexPossibilities[key]
	}
	
	// Loop through the input, split it out into an array and push each item into set.questions
	for(i = 0; i < lines.length; i++) {
		const line = lines[i]
		const arr = line.split(regex)
		const question = {q: arr[0], a: arr[1]}
		set.questions.push(question)
	}
	
	set.questions = set.questions
}

let cardsEl
async function focusLastQuestionInput() {
	await tick()
	var lastQuestionInputEl = cardsEl.querySelector('.card:last-child .question input')
	lastQuestionInputEl.focus()
}

function flashcardsDone() {
	cleanupSetContent()
	storeAllSetsIntoBrowserStorage(s)
	s.changePage(pageSettings.from)
}

function cleanupSetContent() {
	// clean up title by trimming
	set.name = set.name.trim()
	
	// clean up questions by removing any empty flash cards and trim the q and a fields
	let i = 0
	while(i < set.questions.length) {
		var question = set.questions[i]
		var trimmedQ = question.q.trim()
		var trimmedA = question.a.trim()
		if(trimmedQ == '' || trimmedA == '') {
			set.questions.splice(i,1)
		} else {
			question.q = trimmedQ
			question.a = trimmedA
			i++
		}
	}
}

</script>

<h1>Create</h1>

<div class="plr">
	<label class="block mb">
		<strong>Name: </strong><input bind:this={setNameEl} bind:value={set.name} placeholder="Math Questions">
	</label>

	<SetSettings settings={set.settings}/>

	<div bind:this={cardsEl} class="cards">
	{#each set.questions as question, index}
		<div class="card" data-index={index}>
			<label class="question">
				<strong>Question:</strong>
				<input bind:value={question.q} placeholder="What is 6 * 7">
			</label>
			<label class="answer">
				<strong>Answer:</strong>
				<input bind:value={question.a} placeholder="42">
			</label>
			<button on:click={deleteCard}>❌</button>
		</div>
	{:else}
		<p>No cards yet.</p>
	{/each}
	</div>

	<div class="button-row">
		<button on:click={createCard}>Add card</button>
		<button on:click={showImportFromCSV}>Import Cards from CSV data</button>
		<button on:click={flashcardsDone}>Set done</button>
	</div>
	
	{#if showCSVImport}
		<div class="mt">
			<textarea bind:this={csvTextAreaEl} cols="60" rows="10" bind:value={csvContent}></textarea>
		</div>
		<div class="button-row">
			<button on:click={importFromCSV}>Import</button>
			<button on:click={hideImportFromCSV}>Hide import menu</button>
		</div>
		{#if csvImportError}
		<div class="mts">
			<strong>{csvImportError}</strong>
		</div>
		{/if}
	{/if}
	
</div>


<style>
.card {
	margin: .5rem 0;
	background: #eeeeee;
	padding: 0 .25rem;
}
.card * {
	margin: .25rem 0;
}

label {
	display: inline-block;
}

</style>