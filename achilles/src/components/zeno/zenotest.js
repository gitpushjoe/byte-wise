// const Zeno = require('../../zeno');
// const slideshow = require('../../slideshow');
import Zeno from './zeno.js';
import slideshow from './slideshow.js';

// let process = process;

var source = 
`function selectionSort(arr) {

	n = arr.length;
	for (i = 0; i < n - 1; i++) {
		smallest = i;
		for (j = i + 1; j < n; j++) {
			if (arr[j] < arr[smallest]) {
				smallest = j;
			}
		}
	}
} 

const arr = [ 4, 3, 9, 8, 6, 1, 7, 5, 2 ]; // 0
insertionSort(arr); // 1
console.log(arr); // 11
`;
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
