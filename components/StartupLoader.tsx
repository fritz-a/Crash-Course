import { useEffect, useMemo, useRef, useState } from 'react';
import { Animated, Easing, Image, StyleSheet, View } from 'react-native';
//Loading code from https://uiball.com/ldrs/ but help fro copilot to help implement into our code

export default function StartupLoader() {
	const rotate = useRef(new Animated.Value(0)).current;
	const [phase, setPhase] = useState(0);
	const colors = useMemo(
		() => ['#CD1041', '#F58A25', '#F1BE32', '#6921E6', '#9B69BC', '#AD8FFF', '#007EFC', '#38BDF8'],
		[]
	);

	useEffect(() => {
		const loop = Animated.loop(
			Animated.timing(rotate, {
				toValue: 1,
				duration: 900,
				easing: Easing.linear,
				useNativeDriver: true,
			})
		);

		loop.start();
		return () => loop.stop();
	}, [rotate]);

	useEffect(() => {
		const timer = setInterval(() => {
			setPhase((value) => (value + 1) % colors.length);
		}, 120);

		return () => clearInterval(timer);
	}, [colors.length]);

	const dots = useMemo(() => {
		const count = 8;
		const radius = 16;

		return Array.from({ length: count }, (_, i) => {
			const angle = (i / count) * Math.PI * 2;
			return {
				x: Math.cos(angle) * radius,
				y: Math.sin(angle) * radius,
				opacity: 0.25 + (i / count) * 0.75,
			};
		});
	}, []);

	const spinStyle = {
		transform: [
			{
				rotate: rotate.interpolate({
					inputRange: [0, 1],
					outputRange: ['0deg', '360deg'],
				}),
			},
		],
	};

	return (
		<View style={styles.container}>
			<Image source={require('../assets/images/cc-wordmark.png')} style={styles.logo} />
			<Animated.View style={[styles.spinner, spinStyle]}>
				{dots.map((dot, index) => (
					<View
						key={index}
						style={[
							styles.dot,
							{
								left: '50%',
								top: '50%',
								opacity: dot.opacity,
								backgroundColor: colors[(index + phase) % colors.length],
								transform: [{ translateX: dot.x - 3 }, { translateY: dot.y - 3 }],
							},
						]}
					/>
				))}
			</Animated.View>
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		alignItems: 'center',
		justifyContent: 'center',
		backgroundColor: '#F5F0E8',
	},
	logo: {
		width: 260,
		height: 56,
		resizeMode: 'contain',
		marginBottom: 26,
	},
	spinner: {
		width: 40,
		height: 40,
		position: 'relative',
	},
	dot: {
		position: 'absolute',
		width: 6,
		height: 6,
		borderRadius: 3,
	},
});
