import React from 'react';
import {
	AbsoluteFill,
	Sequence,
	spring,
	useCurrentFrame,
	useVideoConfig,
} from 'remotion';
import {ScoreCard} from './Scorecard';
import {Scene} from './types';

export const ScoreCardShowoff: React.FC<{
	shots: Scene[];
}> = ({shots}) => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();

	const scale = spring({
		fps,
		frame,
		config: {
			damping: 200,
		},
	});

	return (
		<AbsoluteFill
			style={{
				display: 'flex',
				justifyContent: 'center',
				alignItems: 'center',
				transform: `scale(${scale * 1.5})`,
			}}
		>
			<Sequence from={-2000} layout="none">
				<ScoreCard shots={shots} />
			</Sequence>
		</AbsoluteFill>
	);
};
