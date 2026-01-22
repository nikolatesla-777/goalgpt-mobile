import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Animated, Easing, Text, Image } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import {
    Brain,
    Activity,
    Database,
    Cpu,
    Globe,
    Shield,
    Zap,
    Network,
    Users,
    Bot,
    Crown,
    Gem,
    Sparkles,
    Star,
    Trophy,
    ShieldCheck
} from 'lucide-react-native';

const ICON_SIZE = 120;
const ACCENT_COLOR = '#4BC41E';
const SECONDARY_COLOR = '#4BC41E';

// ============================================================================
// SCENE 1: WELCOME / AI CORE
// ============================================================================
const Scene1 = () => {
    const scaleAnim = useRef(new Animated.Value(1)).current;
    const opacityAnim = useRef(new Animated.Value(0.5)).current;
    const rotateAnim = useRef(new Animated.Value(0)).current;
    const floatAnim = useRef(new Animated.Value(0)).current;

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

        Animated.loop(
            Animated.sequence([
                Animated.timing(floatAnim, { toValue: 1, duration: 2000, easing: Easing.inOut(Easing.ease), useNativeDriver: true }),
                Animated.timing(floatAnim, { toValue: 0, duration: 2000, easing: Easing.inOut(Easing.ease), useNativeDriver: true })
            ])
        ).start();
    }, []);

    const spin = rotateAnim.interpolate({
        inputRange: [0, 1],
        outputRange: ['0deg', '360deg']
    });

    const counterSpin = rotateAnim.interpolate({
        inputRange: [0, 1],
        outputRange: ['0deg', '-360deg']
    });

    const translateY = floatAnim.interpolate({
        inputRange: [0, 1],
        outputRange: [0, -10]
    });

    return (
        <View style={styles.sceneContainer}>
            <Animated.View style={[styles.orbitContainer, { transform: [{ rotate: spin }] }]}>
                <Animated.View style={[styles.orbitNode, { top: 0, left: '50%', marginLeft: -15, transform: [{ rotate: counterSpin }] }]}>
                    <Database size={30} color={SECONDARY_COLOR} opacity={0.6} />
                </Animated.View>
                <Animated.View style={[styles.orbitNode, { bottom: 0, left: '50%', marginLeft: -15, transform: [{ rotate: counterSpin }] }]}>
                    <Cpu size={30} color={SECONDARY_COLOR} opacity={0.6} />
                </Animated.View>
                <Animated.View style={[styles.orbitNode, { left: 0, top: '50%', marginTop: -15, transform: [{ rotate: counterSpin }] }]}>
                    <Globe size={30} color={SECONDARY_COLOR} opacity={0.6} />
                </Animated.View>
                <Animated.View style={[styles.orbitNode, { right: 0, top: '50%', marginTop: -15, transform: [{ rotate: counterSpin }] }]}>
                    <Shield size={30} color={SECONDARY_COLOR} opacity={0.6} />
                </Animated.View>
            </Animated.View>
            <Animated.View style={[styles.glowRing, { opacity: opacityAnim, transform: [{ scale: Animated.multiply(scaleAnim, 1.2) }] }]} />
            <Animated.View style={{ transform: [{ scale: scaleAnim }, { translateY }] }}>
                <Brain size={ICON_SIZE} color={ACCENT_COLOR} fill="rgba(75, 196, 30, 0.2)" />
            </Animated.View>
        </View>
    );
};

// ============================================================================
// SCENE 2: LIVE MATCH SCANNER
// ============================================================================
const Scene2 = () => {
    const scanRotation = useRef(new Animated.Value(0)).current;
    const blip1Scale = useRef(new Animated.Value(0)).current;
    const blip1Opacity = useRef(new Animated.Value(0)).current;
    const blip2Scale = useRef(new Animated.Value(0)).current;
    const blip2Opacity = useRef(new Animated.Value(0)).current;
    const gridOpacity = useRef(new Animated.Value(0.3)).current;
    const floatAnim = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        Animated.loop(
            Animated.timing(scanRotation, {
                toValue: 1,
                duration: 3000,
                easing: Easing.linear,
                useNativeDriver: true
            })
        ).start();

        Animated.loop(
            Animated.sequence([
                Animated.timing(gridOpacity, { toValue: 0.6, duration: 1500, useNativeDriver: true }),
                Animated.timing(gridOpacity, { toValue: 0.3, duration: 1500, useNativeDriver: true })
            ])
        ).start();

        const pulseBlip = (scale: Animated.Value, opacity: Animated.Value, delay: number) => {
            return Animated.loop(
                Animated.sequence([
                    Animated.delay(delay),
                    Animated.parallel([
                        Animated.timing(scale, { toValue: 1, duration: 400, easing: Easing.out(Easing.back(1.5)), useNativeDriver: true }),
                        Animated.timing(opacity, { toValue: 1, duration: 200, useNativeDriver: true })
                    ]),
                    Animated.delay(1000),
                    Animated.timing(opacity, { toValue: 0, duration: 600, useNativeDriver: true }),
                    Animated.timing(scale, { toValue: 0, duration: 0, useNativeDriver: true })
                ])
            );
        };

        pulseBlip(blip1Scale, blip1Opacity, 500).start();
        pulseBlip(blip2Scale, blip2Opacity, 2000).start();

        Animated.loop(
            Animated.sequence([
                Animated.timing(floatAnim, { toValue: 1, duration: 2500, easing: Easing.inOut(Easing.ease), useNativeDriver: true }),
                Animated.timing(floatAnim, { toValue: 0, duration: 2500, easing: Easing.inOut(Easing.ease), useNativeDriver: true })
            ])
        ).start();
    }, []);

    const spin = scanRotation.interpolate({
        inputRange: [0, 1],
        outputRange: ['0deg', '360deg']
    });

    const translateY = floatAnim.interpolate({
        inputRange: [0, 1],
        outputRange: [0, -8]
    });

    return (
        <View style={styles.sceneContainer}>
            <Animated.View style={{ opacity: gridOpacity, position: 'absolute' }}>
                <Activity size={220} color={SECONDARY_COLOR} strokeWidth={0.5} style={{ opacity: 0.2 }} />
            </Animated.View>
            <View style={[styles.orbitContainer, { width: 180, height: 180, borderRadius: 90, borderColor: 'rgba(75, 196, 30, 0.3)', borderWidth: 1 }]} />
            <View style={[styles.orbitContainer, { width: 100, height: 100, borderRadius: 50, borderColor: 'rgba(75, 196, 30, 0.5)', borderWidth: 1 }]} />
            <View style={{ width: 4, height: 4, borderRadius: 2, backgroundColor: ACCENT_COLOR, position: 'absolute' }} />
            <Animated.View style={[{ backgroundColor: 'rgba(7, 26, 18, 0.8)', padding: 10, borderRadius: 20, borderWidth: 1, borderColor: ACCENT_COLOR, transform: [{ translateY }] }]}>
                <Database size={32} color={ACCENT_COLOR} />
            </Animated.View>
            <Animated.View style={[
                styles.radarContainer,
                {
                    position: 'absolute', width: 200, height: 200, justifyContent: 'center', alignItems: 'center',
                    transform: [{ rotate: spin }]
                }
            ]}>
                <LinearGradient
                    colors={['rgba(75, 196, 30, 0.5)', 'transparent']}
                    style={{ position: 'absolute', top: 0, left: 100, width: 100, height: 40, transform: [{ translateY: 100 }, { rotate: '-90deg' }, { translateX: 50 }, { translateY: -20 }] }}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                />
                <View style={{ position: 'absolute', top: 100, left: 100, width: 100, height: 2, backgroundColor: ACCENT_COLOR, shadowColor: ACCENT_COLOR, shadowRadius: 5, shadowOpacity: 1 }} />
            </Animated.View>
            <Animated.View style={[styles.blip, { top: 60, right: 40, transform: [{ scale: blip1Scale }], opacity: blip1Opacity }]}>
                <View style={styles.blipCore} />
                <View style={styles.blipTag}>
                    <Text style={styles.blipText}>MATCH FOUND</Text>
                </View>
            </Animated.View>
            <Animated.View style={[styles.blip, { bottom: 70, left: 50, transform: [{ scale: blip2Scale }], opacity: blip2Opacity }]}>
                <View style={[styles.blipCore, { backgroundColor: '#FFD700', shadowColor: '#FFD700' }]} />
                <View style={[styles.blipTag, { borderColor: '#FFD700' }]}>
                    <Text style={[styles.blipText, { color: '#FFD700' }]}>GOAL DETECTED</Text>
                </View>
            </Animated.View>
        </View>
    );
};

// ============================================================================
// SCENE 3: AI SIGNAL ENGINE
// ============================================================================
const Scene3 = () => {
    const bar1Height = useRef(new Animated.Value(20)).current;
    const bar2Height = useRef(new Animated.Value(40)).current;
    const bar3Height = useRef(new Animated.Value(30)).current;
    const bar4Height = useRef(new Animated.Value(60)).current;
    const notifY = useRef(new Animated.Value(-100)).current;
    const notifOpacity = useRef(new Animated.Value(0)).current;
    const wonScale = useRef(new Animated.Value(0)).current;
    const wonOpacity = useRef(new Animated.Value(0)).current;
    const floatAnim = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        const fluctuate = (anim: Animated.Value, min: number, max: number, duration: number) => {
            Animated.loop(
                Animated.sequence([
                    Animated.timing(anim, { toValue: max, duration: duration, easing: Easing.inOut(Easing.ease), useNativeDriver: false }),
                    Animated.timing(anim, { toValue: min, duration: duration, easing: Easing.inOut(Easing.ease), useNativeDriver: false })
                ])
            ).start();
        };

        fluctuate(bar1Height, 20, 50, 800);
        fluctuate(bar2Height, 30, 70, 1100);
        fluctuate(bar3Height, 40, 90, 900);
        fluctuate(bar4Height, 30, 80, 1300);

        const playSequence = () => {
            Animated.sequence([
                Animated.delay(500),
                Animated.parallel([
                    Animated.timing(notifY, { toValue: 0, duration: 600, easing: Easing.bounce, useNativeDriver: true }),
                    Animated.timing(notifOpacity, { toValue: 1, duration: 400, useNativeDriver: true })
                ]),
                Animated.delay(800),
                Animated.parallel([
                    Animated.timing(wonScale, { toValue: 1, duration: 400, easing: Easing.back(2), useNativeDriver: true }),
                    Animated.timing(wonOpacity, { toValue: 1, duration: 300, useNativeDriver: true })
                ]),
                Animated.delay(2000),
                Animated.parallel([
                    Animated.timing(notifOpacity, { toValue: 0, duration: 400, useNativeDriver: true }),
                    Animated.timing(wonOpacity, { toValue: 0, duration: 400, useNativeDriver: true }),
                ]),
                Animated.parallel([
                    Animated.timing(notifY, { toValue: -100, duration: 0, useNativeDriver: true }),
                    Animated.timing(wonScale, { toValue: 0, duration: 0, useNativeDriver: true }),
                ])
            ]).start(() => playSequence());
        };
        playSequence();

        Animated.loop(
            Animated.sequence([
                Animated.timing(floatAnim, { toValue: 1, duration: 2200, easing: Easing.inOut(Easing.ease), useNativeDriver: true }),
                Animated.timing(floatAnim, { toValue: 0, duration: 2200, easing: Easing.inOut(Easing.ease), useNativeDriver: true })
            ])
        ).start();
    }, []);

    const translateY = floatAnim.interpolate({
        inputRange: [0, 1],
        outputRange: [0, -12]
    });

    return (
        <View style={styles.sceneContainer}>
            <Animated.View style={{ flexDirection: 'row', alignItems: 'flex-end', height: 120, gap: 12, marginBottom: 20, transform: [{ translateY }] }}>
                <Animated.View style={{ width: 16, backgroundColor: 'rgba(75, 196, 30, 0.4)', borderRadius: 4, height: bar1Height }} />
                <Animated.View style={{ width: 16, backgroundColor: 'rgba(75, 196, 30, 0.6)', borderRadius: 4, height: bar2Height }} />
                <Animated.View style={{ width: 16, backgroundColor: 'rgba(75, 196, 30, 0.8)', borderRadius: 4, height: bar3Height }} />
                <Animated.View style={{ width: 16, backgroundColor: ACCENT_COLOR, borderRadius: 4, height: bar4Height }} />
            </Animated.View>
            <Animated.View style={[styles.notifCard, { transform: [{ translateY: notifY }], opacity: notifOpacity }]}>
                <Bot size={20} color={ACCENT_COLOR} />
                <View style={{ marginLeft: 10 }}>
                    <Text style={styles.notifTitle}>Goal Prediction</Text>
                    <Text style={styles.notifSub}>Confidence: 92%</Text>
                </View>
                <View style={{ marginLeft: 'auto', backgroundColor: 'rgba(75, 196, 30, 0.2)', padding: 4, borderRadius: 4 }}>
                    <Text style={{ color: ACCENT_COLOR, fontSize: 10, fontWeight: 'bold' }}>LIVE</Text>
                </View>
            </Animated.View>
            <Animated.View style={[styles.wonBadge, { transform: [{ scale: wonScale }, { rotate: wonScale.interpolate({ inputRange: [0, 1], outputRange: ['0deg', '-10deg'] }) }], opacity: wonOpacity }]}>
                <Text style={styles.wonText}>WON</Text>
            </Animated.View>
        </View>
    );
};

// ============================================================================
// SCENE 4: GLOBAL CONNECTED COMMUNITY
// ============================================================================
const Scene4 = () => {
    const ringRotation = useRef(new Animated.Value(0)).current;
    const coreScale = useRef(new Animated.Value(1)).current;
    const lineOpacity = useRef(new Animated.Value(0.3)).current;
    const breathAnim = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        Animated.loop(
            Animated.timing(ringRotation, {
                toValue: 1,
                duration: 25000,
                easing: Easing.linear,
                useNativeDriver: true
            })
        ).start();

        Animated.loop(
            Animated.sequence([
                Animated.timing(coreScale, { toValue: 1.1, duration: 1500, easing: Easing.inOut(Easing.ease), useNativeDriver: true }),
                Animated.timing(coreScale, { toValue: 1, duration: 1500, easing: Easing.inOut(Easing.ease), useNativeDriver: true })
            ])
        ).start();

        Animated.loop(
            Animated.sequence([
                Animated.timing(lineOpacity, { toValue: 0.8, duration: 1000, useNativeDriver: true }),
                Animated.timing(lineOpacity, { toValue: 0.3, duration: 1000, useNativeDriver: true })
            ])
        ).start();

        Animated.loop(
            Animated.sequence([
                Animated.timing(breathAnim, { toValue: 1, duration: 2000, easing: Easing.inOut(Easing.ease), useNativeDriver: true }),
                Animated.timing(breathAnim, { toValue: 0, duration: 2000, easing: Easing.inOut(Easing.ease), useNativeDriver: true })
            ])
        ).start();
    }, []);

    const spin = ringRotation.interpolate({
        inputRange: [0, 1],
        outputRange: ['0deg', '360deg']
    });

    const counterSpin = ringRotation.interpolate({
        inputRange: [0, 1],
        outputRange: ['0deg', '-360deg']
    });

    const bubbleScale = breathAnim.interpolate({
        inputRange: [0, 1],
        outputRange: [1, 1.15]
    });

    const FACES = [
        { emoji: "🧔", bg: "#1E3A8A" },
        { emoji: "👨‍💻", bg: "#065F46" },
        { emoji: "👨🏿", bg: "#4B5563" },
        { emoji: "🕵️‍♂️", bg: "#7C3AED" },
        { emoji: "👳‍♂️", bg: "#B45309" },
        { emoji: "👱‍♂️", bg: "#047857" },
        { emoji: "👩", bg: "#BE185D" },
        { emoji: "👨‍🦱", bg: "#BE185D" },
    ];

    const RADIUS = 110;

    return (
        <View style={styles.sceneContainer}>
            <View style={{ position: 'absolute', width: RADIUS * 2, height: RADIUS * 2, borderRadius: RADIUS, borderWidth: 1, borderColor: 'rgba(75,196,30,0.1)' }} />
            <Animated.View style={{
                width: 100, height: 100,
                borderRadius: 50,
                backgroundColor: '#000',
                alignItems: 'center', justifyContent: 'center',
                transform: [{ scale: coreScale }],
                zIndex: 20,
                shadowColor: ACCENT_COLOR,
                shadowOffset: { width: 0, height: 0 },
                shadowOpacity: 0.8,
                shadowRadius: 15,
                elevation: 10
            }}>
                <View style={{ width: 90, height: 90, borderRadius: 45, overflow: 'hidden', borderWidth: 2, borderColor: ACCENT_COLOR, alignItems: 'center', justifyContent: 'center' }}>
                    <Image
                        source={require('../../../assets/images/goalgpt-3d-logo.png')}
                        style={{ width: '100%', height: '100%' }}
                        resizeMode="cover"
                    />
                </View>
            </Animated.View>
            <Animated.View style={[
                { position: 'absolute', width: '100%', height: '100%', alignItems: 'center', justifyContent: 'center' },
                { transform: [{ rotate: spin }] }
            ]}>
                {FACES.map((face, index) => {
                    const deg = (index / FACES.length) * 360;
                    return (
                        <View key={index} style={{ position: 'absolute', alignItems: 'center', justifyContent: 'center' }}>
                            <Animated.View style={{
                                position: 'absolute',
                                height: 1,
                                width: RADIUS,
                                backgroundColor: ACCENT_COLOR,
                                opacity: lineOpacity,
                                transform: [
                                    { rotate: `${deg}deg` },
                                    { translateX: RADIUS / 2 }
                                ]
                            }} />
                            <Animated.View
                                style={[
                                    styles.stickerBubble,
                                    {
                                        transform: [
                                            { rotate: `${deg}deg` },
                                            { translateX: RADIUS },
                                            { rotate: `${-deg}deg` },
                                            { rotate: counterSpin },
                                            { scale: bubbleScale }
                                        ]
                                    }
                                ]}
                            >
                                <Text style={{ fontSize: 28 }}>{face.emoji}</Text>
                            </Animated.View>
                        </View>
                    );
                })}
            </Animated.View>
        </View>
    );
};


// ============================================================================
// SCENE 5: VIP ACCESS - PREMIUM COMPOSITE ICON
// Redesign using layered Lucide icons for a high-end, native feel.
// Centerpiece: A multi-layered Crown with custom shadows and emerald accents.
// Tech surroundings with subtle green energy particles.
// ============================================================================
// ============================================================================
// SCENE 5: VIP ACCESS - ROYAL DATA
// New Premium Design: Golden Crown Centerpiece with Rotating Rays
// ============================================================================
const Scene5 = () => {
    const sunRotate = useRef(new Animated.Value(0)).current;
    const crownScale = useRef(new Animated.Value(0.72)).current;
    const glowOpacity = useRef(new Animated.Value(0.5)).current;

    const crownTilt = useRef(new Animated.Value(0)).current;

    // Gold Colors
    const GOLD_LIGHT = '#FFE55C'; // Bright Gold
    const GOLD_DARK = '#FFAA00';  // Deep Gold
    const ACCENT = '#4BC41E';      // App Brand Green (for subtle tech tie-in)

    useEffect(() => {
        // 1. Rotating Sunburst
        Animated.loop(
            Animated.timing(sunRotate, {
                toValue: 1,
                duration: 20000,
                easing: Easing.linear,
                useNativeDriver: true
            })
        ).start();

        // 2. Crown Breathing/Pulse (Scale Reduced by 20% -> 0.72 to 0.8)
        Animated.loop(
            Animated.sequence([
                Animated.timing(crownScale, { toValue: 0.8, duration: 2000, easing: Easing.inOut(Easing.ease), useNativeDriver: true }),
                Animated.timing(crownScale, { toValue: 0.72, duration: 2000, easing: Easing.inOut(Easing.ease), useNativeDriver: true })
            ])
        ).start();

        // 3. Glow Pulsing
        Animated.loop(
            Animated.sequence([
                Animated.timing(glowOpacity, { toValue: 0.8, duration: 1500, useNativeDriver: true }),
                Animated.timing(glowOpacity, { toValue: 0.4, duration: 1500, useNativeDriver: true })
            ])
        ).start();

        // 4. Crown Tilt/Rocking (10% rotation)
        Animated.loop(
            Animated.sequence([
                Animated.timing(crownTilt, { toValue: 1, duration: 1500, easing: Easing.inOut(Easing.ease), useNativeDriver: true }),
                Animated.timing(crownTilt, { toValue: -1, duration: 1500, easing: Easing.inOut(Easing.ease), useNativeDriver: true })
            ])
        ).start();
    }, []);

    const spin = sunRotate.interpolate({ inputRange: [0, 1], outputRange: ['0deg', '360deg'] });
    const spinReverse = sunRotate.interpolate({ inputRange: [0, 1], outputRange: ['360deg', '0deg'] });

    // Tilt interpolation: -10deg to 10deg (approx 10%)
    const tilt = crownTilt.interpolate({
        inputRange: [-1, 1],
        outputRange: ['-10deg', '10deg']
    });

    return (
        <View style={styles.sceneContainer}>
            {/* Background: Rotating Gold Rays (Simulated with dashed rings) */}
            <Animated.View style={{
                position: 'absolute', width: 280, height: 280,
                borderRadius: 140, borderWidth: 2, borderColor: 'rgba(255, 215, 0, 0.1)', borderStyle: 'dashed',
                transform: [{ rotate: spin }]
            }} />
            <Animated.View style={{
                position: 'absolute', width: 220, height: 220,
                borderRadius: 110, borderWidth: 10, borderColor: 'rgba(255, 215, 0, 0.05)',
                transform: [{ rotate: spinReverse }]
            }} />

            {/* Central Halo Glow */}
            <Animated.View style={{
                position: 'absolute',
                width: 160, height: 160, borderRadius: 80,
                backgroundColor: GOLD_LIGHT,
                opacity: 0.15,
                transform: [{ scale: crownScale }],
                shadowColor: GOLD_DARK, shadowRadius: 40, shadowOpacity: 0.5
            }} />

            {/* THE CROWN (Centerpiece) */}
            <Animated.View style={{ transform: [{ scale: crownScale }, { rotate: tilt }], alignItems: 'center', justifyContent: 'center' }}>
                <View style={{ shadowColor: GOLD_DARK, shadowRadius: 20, shadowOpacity: 0.8, shadowOffset: { width: 0, height: 0 } }}>
                    <Crown size={140} color={GOLD_LIGHT} fill="rgba(255, 170, 0, 0.1)" strokeWidth={1.5} />
                </View>

                {/* Floating Particles */}
                <Animated.View style={{ position: 'absolute', top: -20, right: -10, opacity: glowOpacity }}>
                    <Sparkles size={34} color="#FFF" fill={GOLD_LIGHT} />
                </Animated.View>
                <Animated.View style={{ position: 'absolute', bottom: 10, left: -20, opacity: glowOpacity }}>
                    <Star size={24} color={GOLD_LIGHT} fill={GOLD_LIGHT} />
                </Animated.View>
            </Animated.View>

            {/* VIP ACCESS TEXT (Floating below) */}
            <Animated.View style={{
                position: 'absolute', bottom: -20,
                backgroundColor: 'rgba(0,0,0,0.8)',
                paddingHorizontal: 20, paddingVertical: 8,
                borderRadius: 12,
                borderWidth: 1, borderColor: GOLD_DARK,
                shadowColor: GOLD_DARK, shadowOpacity: 0.5, shadowRadius: 10,
                transform: [{ translateY: crownScale.interpolate({ inputRange: [0.9, 1], outputRange: [0, 5] }) }]
            }}>
                <Text style={{ color: GOLD_LIGHT, fontSize: 18, fontWeight: '900', letterSpacing: 4 }}>VIP ACCESS</Text>
            </Animated.View>
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
        case 5: return <Scene5 />;
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
    radarContainer: {},
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
        fontFamily: 'monospace'
    },
    notifCard: {
        position: 'absolute',
        top: 40,
        width: 220,
        backgroundColor: '#0F291E',
        borderRadius: 12,
        padding: 12,
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: 'rgba(75, 196, 30, 0.3)',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.5,
        shadowRadius: 8,
        elevation: 10,
    },
    notifTitle: {
        color: '#FFF',
        fontSize: 14,
        fontWeight: 'bold',
    },
    notifSub: {
        color: 'rgba(255,255,255,0.6)',
        fontSize: 11,
    },
    wonBadge: {
        position: 'absolute',
        bottom: 50,
        backgroundColor: '#FFD700',
        paddingHorizontal: 20,
        paddingVertical: 8,
        borderRadius: 8,
        borderWidth: 2,
        borderColor: '#FFF',
        shadowColor: '#FFD700',
        shadowOpacity: 0.8,
        shadowRadius: 10,
        elevation: 10,
    },
    wonText: {
        color: '#000',
        fontWeight: 'bold',
        fontSize: 24,
        letterSpacing: 2,
    },
    stickerBubble: {
        position: 'absolute',
        width: 50,
        height: 50,
        borderRadius: 25,
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1.5,
        borderColor: 'rgba(75, 196, 30, 0.5)',
        shadowColor: ACCENT_COLOR,
        shadowOpacity: 0.4,
        shadowRadius: 8,
    }
});
