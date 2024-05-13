#include <vector>
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
	std::vector<int> arr = { }; // 0
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
}
