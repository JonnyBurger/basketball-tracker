import React from 'react';

export const Panel: React.FC<{
	shot: number;
}> = ({shot}) => {
	return (
		<div
			style={{
				width: 80,
				height: 120,
				display: 'flex',
				flexDirection: 'column',
				borderLeft: '1px solid rgba(255, 255, 255, 0.2)',
			}}
		>
			<div style={{flex: 1}} />
			<div
				style={{
					height: 20,
					backgroundImage:
						'radial-gradient(farthest-corner at bottom center, rgba(255, 255, 255, 0.3) 0%, transparent 120%)',
					display: 'flex',
					justifyContent: 'center',
					alignItems: 'center',
					fontFamily: 'Roboto Condensed',
					lineHeight: 1,
				}}
			>
				{shot}
			</div>
		</div>
	);
};
