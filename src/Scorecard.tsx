import React, {useMemo} from 'react';
import {
	Img,
	Sequence,
	spring,
	staticFile,
	useCurrentFrame,
	useVideoConfig,
} from 'remotion';
import {ScoreAnimation} from './ScoreAnimation';
import {SlidingPanel} from './SlidingPanel';
import {Scene} from './types';

const outer: React.CSSProperties = {
	width: (1280 - 100) / 2,
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

const flag: React.CSSProperties = {
	width: 36,
	height: 36,
	position: 'absolute',
	bottom: 30,
};

const name: React.CSSProperties = {
	backgroundColor: 'rgba(0, 0, 0, 0.3)',
	height: '100%',
	paddingLeft: 16,
	flex: 1,
	flexDirection: 'column',
	justifyContent: 'center',
	display: 'flex',
};

export const ScoreCard: React.FC<{
	shots: Scene[];
}> = ({shots}) => {
	const {fps} = useVideoConfig();
	const frame = useCurrentFrame();

	const scoreCardOffset = useMemo(() => {
		return shots
			.map((s, i) => {
				if (i === shots.length - 1) {
					return 0;
				}
				return spring({
					fps,
					frame: frame - s.endFrame - 40,
					config: {
						mass: 0.5,
						damping: 200,
					},
				});
			})
			.reduce((a, b) => a + b, 0);
	}, [fps, frame, shots]);

	return (
		<div style={outer}>
			<div style={bottom}>
				<Img style={profile} src={staticFile('jonny.png')} />
				<Img
					src="https://upload.wikimedia.org/wikipedia/commons/thumb/f/f3/Flag_of_Switzerland.svg/1024px-Flag_of_Switzerland.svg.png?20191016012602"
					style={flag}
				/>
				<div style={name}>
					<div style={surname}>Jonny</div>
					<div style={lastname}>BURGER</div>
				</div>
				<SlidingPanel shots={shots} numberOfOffset={scoreCardOffset} />
			</div>
			<div style={eventName}>2022 REMOTION FREE THROW INVITATIONAL</div>
			{shots.map((s) => {
				if (!s.doesHit) {
					return null;
				}
				return (
					<Sequence from={s.endFrame}>
						<ScoreAnimation />
					</Sequence>
				);
			})}
		</div>
	);
};
