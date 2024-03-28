import { useEffect, useRef } from 'react';
import { Stage } from 'sharc-js/Stage';
import Palette from './palette';
import { LabelSprite, NullSprite, Rect, TextSprite } from 'sharc-js/Sprites';
import { Position as p } from 'sharc-js/Utils';
import { DRAG_EVENT_LISTENERS, CLICK_POSITION, RAMP_CALLBACK_LISTENERS } from './helpers';

function abstract() {
	throw new Error('This method is abstract and must be implemented in a derived class.');
}

export class AchillesStage extends Stage {

	static get STATES() {
		return {
			INITIAL: 'initial',
			PAUSED: 'paused',
			PLAYING: 'playing',
			ENDED: 'ended',
		};
	}

	static get uiButtonProps() {
		return {
			fontSize: 40,
			positionIsCenter: true,
			backgroundColor: Palette.ELEMENT_DEFAULT,
			backgroundRadius: 10,
		};
	}

	zaps = [];
	zapIdx = 0;

	constructor(canvas, initialInput) {
		super(canvas, 'centered', Palette.BG);
		this.input = initialInput;
		this.root.addChildren(
			new NullSprite({ name: 'playground-root' })
				.addChildren(
				new Rect({
						name: 'playground-bg',
						bounds: Rect.Bounds(-1200, -1200, 2400, 2400),
						alpha: 0,
						})
						.on('click', DRAG_EVENT_LISTENERS.click(false))
						.on('drag', (sprite, pos) => {
							const clickPos = sprite.details[CLICK_POSITION];
							const dx = (pos.x - clickPos.x) / 2;
							const dy = (pos.y - clickPos.y) / 2;
							const playground = sprite.parent.children[1];
							playground.position = {
								x: Math.min(400, Math.max(playground.position.x + dx, -400)),
								y: Math.min(400, Math.max(playground.position.y + dy, -400)),
							};
							playground.position = {
								x: Math.abs(playground.position.x) < 10 ? 0 : playground.position.x,
								y: Math.abs(playground.position.y) < 10 ? 0 : playground.position.y,
							};
							sprite.details[CLICK_POSITION] = pos;
					}),
					new NullSprite({ name: 'playground' }),
					new NullSprite({ name: 'playground-ui' }),
			),
			new NullSprite({ name: 'ui' })
				.addChildren(
					new LabelSprite({
						...AchillesStage.uiButtonProps,
						name: 'main-button',
						text: 'Start',
						position: p(0, -300),
						fontSize: 40,
						}).on('release', sprite => {
							const stage = sprite.root.stage;
							if (!stage.validate()) {
								return;
							}
							if (stage.getState() === AchillesStage.STATES.INITIAL) {
								stage.zaps = stage.execute();
								stage.prepareUI();
								stage.setState(AchillesStage.STATES.PAUSED);
								sprite.text = 'Play';
								stage.loadZap(0);
							}
					}),
			),
			new NullSprite({ 
				name: 'state',
				details: {
					state: AchillesStage.STATES.INITIAL,
				}
			}),
			new NullSprite({ name: 'dummy' }),
		);
		this.initialize(initialInput);
		this.loop();
	}

	initialize() { abstract(); }

	validate() { abstract(); }

	prepareUI() { 
		this.ui.addChildren(
			new LabelSprite({
				...AchillesStage.uiButtonProps,
				name: 'back-button',
				text: 'Back',
				position: p(-150, -300),
				fontSize: 40,
				})
				.on('click', RAMP_CALLBACK_LISTENERS.click())
				.on('hold', RAMP_CALLBACK_LISTENERS.hold(sprite => {
					const stage = sprite.root.stage;
					if (stage.getState() === AchillesStage.STATES.PLAYING) {
						return;
					}
					if (stage.zapIdx === 0) {
						return;
					}
					stage.loadZap(--stage.zapIdx);
				})),
			new LabelSprite({
				...AchillesStage.uiButtonProps,
				name: 'next-button',
				text: 'Next',
				position: p(150, -300),
				fontSize: 40,
				})
				.on('click', RAMP_CALLBACK_LISTENERS.click())
				.on('hold', RAMP_CALLBACK_LISTENERS.hold(sprite => {
					const stage = sprite.root.stage;
					if (stage.getState() === AchillesStage.STATES.PLAYING) {
						return;
					}
					if (stage.zapIdx === stage.zaps.length - 1) {
						return;
					}
					stage.loadZap(++stage.zapIdx);
				})),
			new TextSprite({
				name: 'step-counter',
				text: `Step: 0 / ${this.zaps.length} | Section: ${this.zaps[this.zapIdx]?.section}`,
				position: p(-675, 350),
				fontSize: 40,
				color: Palette.ELEMENT_DEFAULT,
			}),
		);
		const mainButton = this.ui.findChild('main-button');
		mainButton.removeEventListener('release');
		// mainButton.on('beforeDraw', sprite => {
		// 	const stage = sprite.root.stage;
		// 	sprite.text = (stage.zapIdx === stage.zaps.length - 1) ? 'Done!' : 
		// 		(stage.getState() === AchillesStage.STATES.INITIAL ? 'Start' : 'Play');
		// });
		mainButton.on('release', sprite => {
			const stage = sprite.root.stage;
			if (stage.getState() === AchillesStage.STATES.PAUSED) {
				if (stage.zapIdx === stage.zaps.length - 1) {
					return;
				}
				stage.interpolate();
				stage.setState(AchillesStage.STATES.PLAYING);
				sprite.text = 'Pause';
				sprite.parent.descendants.filter(s => s != sprite && s.name.includes('button')).forEach(s => s.enabled = false);
			} else if (stage.getState() === AchillesStage.STATES.PLAYING) {
				stage.setState(AchillesStage.STATES.PAUSED);
				stage.root.findDescendant('dummy').removeEventListener('beforeDraw');
				sprite.text = 'Play';
				stage.loadZap(stage.zapIdx);
				sprite.parent.descendants.filter(s => s != sprite && s.name.includes('button')).forEach(s => s.enabled = true);
			} else {
				throw new Error('Invalid state');
			}
		});
	}

	execute() { abstract(); }

	interpolate() {
		console.log(`interpolating ${this.zapIdx}`);
		if (++this.zapIdx === this.zaps.length) {
			this.zapIdx = this.zaps.length - 1;
			this.ui.findChild('back-button').enabled = true;
			this.ui.findChild('next-button').enabled = true;
			this.ui.findChild('main-button').text = 'Play';
			this.setState(AchillesStage.STATES.PAUSED);
			return;
		}
		this.root.findChild('dummy').delay(18, (_, __, stage) => {
			console.log(`finalizing zap ${this.zapIdx - 1}`);
			stage.loadZap(stage.zapIdx);
		});
		this.root.findChild('dummy').delay(20, (_, __, stage) => {
			stage.interpolate();
		});
	}


	setState(state) {
		this.root.children.at(-2).details.state = state;
	}

	getState() {
		return this.root.children.at(-2).details.state;
	}

	loadZap(idx) {
		console.log(`setting zap to ${idx}`);
		this.zapIdx = idx;
		console.log(this.zaps);
		this.root.findDescendant('step-counter').text = `Step: ${idx + 1} / ${this.zaps.length} | Section: ${this.zaps[idx]?.section}`;
	}

	/**
	 * @param {number} idx 
	 *
	 * @returns {NullSprite}
	*/
	get playground() {
		return this.root.children[0].children[1];
	}

	get ui() {
		return this.root.children[1];
	}
}

export function Achilles ({ stageClass }) {
	const canvasRef = useRef(null);

	useEffect(() => {
		if (!canvasRef.current) return;
		const canvas = canvasRef.current;
		const stage = new stageClass(canvas);

		return () => {
			stage.stop();
		}
		}, [stageClass, canvasRef]);

	return <canvas ref={canvasRef} width={1400} height={800} />;
}

