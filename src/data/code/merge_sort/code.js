function merge(arr, start, mid, end) { // 11
	const leftArr = arr.slice(start, mid + 1); // 12
	const rightArr = arr.slice(mid + 1, end + 1); // 13

	let left = 0; 
	let right = 0; 
	let out = start; // 14

	while (left < leftArr.length && right < rightArr.length) { // 15
		if (leftArr[left] <= rightArr[right]) { // 16
			arr[out] = leftArr[left]; // 17
			left++; // 18
		} else { // 19
			arr[out] = rightArr[right]; // 20
			right++; // 21
		}
		out++; // 22
	}

	while (left < leftArr.length) { // 23
		arr[out] = leftArr[left]; // 24
		left++; // 25
		out++; // 26
	}
}

function sort(arr, start, end) { // 4
	if (start >= end) { // 5
		return; // 6
	}

	const mid = Math.floor((start + end) / 2); // 7

	sort(arr, start, mid); // 8
	sort(arr, mid + 1, end); // 9
	merge(arr, start, mid, end); // 10
}

function mergeSort(arr) { // 2
	sort(arr, 0, arr.length - 1); // 3
}

const arr = [ ]; // 0
mergeSort(arr); // 1
console.log(arr); // 27
