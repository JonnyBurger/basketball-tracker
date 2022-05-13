import React from 'react';
import {spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {BasketBallIcon} from './BasketballIcon';
import {Scene} from './types';

export const PANEL_WIDTH = 80;
export const PANEL_HEIGHT = 120;

export const Panel: React.FC<{
	index: number;
	shot: Scene;
}> = ({index, shot}) => {
	const {fps} = useVideoConfig();
	const frame = useCurrentFrame();

	const ballScale = shot.doesHit
		? spring({
				fps,
				frame: frame - shot.endFrame + 3,
				config: {
					damping: 200,
					mass: 0.2,
				},
		  })
		: 0;

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
					<BasketBallIcon />
				</div>
			</div>
			<div
				style={{
					height: 20,
					backgroundImage:
						'radial-gradient(farthest-corner at bottom center, rgba(255, 255, 255, 0.3) 0%, transparent 120%)',
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
