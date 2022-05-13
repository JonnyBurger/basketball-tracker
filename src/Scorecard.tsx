import React from 'react';
import {AbsoluteFill, Img, staticFile} from 'remotion';

const container: React.CSSProperties = {
	padding: 50,
	paddingBottom: 20,
	alignItems: 'flex-end',
};

const bottom: React.CSSProperties = {
	backgroundColor: 'black',
	height: 120,
	width: '50%',
	borderBottom: '4px solid #0b84f3',
	display: 'flex',
	flexDirection: 'row',
	color: 'white',
	fontFamily: 'Roboto Condensed',
	alignItems: 'center',
	boxShadow: '0 0 10px rgba(0, 0, 0, 0.4)',
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
	paddingRight: 15,
};

export const ScoreCard: React.FC = () => {
	return (
		<AbsoluteFill style={container}>
			<div style={bottom}>
				<Img style={profile} src={staticFile('jonny.png')} />
				<div>
					<div style={surname}>Jonny</div>
					<div style={lastname}>BURGER</div>
				</div>
			</div>
		</AbsoluteFill>
	);
};
