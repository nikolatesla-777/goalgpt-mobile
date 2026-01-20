/**
 * AnimatedSplash
 *
 * High-tech animated splash screen (Expo Go 100% compatible).
 * Uses React Native's built-in Animated API (no Reanimated).
 *
 * Features:
 * - Dark Green Gradient Background
 * - Logo Fade-in + Scale Animation
 * - "GoalGPT" Title Text Reveal
 * - "POWERED BY AI" Subtitle with Scanning Bar
 * - AI Pulse Rings around Logo
 */

import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Dimensions, Image, Animated, Easing } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

const { width, height } = Dimensions.get('window');

// ============================================================================
// CONFIGURATION
// ============================================================================

const ANIMATION_DURATION = 4500; // ms (+2 seconds per user request)
const BG_COLORS = ['#071A12', '#062016', '#030B07'] as const;

interface AnimatedSplashProps {
    onComplete: () => void;
}

// ============================================================================
// MAIN COMPONENT
// ============================================================================

export const AnimatedSplash: React.FC<AnimatedSplashProps> = ({ onComplete }) => {
    // Animation Values (React Native's built-in Animated)
    const logoScale = useRef(new Animated.Value(0.85)).current;
    const logoOpacity = useRef(new Animated.Value(0)).current;
    const textOpacity = useRef(new Animated.Value(0)).current;
    const scanLineX = useRef(new Animated.Value(-40)).current;
    const containerOpacity = useRef(new Animated.Value(1)).current;

    // Pulse ring animations
    const ring1Scale = useRef(new Animated.Value(0.8)).current;
    const ring1Opacity = useRef(new Animated.Value(0.6)).current;
    const ring2Scale = useRef(new Animated.Value(0.8)).current;
    const ring2Opacity = useRef(new Animated.Value(0.6)).current;

    useEffect(() => {
        // 1. Logo Entrance
        Animated.parallel([
            Animated.timing(logoOpacity, {
                toValue: 1,
                duration: 800,
                useNativeDriver: true,
            }),
            Animated.spring(logoScale, {
                toValue: 1,
                friction: 8,
                tension: 40,
                useNativeDriver: true,
            }),
        ]).start();

        // 2. Text Reveal (delayed)
        Animated.timing(textOpacity, {
            toValue: 1,
            duration: 600,
            delay: 400,
            useNativeDriver: true,
        }).start();

        // 3. Scan Line Loop
        const scanAnimation = Animated.loop(
            Animated.sequence([
                Animated.timing(scanLineX, {
                    toValue: 120,
                    duration: 1200,
                    easing: Easing.inOut(Easing.ease),
                    useNativeDriver: true,
                }),
                Animated.timing(scanLineX, {
                    toValue: -40,
                    duration: 1200,
                    easing: Easing.inOut(Easing.ease),
                    useNativeDriver: true,
                }),
            ])
        );
        setTimeout(() => scanAnimation.start(), 800);

        // 4. Pulse Ring 1
        const pulseRing1 = Animated.loop(
            Animated.parallel([
                Animated.timing(ring1Scale, {
                    toValue: 1.8,
                    duration: 2000,
                    easing: Easing.out(Easing.ease),
                    useNativeDriver: true,
                }),
                Animated.timing(ring1Opacity, {
                    toValue: 0,
                    duration: 2000,
                    easing: Easing.out(Easing.ease),
                    useNativeDriver: true,
                }),
            ])
        );
        pulseRing1.start();

        // 5. Pulse Ring 2 (delayed)
        setTimeout(() => {
            const pulseRing2 = Animated.loop(
                Animated.parallel([
                    Animated.timing(ring2Scale, {
                        toValue: 1.8,
                        duration: 2000,
                        easing: Easing.out(Easing.ease),
                        useNativeDriver: true,
                    }),
                    Animated.timing(ring2Opacity, {
                        toValue: 0,
                        duration: 2000,
                        easing: Easing.out(Easing.ease),
                        useNativeDriver: true,
                    }),
                ])
            );
            pulseRing2.start();
        }, 1000);

        // 6. Exit after animation duration
        const exitTimer = setTimeout(() => {
            Animated.timing(containerOpacity, {
                toValue: 0,
                duration: 300,
                useNativeDriver: true,
            }).start(() => {
                onComplete();
            });
        }, ANIMATION_DURATION);

        return () => {
            clearTimeout(exitTimer);
        };
    }, []);

    return (
        <Animated.View style={[styles.container, { opacity: containerOpacity }]}>
            {/* 1. Full-screen Gradient Background */}
            <LinearGradient
                colors={['#0A1F14', '#071A12', '#040D08']}
                style={StyleSheet.absoluteFill}
                start={{ x: 0.5, y: 0 }}
                end={{ x: 0.5, y: 1 }}
            />

            {/* 2. Subtle radial glow in center (using overlapping gradients) */}
            <LinearGradient
                colors={['rgba(75, 196, 30, 0.08)', 'transparent']}
                style={StyleSheet.absoluteFill}
                start={{ x: 0.5, y: 0.3 }}
                end={{ x: 0.5, y: 0.9 }}
            />

            {/* 4. Center Content */}
            <View style={styles.centerContent}>
                {/* Logo with Pulse Rings */}
                <View style={styles.logoWrapper}>
                    {/* Pulse Ring 1 */}
                    <Animated.View
                        style={[
                            styles.pulseRing,
                            {
                                transform: [{ scale: ring1Scale }],
                                opacity: ring1Opacity,
                            },
                        ]}
                    />
                    {/* Pulse Ring 2 */}
                    <Animated.View
                        style={[
                            styles.pulseRing,
                            {
                                transform: [{ scale: ring2Scale }],
                                opacity: ring2Opacity,
                            },
                        ]}
                    />

                    <Animated.Image
                        source={require('../../assets/images/splash-logo.png')}
                        style={[
                            styles.logo,
                            {
                                opacity: logoOpacity,
                                transform: [{ scale: logoScale }],
                            },
                        ]}
                        resizeMode="contain"
                    />
                </View>

                {/* Title */}
                <Animated.Text style={[styles.title, { opacity: textOpacity }]}>
                    GoalGPT
                </Animated.Text>

                {/* Subtitle with Scan Bar */}
                <View style={styles.poweredWrapper}>
                    <Animated.Text style={[styles.subtitle, { opacity: textOpacity }]}>
                        POWERED BY AI
                    </Animated.Text>
                    <View style={styles.scanTrack}>
                        <Animated.View
                            style={[
                                styles.scanBar,
                                { transform: [{ translateX: scanLineX }] },
                            ]}
                        />
                    </View>
                </View>
            </View>
        </Animated.View>
    );
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
