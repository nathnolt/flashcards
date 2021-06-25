<script>
import {onMount, tick} from 'svelte'
import {getAllSetsFromBrowserStorage} from './functions.js'

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

var counter = 0
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
	This tool allows you to make flashcards. These are stored locally, using indexedDB. You can export them out and import them again to use them on your phone.
</p>

<h2>Your flashcards:</h2>

<div bind:this={setsEl} class="flashcard-sets plr">
{#each flashcardSets as flashcardSet, index}
	<button on:click="{openSet}" data-index={index} class="flashcard-set">
		<h3>{flashcardSet.name}</h3>
		Questions: {flashcardSet.questions.length}
	</button>
{:else}
	<p>No flashcard sets yet.</p>
{/each}
</div>

<div class="buttons plr">
	<button bind:this={createButtonEl} on:click="{createSet}">Create a flashcard set</button>
</div>


<style>
.buttons {
	margin-top: 1rem;
}

.flashcard-set {
	margin-top: 1rem;
}
.flashcard-set + .flashcard-set {
	margin-left: 1rem;
}
</style>