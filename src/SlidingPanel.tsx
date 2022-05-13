import React from 'react';
import {useCurrentFrame} from 'remotion';
import {Panel, PANEL_HEIGHT, PANEL_WIDTH} from './Panel';
import {Scene} from './types';

const container: React.CSSProperties = {
	height: PANEL_HEIGHT,
	flexDirection: 'row',
	display: 'flex',
};

const PANELS_SHOWN = 4;

export const SlidingPanel: React.FC<{
	shots: Scene[];
	numberOfOffset: number;
}> = ({numberOfOffset, shots}) => {
	const frame = useCurrentFrame();
	const upcomingShot = shots.find((s) => frame < s.endFrame + 30);
	return (
		<div
			style={{
				...container,
				width: PANEL_WIDTH * PANELS_SHOWN,
				overflow: 'hidden',
			}}
		>
			<div
				style={{
					...container,
					width: PANEL_WIDTH * shots.length,
					transform: `translateX(${
						-PANEL_WIDTH * Math.max(0, numberOfOffset - PANELS_SHOWN + 1)
					}px)`,
				}}
			>
				{shots.map((shot, i) => {
					return (
						<Panel
							isCurrentShot={shot === upcomingShot}
							shot={shot}
							index={i + 1}
						/>
					);
				})}
			</div>
		</div>
	);
};
