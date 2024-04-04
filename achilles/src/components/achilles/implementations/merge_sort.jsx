import { ArrayItem, addArrayKey } from './array_helpers';
import Zeno from '../../zeno/zeno.js';
import { Colors } from 'sharc-js/Utils';
import Palette from '../palette';
import Constants from '../constants';
import ArrayStage from './array_stage';

export default class MergeSort extends ArrayStage {

	constructor(canvas) {
		super(canvas, );
	}

	validate() {
		return true;
	}

	static get code() { // just for reference
		return `
function merge(start, mid, end, arr) { // 10
	
	const leftArr = arr.slice(start, mid + 1); // 11
	const rightArr = arr.slice(mid + 1, end + 1); // 12

	let left = 0; 
	let right = 0; 
	let out = start; // 13

	while (left < leftArr.length && right < rightArr.length) { // 14
		if (leftArr[left] <= rightArr[right]) { // 15
			arr[out] = leftArr[left]; // 16
			left++; // 17
		} else {
			arr[out] = rightArr[right]; // 18
			right++; // 19
		}
		out++;
	}

	while (left < leftArr.length) {
		arr[out] = leftArr[left];
		left++;
		out++;
	}

}

function sort(start, end, arr) { // 4

	if (start >= end) {
		return; // 5
	}

	const mid = Math.floor((start + end) / 2); // 6

	sort(start, mid, arr); // 7
	sort(mid + 1, end, arr); // 8
	merge(start, mid, end, arr); // 9
}

function mergeSort(arr) { // 2
	sort(0, arr.length - 1, arr); // 3
}

const arr = [ 4, 3, 9, 8, 6, 1, 7, 5, 2 ]; // 0
mergeSort(arr); // 1
console.log(arr);
		`;
	}

	execute() {

		const zeno = new Zeno();
		const $ = zeno.proxy;

		$.arr = this.playground.children[0].findChildrenWhere(sprite => {
			return sprite.name.startsWith("arritem/") && !sprite.name.startsWith("arritem/other");
		}).sort((a, b) => {
			return parseInt(a.name.split("/")[1]) - parseInt(b.name.split("/")[1]);
		}).map(item => {
			return item.details.value;
		});
		$["IGNORE: elemSources"] = [...new Array($.arr.length)].map(() => '');
		$(0)		


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
					$["IGNORE: elemSources"][$.out] = 'l';
					$(17);
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
			
			$["IGNORE: elemSources"] = $["IGNORE: elemSources"].map((source, idx) => idx <= $.end ? 'g' : source);

			return [ 999, undefined ];

		});

		const sort = $("sort", 4, ["^arr", "start", "end", "^IGNORE: elemSources"], () => {
			if ($.if(() => { return $.start >= $.end }, 5, () => {
				$["IGNORE: elemSources"] = $["IGNORE: elemSources"].map((source, idx) => idx <= $.end ? 'g' : source);
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

		return zeno.zaps;
	}

	interpolate() {
		super.interpolate();
	}

	updateElementPositionsAndAlpha(zap, root, doInterpolate = false) {
		const arr = zap.find("arr");
		const heights = arr.map(() => 0);
		for (const scope of zap.snapshotData) {
			if (scope.get(Zeno.SCOPE_NAME)?.startsWith('sort') && scope.get('start') !== undefined && scope.get('end') !== undefined) {
				for (let i = scope.get('start'); i <= scope.get('end'); i++) {
					heights[i] += 1;
				}
			}
		}
		for (const i in heights) {
			heights[i] = Math.max(heights[i], 1);
		}
		const maxHeight = Math.max(...heights);
		for (const sprite of root.children) {
			const idx = /arritem\/(\d+)$/.exec(sprite.name)?.[1];
			if (!idx) {
				continue;
			}
			const i = parseInt(idx);
			if (doInterpolate) {
				sprite.channels[0].push({
					duration: 20,
					property: 'centerY',
					from: null,
					to: Constants.ARR_ITEM_SIZE + Constants.ARR_ITEM_MARGIN - heights[i] * (Constants.ARR_ITEM_SIZE + Constants.ARR_ITEM_MARGIN),
				});
				sprite.channels[0].push({
					duration: 20,
					property: 'alpha',
					from: null,
					to: heights[i] === maxHeight ? 1 : 0.5,
				});
			} else {
				sprite.centerY = Constants.ARR_ITEM_SIZE + Constants.ARR_ITEM_MARGIN - heights[i] * (Constants.ARR_ITEM_SIZE + Constants.ARR_ITEM_MARGIN);
				// sprite.alpha = zap.safeFind("out") !== undefined ? (i == zap.safeFind("out") && zap.safeFind("out") <= zap.safeFind("end") ? 1 : 0.5) : (heights[i] === maxHeight) ? 1 : 0.5;
				if (zap.safeFind("out") !== undefined) {
					if (zap.safeFind("out") > zap.safeFind("end")) {
						sprite.color = i >= zap.safeFind("start") && i <= zap.safeFind("end") ? Colors.White : Colors.DarkGray;
					} else {
						sprite.color = ["l", "r"].includes(zap.safeFind("IGNORE: elemSources")?.[i]) ? Colors.White : Colors.DarkGray;
					}
				} else {
					sprite.color = heights[i] === maxHeight ? Colors.White : Colors.DarkGray;
				}
			}
		}
	}

	updateElementColors(zap, root) {
		const colors = zap.safeFind("IGNORE: elemSources");
		const sortedIdx = zap.safeFind("start");
		for (const sprite of root.children) {
			const idx = /arritem\/(\d+)$/.exec(sprite.name)?.[1];
			if (parseInt(idx ?? -1) === -1) {
				continue;
			}
			if (sortedIdx !== undefined && parseInt(idx) < sortedIdx) {
				sprite.strokeColor = Colors.DarkGreen;
				continue;
			}
			if (colors) {
				sprite.strokeColor = colors[idx] === 'l' ? Palette.ELEMENT_LEFT_STROKE : 
					colors[idx] === 'r' ? Palette.ELEMENT_RIGHT_STROKE : 
					colors[idx] === 'g' ? Colors.DarkGreen : Colors.Black;
			}
		}

	}

	loadZap(idx) {
		super.loadZap(idx);
		const zap = this.zaps[idx];
		const arr = zap.find("arr");
		this.setArray(arr);
		this.updateElementPositionsAndAlpha(zap, this.arr);
		this.updateElementColors(zap, this.arr);
		if (zap.safeFind('mid') !== undefined && zap.safeFind('out') === undefined) {
			this.addPointer("mid", zap);
		}
		if (zap.safeFind('out') !== undefined) {
			const outPtr = this.addPointer("out", zap);
			if (zap.safeFind("out") > zap.safeFind("end")) {
				outPtr.centerX = this.arr.findDescendant(`arritem/${zap.safeFind("end")}`).centerX + Constants.ARR_ITEM_SIZE + Constants.ARR_ITEM_MARGIN;
				outPtr.centerY = this.arr.findDescendant(`arritem/${zap.safeFind("end")}`).centerY + Constants.ARR_ITEM_SIZE / 2;
			}
		}
		if (zap.safeFind("leftArr") && zap.section !== 999) {
			for (const child of this.arr.children) {
				const idx = parseInt(/arritem\/(\d+)$/.exec(child.name)?.[1] ?? -1);
				if (idx !== -1 && idx >= zap.safeFind("start") && idx <= zap.safeFind("mid")) {
					const cpy = child.copy();
					cpy.centerY -= Constants.ARR_ITEM_SIZE + Constants.ARR_ITEM_MARGIN;
					cpy.centerX -= (Constants.ARR_ITEM_SIZE + Constants.ARR_ITEM_MARGIN) / 2;
					cpy.strokeColor = Palette.ELEMENT_LEFT_STROKE;
					cpy.color = Palette.ELEMENT_LEFT;
					cpy.name = `arritem/leftArr/${idx - zap.safeFind("start")}`;
					cpy.children[0].scaleY = -1;
					const newIdx = idx - zap.safeFind("start");
					cpy.children[0].text = zap.safeFind("leftArr")[newIdx];
					cpy.alpha = zap.safeFind("left") !== undefined ? newIdx === zap.safeFind("left") ? 1 : 0.5 : 1;
					this.arr.addChild(cpy);
				}
			}
		}
		if (zap.safeFind("rightArr") && zap.section !== 999) {
			for (const child of this.arr.children) {
				const idx = parseInt(/arritem\/(\d+)$/.exec(child.name)?.[1] ?? -1);
				if (idx !== -1 && idx >= zap.safeFind("mid") + 1 && idx <= zap.safeFind("end")) {
					const cpy = child.copy();
					cpy.centerY -= Constants.ARR_ITEM_SIZE + Constants.ARR_ITEM_MARGIN;
					cpy.centerX += (Constants.ARR_ITEM_SIZE + Constants.ARR_ITEM_MARGIN) / 2;
					cpy.strokeColor = Palette.ELEMENT_RIGHT_STROKE;
					cpy.color = Palette.ELEMENT_RIGHT;
					cpy.name = `arritem/rightArr/${idx - zap.safeFind("mid") - 1}`;
					cpy.children[0].scaleY = -1;
					const newIdx = idx - zap.safeFind("mid") - 1;
					cpy.children[0].text = zap.safeFind("rightArr")[newIdx];
					cpy.alpha = zap.safeFind("right") !== undefined ? newIdx === zap.safeFind("right") ? 1 : 0.5 : 1;
					this.arr.addChild(cpy);
				}
			}
		}
		this.arr.findChild("!arr-pointers").sendToBack();
		if (idx === this.zaps.length - 1) {
			this.arr.findChildrenWhere(sprite => sprite.name.startsWith("arritem/")).map(sprite => { sprite.color = Colors.Green; });
		}
	}

}

