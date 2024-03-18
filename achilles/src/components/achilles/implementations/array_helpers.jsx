import { Line, NullSprite, Rect, TextSprite } from 'sharc-js/Sprites';
import { Colors, CenterBounds, Position as p, Corners } from 'sharc-js/Utils';
import Palette from '../palette';
import Constants from '../constants';

export function ArrayItem({ value, idx, prefix = 'arritem' }) {
	return new Rect({
		name: `${prefix}/${idx}`,
		bounds: CenterBounds(idx * (Constants.ARR_ITEM_SIZE + Constants.ARR_ITEM_MARGIN), 0, Constants.ARR_ITEM_SIZE),
		color: Palette.ELEMENT_DEFAULT,
		stroke: {
			lineWidth: 5,
		},
		details: {
			value: parseInt(value),
		},
		radius: [Constants.ARR_ITEM_RADIUS],
		}).addChild(new TextSprite({
			name: `${prefix}/${idx}`,
			text: value,
			fontSize: Constants.ARR_TEXT_SIZE,
			color: Palette.TEXT_DEFAULT,
			positionIsCenter: true,
			bold: true,
			position: { x: 0, y: -4 },
	}))
}

export function ModifiableArrayItem({ value, idx }) {
	const item = ArrayItem({ value, idx });
	item.addChildren(
		new Rect({
			name: `arritem/${idx}/plus-hitbox`,
			alpha: 0,
			bounds: CenterBounds(0, Constants.ARR_ITEM_SIZE / 2 + 40, Constants.ARR_ITEM_SIZE / 2),
			effects: (ctx) => {
				ctx.filter = `drop-shadow(1px 1px 10px green)`;
			}
			}).addChild(
			new TextSprite({
					name: `arritem/${idx}/plus`,
					text: "+",
					position: p(0, -20),
					fontSize: Constants.ARR_TEXT_SIZE * 2,
					color: Colors.Green,
					positionIsCenter: true,
			}))
			.on('click', function () {
				this.parent.details.value++;
				this.parent.children[0].text = this.parent.details.value;
		}),
		new Rect({
			name: `arritem/${idx}/minus-hitbox`,
			alpha: 0,
			bounds: CenterBounds(0, -Constants.ARR_ITEM_SIZE / 2 - 40, Constants.ARR_ITEM_SIZE / 2),
			effects: (ctx) => {
				ctx.filter = `drop-shadow(1px 1px 12px red)`;
			}
			}).addChild(
			new TextSprite({
					name: `arritem/${idx}/minus`,
					position: p(0, -45),
					text: "-",
					fontSize: Constants.ARR_TEXT_SIZE * 2,
					color: Colors.Red,
					positionIsCenter: true,
			}))
			.on('click', function () {
				console.log(this.name, this.parent.details.value, this.parent.children[0].text);
				this.parent.details.value--;
				this.parent.children[0].text = this.parent.details.value;
		})
	);
	return item;
}

export function addArrayPointer({ root, idx, color = Palette.POINTER_DEFAULT, text = '' }) {
	const pointer = new Line({
		name: `arrpointer/${idx}`,
		bounds: Corners(
			(idx * (Constants.ARR_ITEM_SIZE + Constants.ARR_ITEM_MARGIN)),
			Constants.ARR_ITEM_SIZE / 2 + Constants.POINTER_MARGIN,
			(idx * (Constants.ARR_ITEM_SIZE + Constants.ARR_ITEM_MARGIN)),
			Constants.ARR_ITEM_SIZE / 2 + Constants.POINTER_LENGTH
		),
		color,
		rotation: 180,
		lineWidth: Constants.POINTER_ARROW_WIDTH,
		lineCap: 'round',
		arrow: {
			side: 'start',
			lineCap: 'round',
			length: Constants.POINTER_ARROW_LENGTH,
			stroke: {
				color,
				lineWidth: Constants.POINTER_ARROW_WIDTH,
				lineCap: 'round',
				lineJoin: 'round',
			},
		},
	});
	if (text) {
		pointer.addChild(new TextSprite({
			name: `arrpointertext/${idx}`,
			text,
			fontSize: Constants.POINTER_TEXT_SIZE,
			color,
			positionIsCenter: true,
			position: { x: 0, y: -Constants.POINTER_LENGTH / 2 - Constants.POINTER_TEXT_MARGIN },
			scale: p(-1, -1),
			bold: true,
		}));
	}
	root.addChild(pointer);
}

export function addArrayKey({ root, idx, value, yOffset = 0, text = '', color = Palette.KEY_DEFAULT, strokeColor = Palette.KEY_STROKE }) {
	const arrItem = ArrayItem({ value, idx, prefix: 'arrkey' });
	arrItem.color = color;
	arrItem.strokeColor = strokeColor;
	arrItem.centerY -= yOffset;
	arrItem.addChild(new TextSprite({
		name: `arrkeytext/${idx}`,
		text,
		fontSize: Constants.ARR_TEXT_SIZE,
		color: Palette.KEY_STROKE,
		align: 'right',
		bold: true,
		position: p(-Constants.ARR_ITEM_SIZE - Constants.ARR_ITEM_MARGIN * 2.5, -Constants.ARR_TEXT_SIZE * .25),
	}));
	root.addChild(arrItem);
}

export function addArrayItems({ root, items, modifiable = false }) {
	items.forEach((item, index) => {
		root.addChild(modifiable ? ModifiableArrayItem({ value: item, idx: index }) :
		ArrayItem({ value: item, idx: index }));
	});
	root.centerX = -(
		(items.length * Constants.ARR_ITEM_SIZE) +
			((items.length - 1) * Constants.ARR_ITEM_MARGIN)
	) / 2;
}
