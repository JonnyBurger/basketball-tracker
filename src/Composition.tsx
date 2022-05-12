import {useCallback, useState} from 'react';
import {AbsoluteFill} from 'remotion';
import {Analyzer} from './Analyser';
import {Visualizer} from './Visualizer';

export const Master: React.FC<{
	src: string;
}> = ({src}) => {
	const [doneAnalyzing, setDoneAnalyzing] = useState(false);

	const onDone = useCallback(() => {
		setDoneAnalyzing(true);
	}, []);

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
