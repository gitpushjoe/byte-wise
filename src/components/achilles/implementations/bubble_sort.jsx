import { ArrayItem, addArrayKey } from './array_helpers';
import Zeno from '../../zeno/zeno.js';
import { Colors, Easing } from 'sharc-js/Utils';
import Palette from '../palette';
import Constants from '../constants';
import ArrayStage from './array_stage';

export default class BubbleSort extends ArrayStage {

	constructor(canvas) {
		super(canvas);
	}

	validate() {
		return true;
	}

	static get code() { // just for reference
		return `
function bubbleSort(arr) { // 2
	const n = arr.length; // 3
	for (let i = n - 1; i > 0; i--) { // 4
		let swapped = false; // 5
		for (let j = 0; j < i; j++) { // 6
			if (arr[j] > arr[j + 1]) { // 7
				[ arr[j], arr[j + 1] ] = [ arr[j + 1], arr[j] ]; // 8
				swapped = true; // 9
			}
		}
		if (!swapped) { // 10
			break; // 11
		}
	}
}

const arr = [ ]; // 0
bubbleSort(arr); // 1
console.log(arr); // 12
`;
	}

	execute() {
		const zeno = new Zeno();
		const $ = zeno.proxy;

		$.arr = this.getArray();
		$(0);

		const bubbleSort = $("bubbleSort", 2, ["^arr"], () => {
			$.n = $.arr.length;
			$(3);
			if ($.for("i", $.n - 1, i => i > 0, i => --i, 4, i => {
				$.swapped = false;
				$(5);
				$.for("j", 0, j => j < i, j => ++j, 6, j => {
					$.if(() => $.arr[j] > $.arr[j + 1], 7, () => {
						$(7);
						const temp = [ $.arr[j], $.arr[j + 1] ];
						$.arr[j] = temp[1];
						$.arr[j + 1] = temp[0];
						$(8);
						$.swapped = true;
						$(9);
					});
				});
				if ($.if(() => !$.swapped, 10, () => {
					$(11);
					return Zeno.BREAK;
				})) { return Zeno.BREAK; }
			})) { console.log('test'); return [ 999, undefined ]; }
			return [ 999, undefined ];
		});

		bubbleSort(1, $.arr);
		$.log($.arr);
		$(12);

		return zeno.zaps;
	}

	interpolate() {
		super.interpolate();
		// console.log(this.zaps);
		const zap = this.zaps[this.zapIdx];
		const section = zap.section;
		// if (section >= this.zaps.length - 2) {
		// 	this.arr.findChildrenWhere(c => c.name.startsWith("arritem/")).forEach((c) => {
		// 		c.channels[0].push({
		// 			duration: this.stretchTime(15),
		// 			property: 'color',
		// 			from: null,
		// 			to: Colors.Green,
		// 		});
		// 	});
		// }
		switch (section) {
			case 4: {
				const i = zap.safeFind("i");
				if (i === zap.safeFind("n") - 1) {
					this.floatIn(this.addPointer("i", zap));
				} else {
					this.slideHorizontal(this.findArrayPointer("i"), undefined, true);
				}
				const j = this.findArrayPointer("j");
				this.floatOut(j);
				this.arr.findChildrenWhere(c => c.name.startsWith("arritem/")).forEach((c, i) => {
					i -= 1;
					c.channels[0].push({
						duration: this.stretchTime(15),
						property: "color",
						from: null,
						to: i >= zap.safeFind("i") ? Colors.Green : Palette.ELEMENT_DEFAULT,
					});
				});
				break;
			}
			case 5: {
				this.arr.findChildrenWhere(c => c.name.startsWith("arritem/")).forEach((c) => {
					c.channels[0].push({
						duration: this.stretchTime(15),
						property: "strokeColor",
						from: null,
						to: Colors.DarkGreen,
					});
				});
				break;
			}
			case 6: {
				const j = zap.safeFind("j");
				if (j === 0) {
					this.floatIn(this.addPointer("j", zap, Palette.POINTER_HIGHLIGHT));
				} else {
					this.slideHorizontal(this.findArrayPointer("j"));
				}
				break;
			}
			case 7: {
				const jIdx = zap.find("j");
				const item = this.findArrayItem(jIdx);
				const item2 = this.findArrayItem(jIdx + 1);
				const shake = [{
					duration: this.stretchTime(3),
					property: 'rotation',
					from: null,
					to: -20,
				}, {
					duration: this.stretchTime(6),
					property: 'rotation',
					from: null,
					to: 20,
				}, {
					duration: this.stretchTime(3),
					property: 'rotation',
					from: null,
					to: 0,
				}];
				const oppositeShake = shake.map(anim => { return { ...anim, to: -anim.to }; });
				item.channels[0].push(shake);
				item2.channels[0].push(oppositeShake);
				break;
			}
			case 8: {
				const jIdx = zap.find("j");
				const item = this.findArrayItem(jIdx);
				const item2 = this.findArrayItem(jIdx + 1);
				this.swapItems(item, item2);
				console.log(jIdx + 1, zap.safeFind("i"));
				if (jIdx + 1 === zap.safeFind("i")) {
					item.createChannels(3);
					item.channels[3].push({
						duration: this.stretchTime(15),
						property: 'color',
						from: null,
						to: Colors.Green,
					});
				}
				break;
			}
			case 9: {
				this.arr.findChildrenWhere(c => c.name.startsWith("arritem/")).forEach((c) => {
					c.channels[0].push({
						duration: this.stretchTime(15),
						property: 'strokeColor',
						from: null,
						to: Colors.Black,
					});
				});
				break;
			}
			case 11: {
				this.floatOut(this.findArrayPointer("j"));
				break;
			}
			case 999: {
				console.log('test');
				this.floatOut(this.findArrayPointer("i"));
				this.floatOut(this.findArrayPointer("j"));
				this.arr.findChildrenWhere(c => c.name.startsWith("arritem/")).forEach((c) => {
					c.channels[0].push({
						duration: this.stretchTime(15),
						property: 'color',
						from: null,
						to: Colors.Green,
					});
				});
				break;
			}
		}
		// switch (section) {
		// 	case 4: {
		// 		const i = zap.safeFind("i");
		// 		if (i === 0) {
		// 			this.floatIn(this.addPointer("i", zap));
		// 		} else {
		// 			this.slideHorizontal(this.findArrayPointer("i"));
		// 		}
		// 		if (this.arr.findDescendant("arrpointer/minimum")) {
		// 			this.floatOut(this.findArrayPointer("minimum"), undefined, true);
		// 		}
		// 		if (this.arr.findDescendant("arrpointer/j")) {
		// 			this.floatOut(this.findArrayPointer("j"));
		// 		}
		// 		break;
		// 	}
		// 	case 5: {
		// 		const ptr = this.addPointer("minimum", zap, Palette.KEY_DEFAULT, true);
		// 		ptr.centerY += 0;
		// 		ptr.children[0].positionY -= 10;
		// 		this.floatIn(ptr, undefined, true);
		// 		break;
		// 	}
		// 	case 6: {
		// 		const j = zap.safeFind("j");
		// 		if (j === zap.safeFind("i") + 1) {
		// 			this.floatIn(this.addPointer("j", zap, Palette.POINTER_HIGHLIGHT));
		// 		} else {
		// 			this.slideHorizontal(this.findArrayPointer("j"));
		// 		}
		// 		break;
		// 	}
		// 	case 8: {
		// 		for (const child of this.playground.children[0].children) {
		// 			if (!child.name.startsWith("arritem/")) {
		// 				continue;
		// 			}
		// 			if (child.strokeColor.red !== 0) {
		// 				child.channels[0].push({
		// 					duration: this.stretchTime(10),
		// 					property: "strokeColor",
		// 					from: null,
		// 					to: Colors.Black,
		// 				});
		// 				child.createChannels(1).channels[1].push({
		// 					duration: this.stretchTime(10),
		// 					property: "color",
		// 					from: null,
		// 					to: Palette.ELEMENT_DEFAULT,
		// 				});
		// 			} else if (parseInt(child.name.split("/")[1]) === zap.safeFind("minimum")) {
		// 				child.channels[0].push({
		// 					duration: this.stretchTime(10),
		// 					property: "strokeColor",
		// 					from: null,
		// 					to: Palette.KEY_STROKE,
		// 				});
		// 				child.createChannels(1).channels[1].push({
		// 					duration: this.stretchTime(10),
		// 					property: "color",
		// 					from: null,
		// 					to: Palette.KEY_DEFAULT,
		// 				});
		// 			}
		// 		}
		// 		this.slideHorizontal(this.findArrayPointer("minimum"), undefined, undefined, zap.safeFind("j"));
		// 		break;
		// 	}
		// 	case 10: { 
		// 		const item1 = this.findArrayItem(zap.safeFind("i"));
		// 		const item2 = this.findArrayItem(zap.safeFind("minimum"));
		// 		this.swapItems(item1, item2);
		// 		break;
		// 	}
		// }
	}

	loadZap(idx) {
		super.loadZap(idx);
		const zap = this.zaps[idx];
		const section = zap.section;
		console.log(section, this.zapIdx + 1);
		this.setArray(zap.find("arr"));
		if (zap.safeFind("i") !== undefined) {
			this.addPointer("i", zap);
		}
		if (zap.safeFind("j") !== undefined) {
			const ptr = this.addPointer("j", zap, Palette.POINTER_HIGHLIGHT);
			ptr.centerY += 0;
		}
		this.playground.children[0].children.forEach((c) => {
			if (idx >= this.zaps.length - 2) {
				c.strokeColor = Colors.DarkGreen;
			} else {
				c.strokeColor = [false].includes(zap.safeFind("swapped")) ? Colors.DarkGreen : Colors.Black;
			}
			if (!c.name.startsWith("arritem/")) {
				return;
			}
			const i = parseInt(c.name.split("/")[1]);
			if (idx >= this.zaps.length - 2) {
				c.color = Colors.Green;
				return;
			}
			if (!zap.safeFind("i")) {
				return;
			}
			if (i >= (zap.safeFind("i") ?? -1) || ([8, 9].includes(section) && i === zap.safeFind("j") && i === zap.safeFind("i") - 1)) {
				c.color = Colors.Green;
			}
		});
	}

}

