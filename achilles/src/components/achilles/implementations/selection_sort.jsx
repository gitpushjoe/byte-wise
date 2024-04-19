import { ArrayItem, addArrayKey } from './array_helpers';
import Zeno from '../../zeno/zeno.js';
import { Colors } from 'sharc-js/Utils';
import Palette from '../palette';
import Constants from '../constants';
import ArrayStage from './array_stage';

export default class InsertionSort extends ArrayStage {

	constructor(canvas) {
		super(canvas);
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

const arr = [ 4, 3, 9, 8, 6, 1, 7, 5, 2 ]; // 0
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
				$(10);
			});
			return [ 999, undefined ];
		});

		$.arr = this.playground.children[0].findChildrenWhere(sprite => {
			return sprite.name.startsWith("arritem/") && !sprite.name.startsWith("arritem/other");
		}).sort((a, b) => {
			return parseInt(a.name.split("/")[1]) - parseInt(b.name.split("/")[1]);
		}).map(item => {
			return item.details.value;
		});

		this.input = [...$.arr];

		$(0);
		insertionSort(1, $.arr);
		$.log($.arr);
		$(11);

		return zeno.zaps;
	}

	interpolate() {
		super.interpolate();
		if (this.zaps[this.zapIdx].section === 9) {
			const j = this.playground.findDescendant('arrpointer/j');
			const key = this.playground.findDescendant('!arr-key').children[0];
			const idx = this.zaps[this.zapIdx].find("j");
			const anim = {
				duration: 20,
				property: 'centerX',
				from: null,
				to: idx * (Constants.ARR_ITEM_SIZE + Constants.ARR_ITEM_MARGIN),
			};
			j.channels[0].push(anim);
			key.channels[0].push(anim);

		} else if (this.zaps[this.zapIdx].section === 4) {
			const i = this.playground.findDescendant('arrpointer/i');
			const j = this.playground.findDescendant('arrpointer/j');
			if (!i) {
				return;
			}
			const idx = this.zaps[this.zapIdx].find("i");
			i.channels[0].push({
				duration: 15,
				property: 'centerX',
				from: null,
				to: idx * (Constants.ARR_ITEM_SIZE + Constants.ARR_ITEM_MARGIN),
			});
			j.createChannels(1);
			j.distribute([[{
				duration: 15,
				property: 'alpha',
				from: null,
				to: 0,
			}], [{
				duration: 15,
				property: 'centerY',
				from: null,
				to: y => y + 10,
			}]]);
			j.children[0].channels[0].push({
				duration: 15,
				property: 'alpha',
				from: null,
				to: 0,
			});

		} else if (this.zaps[this.zapIdx].section === 10) {
			const key = this.playground.findDescendant('!arr-key').children[0];
			this.playground.findDescendant('!arr-key').bringToFront();
			key.channels[0].push({
				duration: 15,
				property: 'center',
				from: null,
				to: (center) => { return {
					x: center.x + Constants.ARR_ITEM_SIZE + Constants.ARR_ITEM_MARGIN,
					y: 0
				}; },
			});

		} else if (this.zaps[this.zapIdx].section === 7) {
			const jIdx = this.zaps[this.zapIdx].find("j");
			const item = this.playground.findDescendant(`arritem/${jIdx}`);
			const key = this.playground.findDescendant('!arr-key').children[0];
			const shake = [{
				duration: 3,
				property: 'rotation',
				from: null,
				to: -20,
			}, {
				duration: 6,
				property: 'rotation',
				from: null,
				to: 20,
			}, {
				duration: 3,
				property: 'rotation',
				from: null,
				to: 0,
			}];
			const oppositeShake = shake.map(anim => { return { ...anim, to: -anim.to }; });
			item.channels[0].push(shake);
			key.channels[0].push(oppositeShake);

		} else if (this.zaps[this.zapIdx].section === 8) {
			const tempItem = ArrayItem({
				value: this.zaps[this.zapIdx].find("arr")[this.zaps[this.zapIdx].find("j")],
				idx: this.zaps[this.zapIdx].find("j"),
			});
			tempItem.color = Colors.Green;
			this.playground.children[0].addChild(tempItem);
			tempItem.channels[0].push({
				duration: 15,
				property: 'centerX',
				from: null,
				to: x => x + Constants.ARR_ITEM_SIZE + Constants.ARR_ITEM_MARGIN,
			});

		} else if (this.zaps[this.zapIdx].section === 5) {
			const fadeIn = {
				duration: 20,
				property: 'alpha',
				from: 0,
				to: 1,
			};
			const dropIn = {
				duration: 20,
				property: 'centerY',
				from: null,
				to: y => y + 10,
				easing: (t) => 1 - t,
			};
			const pointer = this.addPointer("j", this.zaps[this.zapIdx], Palette.POINTER_HIGHLIGHT);
			pointer.createChannels(1).distribute([[fadeIn], [dropIn]]);
			pointer.children[0].channels[0].push(fadeIn);
		
		} else if (this.zaps[this.zapIdx].section === 6) {
			const arrKey = addArrayKey({
				root: this.playground.children[0].findChild("!arr-key"),
				idx: this.zaps[this.zapIdx].find("i"),
				value: this.zaps[this.zapIdx].find("key"),
				color: Palette.KEY_HIGHLIGHT,
				text: 'key',
			});
			arrKey.createChannels(1).distribute([{
				duration: 20,
				property: 'centerX',
				from: null,
				to: x => x - Constants.ARR_ITEM_SIZE - Constants.ARR_ITEM_MARGIN,
			}, {
				duration: 20,
				property: 'centerY',
				from: null,
				to: -(Constants.ARR_ITEM_SIZE + Constants.ARR_ITEM_MARGIN),
			}]);
			this.arr.findChild("!arr-key").bringToFront();
		}
		
	}

	loadZap(idx) {
		super.loadZap(idx);
		const zap = this.zaps[idx];
		this.setArray(zap.find("arr"));
		if (zap.safeFind("i") !== undefined) {
			this.addPointer("i", zap);
		}
		if (zap.safeFind("j") !== undefined) {
			this.addPointer("j", zap, Palette.POINTER_HIGHLIGHT);
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
			} else if (zap.safeFind("i") === undefined && this.zapIdx > 4) {
				c.color = Colors.Green;
			} else {
				c.color = Colors.White;
			}
		});
	}

}

