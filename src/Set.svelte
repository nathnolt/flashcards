<script>
// imports
import {onMount} from 'svelte'
import {storeAllSetsIntoBrowserStorage} from './functions.js'
import SetSettings from './SetSettings.svelte'

export let s
const set = s.flashcardSets[s.curSetIndex]
const settingsClone = JSON.parse(JSON.stringify(set.settings))

function startQuiz() {
	s.pageSettings.Quiz.settings = settingsClone
	s.changePage('Quiz')
}

function editSet() {
	s.pageSettings.Create.mode = 'edit'
	s.pageSettings.Create.from = 'Set'
	s.changePage('Create')
}

function removeSet() {
	s.flashcardSets.splice(s.curSetIndex, 1)
	storeAllSetsIntoBrowserStorage(s).then(backHome)
}

function backHome() {
	s.changePage('Home')
}

let startButtonEl
onMount(function setMounted() {
	startButtonEl.focus()
})
</script>

<h1>{set.name}</h1>
<div class="plr">
	<div><strong>questions:</strong> {set.questions.length}</div>
	
	<div class="buttons mt">
		<button on:click={editSet}>Edit set</button>
		<button on:click={removeSet}>Remove set</button>
	</div>
</div>

<h2>Quiz menu</h2>

<div class="plr">
	<h3>Quiz settings</h3>
	
	<SetSettings settings={settingsClone}/>
	
	<div class="buttons">
		<button class="mts" bind:this={startButtonEl} on:click={startQuiz}>Start quiz</button>
		<button class="mts" on:click={backHome}>Home</button>
	</div>
</div>

<style>
.buttons button + button{
	margin-left: .5rem;
}
</style>