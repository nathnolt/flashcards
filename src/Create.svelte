<script>
import {tick} from 'svelte'
export let s
const pageSettings = s.pageSettings[s.pageName]

let set
if(pageSettings.mode == 'new') {
	set = {
		name: '',
		questions: [],
	}
	s.flashcardSets.push(set)
} else
if(pageSettings.mode == 'edit') {
	debugger
} else {
	console.warn('no support')
}



function addEmptyCard() {
	var cardObj = {
		q: '',
		a: '',
	}
	set.questions.push(cardObj)
	set.questions = set.questions
	
	focusLastQuestionInput()
}

let cardsEl
async function focusLastQuestionInput() {
	await tick()
	var lastQuestionInputEl = cardsEl.querySelector('.card:last-child .question input')
	lastQuestionInputEl.focus()
}

function flashcardsDone() {
	s.changePage('Home')
}
</script>

<h1>Create</h1>

<label><strong>Name: </strong><input bind:value={set.name} placeholder="Music questions"></label>

<div bind:this={cardsEl} class="cards">
{#each set.questions as question}
	<div class="card">
		<div class="question">
			<span>question</span>
			<input bind:value={question.q}>
		</div>
		<div class="answer">
			<span>answer</span>
			<input bind:value={question.a}>
		</div>
	</div>
{:else}
	<p>No cards yet.</p>
{/each}
</div>

<button on:click={addEmptyCard}>Add card</button>
<button on:click={flashcardsDone}>Flashcards done</button>

<style>

</style>