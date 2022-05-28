import {getVideoMetadata, VideoMetadata} from '@remotion/media-utils';
import {useEffect, useState} from 'react';
import {Composition, continueRender, delayRender, staticFile} from 'remotion';
import {Master} from './Composition';
import {ensureAllFonts} from './ensure-fonts';
import {Panel} from './Panel';

const src = staticFile('basketball.mp4');

const fps = 30;

ensureAllFonts();

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
		</>
	);
};
