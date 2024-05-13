export default function SourceCode() {
	return [
		{
			language: 'C++',
			code: 
`#include <vector>
#include <iostream>

void merge(std::vector<int>& arr, int start, int mid, int end) { // 11
	std::vector<int> left_arr(arr.begin() + start, arr.begin() + mid + 1); // 12
	std::vector<int> right_arr(arr.begin() + mid + 1, arr.begin() + end + 1); // 13
	
	int left = 0; 
	int right = 0;
	int out = start; // 14

	while (left < left_arr.size() && right < right_arr.size()) { // 15
		if (left_arr[left] <= right_arr[right]) { // 16
			arr[out] = left_arr[left]; // 17
			left++; // 18
		} else { // 19
			arr[out] = right_arr[right]; // 20
			right++; // 21
		}
		out++; // 22
	}

	while(left < left_arr.size()) { // 23
		arr[out] = left_arr[left]; // 24
		left++; // 25
		out++; // 26
	}
}

void sort(std::vector<int>& arr, int start, int end) { // 4
	if (start >= end) { // 5
		return; // 6
	}

	int mid = (start + end) / 2; // 7

	sort(arr, start, mid); // 8
	sort(arr, mid + 1, end); // 9
	merge(arr, start, mid, end); // 10
}

void merge_sort(std::vector<int>& arr) { // 2
	sort(arr, 0, arr.size() - 1); // 3
}

void print_arr(const std::vector<int>& arr);

int main() {
	std::vector<int> arr = { %input% }; // 0
	merge_sort(arr); // 1
	print_arr(arr); // 27
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
`def merge(arr, start, mid, end): # 11
    left_arr = arr[start:mid+1] # 12
    right_arr = arr[mid+1:end+1] # 13

    left = 0
    right = 0
    out = start # 14

    while left < len(left_arr) and right < len(right_arr): # 15
        if left_arr[left] <= right_arr[right]: # 16
            arr[out] = left_arr[left] # 17
            left += 1 # 18
        else: # 19
            arr[out] = right_arr[right] # 20
            right += 1 # 21
        out += 1 # 22

    while left < len(left_arr): # 23
        arr[out] = left_arr[left] # 24
        left += 1 # 25
        out += 1 # 26

def sort(arr, start, end): # 4
    if start >= end: # 5
        return # 6

    mid = (start + end) // 2 # 7

    sort(arr, start, mid) # 8
    sort(arr, mid+1, end) # 9
    merge(arr, start, mid, end) # 10

def merge_sort(arr): # 2
    sort(arr, 0, len(arr)-1) # 3

arr = [ %input% ] # 0
merge_sort(arr) # 1
print(arr) # 27`,
	},
	{
		language: 'Javascript',
		code:
`function merge(arr, start, mid, end) { // 11
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

const arr = [ %input% ]; // 0
mergeSort(arr); // 1
console.log(arr); // 27`
	}
	];
}
