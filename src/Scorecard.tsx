import React from 'react';
import {AbsoluteFill, Img, staticFile} from 'remotion';
import {ScoreAnimation} from './ScoreAnimation';
import {SlidingPanel} from './SlidingPanel';
import {Scene} from './types';

const container: React.CSSProperties = {
	padding: 50,
	paddingBottom: 20,
	alignItems: 'flex-end',
};

const outer: React.CSSProperties = {
	width: '50%',
	boxShadow: '0 0 10px rgba(0, 0, 0, 0.4)',
	position: 'relative',
};

const bottom: React.CSSProperties = {
	backgroundColor: 'rgba(0, 0, 0, 0.8)',
	height: 120,
	display: 'flex',
	flexDirection: 'row',
	color: 'white',
	fontFamily: 'Roboto Condensed',
	alignItems: 'center',
};

const eventName: React.CSSProperties = {
	backgroundColor: '#0b84f3',
	width: '100%',
	lineHeight: 1,
	height: 30,
	color: 'white',
	fontFamily: 'Roboto Condensed',
	display: 'flex',
	justifyContent: 'center',
	alignItems: 'center',
};

const surname: React.CSSProperties = {
	fontWeight: 300,
	fontSize: 20,
	fontStyle: 'italic',
};

const lastname: React.CSSProperties = {
	fontWeight: 500,
	fontSize: 24,
};

const profile: React.CSSProperties = {
	height: '100%',
};

export const ScoreCard: React.FC<{
	scoreCardOffset: number;
	shots: Scene[];
}> = ({scoreCardOffset, shots}) => {
	return (
		<AbsoluteFill style={container}>
			<div style={outer}>
				<div style={bottom}>
					<Img style={profile} src={staticFile('jonny.png')} />
					<div
						style={{
							backgroundColor: 'rgba(0, 0, 0, 0.3)',
							height: '100%',
							paddingLeft: 16,
							flex: 1,
							flexDirection: 'column',
							justifyContent: 'center',
							display: 'flex',
						}}
					>
						<div style={surname}>Jonny</div>
						<div style={lastname}>BURGER</div>
					</div>
					<SlidingPanel shots={shots} numberOfOffset={scoreCardOffset} />
				</div>
				<div style={eventName}>2022 REMOTION FREE THROW INVITATIONAL</div>
				<ScoreAnimation />
			</div>
		</AbsoluteFill>
	);
};
