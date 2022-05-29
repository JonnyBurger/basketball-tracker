import {getVideoMetadata, VideoMetadata} from '@remotion/media-utils';
import {useEffect, useState} from 'react';
import {Composition, continueRender, delayRender, staticFile} from 'remotion';
import {Master} from './Composition';
import {ensureAllFonts} from './ensure-fonts';
import {Panel} from './Panel';
import {ScoreAnimation} from './ScoreAnimation';
import {ScoreCard} from './Scorecard';
import {ScoreCardShowoff} from './ScoreCardShowoff';
import {Scene} from './types';

const src = staticFile('basketball.mp4');

const fps = 30;

ensureAllFonts();

const demoShots: Scene[] = [
	{
		doesHit: true,
		startFrame: 116,
		endFrame: 148,
	},
	{
		doesHit: true,
		startFrame: 346,
		endFrame: 382,
	},
	{
		doesHit: false,
		startFrame: 734,
		endFrame: 781,
	},
	{
		doesHit: true,
		startFrame: 983,
		endFrame: 1015,
	},
	{
		doesHit: true,
		startFrame: 1199,
		endFrame: 1245,
	},
	{
		doesHit: true,
		startFrame: 1593,
		endFrame: 1637,
	},
	{
		doesHit: false,
		startFrame: 1976,
		endFrame: 2025,
	},
	{
		doesHit: false,
		startFrame: 2194,
		endFrame: 2241,
	},
	{
		doesHit: true,
		startFrame: 2380,
		endFrame: 2426,
	},
	{
		doesHit: false,
		startFrame: 2796,
		endFrame: 2846,
	},
];

export const RemotionVideo: React.FC = () => {
	const [handle] = useState(() => delayRender());
	const [videoData, setVideoData] = useState<VideoMetadata | null>(null);

	useEffect(() => {
		getVideoMetadata(src)
			.then((data) => setVideoData(data))
			.catch((err) => console.log(err))
			.finally(() => continueRender(handle));
	}, [handle]);

	if (videoData === null) {
		return null;
	}

	const {durationInSeconds, width, height} = videoData;

	const durationInFrames = Math.floor(durationInSeconds * fps);

	return (
		<>
			<Composition
				id="Comp"
				component={Master}
				durationInFrames={durationInFrames}
				fps={fps}
				width={width}
				height={height}
				defaultProps={{
					src,
				}}
			/>
			<Composition
				id="Panel"
				component={Panel}
				durationInFrames={30}
				fps={30}
				height={120}
				width={80}
			/>
			<Composition
				id="ScoreCard"
				component={ScoreCard}
				durationInFrames={900}
				fps={30}
				height={120}
				width={590}
				defaultProps={{
					shots: demoShots,
				}}
			/>
			<Composition
				id="ScoreCardShowoff"
				component={ScoreCardShowoff}
				durationInFrames={900}
				fps={30}
				width={1280}
				height={720}
				defaultProps={{
					shots: demoShots,
				}}
			/>
			<Composition
				id="ScoreAnimation"
				component={ScoreAnimation}
				durationInFrames={60}
				fps={30}
				width={1280}
				height={720}
				defaultProps={{
					shots: demoShots,
				}}
			/>
		</>
	);
};
