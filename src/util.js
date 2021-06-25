// Data based utility stuff.

export function shuffleArray(array) {
	const shuffled = []
	const clone = newArr(array)
	
	let i = 0
	let len = clone.length
	while(len - i) {
		const randomIndex = Math.random() * len - i | 0
		shuffled[i] = clone.splice(randomIndex, 1)[0]
		i++
	}
	return shuffled
}

export function newArr(arrLike) {
	return Array.prototype.slice.call(arrLike, 0)
}

export function range(min, max, step) {
	step = step || 1
	if(max < min) {
		var temp = max
		max = min
		min = temp
	}
	
	
	const rangeArr = []
	let i
	for(i = min; i < max; i+= step) {
		rangeArr.push(i)
	}
	return rangeArr
}