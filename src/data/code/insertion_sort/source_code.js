export default function SourceCode() {
	return [
		{
			language: 'C++',
			code: 
`#include <vector>
#include <iostream>

void insertion_sort(std::vector<int>& arr) { // 2
	int n = arr.size(); // 3
	for (int i = 1; i < n; i++) { // 4
		int j = i - 1; // 5
		int key = arr[i]; // 6
		while (j >= 0 && arr[j] > key) { // 7
			arr[j + 1] = arr[j]; // 8
			j--; // 9
		}
		arr[j + 1] = key; // 10
	}
}

void print_arr(const std::vector<int>& arr);

int main() { 
	std::vector<int> arr = { %input% }; // 0
	insertion_sort(arr); // 1
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
}
`,
	},
	{
		language: 'Python',
		code:
`def insertion_sort(arr): # 2
    n = len(arr) # 3
    for i in range(1, n): # 4
        j = i - 1 # 5
        key = arr[i] # 6
        while j > 0 and arr[j-1] > key: # 7
            arr[j] = arr[j-1] # 8
            j -= 1 # 9
        arr[j] = key # 10

arr = [ %input% ] # 0
insertion_sort(arr) # 1
print(arr) # 11`,
	},
	{
		language: 'Javascript',
		code:
`function insertionSort(arr) { // 2

	let n = arr.length; // 3
	for (let i = 1; i < n; i++) { // 4
		let j = i - 1; // 5
		let key = arr[i]; // 6
		while (j >= 0 && arr[j] > key) { // 7
			arr[j + 1] = arr[j]; // 8
			j--; // 9
		}
		arr[j + 1] = key; // 10
	}

} 

const arr = [ %input% ]; // 0
insertionSort(arr); // 1
console.log(arr); // 11`
	}
	];
}
