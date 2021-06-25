<script>

// imports
import {shuffleArray, range} from './util.js'
import {tick} from 'svelte'

// props
export let s

// variables
const set = s.flashcardSets[s.curSetIndex]

const settings = s.pageSettings.Quiz.settings

let questionIndexes

let subMode
let questionNumber = -1
let guessInput
let curQuestionIndex

let correct
let totalCorrect = 0
let scoreArr = [
	/*
	{
		i: 0,
		correct: true,
	}
	*/
]

let kbdObj = {
	enter: false,
}

$: question = set.questions[curQuestionIndex]

// start program
prepareQuestions() // prepare the questions
nextQuestion()

function prepareQuestions() {
	questionIndexes = shuffleArray(range(0, set.questions.length))
}

let guessInputEl
async function nextQuestion() {
	questionNumber++
	subMode = 'question'
	if(questionNumber >= questionIndexes.length) {
		endQuiz()
	} else {
		curQuestionIndex = questionIndexes[questionNumber]
	}
	await tick()
	guessInputEl.focus()
}


function endQuiz() {
	subMode = 'end'
}

function submitAnswer() {
	// Check if the input matches the correctAnswer, using regex I think.
	var correctAnswer = question.a
	
	if(guessInput == undefined) {
		guessInput = ''
	}
	
	if(settings.icase) {
		correctAnswer = correctAnswer.toLowerCase()
		guessInput = guessInput.toLowerCase()
	}
	
	if(settings.iwhitespace) {
		const regex = /\s+/g
		correctAnswer = correctAnswer.replace(regex, '')
		guessInput = guessInput.replace(regex, '')
	}
	
	if(settings.ipunctuation) {
		const regex = /\,|\.|\?|\!|\:/g
		correctAnswer = correctAnswer.replace(regex, '')
		guessInput = guessInput.replace(regex, '')
	}
	
	correctAnswer = correctAnswer.trim()
	guessInput = guessInput.trim()
	correct = guessInput == correctAnswer
	if(correct) {
		totalCorrect++
	}
	scoreArr.push({i: curQuestionIndex, c: correct, ya: guessInput})
	
	guessInput = ''
	
	revealAnswer()
}

function revealAnswer() {
	subMode = 'reveal'
	focusNextQuestionButton()
}

let nextQuestionButton
async function focusNextQuestionButton() {
	await tick()
	nextQuestionButton.focus()
}

function goHome() {
	s.changePage('Home') 
}
</script>


<h1>Quiz</h1>

{#if subMode == 'question'}

	<p class="question">
		{question.q}
	</p>
	<label>
		<strong>Answer</strong>
		<input bind:this={guessInputEl} bind:value={guessInput}>
	</label>

	<button on:click={submitAnswer}>Submit</button>
	
{:else if subMode == 'reveal'}
	
	{#if correct}
		<h2 class="correct">Yes :)</h2>
	{:else}
		<h2 class="incorrect">No :(</h2>
	{/if}
	<p>{question.q}<p>
	<p><strong>Correct answer: </strong> <span>{question.a}</span></p>
	<p><strong>Your answer: </strong> <span>{guessInput}</span></p>
	
	<div class="mt">
		<button bind:this={nextQuestionButton} on:click={nextQuestion}>Next Question</button>
	</div>
	
{:else if subMode == 'end'}

	<h2>Result: {totalCorrect} / {questionIndexes.length} Correct</h2>
	
	<p>Breakdown</p>
	
	<ul class="breakdown">
		{#each scoreArr as scoreItem}
			<li class="{scoreItem.c ? 'correct' : 'incorrect'}">{(() => {
					const question = set.questions[scoreItem.i]
					const correctStr = scoreItem.c ? 'correct' : 'incorrect'
					return `${question.q} = ${question.a}, your answer: "${scoreItem.ya}" = ${correctStr}`
			})()}</li>
		{/each}
	</ul>
	
	<button on:click={goHome}>Home</button>
	
{:else}

	<p>Something went wrong</p>
	
{/if}

<style>

.correct {
	background: #77ff77;
}
.incorrect {
	background: #ff9999;
}

</style>