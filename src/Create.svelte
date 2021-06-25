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
	<label><strong>Name: </strong><input bind:this={setNameEl} bind:value={set.name} placeholder="Music questions"></label>

	<SetSettings settings={set.settings}/>

	<div bind:this={cardsEl} class="cards">
	{#each set.questions as question, index}
		<div class="card" data-index={index}>
			<label class="question">
				<strong>Question:</strong>
				<input bind:value={question.q}>
			</label>
			<label class="answer">
				<strong>Answer:</strong>
				<input bind:value={question.a}>
			</label>
			<button on:click={deleteCard}>❌</button>
		</div>
	{:else}
		<p>No cards yet.</p>
	{/each}
	</div>

	<button on:click={createCard}>Add card</button>
	<button on:click={flashcardsDone}>Flashcards done</button>
</div>

<style>
.card {
	margin: .5rem 0;
}
</style>