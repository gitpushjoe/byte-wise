import { useEffect, useRef } from 'react';
import { Stage } from 'sharc-js/Stage';
import Palette from './palette';
import { Ellipse, LabelSprite, Line, NullSprite, Rect, TextSprite } from 'sharc-js/Sprites';
import { Color, Colors, Position as p } from 'sharc-js/Utils';
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
			positionIsCenter: true,
			backgroundRadius: 10,
			bold: true,
			color: Colors.LightCyan,
			effects: ctx => {
				ctx.filter = `drop-shadow(1px 1px 3px dark-gray)`;
			},
			fontSize: 40,
		};
	}

	onSectionUpdate = () => {};

	static get DEFAULT_INPUT() { return abstract(); }

	input = undefined;

	onInputUpdate = () => {};

	updateInput() { 
		this.onInputUpdate(this.input);
	}

	onZapUpdate = () => {};

	zaps = [];
	zapIdx = 0;

	next_interpolate_quantum = undefined;
	interpolate_quantum = 50;

	static get uiButtonStartListener() {
		return (sprite, _, __, stage) => {
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
		}
	}

	constructor(canvas, initialInput) {
		super(canvas, 'centered', Palette.BG);
		this.ctx = this.canvas.getContext('2d', { willReadFrequently: true });
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
					new NullSprite({
						name: 'settings',
						position: p(180, -240),
						}).addChildren(
						new TextSprite({
								name: 'speed-icon',
								text: '🐇',
								position: p(30, -30),
								postionIsCenter: false,
								fontSize: 40,
								scale: p(-1, 1),
							}),
						new Line({
								bounds: Line.Bounds(110, -50, 410, -50),
								lineWidth: 5,
								lineCap: 'round',
								color: Colors.DimGray,
							}),
							...[...Array(6).keys()].map(i => new Ellipse({
								center: p(110 + (300 / 5) * i, -50),
								radius: 8,
								color: Colors.DimGray,
								}).on('click', (sprite, _, __, stage) => {
									sprite.parent.findChild('speed-slider').centerX = sprite.center.x;
									stage.next_interpolate_quantum = [200, 100, 60, 50, 25, 20][i];
								})
							),
						new Ellipse({
								name: 'speed-slider',
								center: p(110 + (300 / 5) * 3, -50),
								radius: 15,
								color: Colors.Pink,
								stroke: { lineWidth: 3, color: Colors.IndianRed },
								effects: ctx => {
									ctx.filter = `drop-shadow(0px 0px 1px indianred)`;
								}
								}).on('drag', (sprite, pos, _, stage) => {
									let idx = -1;
									for (let i = 0; i < 6; i++) {
										if (Math.abs(pos.x - (110 + (300 / 5) * i)) < 10) {
											idx = i;
										}
									}
									if (idx === -1) { 
										return; 
									}
									sprite.centerX = 110 + (300 / 5) * idx;
									stage.next_interpolate_quantum = [200, 100, 60, 50, 25, 20][idx];
							}),
						new TextSprite({
								name: 'zoom-icon',
								text: '🔍',
								position: p(30, -90),
								postionIsCenter: false,
								fontSize: 40,
								scale: p(-1, 1),
							}),
						new Line({
								bounds: Line.Bounds(110, -110, 415, -110),
								lineWidth: 5,
								lineCap: 'round',
								color: Colors.DimGray,
							}),
							...[...Array(2).keys()].map(i => new Ellipse({
								center: p(110 + 300 * i, -110),
								radius: 8,
								color: Colors.DimGray,
								})
							),
						new Ellipse({
								name: 'zoom-slider',
								center: p(260, -110),
								radius: 15,
								color: Colors.LightCyan,
								stroke: { lineWidth: 3, color: Colors.Cyan },
								effects: ctx => {
									ctx.filter = `drop-shadow(0px 0px 1px cyan)`;
								}
								}).on('drag', (sprite, pos, _, stage) => {
									sprite.centerX = Math.min(410, Math.max(110, pos.x));
									stage.playground.scale = {
										x: 0.5 + (sprite.centerX - 110) / 300,
										y: 0.5 + (sprite.centerX - 110) / 300,
									};
							}),
						new TextSprite({
								text: '▼',
								position: p(452.5, -60),
								color: Colors.Red,
								fontSize: 40,
								bold: true,
								effects: ctx => {
									ctx.filter = `drop-shadow(0px 0px 5px red)`;
								},
								details: true,
								channelCount: 3,
								}).on('click', (sprite) => {
									if (sprite.channels[0].animations.length !== 0) {
										return;
									}
									const isHidden = sprite.details;
									sprite.addEventListener('beforeDraw', (sprite) => {
										sprite.effects = ctx => {
											ctx.filter = `drop-shadow(0px 0px 5px rgba(${sprite.red}, ${sprite.green}, ${sprite.blue}, 1))`;
										}
										if (sprite.channels[0].animations.length === 0) {
											return 1;
										}
									});
									sprite.distribute([
										[
											{
												property: 'rotation',
												from: null,
												to: isHidden ? 180 : 0,
												duration: 30,
											}
										],
										[
											{
												property: 'color',
												from: null,
												to: isHidden ? Colors.LightGreen : Colors.Red,
												duration: 30,
											}
										],
										[
											{
												property: 'positionY',
												from: null,
												to: y => { return y + 100 * (isHidden ? 1 : -1); },
												duration: 30,
											}
										]
									]);
									sprite.parent.distribute([
										[
											{
												property: 'centerY',
												from: null,
												to: isHidden ? -380 : -240,
												duration: 30,
											}
										]
									]);
									sprite.details = !isHidden;
							})
					),
				new LabelSprite({
						...AchillesStage.uiButtonProps,
						name: 'main-button',
						text: 'Start',
						position: p(0, -285),
						}).on('release', AchillesStage.uiButtonStartListener),
			),
			new NullSprite({ 
				name: 'state',
				details: {
					state: AchillesStage.STATES.INITIAL,
				}
			}),
			new NullSprite({ name: 'dummy' }),
		);
		this.on('scroll', (_, event, stage) => {
			stage.playground.scale = {
				x: Math.min(1.5, Math.max(this.playground.scale.x - event.deltaY / 2000, 0.5)),
				y: Math.min(1.5, Math.max(this.playground.scale.y - event.deltaY / 2000, 0.5)),
			};
			stage.root.findDescendant('zoom-slider').centerX = 110 + 600 * (this.playground.scale.x - 0.5) / 2;
		});
		this.initialize(this.input);
		this.loop();
	}

	initialize() { abstract(); }

	validate() { abstract(); }

	stretchTime(time) {
		return time * this.interpolate_quantum / 20;
	}

	stretchAnim(anim) {
		return {
			...anim,
			duration: this.stretchTime(anim.duration),
		};
	}

	prepareUI() { 
		this.ui.addChildren(
			new LabelSprite({
				...AchillesStage.uiButtonProps,
				name: 'back-button',
				text: 'Back',
				position: p(-150, -285),
				})
				.on('click', RAMP_CALLBACK_LISTENERS.click())
				.on('hold', RAMP_CALLBACK_LISTENERS.hold((_, __, ___, stage) => {
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
				position: p(150, -285),
				})
				.on('click', RAMP_CALLBACK_LISTENERS.click())
				.on('hold', RAMP_CALLBACK_LISTENERS.hold((_, __, ___, stage) => {
					if (stage.getState() === AchillesStage.STATES.PLAYING) {
						return;
					}
					if (stage.zapIdx === stage.zaps.length - 1) {
						return;
					}
					stage.loadZap(++stage.zapIdx);
			})),
			new LabelSprite({
				...AchillesStage.uiButtonProps,
				name: 'start-button',
				text: '#1',
				position: p(-150, -350),
				})
				.on('release', (_, __, ___, stage) => {
					if (stage.getState() === AchillesStage.STATES.PLAYING) {
						return;
					}
				stage.loadZap(0);
			}),
			new LabelSprite({
				...AchillesStage.uiButtonProps,
				name: 'end-button',
				text: `#${this.zaps.length}`,
				position: p(150, -350),
				})
				.on('release', (_, __, ___, stage) => {
					if (stage.getState() === AchillesStage.STATES.PLAYING) {
						return;
					}
					stage.loadZap(stage.zaps.length - 1);
			}),
			new LabelSprite({
				...AchillesStage.uiButtonProps,
				name: 'reset-button',
				text: 'Edit',
				position: p(0, -350),
				})
				.on('release', (sprite, _, __, stage) => {
					if (stage.getState() === AchillesStage.STATES.PLAYING) {
						return;
					}
					stage.setState(AchillesStage.STATES.INITIAL);
					stage.initialize();
					sprite.root.findDescendant('main-button').text = 'Start';
					sprite.root.findDescendant('main-button').removeEventListener('release');
					sprite.root.findDescendant('main-button').on('release', AchillesStage.uiButtonStartListener);
					sprite.root.findDescendant('step-counter').removeSelf();
					sprite.root.findDescendant('back-button').removeSelf();
					sprite.root.findDescendant('next-button').removeSelf();
					sprite.root.findDescendant('start-button').removeSelf();
					sprite.root.findDescendant('end-button').removeSelf();
					sprite.root.findDescendant('reset-button').removeSelf();
			}),
			new TextSprite({
				name: 'step-counter',
				text: `Step: 0 / ${this.zaps.length}`,
				fontSize: 40,
				position: p(-this.width / 2 + 20, this.height / 2 - 20),
				color: Palette.ELEMENT_DEFAULT,
			}),
		);
		const mainButton = this.ui.findChild('main-button');
		mainButton.removeEventListener('release');
		mainButton.on('release', (sprite, _, __, stage) => {
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
		if (++this.zapIdx === this.zaps.length) {
			this.zapIdx = this.zaps.length - 1;
			this.ui.findChild('back-button').enabled = true;
			this.ui.findChild('next-button').enabled = true;
			this.ui.findChild('start-button').enabled = true;
			this.ui.findChild('end-button').enabled = true;
			this.ui.findChild('reset-button').enabled = true;
			this.ui.findChild('main-button').text = 'Play';
			this.setState(AchillesStage.STATES.PAUSED);
			return;
		}
		this.root.findChild('dummy').delay(this.stretchTime(18), (_, __, stage) => {
			stage.loadZap(stage.zapIdx, true);
		});
		this.onSectionUpdate(this.zaps[this.zapIdx]?.section);
		this.onZapUpdate(this.zaps[this.zapIdx]);
		this.root.findChild('dummy').delay(this.stretchTime(20), (_, __, stage) => {
			if (stage.next_interpolate_quantum) {
				stage.interpolate_quantum = stage.next_interpolate_quantum;
				stage.next_interpolate_quantum = undefined;
			}
			stage.interpolate();
		});
	}


	setState(state) {
		this.root.children.at(-2).details.state = state;
	}

	getState() {
		return this.root.children.at(-2).details.state;
	}

	loadZap(idx, noUpdate = false) {
		this.zapIdx = idx;
		this.root.findDescendant('step-counter').text = `Step: ${idx + 1} / ${this.zaps.length}`;
		!noUpdate && this.onSectionUpdate(this.zaps[idx]?.section);
		!noUpdate && this.onZapUpdate(this.zaps[idx]);
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

export function Achilles ({ stageClass, onSectionUpdate, onInputUpdate, onZapUpdate }) {
	const canvasRef = useRef(null);

	useEffect(() => {
		if (!canvasRef.current) return;
		const canvas = canvasRef.current;
		const stage = new stageClass(canvas);
		stage.onSectionUpdate = onSectionUpdate;
		stage.onInputUpdate = onInputUpdate;
		stage.onZapUpdate = onZapUpdate;
		onSectionUpdate(-1);
		onInputUpdate(stage.input);
		window.debug = stage.root.logHierarchy.bind(stage.root);

		return () => {
			stage.stop();
		}
		}, [stageClass, canvasRef]);

	return <canvas ref={canvasRef} width={1400} height={800} />;
}

