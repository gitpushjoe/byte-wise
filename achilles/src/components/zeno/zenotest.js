// const Zeno = require('../../zeno');
// const slideshow = require('../../slideshow');
import Zeno from './zeno.js';
import slideshow from './slideshow.js';

// let process = process;

var source = 
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

const arr = [ 4, 3, 9, 8, 6, 1, 7, 5, 2 ]; // 0
mergeSort(arr); // 1
console.log(arr); // 27`;

const sections = source;

		const zeno = new Zeno();
		const $ = zeno.proxy;

		$.arr = [ 4, 3, 9, 8, 6, 1, 7, 5, 2 ];
		$["IGNORE: elemSources"] = [...new Array($.arr.length)].map(() => '');
		$(0);


		const merge = $("merge", 11, ["^arr", "start", "mid", "end", "^IGNORE: elemSources"], () => {
			$.leftArr = $.arr.slice($.start, $.mid + 1);
			$(12);
			$.rightArr = $.arr.slice($.mid + 1, $.end + 1);
			$(13);

			$.left = 0;
			$.right = 0;
			$.out = $.start;
			$(14);

			$.while(() => { return $.left < $.leftArr.length && $.right < $.rightArr.length }, 15, () => {
			$.if(() => { return $.leftArr[$.left] <= $.rightArr[$.right] }, 16, () => {
					$.arr[$.out] = $.leftArr[$.left];
					$(17);
					$["IGNORE: elemSources"][$.out] = 'l';
					$.left++;
					$(18);
					}, 19, () => {
						$.arr[$.out] = $.rightArr[$.right];
						$["IGNORE: elemSources"][$.out] = 'r';
						$(20);
						$.right++;
						$(21);
				});
				$.out++;
				$(22);
			});

			$.while(() => { return $.left < $.leftArr.length }, 23, () => {
				$.arr[$.out] = $.leftArr[$.left];
				$["IGNORE: elemSources"][$.out] = 'l';
				$(24);
				$.left++;
				$(25);
				$.out++;
				$(26);
			});
			
			zeno.set("IGNORE: elemSources", $["IGNORE: elemSources"].map((elem, idx) => idx <= $.end ? 'g' : elem));

			return [ 999, undefined ];

		});

		const sort = $("sort", 4, ["^arr", "start", "end", "^IGNORE: elemSources"], () => {
			if ($.if(() => { return $.start >= $.end }, 5, () => {
				return [ 6, undefined ];
			})) { return; }

			$.mid = Math.floor(($.start + $.end) / 2);
		$(7);

			sort(8, $.arr, $.start, $.mid, $["IGNORE: elemSources"]);
			sort(9, $.arr, $.mid + 1, $.end, $["IGNORE: elemSources"]);
			merge(10, $.arr, $.start, $.mid, $.end, $["IGNORE: elemSources"]);

			return [ 999, undefined ];

		});

		const mergesort = $("mergesort", 2, ["^arr", "^IGNORE: elemSources"], () => {
			sort(3, $.arr, 0, $.arr.length - 1, $["IGNORE: elemSources"]);
			return $.arr;
		});

		mergesort(1, $.arr, $["IGNORE: elemSources"]);

		$.log($.arr);
		$(27);

slideshow(zeno, sections);
