import React, { useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import Animated, {
    useSharedValue,
    useAnimatedStyle,
    withRepeat,
    withTiming,
    withSequence,
    Easing,
    withDelay,
    interpolate,
} from 'react-native-reanimated';
import {
    Brain,
    Zap,
    Activity,
    ScanLine,
    BarChart2,
    Crosshair,
    Target,
    Check,
    Crown,
    Gem,
    Cpu,
    Database,
    Globe,
    Shield,
    Bot
} from 'lucide-react-native';

const ICON_SIZE = 120;
const ACCENT_COLOR = '#4BC41E';
const SECONDARY_COLOR = '#4BC41E';

// ============================================================================
// SCENE 1: WELCOME / AI CORE
// A central "brain" pulsing, with orbiting data nodes
// ============================================================================
const Scene1 = () => {
    const scale = useSharedValue(1);
    const opacity = useSharedValue(0.5);
    const rotate = useSharedValue(0);

    useEffect(() => {
        scale.value = withRepeat(
            withSequence(
                withTiming(1.1, { duration: 1500, easing: Easing.inOut(Easing.ease) }),
                withTiming(1, { duration: 1500, easing: Easing.inOut(Easing.ease) })
            ),
            -1,
            true
        );
        opacity.value = withRepeat(
            withSequence(
                withTiming(1, { duration: 1000 }),
                withTiming(0.5, { duration: 1000 })
            ),
            -1,
            true
        );
        rotate.value = withRepeat(
            withTiming(360, { duration: 8000, easing: Easing.linear }),
            -1,
            false
        );
    }, []);

    const centerStyle = useAnimatedStyle(() => ({
        transform: [{ scale: scale.value }],
    }));

    const glowStyle = useAnimatedStyle(() => ({
        opacity: opacity.value,
        transform: [{ scale: scale.value * 1.2 }],
    }));

    const orbitStyle = useAnimatedStyle(() => ({
        transform: [{ rotate: `${rotate.value}deg` }],
    }));

    return (
        <View style={styles.sceneContainer}>
            {/* Orbiting Elements */}
            <Animated.View style={[styles.orbitContainer, orbitStyle]}>
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
            <Animated.View style={[styles.glowRing, glowStyle]} />

            {/* Main Icon */}
            <Animated.View style={centerStyle}>
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
    const scanY = useSharedValue(-50);
    const chartOpacity = useSharedValue(0.6);

    useEffect(() => {
        scanY.value = withRepeat(
            withTiming(150, { duration: 2000, easing: Easing.linear }),
            -1,
            false
        );

        chartOpacity.value = withRepeat(
            withSequence(
                withTiming(1, { duration: 500 }),
                withTiming(0.6, { duration: 500 })
            ),
            -1,
            true
        );
    }, []);

    const scanLineStyle = useAnimatedStyle(() => ({
        transform: [{ translateY: scanY.value }],
    }));

    const chartStyle = useAnimatedStyle(() => ({
        opacity: chartOpacity.value,
    }));

    return (
        <View style={styles.sceneContainer}>
            <Animated.View style={chartStyle}>
                <BarChart2 size={140} color={ACCENT_COLOR} />
            </Animated.View>

            <View style={styles.overlay}>
                {/* Masking container for scan line */}
                <View style={{ width: 160, height: 160, overflow: 'hidden' }}>
                    <Animated.View style={[styles.scanLine, scanLineStyle]}>
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
    const rotate = useSharedValue(0);
    const scale = useSharedValue(1.5);
    const opacity = useSharedValue(0);

    useEffect(() => {
        rotate.value = withRepeat(
            withTiming(90, { duration: 2000, easing: Easing.inOut(Easing.cubic) }),
            -1,
            true
        );
        scale.value = withRepeat(
            withSequence(
                withTiming(1, { duration: 800, easing: Easing.out(Easing.exp) }),
                withDelay(1200, withTiming(1.5, { duration: 0 }))
            ),
            -1,
            false
        );
        opacity.value = withRepeat(
            withSequence(
                withTiming(1, { duration: 400 }),
                withDelay(1200, withTiming(0, { duration: 400 }))
            ),
            -1,
            false
        );

    }, []);

    const crosshairStyle = useAnimatedStyle(() => ({
        transform: [{ rotate: `${rotate.value}deg` }, { scale: scale.value }],
        opacity: opacity.value
    }));

    const targetStyle = useAnimatedStyle(() => ({
        opacity: interpolate(scale.value, [1.5, 1], [0.5, 1])
    }));

    return (
        <View style={styles.sceneContainer}>
            <Animated.View style={targetStyle}>
                <Bot size={100} color={ACCENT_COLOR} />
            </Animated.View>

            <Animated.View style={[styles.overlay, crosshairStyle]}>
                <Crosshair size={180} color="#FFFFFF" strokeWidth={1.5} />
            </Animated.View>

            {/* "Lock" confirmation */}
            <Animated.View style={[styles.lockBadge, { opacity: interpolate(scale.value, [1.1, 1], [0, 1]) }]}>
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
    const scale = useSharedValue(1);
    const shine = useSharedValue(-100);

    useEffect(() => {
        scale.value = withRepeat(
            withSequence(
                withTiming(1.1, { duration: 2000 }),
                withTiming(1, { duration: 2000 })
            ),
            -1,
            true
        );
    }, []);

    const crownStyle = useAnimatedStyle(() => ({
        transform: [{ scale: scale.value }],
    }));

    return (
        <View style={styles.sceneContainer}>
            <Animated.View style={crownStyle}>
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
