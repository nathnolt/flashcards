<script>
// 1. load other components

import Create from './Create.svelte'
import Home from './Home.svelte'

let pageEl

let currentPage

// My Global State, passed through an 's' named prop
const state = {
	// 1. page related.
	comps: {
		Create,
		Home
	},
	pageName: null,
	pageSettings: {
		Create: {
			mode: 'new', // either 'new' or 'edit'
		},
	},
	
	// 2. data related
	flashcardSets: [],
	
	// 3. functions
	changePage(pageName) {
		state.pageName = pageName
		currentPage = state.comps[pageName]
	},
}

state.pageName = 'Home'
currentPage = state.comps[state.pageName]
</script>

<main>
<svelte:component s={state} this={currentPage}/>
</main>

<style>
</style>