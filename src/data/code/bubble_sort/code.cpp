#include <vector>
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
	std::vector<int> arr = { 4, 3, 9, 8, 6, 1, 7, 5, 2 }; // 0
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

}

