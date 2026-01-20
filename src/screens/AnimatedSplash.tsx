/**
 * AnimatedSplash
 *
 * High-tech animated splash screen (Expo Go compatible).
 * Uses only Reanimated + LinearGradient (no Skia).
 *
 * Features:
 * - Dark Green Gradient Background
 * - Logo Fade-in + Scale Animation
 * - "GoalGPT" Title Text Reveal
 * - "POWERED BY AI" Subtitle with Scanning Bar
 * - AI Pulse Rings around Logo
 */

import React, { useEffect } from 'react';
import { View, StyleSheet, Dimensions, Image, Text } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, {
    useSharedValue,
    useAnimatedStyle,
    withTiming,
    withDelay,
    withRepeat,
    withSequence,
    withSpring,
    runOnJS,
    Easing,
} from 'react-native-reanimated';

const { width, height } = Dimensions.get('window');

// ============================================================================
// CONFIGURATION
// ============================================================================

const ANIMATION_DURATION = 2500; // ms
const BG_COLORS = ['#071A12', '#062016', '#030B07'] as const;

interface AnimatedSplashProps {
    onComplete: () => void;
}

// ============================================================================
// MAIN COMPONENT
// ============================================================================

export const AnimatedSplash: React.FC<AnimatedSplashProps> = ({ onComplete }) => {
    // Animation States
    const logoScale = useSharedValue(0.85);
    const logoOpacity = useSharedValue(0);
    const textOpacity = useSharedValue(0);
    const scanLineX = useSharedValue(-40);
    const containerOpacity = useSharedValue(1);

    useEffect(() => {
        // 1. Logo Entrance
        logoOpacity.value = withTiming(1, { duration: 800 });
        logoScale.value = withSpring(1, { damping: 12 });

        // 2. Text Reveal
        textOpacity.value = withDelay(400, withTiming(1, { duration: 600 }));

        // 3. Scan Line Loop (continuous left-to-right)
        scanLineX.value = withDelay(
            800,
            withRepeat(
                withTiming(120, { duration: 1200, easing: Easing.inOut(Easing.ease) }),
                -1, // Infinite repeat
                true // Reverse
            )
        );

        // 4. Exit after animation duration
        const timer = setTimeout(() => {
            containerOpacity.value = withTiming(0, { duration: 300 }, (finished) => {
                if (finished) runOnJS(onComplete)();
            });
        }, ANIMATION_DURATION);

        return () => clearTimeout(timer);
    }, []);

    // Animated Styles
    const animatedLogoStyle = useAnimatedStyle(() => ({
        opacity: logoOpacity.value,
        transform: [{ scale: logoScale.value }],
    }));

    const animatedTextStyle = useAnimatedStyle(() => ({
        opacity: textOpacity.value,
    }));

    const animatedScanLineStyle = useAnimatedStyle(() => ({
        transform: [{ translateX: scanLineX.value }],
    }));

    const animatedContainerStyle = useAnimatedStyle(() => ({
        opacity: containerOpacity.value,
    }));

    return (
        <Animated.View style={[styles.container, animatedContainerStyle]}>
            {/* 1. Gradient Background */}
            <LinearGradient
                colors={BG_COLORS}
                style={StyleSheet.absoluteFill}
                start={{ x: 0.5, y: 0 }}
                end={{ x: 0.5, y: 1 }}
            />

            {/* 2. Optional Background Image (Stadium) */}
            <Image
                source={require('../../assets/images/splash-bg.png')}
                style={[StyleSheet.absoluteFill, styles.bgImage]}
                resizeMode="cover"
                blurRadius={5}
            />

            {/* 3. Vignette Overlay */}
            <LinearGradient
                colors={['transparent', 'rgba(0,0,0,0.6)']}
                style={StyleSheet.absoluteFill}
                start={{ x: 0.5, y: 0 }}
                end={{ x: 0.5, y: 1 }}
            />

            {/* 4. Center Content */}
            <View style={styles.centerContent}>
                {/* Logo with Pulse Rings */}
                <View style={styles.logoWrapper}>
                    <PulseRing delay={0} />
                    <PulseRing delay={1000} />

                    <Animated.Image
                        source={require('../../assets/images/splash-logo.png')}
                        style={[styles.logo, animatedLogoStyle]}
                        resizeMode="contain"
                    />
                </View>

                {/* Title */}
                <Animated.Text style={[styles.title, animatedTextStyle]}>
                    GoalGPT
                </Animated.Text>

                {/* Subtitle with Scan Bar */}
                <View style={styles.poweredWrapper}>
                    <Animated.Text style={[styles.subtitle, animatedTextStyle]}>
                        POWERED BY AI
                    </Animated.Text>
                    <View style={styles.scanTrack}>
                        <Animated.View style={[styles.scanBar, animatedScanLineStyle]} />
                    </View>
                </View>
            </View>
        </Animated.View>
    );
};

// ============================================================================
// PULSE RING COMPONENT
// ============================================================================

const PulseRing = ({ delay }: { delay: number }) => {
    const ringScale = useSharedValue(0.8);
    const ringOpacity = useSharedValue(0.6);

    useEffect(() => {
        // Infinite pulsing animation
        ringScale.value = withDelay(
            delay,
            withRepeat(
                withTiming(1.8, { duration: 2000, easing: Easing.out(Easing.ease) }),
                -1, // Infinite
                false
            )
        );

        ringOpacity.value = withDelay(
            delay,
            withRepeat(
                withTiming(0, { duration: 2000, easing: Easing.out(Easing.ease) }),
                -1,
                false
            )
        );
    }, []);

    const style = useAnimatedStyle(() => ({
        transform: [{ scale: ringScale.value }],
        opacity: ringOpacity.value,
    }));

    return <Animated.View style={[styles.pulseRing, style]} />;
};

// ============================================================================
// STYLES
// ============================================================================

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#071A12',
    },
    bgImage: {
        opacity: 0.1,
    },
    centerContent: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 20,
    },
    logoWrapper: {
        width: 200,
        height: 200,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 20,
    },
    logo: {
        width: 180,
        height: 180,
        zIndex: 2,
    },
    pulseRing: {
        position: 'absolute',
        width: 160,
        height: 160,
        borderRadius: 80,
        borderWidth: 2,
        borderColor: 'rgba(75, 196, 30, 0.5)',
        zIndex: 1,
    },
    title: {
        fontSize: 56,
        fontWeight: '900',
        color: '#FFFFFF',
        letterSpacing: 2,
        textShadowColor: 'rgba(75, 196, 30, 0.6)',
        textShadowOffset: { width: 0, height: 0 },
        textShadowRadius: 20,
        marginBottom: 10,
    },
    poweredWrapper: {
        marginTop: 10,
        alignItems: 'center',
    },
    subtitle: {
        fontSize: 14,
        fontWeight: '600',
        color: '#8E8E93',
        letterSpacing: 3,
    },
    scanTrack: {
        height: 2,
        width: 120,
        backgroundColor: 'rgba(255,255,255,0.1)',
        marginTop: 8,
        overflow: 'hidden',
        borderRadius: 1,
    },
    scanBar: {
        width: 40,
        height: '100%',
        backgroundColor: '#4BC41E',
        shadowColor: '#4BC41E',
        shadowOpacity: 1,
        shadowRadius: 8,
    },
});

export default AnimatedSplash;
