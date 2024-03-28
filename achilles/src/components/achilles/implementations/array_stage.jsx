import { AchillesStage } from '../achilles';
import { addArrayItems, addArrayPointer } from './array_helpers';
import { NullSprite } from 'sharc-js/Sprites';
import Palette from '../palette';

export default class ArrayStage extends AchillesStage {

	static get DEFAULT_INPUT() {
		return [ 6, 5, 2, 10, 8, 7, 3, 9, 1, 4 ];
	}

	constructor(canvas) {
		super(canvas, ArrayStage.DEFAULT_INPUT);
	}

	initialize(input) {
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
			items: input,
			modifiable: true,
		});
	}

	get arr() {
		return this.playground.children[0];
	}

	addPointer(varName, zap, color = Palette.POINTER_DEFAULT) {
		return addArrayPointer({
			root: this.arr.findChild("!arr-pointers"),
			idx: zap.find(varName),
			color: color,
			text: varName,
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


