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
	
	<div class="button-row">
		<button on:click={editSet}>Edit set</button>
		<button on:click={removeSet}>Remove set</button>
	</div>
</div>

<h2>Quiz menu</h2>

<div class="plr">
	<SetSettings settings={settingsClone}/>
	
	<div class="button-row">
		<button bind:this={startButtonEl} on:click={startQuiz}>Start quiz</button>
		<button on:click={backHome}>Home</button>
	</div>
</div>