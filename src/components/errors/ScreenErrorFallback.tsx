/**
 * ScreenErrorFallback Component
 * 
 * Premium error fallback UI for screen-level errors.
 * Provides user-friendly error display with retry and report options.
 * 
 * @module components/errors/ScreenErrorFallback
 */

import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Warning, ArrowClockwise, House } from 'phosphor-react-native';
import { NeonText } from '../atoms/NeonText';
import { spacing } from '../../constants/tokens';
import { useTheme } from '../../theme/ThemeProvider';

// ============================================================================
// TYPES
// ============================================================================

export interface ScreenErrorFallbackProps {
    /** Error object */
    error: Error;
    /** Function to reset and retry */
    resetError: () => void;
    /** Optional function to navigate home */
    onGoHome?: () => void;
    /** Custom title */
    title?: string;
    /** Custom description */
    description?: string;
}

// ============================================================================
// COMPONENT
// ============================================================================

export const ScreenErrorFallback: React.FC<ScreenErrorFallbackProps> = ({
    error,
    resetError,
    onGoHome,
    title = 'Bir şeyler ters gitti',
    description = 'Üzgünüz, beklenmeyen bir hata oluştu. Lütfen tekrar deneyin.',
}) => {
    const { theme } = useTheme();

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
            <View style={styles.content}>
                {/* Error Icon */}
                <View style={styles.iconContainer}>
                    <View style={styles.iconCircle}>
                        <Warning size={48} weight="fill" color="#ef4444" />
                    </View>
                </View>

                {/* Title */}
                <NeonText size="large" weight="bold" style={styles.title}>
                    {title}
                </NeonText>

                {/* Description */}
                <NeonText size="medium" style={styles.description}>
                    {description}
                </NeonText>

                {/* Error Details (collapsed by default in production) */}
                {__DEV__ && (
                    <View style={styles.errorDetails}>
                        <NeonText size="small" style={styles.errorMessage}>
                            {error.message}
                        </NeonText>
                    </View>
                )}

                {/* Actions */}
                <View style={styles.actions}>
                    {/* Retry Button */}
                    <TouchableOpacity
                        style={styles.retryButton}
                        onPress={resetError}
                        activeOpacity={0.8}
                    >
                        <ArrowClockwise size={20} weight="bold" color="white" />
                        <NeonText size="medium" weight="bold" color="white">
                            Tekrar Dene
                        </NeonText>
                    </TouchableOpacity>

                    {/* Go Home Button (optional) */}
                    {onGoHome && (
                        <TouchableOpacity
                            style={styles.homeButton}
                            onPress={onGoHome}
                            activeOpacity={0.8}
                        >
                            <House size={20} weight="fill" color="#4ade80" />
                            <NeonText size="medium" weight="medium" style={styles.homeButtonText}>
                                Ana Sayfa
                            </NeonText>
                        </TouchableOpacity>
                    )}
                </View>
            </View>
        </SafeAreaView>
    );
};

// ============================================================================
// STYLES
// ============================================================================

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    content: {
        alignItems: 'center',
        paddingHorizontal: spacing.xl,
        maxWidth: 320,
    },
    iconContainer: {
        marginBottom: spacing.xl,
    },
    iconCircle: {
        width: 96,
        height: 96,
        borderRadius: 48,
        backgroundColor: 'rgba(239, 68, 68, 0.15)',
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 2,
        borderColor: 'rgba(239, 68, 68, 0.3)',
    },
    title: {
        textAlign: 'center',
        marginBottom: spacing.md,
    },
    description: {
        textAlign: 'center',
        opacity: 0.7,
        marginBottom: spacing.xl,
        lineHeight: 22,
    },
    errorDetails: {
        backgroundColor: 'rgba(255, 255, 255, 0.05)',
        borderRadius: 8,
        padding: spacing.md,
        marginBottom: spacing.xl,
        width: '100%',
        borderWidth: 1,
        borderColor: 'rgba(239, 68, 68, 0.2)',
    },
    errorMessage: {
        color: '#ef4444',
        fontFamily: 'monospace',
        fontSize: 11,
    },
    actions: {
        gap: spacing.md,
        width: '100%',
    },
    retryButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: spacing.sm,
        backgroundColor: '#4ade80',
        paddingVertical: spacing.md,
        paddingHorizontal: spacing.xl,
        borderRadius: 12,
    },
    homeButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: spacing.sm,
        backgroundColor: 'rgba(74, 222, 128, 0.1)',
        paddingVertical: spacing.md,
        paddingHorizontal: spacing.xl,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: 'rgba(74, 222, 128, 0.3)',
    },
    homeButtonText: {
        color: '#4ade80',
    },
});

export default ScreenErrorFallback;
