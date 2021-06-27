<script>
import { get as storage_get, set as storage_set } from 'idb-keyval'

import {removeAllSets, declare, dialogClick, hideDialog, registerServiceWorker} from './functions.js'

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
	
	dialog: {
		confirmRemoveAll: {
			el: null,
			show: false,
		},
		prevFocusEl: null,
	},
	
	showUpdateButton: false,
	
	// 2. data related
	flashcardSets: [],
	curSetIndex: -1,
	storageErrors: null,
	
	// 3. functions
	changePage(pageName) {
		state.pageName = pageName
		currentPage = state.comps[pageName]
	},
}

registerServiceWorker(state)
let showUpdateButton
declare('showUpdateButton', function() {
	showUpdateButton = state.showUpdateButton
})
function updateVersion() {
	location.reload()
}

state.pageName = 'Home'
currentPage = state.comps[state.pageName]


// reactive vars
let dialogConfirmRemoveAllShow = state.dialog.confirmRemoveAll.show
declare('dialogConfirmRemoveAllShow', function() {
	dialogConfirmRemoveAllShow = state.dialog.confirmRemoveAll.show
})

const dialogClickB = dialogClick.bind(state)

</script>

<main>
<svelte:component s={state} this={currentPage}/>
{#if state.storageErrors != null}
	<p>IndexedDB storage failed: {state.storageErrors}</p>
{/if}
<div class="pb"></div>
<div class="plr">
	<a href="https://github.com/nathnolt/flashcards/" target="_blank" rel="noopener">Source Code</a>
	
	{#if showUpdateButton}
		<button class="mts" on:click={updateVersion}>Update to latest version</button>
	{/if}
</div>
<div class="pb"></div>
</main>

<!-- dialogs -->
{#if dialogConfirmRemoveAllShow}
<dialog bind:this={state.dialog.confirmRemoveAll.el} data-name='confirmRemoveAll' on:click={dialogClickB}><div class="dialog-main">
	<h2>Every set will be gone.</h2>
	<div class="body button-row">
		<button on:click='{removeAllSets.bind(state)}'>No more sets</button>
		<button class="text" on:click='{hideDialog.bind(state)}'>I wanna keep some sets</button>
	</div>
</div></dialog>
{/if}