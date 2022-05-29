import React, {useMemo} from 'react';
import {AbsoluteFill, useCurrentFrame, useVideoConfig, Video} from 'remotion';
import {Coordinate, loadCalculateFrame} from './Analyser';
import {ScoreCardContainer} from './ScorecardContainer';
import {Scene} from './types';

const basket: [Coordinate, Coordinate] = [
	{
		x: 240,
		y: 190,
	},
	{
		x: 340,
		y: 280,
	},
];

export const isShooting = (coordinate: Coordinate | null) => {
	if (!coordinate) {
		return 'maybe';
	}
	// Is higher than lower bound of basket? Then we are currently shooting
	if (coordinate.y < basket[1].y) {
		return 'yes';
	}
	return 'no';
};

export const isInsideBasket = (coordinate: Coordinate | null) => {
	if (!coordinate) {
		return false;
	}
	if (coordinate.x <= basket[0].x || coordinate.x >= basket[1].x) {
		return false;
	}
	if (coordinate.y <= basket[0].y || coordinate.y >= basket[1].y) {
		return false;
	}
	return true;
};

export const Visualizer: React.FC<{
	src: string;
}> = ({src}) => {
	const {durationInFrames} = useVideoConfig();
	const frame = useCurrentFrame();

	const shots = useMemo(() => {
		const scenes: Scene[] = [];
		let frameBeforeShooting = false;
		for (let i = 0; i < durationInFrames; i++) {
			const point = loadCalculateFrame(i, src) ?? null;
			const state = isShooting(point);
			if (state === 'no') {
				frameBeforeShooting = false;
			} else if (state === 'yes') {
				if (frameBeforeShooting) {
					scenes[scenes.length - 1].endFrame = i;
					if (isInsideBasket(point)) {
						scenes[scenes.length - 1].doesHit = true;
					}
				} else {
					scenes.push({doesHit: false, startFrame: i, endFrame: i});
				}
				frameBeforeShooting = true;
			}
		}
		return scenes;
	}, [durationInFrames, src]);

	return (
		<AbsoluteFill>
			<Video src={src} />
			<AbsoluteFill
				style={{
					display: 'flex',
					alignItems: 'flex-end',
				}}
			>
				<ScoreCardContainer shots={shots} />
			</AbsoluteFill>
		</AbsoluteFill>
	);
};
