<script>
	export let s
	const pageSettings = s.pageSettings[s.pageName]
	function createSet() {
		s.pageSettings.Create.mode = 'new'
		s.changePage('Create')
	}
</script>

<h1>Flashcards</h1>
<p>
	This tool allows you to make flashcards. These are stored locally, using indexedDB. You can export them out and import them again to use them on your phone.
</p>

<h2>Your flashcards:</h2>
{#each s.flashcardSets as flashcardSet}
	<div class="flashcard-set">
		<h3>{flashcardSet.name}</h3>
		Questions: {flashcardSet.questions.length}
	</div>
{:else}
	<p>No flashcard sets yet.</p>
{/each}

<button on:click="{createSet}">Create a flashcard set</button>

<style>
.flashcard-set {
	background: red;
}
</style>