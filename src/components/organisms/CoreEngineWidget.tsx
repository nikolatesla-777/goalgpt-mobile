import React, { useEffect, useRef, useState } from 'react';
import { View, StyleSheet, Dimensions, Animated, Easing } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialCommunityIcons, Ionicons } from '@expo/vector-icons';
import { NeonText } from '../atoms/NeonText';
import { useTheme } from '../../theme/ThemeProvider';
import { spacing, colors, borderRadius } from '../../constants/tokens';

const { width } = Dimensions.get('window');

const LOG_ENTRIES = [
    'Connection established: eu-central-1',
    'Syncing live odds feed...',
    'Analyzing pattern: Over 2.5 Goals',
    'Neural node handshake active',
    'Verifying squad depth: Premier League',
    'Calculating xG models...',
    'Latency optimized: 12ms',
    'Fetching h2h historical data'
];

export const CoreEngineWidget = () => {
    const { theme } = useTheme();
    const [logText, setLogText] = useState(LOG_ENTRIES[0]);

    // Animation Values
    const spinValue = useRef(new Animated.Value(0)).current;
    const pulseValue = useRef(new Animated.Value(1)).current;
    const scannerValue = useRef(new Animated.Value(0)).current;
    const fadeAnim = useRef(new Animated.Value(1)).current;

    useEffect(() => {
        // Spin Animation for Rings
        Animated.loop(
            Animated.timing(spinValue, {
                toValue: 1,
                duration: 10000,
                easing: Easing.linear,
                useNativeDriver: true,
            })
        ).start();

        // Pulse Animation for Green Dot
        Animated.loop(
            Animated.sequence([
                Animated.timing(pulseValue, {
                    toValue: 0.4,
                    duration: 1000,
                    useNativeDriver: true,
                }),
                Animated.timing(pulseValue, {
                    toValue: 1,
                    duration: 1000,
                    useNativeDriver: true,
                }),
            ])
        ).start();

        // Scanner Beam Animation
        Animated.loop(
            Animated.sequence([
                Animated.timing(scannerValue, {
                    toValue: 1,
                    duration: 2500,
                    easing: Easing.inOut(Easing.ease),
                    useNativeDriver: true,
                }),
                Animated.timing(scannerValue, {
                    toValue: 0,
                    duration: 0, // Reset instantly
                    useNativeDriver: true,
                }),
            ])
        ).start();

        // Log Rotation
        const interval = setInterval(() => {
            // Fade out
            Animated.timing(fadeAnim, {
                toValue: 0,
                duration: 200,
                useNativeDriver: true,
            }).start(() => {
                // Update text
                setLogText(prev => {
                    const currentIndex = LOG_ENTRIES.indexOf(prev);
                    return LOG_ENTRIES[(currentIndex + 1) % LOG_ENTRIES.length];
                });
                // Fade in
                Animated.timing(fadeAnim, {
                    toValue: 1,
                    duration: 200,
                    useNativeDriver: true,
                }).start();
            });
        }, 3000);

        return () => clearInterval(interval);
    }, []);

    const spin = spinValue.interpolate({
        inputRange: [0, 1],
        outputRange: ['0deg', '360deg']
    });

    const reverseSpin = spinValue.interpolate({
        inputRange: [0, 1],
        outputRange: ['360deg', '0deg']
    });

    const scannerTranslateX = scannerValue.interpolate({
        inputRange: [0, 1],
        outputRange: [-width, width] // Move across the screen width
    });

    return (
        <View style={styles.container}>
            {/* Main Card */}
            <LinearGradient
                colors={['#09090b', '#050505']}
                style={[styles.card, { borderColor: theme.colors.border }]}
                start={{ x: 0, y: 0 }}
                end={{ x: 0, y: 1 }}
            >
                {/* 1. Header Bar */}
                <View style={styles.header}>
                    <View style={styles.headerLeft}>
                        <Animated.View style={[styles.statusDot, { opacity: pulseValue }]} />
                        <NeonText size="small" color="brand" weight="bold" style={styles.statusText}>
                            YAPAY ZEKA AKTIF
                        </NeonText>
                    </View>
                    <View style={styles.headerRight}>
                        <View style={styles.metaItem}>
                            <Ionicons name="wifi" size={10} color="rgba(255,255,255,0.3)" />
                            <NeonText size="small" color="white" style={styles.metaText}>PING: 14ms</NeonText>
                        </View>
                        <View style={styles.metaItem}>
                            <Ionicons name="globe-outline" size={10} color="rgba(255,255,255,0.3)" />
                            <NeonText size="small" color="white" style={styles.metaText}>REGION: ALL WORLD</NeonText>
                        </View>
                    </View>
                </View>

                {/* 2. Main Body */}
                <View style={styles.body}>
                    {/* Left Icon Area */}
                    {/* Left Icon Area - Premium Brain Animation */}
                    <View style={styles.visualContainer}>
                        <Animated.View style={[styles.ringOuter, { transform: [{ rotate: spin }] }]} />
                        <Animated.View style={[styles.ringInner, { transform: [{ rotate: reverseSpin }] }]} />
                        <View style={styles.chipContainer}>
                            <MaterialCommunityIcons name="brain" size={26} color="#4ade80" style={{ opacity: 0.9 }} />
                        </View>
                        {/* Pulse Effect for Brain */}
                        <Animated.View style={[
                            StyleSheet.absoluteFill,
                            {
                                backgroundColor: 'rgba(74, 222, 128, 0.2)',
                                borderRadius: 40,
                                transform: [{ scale: pulseValue }],
                                zIndex: -1
                            }
                        ]} />
                    </View>

                    {/* Right Content Area */}
                    <View style={styles.contentContainer}>
                        <View style={styles.titleRow}>
                            <NeonText size="medium" weight="bold" color="white">GoalGPT </NeonText>
                            <NeonText size="medium" weight="bold" color="brand" style={styles.glowText}>Core Engine</NeonText>
                        </View>

                        <NeonText size="small" color="white" style={{ ...styles.description, fontSize: 11, fontWeight: 'normal', opacity: 0.7 }}>
                            GoalGPT, en isabetli gol beklentilerini sunabilmek için <NeonText size="small" color="white" weight="bold" style={{ fontSize: 11 }}>500+ veri kaynağından</NeonText> beslenen yapay zeka modeliyle, maçları <NeonText size="small" color="brand" weight="bold" style={{ fontSize: 11 }}>7/24 kesintisiz</NeonText> olarak taramaya devam ediyor.
                        </NeonText>

                        {/* Stats Grid */}
                        <View style={styles.statsGrid}>
                            <View style={styles.statBox}>
                                <NeonText size="small" color="white" style={styles.statLabel}>DATABASE</NeonText>
                                <NeonText size="small" color="white" weight="bold" style={styles.statValue}>+500</NeonText>
                            </View>

                            <View style={styles.statBox}>
                                <NeonText size="small" color="white" style={styles.statLabel}>UPTIME</NeonText>
                                <NeonText size="small" color="white" weight="bold" style={styles.statValue}>99.9%</NeonText>
                            </View>

                            <View style={styles.statBox}>
                                <NeonText size="small" color="white" style={styles.statLabel}>İŞLEM HIZI</NeonText>
                                <NeonText size="small" color="white" weight="bold" style={styles.statValue}>~0.04s</NeonText>
                            </View>
                        </View>
                    </View>
                </View>

                {/* 3. Footer / Logs */}
                <View style={styles.footer}>
                    <View style={styles.logRow}>
                        <Ionicons name="flash" size={12} color="#f59e0b" style={{ marginRight: 6 }} />
                        <Animated.View style={{ opacity: fadeAnim }}>
                            <NeonText size="small" color="white" style={styles.logText}>
                                <NeonText size="small" color="brand" style={{ marginRight: 4 }}>➜ </NeonText>
                                {logText}
                            </NeonText>
                        </Animated.View>
                    </View>

                    <LinearGradient
                        colors={['transparent', '#050505']}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 0 }}
                        style={styles.logGradient}
                    />
                </View>

                {/* 4. Scanner Beam */}
                <View style={styles.scannerContainer}>
                    <Animated.View
                        style={[
                            styles.scannerBeam,
                            { transform: [{ translateX: scannerTranslateX }] }
                        ]}
                    >
                        <LinearGradient
                            colors={['transparent', '#4ade80', 'transparent']}
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 0 }}
                            style={{ flex: 1, opacity: 0.5 }}
                        />
                    </Animated.View>
                </View>

            </LinearGradient>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        marginBottom: spacing.lg,
        paddingHorizontal: spacing.lg,
        shadowColor: '#4ade80',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 12,
        elevation: 5,
    },
    card: {
        borderRadius: borderRadius.xl,
        borderWidth: 1,
        overflow: 'hidden',
        position: 'relative',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: spacing.md,
        paddingVertical: 10,
        backgroundColor: 'rgba(255,255,255,0.02)',
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(255,255,255,0.05)',
    },
    headerLeft: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    statusDot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: '#4ade80',
        marginRight: 6,
        shadowColor: '#4ade80',
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.8,
        shadowRadius: 6,
    },
    statusText: {
        fontSize: 10,
        letterSpacing: 1,
    },
    headerRight: {
        flexDirection: 'row',
        gap: 12,
    },
    metaItem: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
    },
    metaText: {
        fontSize: 9,
        fontFamily: 'Roboto_Mono', // Adjust if font not available
        opacity: 0.7
    },
    body: {
        flexDirection: 'row',
        padding: spacing.md,
        alignItems: 'center',
    },
    visualContainer: {
        width: 80,
        height: 80,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: spacing.md,
    },
    ringOuter: {
        position: 'absolute',
        width: 70,
        height: 70,
        borderRadius: 35,
        borderWidth: 2,
        borderColor: 'rgba(74, 222, 128, 0.1)',
        borderTopColor: 'transparent',
    },
    ringInner: {
        position: 'absolute',
        width: 50,
        height: 50,
        borderRadius: 25,
        borderWidth: 1,
        borderColor: 'rgba(74, 222, 128, 0.2)',
        borderRightColor: 'transparent',
    },
    chipContainer: {
        width: 40,
        height: 40,
        backgroundColor: 'rgba(74, 222, 128, 0.1)',
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: 'rgba(74, 222, 128, 0.2)',
    },
    contentContainer: {
        flex: 1,
    },
    titleRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 4,
        flexWrap: 'wrap',
    },
    glowText: {
        textShadowColor: 'rgba(74, 222, 128, 0.5)',
        textShadowOffset: { width: 0, height: 0 },
        textShadowRadius: 10,
    },
    description: {
        lineHeight: 16,
        marginBottom: spacing.md,
        opacity: 0.8,
    },
    statsGrid: {
        flexDirection: 'row',
        gap: 8,
    },
    statBox: {
        flex: 1,
        backgroundColor: '#111',
        padding: 6,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.05)',
        alignItems: 'flex-start',
    },
    statLabel: {
        fontSize: 8,
        textTransform: 'uppercase',
        marginBottom: 2,
        opacity: 0.6,
        letterSpacing: 0.5,
    },
    statValue: {
        fontSize: 11,
        fontFamily: 'Roboto_Mono', // Adjust if monospace font not available
    },
    footer: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: spacing.md,
        paddingVertical: 8,
        backgroundColor: '#050505',
        borderTopWidth: 1,
        borderTopColor: 'rgba(255,255,255,0.05)',
        position: 'relative',
        height: 32,
    },
    logRow: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
    },
    logText: {
        fontFamily: 'Roboto_Mono',
        fontSize: 10,
        opacity: 0.8,
    },
    logGradient: {
        position: 'absolute',
        right: 0,
        top: 0,
        bottom: 0,
        width: 40,
    },
    scannerContainer: {
        height: 2,
        backgroundColor: '#050505',
        overflow: 'hidden',
        width: '100%',
        position: 'relative',
    },
    scannerBeam: {
        height: '100%',
        width: '50%', // Beam width
        position: 'absolute',
    }
});
