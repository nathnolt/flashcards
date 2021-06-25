<script>
import { get as storage_get, set as storage_set } from 'idb-keyval'
import { hglobal } from './global.js'

// 1. load other components
import Create from './Create.svelte'
import Home from './Home.svelte'
import Set from './Set.svelte'
import Quiz from './Quiz.svelte'

let pageEl

let currentPage

// My Global State, passed through an 's' named prop
const state = {
	// 1. page related.
	comps: {
		Create,
		Home,
		Set,
		Quiz,
	},
	kbd: {},
	pageName: null,
	pageSettings: {
		Create: {
			mode: 'new', // either 'new' or 'edit'
			from: 'Home',
		},
		Quiz: {
			settings: null,
		}
	},
	
	// 2. data related
	flashcardSets: [],
	curSetIndex: -1,
	storageErrors: null,
	
	// 3. functions
	changePage(pageName) {
		console.log('changing page to ' + pageName)
		state.pageName = pageName
		currentPage = state.comps[pageName]
	},
}

hglobal.state = state

state.pageName = 'Home'
currentPage = state.comps[state.pageName]


</script>

<main>
<svelte:component s={state} this={currentPage}/>
{#if state.storageErrors != null}
	<p>IndexedDB storage failed: {state.storageErrors}</p>
{/if}
</main>

<style>
</style>