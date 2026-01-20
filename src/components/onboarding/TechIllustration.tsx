import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Animated, Easing, Text, Dimensions } from 'react-native';
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
    Shield,
    Users,
    MessageCircle,
    ThumbsUp
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
            <Animated.View style={[styles.glowRing, { opacity: opacityAnim, transform: [{ scale: Animated.multiply(scaleAnim, 1.2) }] }]} />
            <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
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
    }, []);

    const spin = scanRotation.interpolate({
        inputRange: [0, 1],
        outputRange: ['0deg', '360deg']
    });

    return (
        <View style={styles.sceneContainer}>
            <Animated.View style={{ opacity: gridOpacity, position: 'absolute' }}>
                <Activity size={220} color={SECONDARY_COLOR} strokeWidth={0.5} style={{ opacity: 0.2 }} />
            </Animated.View>
            <View style={[styles.orbitContainer, { width: 180, height: 180, borderRadius: 90, borderColor: 'rgba(75, 196, 30, 0.3)', borderWidth: 1 }]} />
            <View style={[styles.orbitContainer, { width: 100, height: 100, borderRadius: 50, borderColor: 'rgba(75, 196, 30, 0.5)', borderWidth: 1 }]} />
            <View style={{ width: 4, height: 4, borderRadius: 2, backgroundColor: ACCENT_COLOR, position: 'absolute' }} />
            <View style={{ backgroundColor: 'rgba(7, 26, 18, 0.8)', padding: 10, borderRadius: 20, borderWidth: 1, borderColor: ACCENT_COLOR }}>
                <Database size={32} color={ACCENT_COLOR} />
            </View>
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
    }, []);

    return (
        <View style={styles.sceneContainer}>
            <View style={{ flexDirection: 'row', alignItems: 'flex-end', height: 120, gap: 12, marginBottom: 20 }}>
                <Animated.View style={{ width: 16, backgroundColor: 'rgba(75, 196, 30, 0.4)', borderRadius: 4, height: bar1Height }} />
                <Animated.View style={{ width: 16, backgroundColor: 'rgba(75, 196, 30, 0.6)', borderRadius: 4, height: bar2Height }} />
                <Animated.View style={{ width: 16, backgroundColor: 'rgba(75, 196, 30, 0.8)', borderRadius: 4, height: bar3Height }} />
                <Animated.View style={{ width: 16, backgroundColor: ACCENT_COLOR, borderRadius: 4, height: bar4Height }} />
            </View>
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
            <Animated.View style={[styles.wonBadge, { transform: [{ scale: wonScale }, { rotate: '-10deg' }], opacity: wonOpacity }]}>
                <Text style={styles.wonText}>WON</Text>
            </Animated.View>
        </View>
    );
};

// ============================================================================
// SCENE 4: COMMUNITY & INSIGHTS (New Request)
// Happy Human Emojis appearing continuously
// ============================================================================
const Scene4 = () => {
    // We create multiple "Avatar" instances that loop independently
    const Avatar = ({ emoji, startX, startY, delay, duration }: any) => {
        const opacity = useRef(new Animated.Value(0)).current;
        const translateY = useRef(new Animated.Value(0)).current;
        const scale = useRef(new Animated.Value(0)).current;

        useEffect(() => {
            const animate = () => {
                Animated.sequence([
                    Animated.delay(delay),
                    Animated.parallel([
                        Animated.timing(opacity, { toValue: 1, duration: 500, useNativeDriver: true }),
                        Animated.timing(scale, { toValue: 1, duration: 500, easing: Easing.out(Easing.back(1.5)), useNativeDriver: true }),
                        Animated.timing(translateY, { toValue: -20, duration: duration, easing: Easing.out(Easing.ease), useNativeDriver: true })
                    ]),
                    Animated.delay(1000), // Linger
                    Animated.parallel([
                        Animated.timing(opacity, { toValue: 0, duration: 500, useNativeDriver: true }),
                        Animated.timing(scale, { toValue: 0.5, duration: 500, useNativeDriver: true }),
                    ]),
                    Animated.timing(translateY, { toValue: 0, duration: 0, useNativeDriver: true })
                ]).start(() => animate());
            };
            animate();
        }, []);

        return (
            <Animated.View style={[
                styles.avatarBubble,
                {
                    left: startX,
                    top: startY,
                    opacity,
                    transform: [{ translateY }, { scale }]
                }
            ]}>
                <Text style={{ fontSize: 24 }}>{emoji}</Text>
            </Animated.View>
        );
    };

    const pulseScale = useRef(new Animated.Value(1)).current;

    useEffect(() => {
        Animated.loop(
            Animated.sequence([
                Animated.timing(pulseScale, { toValue: 1.1, duration: 1500, useNativeDriver: true }),
                Animated.timing(pulseScale, { toValue: 1, duration: 1500, useNativeDriver: true })
            ])
        ).start();
    }, []);

    return (
        <View style={styles.sceneContainer}>
            {/* Central Globe/Network Hub */}
            <Animated.View style={{ transform: [{ scale: pulseScale }], alignItems: 'center', justifyContent: 'center' }}>
                <View style={{
                    width: 80, height: 80, borderRadius: 40,
                    backgroundColor: 'rgba(75, 196, 30, 0.1)',
                    alignItems: 'center', justifyContent: 'center',
                    borderWidth: 1, borderColor: ACCENT_COLOR
                }}>
                    <Globe size={40} color={ACCENT_COLOR} />
                </View>
                <View style={{ position: 'absolute', width: 120, height: 120, borderRadius: 60, borderWidth: 1, borderColor: 'rgba(75, 196, 30, 0.2)' }} />
            </Animated.View>

            {/* Floating Happy People */}
            {/* Top Left */}
            <Avatar emoji="👩‍💼" startX={40} startY={40} delay={0} duration={2000} />
            {/* Top Right */}
            <Avatar emoji="👨‍💻" startX={220} startY={30} delay={800} duration={2200} />
            {/* Mid Left */}
            <Avatar emoji="🧔" startX={20} startY={120} delay={1500} duration={2500} />
            {/* Mid Right */}
            <Avatar emoji="👱‍♀️" startX={240} startY={140} delay={400} duration={1800} />
            {/* Bot Left */}
            <Avatar emoji="🤴" startX={50} startY={220} delay={2000} duration={2100} />
            {/* Bot Right */}
            <Avatar emoji="👩‍🦰" startX={200} startY={210} delay={1200} duration={2300} />
            {/* Center Top */}
            <Avatar emoji="🎉" startX={130} startY={10} delay={3000} duration={3000} />

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
    radarContainer: {},
    radarBeam: {},
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
    // SCENE 4 STYLES
    avatarBubble: {
        position: 'absolute',
        width: 44,
        height: 44,
        borderRadius: 22,
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: 'rgba(75, 196, 30, 0.4)',
        shadowColor: ACCENT_COLOR,
        shadowOpacity: 0.3,
        shadowRadius: 5
    }
});
