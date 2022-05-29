import React from 'react';
import {ScoreCard} from './Scorecard';
import {Scene} from './types';

const container: React.CSSProperties = {
	padding: 50,
	paddingBottom: 20,
	alignItems: 'flex-end',
};

export const ScoreCardContainer: React.FC<{
	shots: Scene[];
}> = ({shots}) => {
	return (
		<div style={container}>
			<ScoreCard shots={shots} />
		</div>
	);
};
