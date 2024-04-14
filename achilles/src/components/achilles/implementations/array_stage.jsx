import { AchillesStage } from '../achilles';
import { addArrayItems, addArrayPointer } from './array_helpers';
import { NullSprite } from 'sharc-js/Sprites';
import Palette from '../palette';

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

}


