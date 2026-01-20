import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Animated, Easing } from 'react-native';
import {
    Brain,
    Activity,
    ScanLine,
    BarChart2,
    Crosshair,
    Bot, // Using Bot instead of Target for better visibility
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
// SCENE 1: WELCOME / AI CORE
// A central "brain" pulsing, with orbiting data nodes
// ============================================================================
const Scene1 = () => {
    const scaleAnim = useRef(new Animated.Value(1)).current;
    const opacityAnim = useRef(new Animated.Value(0.5)).current;
    const rotateAnim = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        // Pulse Scale
        Animated.loop(
            Animated.sequence([
                Animated.timing(scaleAnim, { toValue: 1.1, duration: 1500, useNativeDriver: true, easing: Easing.inOut(Easing.ease) }),
                Animated.timing(scaleAnim, { toValue: 1, duration: 1500, useNativeDriver: true, easing: Easing.inOut(Easing.ease) })
            ])
        ).start();

        // Pulse Opacity
        Animated.loop(
            Animated.sequence([
                Animated.timing(opacityAnim, { toValue: 1, duration: 1000, useNativeDriver: true }),
                Animated.timing(opacityAnim, { toValue: 0.5, duration: 1000, useNativeDriver: true })
            ])
        ).start();

        // Rotation
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
// SCENE 2: REAL-TIME ANALYTICS
// Scan line moving over chart
// ============================================================================
const Scene2 = () => {
    const scanY = useRef(new Animated.Value(-50)).current;
    const chartOpacity = useRef(new Animated.Value(0.6)).current;

    useEffect(() => {
        // Scan Line
        Animated.loop(
            Animated.timing(scanY, {
                toValue: 150,
                duration: 2000,
                easing: Easing.linear,
                useNativeDriver: true
            })
        ).start();

        // Chart flicker
        Animated.loop(
            Animated.sequence([
                Animated.timing(chartOpacity, { toValue: 1, duration: 500, useNativeDriver: true }),
                Animated.timing(chartOpacity, { toValue: 0.6, duration: 500, useNativeDriver: true })
            ])
        ).start();
    }, []);

    return (
        <View style={styles.sceneContainer}>
            <Animated.View style={{ opacity: chartOpacity }}>
                <BarChart2 size={140} color={ACCENT_COLOR} />
            </Animated.View>

            <View style={styles.overlay}>
                {/* Masking container for scan line */}
                <View style={{ width: 160, height: 160, overflow: 'hidden' }}>
                    <Animated.View style={[styles.scanLine, { transform: [{ translateY: scanY }] }]}>
                        <ScanLine size={160} color="#FFFFFF" strokeWidth={1} />
                    </Animated.View>
                </View>
            </View>
        </View>
    );
};

// ============================================================================
// SCENE 3: HIGH ACCURACY
// Target locking on
// ============================================================================
const Scene3 = () => {
    const rotateAnim = useRef(new Animated.Value(0)).current;
    const scaleAnim = useRef(new Animated.Value(1.5)).current;
    const opacityAnim = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        // Rotate Crosshair
        Animated.loop(
            Animated.timing(rotateAnim, {
                toValue: 1,
                duration: 2000,
                easing: Easing.inOut(Easing.cubic),
                useNativeDriver: true
            })
        ).start();

        // Lock-on Effect sequence
        Animated.loop(
            Animated.sequence([
                // Zoom in
                Animated.parallel([
                    Animated.timing(scaleAnim, { toValue: 1, duration: 800, easing: Easing.out(Easing.exp), useNativeDriver: true }),
                    Animated.timing(opacityAnim, { toValue: 1, duration: 400, useNativeDriver: true })
                ]),
                // Hold
                Animated.delay(800),
                // Reset
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

    // Interpolate scale for target opacity
    const targetOpacity = scaleAnim.interpolate({
        inputRange: [1, 1.5],
        outputRange: [1, 0.5]
    });

    // Interpolate scale for lock badge opacity
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

            {/* "Lock" confirmation */}
            <Animated.View style={[styles.lockBadge, { opacity: lockOpacity }]}>
                <Check size={24} color="#000" />
            </Animated.View>
        </View>
    );
};

// ============================================================================
// SCENE 4: PREMIUM
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

            {/* Sparkles */}
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
    scanLine: {
        width: 160,
        height: 2,
        backgroundColor: ACCENT_COLOR,
        shadowColor: ACCENT_COLOR,
        shadowOpacity: 1,
        shadowRadius: 10,
    },
    lockBadge: {
        position: 'absolute',
        bottom: 80,
        backgroundColor: ACCENT_COLOR,
        padding: 4,
        borderRadius: 20,
    }
});
