import React from 'react';
import { View, StyleSheet, TouchableOpacity, Modal, Dimensions, Image } from 'react-native';
import { Robot, X, ArrowRight } from 'phosphor-react-native';
import { NeonText } from '../atoms/NeonText';
import { useTheme } from '../../theme/ThemeProvider';
import { spacing, borderRadius } from '../../constants/tokens';
import { BlurView } from 'expo-blur'; // Optional, but nice for overlay. Fallback to view if not installed.

interface BotStatsModalProps {
    visible: boolean;
    onClose: () => void;
    botName: string;
    winRate: number;
    totalWins: number;
    totalLoss: number; // or calculate from total - wins
    totalPredictions: number;
    onDetailPress?: () => void;
}

const { width } = Dimensions.get('window');

export const BotStatsModal: React.FC<BotStatsModalProps> = ({
    visible,
    onClose,
    botName,
    winRate,
    totalWins,
    totalLoss,
    totalPredictions,
    onDetailPress
}) => {
    const { theme } = useTheme();

    return (
        <Modal
            visible={visible}
            transparent
            animationType="fade"
            onRequestClose={onClose}
        >
            <View style={styles.overlay}>
                {/* Close Overlay Tap */}
                <TouchableOpacity style={StyleSheet.absoluteFill} onPress={onClose} activeOpacity={1} />

                <View style={[styles.modalContainer, { borderColor: theme.colors.border }]}>
                    {/* Header */}
                    <View style={styles.header}>
                        <View style={styles.headerLeft}>
                            <View style={[styles.botIcon, { backgroundColor: 'rgba(34, 197, 94, 0.1)', borderColor: 'rgba(34, 197, 94, 0.2)' }]}>
                                <Robot size={24} weight="fill" color="#4ade80" />
                            </View>
                            <View>
                                <NeonText size="large" weight="bold" color="white" style={styles.botName}>
                                    {botName}
                                </NeonText>
                                <View style={styles.priorityBadge}>
                                    <NeonText size="small" weight="bold" style={styles.priorityText}>PRIORITY: 100</NeonText>
                                </View>
                            </View>
                        </View>
                        <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                            <X size={20} color="#666" weight="bold" />
                        </TouchableOpacity>
                    </View>

                    {/* Progress Section */}
                    <View style={styles.progressSection}>
                        <View style={styles.progressLabelRow}>
                            <NeonText size="medium" color="gray">Başarı Oranı</NeonText>
                            <NeonText size="large" weight="bold" style={{ color: '#4ade80', fontSize: 24 }}>%{winRate}</NeonText>
                        </View>
                        <View style={styles.progressBarBg}>
                            <View style={[styles.progressBarFill, { width: `${winRate}%` }]} />
                        </View>
                    </View>

                    {/* Stats Grid */}
                    <View style={styles.statsGrid}>
                        <View style={styles.statBox}>
                            <NeonText size="large" weight="bold" color="white" style={styles.statValue}>{totalWins}</NeonText>
                            <NeonText size="small" weight="bold" style={[styles.statLabel, { color: '#4ade80' }]}>WINS</NeonText>
                        </View>
                        <View style={styles.statBox}>
                            <NeonText size="large" weight="bold" color="white" style={styles.statValue}>{totalLoss}</NeonText>
                            <NeonText size="small" weight="bold" style={[styles.statLabel, { color: '#ef4444' }]}>LOSS</NeonText>
                        </View>
                        <View style={styles.statBox}>
                            <NeonText size="large" weight="bold" color="white" style={styles.statValue}>{totalPredictions}</NeonText>
                            <NeonText size="small" weight="bold" style={[styles.statLabel, { color: '#9ca3af' }]}>TOTAL</NeonText>
                        </View>
                    </View>

                    {/* Action Button */}
                    <TouchableOpacity style={styles.actionButton} onPress={onDetailPress}>
                        <NeonText size="medium" weight="bold" style={{ color: '#000' }}>Bot Detay Sayfasına Git</NeonText>
                        <ArrowRight size={20} color="#000" weight="bold" />
                    </TouchableOpacity>

                </View>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.8)',
        justifyContent: 'center',
        alignItems: 'center',
        padding: spacing.md, // Reduced padding
    },
    modalContainer: {
        width: '85%', // Restrict width to be less wide
        maxWidth: 360, // Limit max width for tablets
        backgroundColor: '#0a0a0a',
        borderRadius: borderRadius.xl,
        borderWidth: 1,
        padding: spacing.lg,
        // Shadow (Glow)
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.5,
        shadowRadius: 20,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: spacing.lg, // Reduced from xl
    },
    headerLeft: {
        flexDirection: 'row',
        gap: spacing.md,
    },
    botIcon: {
        width: 48,
        height: 48,
        borderRadius: 16,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1,
    },
    botName: {
        fontSize: 20,
        marginBottom: 4,
    },
    priorityBadge: {
        backgroundColor: '#222',
        paddingHorizontal: 8,
        paddingVertical: 2,
        borderRadius: 4,
    },
    priorityText: {
        fontSize: 10,
        color: '#888',
        fontFamily: 'Courier', // Monospace vibe
    },
    closeButton: {
        width: 32,
        height: 32,
        borderRadius: 16,
        backgroundColor: '#1a1a1a',
        alignItems: 'center',
        justifyContent: 'center',
    },
    progressSection: {
        marginBottom: spacing.lg, // Reduced from xl
    },
    progressLabelRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: spacing.sm,
    },
    progressBarBg: {
        height: 8,
        backgroundColor: '#222',
        borderRadius: 4,
        overflow: 'hidden',
    },
    progressBarFill: {
        height: '100%',
        backgroundColor: '#4ade80',
        borderRadius: 4,
    },
    statsGrid: {
        flexDirection: 'row',
        gap: spacing.md,
        marginBottom: spacing.lg, // Reduced from xl
    },
    statBox: {
        flex: 1,
        backgroundColor: '#111',
        borderRadius: borderRadius.lg,
        padding: spacing.md,
        alignItems: 'center',
        justifyContent: 'center',
        gap: 4,
    },
    statValue: {
        fontSize: 24,
    },
    statLabel: {
        fontSize: 10,
        textTransform: 'uppercase',
    },
    actionButton: {
        backgroundColor: '#4ade80',
        height: 50,
        borderRadius: borderRadius.lg,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
        shadowColor: '#4ade80',
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.5,
        shadowRadius: 10,
    },
});
