/* eslint-disable @remotion/warn-native-media-tag */
/* eslint-disable no-await-in-loop */
import React, {useCallback, useEffect, useRef, useState} from 'react';
import {AbsoluteFill, useVideoConfig} from 'remotion';

const lightOrange = [227, 174, 127];
const darkOrange = [166, 102, 75];

export type Coordinate = {
	x: number;
	y: number;
};

const indicatorSize = 60;

const getKey = (frame: number, src: string) =>
	['coordinates', frame, src].join('-');

const saveCalculatedFrame = (
	frame: number,
	src: string,
	coordinate: Coordinate | null
) => {
	const key = getKey(frame, src);
	localStorage.setItem(
		key,
		coordinate === null ? 'null' : JSON.stringify(coordinate)
	);
};

export const loadCalculateFrame = (
	frame: number,
	src: string
): Coordinate | null | undefined => {
	const key = getKey(frame, src);
	const content = localStorage.getItem(key);
	return content
		? content === 'null'
			? null
			: JSON.parse(content)
		: undefined;
};

const findApproximateBallPosition = (
	matchingPixels: Coordinate[],
	secondPass = false
): Coordinate => {
	const avgX =
		matchingPixels.map((p) => p.x).reduce((a, b) => a + b, 0) /
		matchingPixels.length;
	const avgY =
		matchingPixels.map((p) => p.y).reduce((a, b) => a + b, 0) /
		matchingPixels.length;

	if (secondPass) {
		return {
			x: avgX,
			y: avgY,
		};
	}

	const sortByDistance = matchingPixels
		.slice()
		.sort((a, b) => {
			const distanceA = Math.sqrt((a.x - avgX) ** 2 + (a.y - avgY) ** 2);
			const distanceB = Math.sqrt((b.x - avgX) ** 2 + (b.y - avgY) ** 2);
			return distanceA - distanceB;
		})
		.slice(0, Math.floor(matchingPixels.length * 0.7));

	return findApproximateBallPosition(sortByDistance, true);
};

export const Analyzer: React.FC<{
	onDone: () => void;
	src: string;
}> = ({onDone, src}) => {
	const video = useRef<HTMLVideoElement>(null);

	const [framesAnalyzed, setFramesAnalyzed] = useState(0);
	const {width, height, fps} = useVideoConfig();
	const canvas = useRef<HTMLCanvasElement>(null);
	const indicator = useRef<HTMLDivElement>(null);

	const numberOfPixels = width * height;

	const callback = useCallback(() => {
		if (!canvas.current || !video.current) {
			throw new Error('should not happen');
		}
		const context = canvas.current.getContext('2d');
		if (!context) {
			throw new Error('should not happen');
		}
		context.drawImage(video.current, 0, 0, width, height);
		const imageFrame = context.getImageData(0, 0, width, height);
		const {length} = imageFrame.data;

		const matchingPixels: {x: number; y: number}[] = [];

		// Find orange pixels
		for (let i = 0; i < length; i += 4) {
			const red = imageFrame.data[i + 0];
			const green = imageFrame.data[i + 1];
			const blue = imageFrame.data[i + 2];
			const redMatch = red < lightOrange[0] && red > darkOrange[0];
			const greenMatch = green < lightOrange[1] && green > darkOrange[1];
			const blueMatch = blue < lightOrange[2] && blue > darkOrange[2];
			const isBall = redMatch && blueMatch && greenMatch;
			if (isBall) {
				const pixel = i / 4;
				const x = pixel % width;
				const y = Math.floor(pixel / width);
				matchingPixels.push({x, y});
			}
		}

		// If ball does not match at least 0.02% of screens pixels, there is no ball
		if (matchingPixels.length < numberOfPixels * 0.0002) {
			return null;
		}

		return findApproximateBallPosition(matchingPixels);
	}, [height, numberOfPixels, video, width]);

	const analyzeFrame = useCallback(
		async (
			video: HTMLVideoElement,
			frame: number
		): Promise<Coordinate | null> => {
			if (loadCalculateFrame(frame, src) !== undefined) {
				return Promise.resolve(loadCalculateFrame(frame, src) ?? null);
			}

			return new Promise<Coordinate | null>((resolve) => {
				video.currentTime = frame / fps;
				video.requestVideoFrameCallback(() => {
					const item = callback();
					saveCalculatedFrame(frame, src, item);
					if (!indicator.current) {
						return;
					}
					if (item === null) {
						indicator.current.style.left = '-999px';
						indicator.current.style.top = '-999px';
					} else {
						indicator.current.style.left = item.x - indicatorSize / 2 + 'px';
						indicator.current.style.top = item.y - indicatorSize / 2 + 'px';
					}
					return resolve(item);
				});
			});
		},
		[callback, fps, src]
	);

	const startAnalyzer = useCallback(
		async (video: HTMLVideoElement) => {
			const time = video.duration;
			const frames = Math.floor(time * fps);

			for (let i = 0; i < frames; i++) {
				await analyzeFrame(video, i);
				console.log('frames analyzed', i);
				setFramesAnalyzed(i + 1);
			}
			onDone();
		},
		[analyzeFrame, onDone, fps]
	);

	useEffect(() => {
		if (!video.current) {
			return;
		}

		video.current.addEventListener('loadedmetadata', () =>
			startAnalyzer(video.current as HTMLVideoElement)
		);
	}, [analyzeFrame, startAnalyzer, video]);

	return (
		<AbsoluteFill>
			<AbsoluteFill>
				<video
					ref={video}
					// If we access the data of a remote video, we must add this prop, and the remote video must have CORS enabled
					crossOrigin="anonymous"
					src={src}
				/>
			</AbsoluteFill>
			<AbsoluteFill>
				<canvas ref={canvas} width={width} height={height} />
			</AbsoluteFill>
			<AbsoluteFill
				style={{
					justifyContent: 'center',
					alignItems: 'center',
					fontSize: 100,
					color: 'white',
					fontFamily: 'sans-serif',
					fontWeight: 'bold',
					textShadow: '0 0 5px black',
				}}
			>
				{framesAnalyzed} Frames analyzed
			</AbsoluteFill>
			<AbsoluteFill>
				<div
					ref={indicator}
					style={{
						position: 'absolute',
						border: '5px solid blue',
						height: indicatorSize,
						width: indicatorSize,
					}}
				/>
			</AbsoluteFill>
		</AbsoluteFill>
	);
};
