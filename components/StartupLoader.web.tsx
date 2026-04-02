// Loading code from https://uiball.com/ldrs/ with adaptation for this app.

const DOT_COUNT = 8;
const RADIUS = 16;
const DOT_COLORS = ['#CD1041', '#F58A25', '#F1BE32', '#6921E6', '#9B69BC', '#AD8FFF', '#007EFC', '#38BDF8'];

export default function StartupLoader() {
	const logoAsset = require('../assets/images/cc-wordmark.png');
	const logoSrc =
		typeof logoAsset === 'string'
			? logoAsset
			: logoAsset?.default ?? logoAsset?.uri ?? '';

	return (
		<>
			<style>
				{`@keyframes startup-spin {
						from { transform: rotate(0deg); }
						to { transform: rotate(360deg); }
					}

					@keyframes startup-color-cycle {
						0% { filter: saturate(1); }
						50% { filter: saturate(1.25); }
						100% { filter: saturate(1); }
					}
				`}
			</style>
			<div
				style={{
					minHeight: '100vh',
					display: 'flex',
					flexDirection: 'column',
					alignItems: 'center',
					justifyContent: 'center',
					backgroundColor: '#F5F0E8',
				}}
			>
				<img
					src={logoSrc}
					alt="Crash Course"
					style={{ width: 260, height: 56, objectFit: 'contain', marginBottom: 26 }}
				/>
				<div
					style={{
						width: 40,
						height: 40,
						position: 'relative',
						animation: 'startup-spin 0.9s linear infinite',
						willChange: 'transform',
					}}
				>
					{Array.from({ length: DOT_COUNT }, (_, i) => {
						const angle = (i / DOT_COUNT) * Math.PI * 2;
						const x = Math.cos(angle) * RADIUS;
						const y = Math.sin(angle) * RADIUS;
						const opacity = 0.25 + (i / DOT_COUNT) * 0.75;

						return (
							<span
								key={i}
								style={{
									position: 'absolute',
									width: 6,
									height: 6,
									borderRadius: '50%',
									backgroundColor: DOT_COLORS[i],
									left: '50%',
									top: '50%',
									transform: `translate(-50%, -50%) translate(${x}px, ${y}px)`,
									opacity,
									animation: 'startup-color-cycle 960ms ease-in-out infinite',
									animationDelay: `${-i * 120}ms`,
								}}
							/>
						);
					})}
				</div>
			</div>
		</>
	);
}
