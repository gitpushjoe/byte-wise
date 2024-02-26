// SECTION 0
const num = 10;

// SECTION 1
function fib(n) {

	// SECTION 2
	if (n <= 1) {
		// SECTION 3
		return n;
	}
	// SECTION 4
	return fib(n - 1) + fib(n - 2);
}

// SECTION 5
const result = fib(num);

console.log(result);
