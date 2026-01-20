import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Animated, Easing, Text } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import {
    Brain,
    Activity,
    ScanLine,
    BarChart2,
    Crosshair,
    Bot,
    Check,
    Crown,
    Gem,
    Database,
    Cpu,
    Globe,
    Shield
} from 'lucide-react-native';

const ICON_SIZE = 120;
const ACCENT_COLOR = '#4BC41E';
const SECONDARY_COLOR = '#4BC41E';

// ============================================================================
// SCENE 1: WELCOME / AI CORE (Welcome to GoalGPT)
// A central "brain" pulsing, with orbiting data nodes
// ============================================================================
const Scene1 = () => {
    const scaleAnim = useRef(new Animated.Value(1)).current;
    const opacityAnim = useRef(new Animated.Value(0.5)).current;
    const rotateAnim = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        Animated.loop(
            Animated.sequence([
                Animated.timing(scaleAnim, { toValue: 1.1, duration: 1500, useNativeDriver: true, easing: Easing.inOut(Easing.ease) }),
                Animated.timing(scaleAnim, { toValue: 1, duration: 1500, useNativeDriver: true, easing: Easing.inOut(Easing.ease) })
            ])
        ).start();

        Animated.loop(
            Animated.sequence([
                Animated.timing(opacityAnim, { toValue: 1, duration: 1000, useNativeDriver: true }),
                Animated.timing(opacityAnim, { toValue: 0.5, duration: 1000, useNativeDriver: true })
            ])
        ).start();

        Animated.loop(
            Animated.timing(rotateAnim, {
                toValue: 1,
                duration: 8000,
                easing: Easing.linear,
                useNativeDriver: true
            })
        ).start();
    }, []);

    const spin = rotateAnim.interpolate({
        inputRange: [0, 1],
        outputRange: ['0deg', '360deg']
    });

    return (
        <View style={styles.sceneContainer}>
            {/* Orbiting Elements */}
            <Animated.View style={[styles.orbitContainer, { transform: [{ rotate: spin }] }]}>
                <View style={[styles.orbitNode, { top: 0, left: '50%', marginLeft: -15 }]}>
                    <Database size={30} color={SECONDARY_COLOR} opacity={0.6} />
                </View>
                <View style={[styles.orbitNode, { bottom: 0, left: '50%', marginLeft: -15 }]}>
                    <Cpu size={30} color={SECONDARY_COLOR} opacity={0.6} />
                </View>
                <View style={[styles.orbitNode, { left: 0, top: '50%', marginTop: -15 }]}>
                    <Globe size={30} color={SECONDARY_COLOR} opacity={0.6} />
                </View>
                <View style={[styles.orbitNode, { right: 0, top: '50%', marginTop: -15 }]}>
                    <Shield size={30} color={SECONDARY_COLOR} opacity={0.6} />
                </View>
            </Animated.View>

            {/* Glowing Background */}
            <Animated.View style={[styles.glowRing, { opacity: opacityAnim, transform: [{ scale: Animated.multiply(scaleAnim, 1.2) }] }]} />

            {/* Main Icon */}
            <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
                <Brain size={ICON_SIZE} color={ACCENT_COLOR} fill="rgba(75, 196, 30, 0.2)" />
            </Animated.View>
        </View>
    );
};

// ============================================================================
// SCENE 2: LIVE MATCH SCANNER (Replaced Real-Time Analytics)
// Sophisticated Radar Scanner detecting signals and goals
// ============================================================================
const Scene2 = () => {
    // Animation Values
    const scanRotation = useRef(new Animated.Value(0)).current;
    // Blips represent found matches/signals
    const blip1Scale = useRef(new Animated.Value(0)).current;
    const blip1Opacity = useRef(new Animated.Value(0)).current;

    const blip2Scale = useRef(new Animated.Value(0)).current;
    const blip2Opacity = useRef(new Animated.Value(0)).current;

    const gridOpacity = useRef(new Animated.Value(0.3)).current;

    useEffect(() => {
        // 1. Radar Rotation (Infinite) - simulates scanning
        Animated.loop(
            Animated.timing(scanRotation, {
                toValue: 1,
                duration: 3000,
                easing: Easing.linear,
                useNativeDriver: true
            })
        ).start();

        // 2. Pulse Grid Background - gives "live data" feel
        Animated.loop(
            Animated.sequence([
                Animated.timing(gridOpacity, { toValue: 0.6, duration: 1500, useNativeDriver: true }),
                Animated.timing(gridOpacity, { toValue: 0.3, duration: 1500, useNativeDriver: true })
            ])
        ).start();

        // 3. Signal Blip Animation Helper
        const pulseBlip = (scale: Animated.Value, opacity: Animated.Value, delay: number) => {
            return Animated.loop(
                Animated.sequence([
                    Animated.delay(delay), // Wait for scanner to pass
                    Animated.parallel([
                        // Appear rapidly
                        Animated.timing(scale, { toValue: 1, duration: 400, easing: Easing.out(Easing.back(1.5)), useNativeDriver: true }),
                        Animated.timing(opacity, { toValue: 1, duration: 200, useNativeDriver: true })
                    ]),
                    Animated.delay(1000), // Stay visible
                    // Fade out
                    Animated.timing(opacity, { toValue: 0, duration: 600, useNativeDriver: true }),
                    Animated.timing(scale, { toValue: 0, duration: 0, useNativeDriver: true }) // Reset
                ])
            );
        };

        // Start blips at different intervals
        pulseBlip(blip1Scale, blip1Opacity, 500).start();
        pulseBlip(blip2Scale, blip2Opacity, 2000).start();

    }, []);

    const spin = scanRotation.interpolate({
        inputRange: [0, 1],
        outputRange: ['0deg', '360deg']
    });

    return (
        <View style={styles.sceneContainer}>
            {/* Background Grid - Data Feel */}
            <Animated.View style={{ opacity: gridOpacity, position: 'absolute' }}>
                {/* Using Activity icon as a grid abstraction, heavily scaled */}
                <Activity size={220} color={SECONDARY_COLOR} strokeWidth={0.5} style={{ opacity: 0.2 }} />
            </Animated.View>

            {/* Static Radar Rings */}
            <View style={[styles.orbitContainer, { width: 180, height: 180, borderRadius: 90, borderColor: 'rgba(75, 196, 30, 0.3)', borderWidth: 1 }]} />
            <View style={[styles.orbitContainer, { width: 100, height: 100, borderRadius: 50, borderColor: 'rgba(75, 196, 30, 0.5)', borderWidth: 1 }]} />
            <View style={{ width: 4, height: 4, borderRadius: 2, backgroundColor: ACCENT_COLOR, position: 'absolute' }} />

            {/* Central Hub Icon */}
            <View style={{ backgroundColor: 'rgba(7, 26, 18, 0.8)', padding: 10, borderRadius: 20, borderWidth: 1, borderColor: ACCENT_COLOR }}>
                <Database size={32} color={ACCENT_COLOR} />
            </View>

            {/* Rotating Scanner Beam Container */}
            <Animated.View style={[
                styles.radarContainer, // Needs to be absolute and centered
                {
                    position: 'absolute',
                    width: 200,
                    height: 200,
                    justifyContent: 'center',
                    alignItems: 'center',
                    transform: [{ rotate: spin }]
                }
            ]}>
                {/* The Beam itself - Gradient fading out */}
                <LinearGradient
                    colors={['rgba(75, 196, 30, 0.5)', 'transparent']}
                    style={{
                        position: 'absolute',
                        top: 0,
                        left: 100, // Start from center (width/2)
                        width: 100, // Extends to edge
                        height: 40, // Height of the fan
                        transform: [{ translateY: 100 }, { rotate: '-90deg' }, { translateX: 50 }, { translateY: -20 }] // Complex transform to align fan cone, simplified via layout usually but absolute is easier here
                    }}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }} // Gradient direction
                />

                {/* Simple line beam */}
                <View style={{
                    position: 'absolute',
                    top: 100,
                    left: 100,
                    width: 100,
                    height: 2,
                    backgroundColor: ACCENT_COLOR,
                    shadowColor: ACCENT_COLOR,
                    shadowRadius: 5,
                    shadowOpacity: 1
                }} />
            </Animated.View>

            {/* Detected Signal 1: "MATCH FOUND" */}
            <Animated.View style={[
                styles.blip,
                { top: 60, right: 40, transform: [{ scale: blip1Scale }], opacity: blip1Opacity }
            ]}>
                <View style={styles.blipCore} />
                <View style={styles.blipTag}>
                    <Text style={styles.blipText}>MATCH FOUND</Text>
                </View>
            </Animated.View>

            {/* Detected Signal 2: "GOAL!" */}
            <Animated.View style={[
                styles.blip,
                { bottom: 70, left: 50, transform: [{ scale: blip2Scale }], opacity: blip2Opacity }
            ]}>
                <View style={[styles.blipCore, { backgroundColor: '#FFD700', shadowColor: '#FFD700' }]} />
                <View style={[styles.blipTag, { borderColor: '#FFD700' }]}>
                    <Text style={[styles.blipText, { color: '#FFD700' }]}>GOAL DETECTED</Text>
                </View>
            </Animated.View>
        </View>
    );
};

// ============================================================================
// SCENE 3: HIGH ACCURACY (Target Locking)
// Target locking on
// ============================================================================
const Scene3 = () => {
    const rotateAnim = useRef(new Animated.Value(0)).current;
    const scaleAnim = useRef(new Animated.Value(1.5)).current;
    const opacityAnim = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        Animated.loop(
            Animated.timing(rotateAnim, {
                toValue: 1,
                duration: 2000,
                easing: Easing.inOut(Easing.cubic),
                useNativeDriver: true
            })
        ).start();

        Animated.loop(
            Animated.sequence([
                Animated.parallel([
                    Animated.timing(scaleAnim, { toValue: 1, duration: 800, easing: Easing.out(Easing.exp), useNativeDriver: true }),
                    Animated.timing(opacityAnim, { toValue: 1, duration: 400, useNativeDriver: true })
                ]),
                Animated.delay(800),
                Animated.parallel([
                    Animated.timing(scaleAnim, { toValue: 1.5, duration: 0, useNativeDriver: true }),
                    Animated.timing(opacityAnim, { toValue: 0, duration: 400, useNativeDriver: true })
                ])
            ])
        ).start();

    }, []);

    const spin = rotateAnim.interpolate({
        inputRange: [0, 1],
        outputRange: ['0deg', '90deg']
    });

    const targetOpacity = scaleAnim.interpolate({
        inputRange: [1, 1.5],
        outputRange: [1, 0.5]
    });

    const lockOpacity = scaleAnim.interpolate({
        inputRange: [1, 1.1],
        outputRange: [1, 0]
    });

    return (
        <View style={styles.sceneContainer}>
            <Animated.View style={{ opacity: targetOpacity }}>
                <Bot size={100} color={ACCENT_COLOR} />
            </Animated.View>

            <Animated.View style={[styles.overlay, { transform: [{ rotate: spin }, { scale: scaleAnim }], opacity: opacityAnim }]}>
                <Crosshair size={180} color="#FFFFFF" strokeWidth={1.5} />
            </Animated.View>

            <Animated.View style={[styles.lockBadge, { opacity: lockOpacity }]}>
                <Check size={24} color="#000" />
            </Animated.View>
        </View>
    );
};

// ============================================================================
// SCENE 4: PREMIUM (Unlock)
// Glowing Crown
// ============================================================================
const Scene4 = () => {
    const scaleAnim = useRef(new Animated.Value(1)).current;

    useEffect(() => {
        Animated.loop(
            Animated.sequence([
                Animated.timing(scaleAnim, { toValue: 1.1, duration: 2000, useNativeDriver: true }),
                Animated.timing(scaleAnim, { toValue: 1, duration: 2000, useNativeDriver: true })
            ])
        ).start();
    }, []);

    return (
        <View style={styles.sceneContainer}>
            <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
                <Crown size={120} color="#FFD700" fill="rgba(255, 215, 0, 0.2)" strokeWidth={2} />
            </Animated.View>

            <View style={{ position: 'absolute', top: -30, right: -20 }}>
                <Gem size={30} color={ACCENT_COLOR} />
            </View>
            <View style={{ position: 'absolute', bottom: -20, left: -20 }}>
                <Gem size={24} color={ACCENT_COLOR} />
            </View>
        </View>
    );
};


interface TechIllustrationProps {
    slideId: number;
}

export const TechIllustration: React.FC<TechIllustrationProps> = ({ slideId }) => {
    switch (slideId) {
        case 1: return <Scene1 />;
        case 2: return <Scene2 />;
        case 3: return <Scene3 />;
        case 4: return <Scene4 />;
        default: return <Scene1 />;
    }
};

const styles = StyleSheet.create({
    sceneContainer: {
        width: 300,
        height: 300,
        justifyContent: 'center',
        alignItems: 'center',
    },
    orbitContainer: {
        position: 'absolute',
        width: 260,
        height: 260,
        borderRadius: 130,
        borderWidth: 1,
        borderColor: 'rgba(75, 196, 30, 0.2)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    orbitNode: {
        position: 'absolute',
        width: 30,
        height: 30,
        justifyContent: 'center',
        alignItems: 'center',
    },
    glowRing: {
        position: 'absolute',
        width: 140,
        height: 140,
        borderRadius: 70,
        backgroundColor: 'rgba(75, 196, 30, 0.15)',
    },
    overlay: {
        position: 'absolute',
        justifyContent: 'center',
        alignItems: 'center',
    },
    lockBadge: {
        position: 'absolute',
        bottom: 80,
        backgroundColor: ACCENT_COLOR,
        padding: 4,
        borderRadius: 20,
    },
    // NEW STYLES FOR SCANNER SCENE
    radarContainer: {
        // Defines the rotating layer
    },
    radarBeam: {
        // Gradient cone styles
    },
    blip: {
        position: 'absolute',
        alignItems: 'center',
        justifyContent: 'center',
    },
    blipCore: {
        width: 12,
        height: 12,
        borderRadius: 6,
        backgroundColor: ACCENT_COLOR,
        shadowColor: ACCENT_COLOR,
        shadowOpacity: 1,
        shadowRadius: 10,
        marginBottom: 4,
    },
    blipTag: {
        backgroundColor: 'rgba(0,0,0,0.7)',
        paddingHorizontal: 6,
        paddingVertical: 2,
        borderRadius: 4,
        borderWidth: 1,
        borderColor: ACCENT_COLOR,
    },
    blipText: {
        color: ACCENT_COLOR,
        fontSize: 10,
        fontWeight: 'bold',
        fontFamily: 'monospace' // Or your app's mono font
    }
});
