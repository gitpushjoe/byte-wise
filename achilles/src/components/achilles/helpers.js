import { Rect } from 'sharc-js/Sprites';

export default function Hitbox(bounds, sprite) {
	const hitbox = new Rect({
		bounds: {
			x1: bounds.x1 + sprite.centerX,
			y1: bounds.y1 + sprite.centerY,
			x2: bounds.x2 + sprite.x2 + sprite.centerX,
			y2: bounds.y2 + sprite.y2 + sprite.centerY,
		},
		alpha: 1,
	});
	hitbox.addChild(sprite);
	sprite.on = function(...args) {
		hitbox.on(...args);
		return sprite;
	};
	sprite.addEventListener = function(...args) {
		hitbox.addEventListener(...args);
		return sprite;
	}
	sprite.removeEventListener = function(...args) {
		hitbox.removeEventListener(...args);
		return sprite;
	}
	return hitbox;
}
