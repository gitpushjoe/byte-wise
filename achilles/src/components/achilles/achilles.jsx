import { useEffect, useRef } from 'react';
import { Stage } from 'sharc-js/Stage';
import Palette from './palette';
import { LabelSprite, NullSprite } from 'sharc-js/Sprites';
import { Position as p } from 'sharc-js/Utils';

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
	zapIdx = undefined;

	constructor(canvas, initialInput) {
		super(canvas, 'centered', Palette.BG);
		this.input = initialInput;
		this.root.addChildren(
			new NullSprite({ name: 'playground' }),
			new NullSprite({ name: 'ui' })
				.addChildren(
					new LabelSprite({
						...AchillesStage.uiButtonProps,
						name: 'main-button',
						text: 'Start',
						position: p(0, -300),
						fontSize: 40,
						}).on('release', function () {
							const stage = this.root.stage;
							if (!stage.validate()) {
								return;
							}
							if (stage.getState() === AchillesStage.STATES.INITIAL) {
								stage.prepareUI();
								stage.zaps = stage.execute();
								stage.setState(AchillesStage.STATES.PAUSED);
								this.text = 'Play';
								stage.loadZap(0);
							}
					}),
			),
			new NullSprite({ 
				name: 'state',
				details: {
					state: AchillesStage.STATES.INITIAL,
				}
			})
		);
		console.log(this.root.children);
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
			}).on('release', function () {
				const stage = this.root.stage;
				if (stage.getState() === AchillesStage.STATES.PLAYING) {
					return;
				}
				if (stage.zapIdx === 0) {
					return;
				}
				stage.loadZap(stage.zapIdx - 1);
			}),
			new LabelSprite({
				...AchillesStage.uiButtonProps,
				name: 'next-button',
				text: 'Next',
				position: p(150, -300),
				fontSize: 40,
			}).on('release', function () {
				const stage = this.root.stage;
				if (stage.getState() === AchillesStage.STATES.PLAYING) {
						console.log('playing');
					return;
				}
				if (stage.zapIdx === stage.zaps.length - 1) {
					console.log('end of zaps');
					return;
				}
					console.log(stage.zapIdx + 1);
				stage.loadZap(stage.zapIdx + 1);
			}),
		);
	}

	execute() { abstract(); }

	setState(state) {
		this.root.children.at(-1).details.state = state;
	}

	getState() {
		return this.root.children.at(-1).details.state;
	}

	loadZap(idx) {
		console.log(`setting zap to ${idx}`);
		this.zapIdx = idx;
	}

	get playground() {
		return this.root.children[0];
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

