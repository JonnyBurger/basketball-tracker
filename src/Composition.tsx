import {useCallback, useState} from 'react';
import {AbsoluteFill, continueRender, delayRender} from 'remotion';
import {Analyzer} from './Analyser';
import {Visualizer} from './Visualizer';

export const Master: React.FC<{
	src: string;
}> = ({src}) => {
	const [waitForAnalyser] = useState(() => delayRender());
	const [doneAnalyzing, setDoneAnalyzing] = useState(false);

	const onDone = useCallback(() => {
		setDoneAnalyzing(true);
		continueRender(waitForAnalyser);
	}, [waitForAnalyser]);

	return (
		<AbsoluteFill>
			{doneAnalyzing ? (
				<Visualizer src={src} />
			) : (
				<Analyzer src={src} onDone={onDone} />
			)}
		</AbsoluteFill>
	);
};
