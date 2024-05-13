export default function SourceCode() {
	return [
		{
			language: 'C++',
			code: 
`#include <vector>
#include <iostream>

void selection_sort(std::vector<int>& arr) { // 2
	int n = arr.size(); // 3
	for (int i = 0; i < n - 1; i++) { // 4
		int minimum = i; // 5
		for (int j = i + 1; j < n; j++) { // 6
			if (arr[j] < arr[minimum]) { // 7
				minimum = j; // 8
			}
		}
		if (minimum != i) { // 9
			std::swap(arr[i], arr[minimum]); // 10
		}
	}
}

void print_arr(const std::vector<int>& arr);

int main() {
	std::vector<int> arr = { 4, 3, 9, 8, 6, 1, 7, 5, 2 }; // 0
	selection_sort(arr); // 1
	print_arr(arr); // 11
	return 0;
}

void print_arr(const std::vector<int>& arr) {
	std::cout << "[";
	for (int i = 0; i < arr.size(); i++) {
		std::cout << arr[i];
		if (i != arr.size() - 1) {
			std::cout << ", ";
		}
	}
	std::cout << "]" << std::endl;
}`,
	},
	{
		language: 'Python',
		code:
`def selection_sort(arr): # 2
	n = len(arr) # 3
	for i in range(0, n - 1): # 4
		minimum = i # 5
		for j in range(i + 1, n): # 6
			if arr[j] < arr[minimum]: # 7
				minimum = j # 8
		if minimum != i: # 9
			arr[i], arr[minimum] = arr[minimum], arr[i] # 10

arr = [ 4, 3, 9, 8, 6, 1, 7, 5, 2 ] # 1
selection_sort(arr) # 12
print(arr) # 13`,
	},
	{
		language: 'Javascript',
		code:
`function selectionSort(arr) { // 2
	const n = arr.length; // 3
	for (let i = 0; i < n - 1; i++) { // 4
		let minimum = i; // 5
		for (let j = i + 1; j < n; j++) { // 6
			if (arr[j] < arr[minimum]) { // 7
				minimum = j; // 8
			}
		}
		if (minimum !== i) { // 9
			[ arr[i], arr[minimum] ] = [ arr[minimum], arr[i] ]; // 10
		}
	}
} 

const arr = [ 4, 3, 9, 8, 6, 1, 7, 5, 2 ]; // 0
selectionSort(arr); // 1
console.log(arr); // 11`
	}
	];
}
