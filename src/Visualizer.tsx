import React, {useMemo} from 'react';
import {AbsoluteFill, useCurrentFrame, useVideoConfig, Video} from 'remotion';
import {Coordinate, loadCalculateFrame} from './Analyser';
import {ScoreCard} from './Scorecard';

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

type Scene = {
	startFrame: number;
	endFrame: number;
	doesHit: boolean;
};

export const Visualizer: React.FC<{
	src: string;
}> = ({src}) => {
	const frame = useCurrentFrame();
	const {height, width, durationInFrames} = useVideoConfig();

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
		console.log(scenes);
		return scenes;
	}, [durationInFrames, src]);

	const isInShot = shots.findIndex(
		(s) => s.startFrame <= frame && s.endFrame >= frame
	);

	const square = loadCalculateFrame(frame, src);

	return (
		<AbsoluteFill>
			<Video src={src} />
			{square ? (
				<div
					style={{
						position: 'absolute',
						width: 50,
						height: 50,
						marginLeft: -25,
						marginTop: -25,
						border: '5px solid blue',
						left: square.x,
						top: square.y,
					}}
				/>
			) : null}
			<AbsoluteFill>
				<svg viewBox={`0 0 ${width} ${height}`}>
					<path
						d={`
          M ${basket[0].x} ${basket[0].y}
          L ${basket[0].x} ${basket[1].y}
          L ${basket[1].x} ${basket[1].y}
          L ${basket[1].x} ${basket[0].y}
          z`}
						fill="none"
						stroke="green"
						strokeWidth="10"
					/>
				</svg>
			</AbsoluteFill>
			<AbsoluteFill
				style={{
					color: 'white',
					fontSize: 40,
					padding: 30,
					fontFamily: 'sans-serif',
				}}
			>
				Is shooting = {isShooting(square ?? null)} <br />
				{isInShot > -1 ? (
					<div>
						Shot = {isInShot + 1}, hit = {String(shots[isInShot].doesHit)}
					</div>
				) : null}
				<br />
			</AbsoluteFill>
			<ScoreCard />
		</AbsoluteFill>
	);
};
