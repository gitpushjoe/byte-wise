import { AchillesStage } from '../achilles';
import { addArrayItems, addArrayPointer } from './array_helpers';
import { NullSprite } from 'sharc-js/Sprites';
import Palette from '../palette';
import Constants from '../constants';
import { Easing } from 'sharc-js/Utils';

export default class ArrayStage extends AchillesStage {

	static get DEFAULT_INPUT() {
		return [ 6, 2, 10, 5, 9, 4, 3, 8, 7, 1 ];
	}

	constructor(canvas) {
		super(canvas, ArrayStage.DEFAULT_INPUT);
	}

	initialize() {
		this.playground.removeAllChildren();
		this.playground.addChildren(
			new NullSprite({ name: '!arr' })
				.addChildren(
					new NullSprite({ name: '!arr-pointers' }),
					new NullSprite({ name: '!arr-key' }),
			),
		);
		addArrayItems({
			root: this.arr,
			items: this.input,
			modifiable: true,
		});
	}

	get arr() {
		return this.playground.children[0];
	}

	addPointer(varName, zap, color = Palette.POINTER_DEFAULT, isFlipped = false, prefix = undefined, offset = 0) {
		return addArrayPointer({
			root: this.arr.findChild("!arr-pointers"),
			idx: zap.find(varName) + offset,
			color: color,
			text: varName,
			isFlipped,
			prefix
		});
	}

	setArray(arr, modifiable = false) {
		this.arr.removeDescendantsWhere(c => c.name.startsWith("arritem/"));
		this.arr.findChild("!arr-pointers").removeAllChildren();
		this.arr.findChild("!arr-key").removeAllChildren();
		addArrayItems({
			root: this.arr,
			items: arr,
			modifiable
		});
	}

	getArray() {
		const arr = this.playground.children[0].findChildrenWhere(sprite => {
			return sprite.name.startsWith("arritem/") && !sprite.name.startsWith("arritem/other");
		}).sort((a, b) => {
			return parseInt(a.name.split("/")[1]) - parseInt(b.name.split("/")[1]);
		}).map(item => {
			return item.details.value;
		});
		this.input = [...arr];
		return arr;
	}

	findArrayItem(idx) {
		return this.arr.findChild(`arritem/${idx}`);
	}

	findArrayPointer(pointerName) {
		return this.arr.findChild("!arr-pointers").findChild(`arrpointer/${pointerName}`);
	}

	slideHorizontal(sprite, duration = 15, backwards = false) {
		const anim = this.stretchAnim({
			duration,
			property: 'centerX',
			from: null,
			to: x => x + (Constants.ARR_ITEM_SIZE + Constants.ARR_ITEM_MARGIN) * (backwards ? -1 : 1)
		});
		if (!sprite) {
			return anim;
		}
		if (sprite.channels[0].animations.length === 0) {
			sprite.channels[0].push(anim);
		} else {
			sprite.createChannels(1);
			sprite.channels[1].push(anim);
		}
	}

	floatOut(sprite, duration = 15) {
		const floatAnims = [
			[{
				duration: this.stretchTime(duration),
				property: 'alpha',
				from: null,
				to: 0,
			}], 
			[{
				duration: this.stretchTime(duration),
				property: 'centerY',
				from: null,
				to: y => y + 10,
		}]];
		if (!sprite) {
			return floatAnims;
		}
		if (sprite.channels.length < 2) {
			sprite.createChannels(1);
		}
		sprite.distribute(floatAnims);
	}

	floatIn(sprite, duration = 15) {
		const floatAnims = this.floatOut(null, duration);
		floatAnims[0][0].from = null;
		floatAnims[0][0].to = 1;
		floatAnims[1][0].to = y => y - 10;
		if (!sprite) {
			return floatAnims;
		}
		if (sprite.channels.length < 2) {
			sprite.createChannels(1);
		}
		sprite.distribute(floatAnims);
	}
}


