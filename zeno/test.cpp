#include <iostream>
#include <vector>

int main() {
	std::vector<int*> ints;
	std::vector<std::string*> strings;
	std::vector<void>* vectors[2];
	vectors[0] = &ints;
}
