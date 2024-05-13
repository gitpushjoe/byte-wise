export default function SourceCode() {
	return [
		{
			language: 'C++',
			code: 
`#include <vector>
#include <iostream>

void bubble_sort(std::vector<int>& arr) { // 2
	int n = arr.size(); // 3
	for (int i = n - 1; i > 0; i--) { // 4
		bool swapped = false; // 5
		for (int j = 0; j < i; j++) { // 6
			if (arr[j] > arr[j + 1]) { // 7
				std::swap(arr[j], arr[j + 1]); // 8
				swapped = true; // 9
			}
		}
		if (!swapped) { // 10
			break; // 11
		}
	}
}

void print_arr(const std::vector<int>& arr);

int main() { 
	std::vector<int> arr = { %input% }; // 0
	bubble_sort(arr); // 1
	print_arr(arr); // 12
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
`def bubble_sort(arr): # 2
    n = len(arr) # 3
    for i in range(n - 1, 0, -1): # 4
        swapped = False # 5
        for j in range(i): # 6
            if arr[j] > arr[j+1]: # 7
                arr[j], arr[j+1] = arr[j+1], arr[j] # 8
                swapped = True # 9
        if not swapped: # 10
            break # 11

arr = [ %input% ] # 0
bubble_sort(arr) # 1
print(arr) # 12`,
	},
	{
		language: 'Javascript',
		code:
`function bubbleSort(arr) { // 2
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

const arr = [ %input% ]; // 0
bubbleSort(arr); // 1
console.log(arr); // 12`
	}
	];
}
