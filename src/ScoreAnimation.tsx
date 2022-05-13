import React from 'react';
import {
	AbsoluteFill,
	spring,
	staticFile,
	useCurrentFrame,
	useVideoConfig,
	Video,
} from 'remotion';
import {TriangleEntrace} from './TriangleEntrance';

export const ScoreAnimation: React.FC = () => {
	const {fps} = useVideoConfig();
	const frame = useCurrentFrame();
	const progress = spring({
		fps,
		frame,
		config: {
			damping: 200,
			mass: 0.5,
		},
	});

	const outProgress = spring({
		fps,
		frame: frame - 35,
		config: {
			damping: 200,
			mass: 0.5,
		},
	});

	const letter = (delay: number) => {
		return spring({
			fps,
			frame: frame - delay,
			config: {
				damping: 200,
				mass: 0.3,
			},
		});
	};

	return (
		<TriangleEntrace type="out" progress={outProgress}>
			<TriangleEntrace type="in" progress={progress}>
				<AbsoluteFill>
					<AbsoluteFill>
						<Video src={staticFile('fire.mp4')} />
					</AbsoluteFill>
					<AbsoluteFill style={{backgroundColor: 'orange', opacity: 0.95}} />
					<AbsoluteFill
						style={{
							justifyContent: 'center',
							alignItems: 'center',
							fontFamily: 'SF Pro',
							fontSize: 70,
							fontWeight: 900,
							fontStyle: 'italic',
							color: 'white',
							display: 'flex',
							flexDirection: 'row',
						}}
					>
						{'SCORE'.split('').map((l, i) => {
							return (
								<span
									style={{
										display: 'inline-block',
										transform: `scale(${letter(3 + i)})`,
									}}
								>
									{l}
								</span>
							);
						})}
					</AbsoluteFill>
				</AbsoluteFill>
			</TriangleEntrace>
		</TriangleEntrace>
	);
};
