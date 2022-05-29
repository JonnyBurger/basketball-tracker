import React from 'react';
import {interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {BasketBallIcon} from './BasketballIcon';
import {MissIcon} from './MissIcon';
import {Scene} from './types';

export const PANEL_WIDTH = 80;
export const PANEL_HEIGHT = 120;

export const Panel: React.FC<{
	index: number;
	shot: Scene;
	isCurrentShot: boolean;
}> = ({index, shot, isCurrentShot}) => {
	const {fps} = useVideoConfig();
	const frame = useCurrentFrame();

	const ballScale = spring({
		fps,
		frame: frame - shot.endFrame - 50,
		config: {
			damping: 200,
			mass: 0.2,
		},
	});

	return (
		<div
			style={{
				width: PANEL_WIDTH,
				height: PANEL_HEIGHT,
				display: 'flex',
				flexDirection: 'column',
				borderLeft: '1px solid rgba(255, 255, 255, 0.2)',
			}}
		>
			<div
				style={{
					flex: 1,
					justifyContent: 'center',
					alignItems: 'center',
					display: 'flex',
				}}
			>
				<div
					style={{
						transform: `scale(${ballScale})`,
					}}
				>
					{shot.doesHit ? <BasketBallIcon /> : <MissIcon />}
				</div>
			</div>
			<div
				style={{
					height: 20,
					backgroundImage:
						'radial-gradient(farthest-corner at bottom center, rgba(255, 255, 255, ' +
						(isCurrentShot
							? interpolate((Math.sin(frame / 10) + 1) / 2, [0, 1], [0.15, 0.3])
							: 0.08) +
						') 0%, transparent 120%)',
					display: 'flex',
					justifyContent: 'center',
					alignItems: 'center',
					fontFamily: 'Roboto Condensed',
					lineHeight: 1,
				}}
			>
				{index}
			</div>
		</div>
	);
};
