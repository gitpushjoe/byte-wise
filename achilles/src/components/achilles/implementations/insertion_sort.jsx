import { AchillesStage } from '../achilles';
import { addArrayItems, addArrayKey, addArrayPointer } from './array_helpers';
import { NullSprite } from 'sharc-js/Sprites';
import Zeno from '../zeno';
import { Colors } from 'sharc-js/Utils';
import Palette from '../palette';
import Constants from '../constants';

export default class InsertionSort extends AchillesStage {

	constructor(canvas) {
		super(canvas, [ 4, 3, 9, 8, 6, 1, 7, 5, 2 ]);
	}

	initialize(input) {
		this.playground.removeChildren(...this.playground.children);
		this.playground.addChildren(
			new NullSprite({ name: '!arr' })
				.addChildren(
					new NullSprite({ name: '!arr-pointers' }),
					new NullSprite({ name: '!arr-key' }),
			),
		);
		addArrayItems({
			root: this.playground.children[0],
			items: input,
			modifiable: true,
		});
	}

	validate() {
		return true;
	}

	static get code() { // just for reference
		return `
function insertionSort(arr) { // 2
	n = arr.length; // 3
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

let arr = [ 4, 3, 9, 8, 6, 1, 7, 5, 2 ]; // 0
insertionSort(arr); // 1
console.log(arr); // 11
		`;
	}

	execute() {
		const zeno = new Zeno();
		const $ = zeno.proxy;
		const insertionSort = $("insertionSort", 2, ["^arr"], () => {
			$.n = $.arr.length;
			$(3);
			$.for("i", 1, i => i < $.n, i => ++i, 4, () => {
				$.j = $.i - 1;
				$(5);
				$.key = $.arr[$.i];
				$(6);
				$.while(() => $.j >= 0 && $.arr[$.j] > $.key, 7, () => {
					$.arr[$.j + 1] = $.arr[$.j];
					$(8);
					$.j = $.j - 1;
					$(9);
				});
				$.arr[$.j + 1] = $.key;
				console.log($.i, $.arr);
				$(10);
			});
			return [ undefined, 999 ];
		});

		$.arr = this.playground.children[0].children.filter(item => {
			return item.name.startsWith("arritem/");
		}).map(item => {
			return item.details.value;
		});
		$(0);
		insertionSort(1, $.arr);
		$.log($.arr);
		$(11);

		return zeno.zaps;
	}

	loadZap(idx) {
		console.log(`received zap ${idx}`);
		const zap = this.zaps[idx];
		const arr = zap.find("arr");
		this.playground.children[0].removeChildren(...this.playground.children[0].children.filter(c => c.name.startsWith("arritem/")));
		this.playground.children[0].findChild("!arr-pointers").removeChildren(...this.playground.children[0].findChild("!arr-pointers").children);
		this.playground.children[0].findChild("!arr-key").removeChildren(...this.playground.children[0].findChild("!arr-key").children);
		addArrayItems({
			root: this.playground.children[0],
			items: arr,
			modifiable: false,
		});
		if (zap.safeFind("i") !== undefined) {
			addArrayPointer({
				root: this.playground.children[0].findChild("!arr-pointers"),
				idx: zap.find("i"),
				color: Palette.POINTER_DEFAULT,
				text: 'i',
			});
		}
		if (zap.safeFind("j") !== undefined) {
			addArrayPointer({
				root: this.playground.children[0].findChild("!arr-pointers"),
				idx: zap.find("j"),
				color: Palette.POINTER_HIGHLIGHT,
				text: 'j',
			});
		}
		if (zap.safeFind("key") !== undefined && zap.section !== 10) {
			addArrayKey({
				root: this.playground.children[0].findChild("!arr-key"),
				idx: zap.find("j"),
				value: zap.find("key"),
				color: Palette.KEY_HIGHLIGHT,
				yOffset: Constants.ARR_ITEM_SIZE + Constants.ARR_ITEM_MARGIN,
				text: 'key',
			});
		}
		this.playground.children[0].children.forEach((c) => {
			const i = parseInt(c.name.split("/")[1]);
			if (!c.name.startsWith("arritem/")) {
				return;
			}
			if (zap.section === 10 && i === zap.safeFind("j") + 1) {
				c.color = Palette.KEY_DEFAULT;
				c.strokeColor = Palette.KEY_STROKE;
				return;
			}
			if (([8, 9, 10].includes(zap.section) && i === zap.safeFind("j") + 1) ||
				(i === zap.safeFind("i") && zap.safeFind("j") < zap.safeFind("i") - 1)) {
				c.color = Colors.Green;
				return;
			}
			if (i < (zap.safeFind("i")  ?? -1)) {
				c.color = Colors.Green;
			} else if (zap.safeFind("i") === undefined && this.zapIdx > 2) {
				console.log(this.zapIdx, +zap.safeFind("i"));
				c.color = Colors.Green;
			} else {
				c.color = Colors.White;
			}
		});
		super.loadZap(idx);
	}

}

