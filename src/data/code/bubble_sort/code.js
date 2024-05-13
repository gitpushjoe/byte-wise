function bubbleSort(arr) { // 2
	const n = arr.length; // 3
	for (let i = n - 1; i > 0; i--) { // 4
		let swapped = false; // 5
		for (let j = 0; j < i; j++) { // 6
			if (arr[j] > arr[j + 1]) { // 7
				[ arr[j], arr[j + 1] ] = [ arr[j + 1], arr[j] ]; // 8
				swapped = true; // 9
			}
		}
		if (!swapped) { // 10
			break; // 11
		}
	}
}

const arr = [ ]; // 0
bubbleSort(arr); // 1
console.log(arr); // 12
