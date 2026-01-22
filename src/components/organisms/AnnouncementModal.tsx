/**
 * AnnouncementModal
 * 
 * Displays admin-created popup announcements
 * Supports external URL opening (Telegram, etc.)
 */

import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    Modal,
    TouchableOpacity,
    Image,
    Dimensions,
    ActivityIndicator,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, typography, borderRadius } from '../../constants/tokens';
import { Announcement } from '../../hooks/useAnnouncements';

// ============================================================================
// TYPES
// ============================================================================

interface AnnouncementModalProps {
    visible: boolean;
    announcement: Announcement | null;
    onDismiss: () => void;
    onButtonPress: () => void;
}

const { width: SCREEN_WIDTH } = Dimensions.get('window');

// ============================================================================
// COMPONENT
// ============================================================================

export const AnnouncementModal: React.FC<AnnouncementModalProps> = ({
    visible,
    announcement,
    onDismiss,
    onButtonPress,
}) => {
    const [imageLoading, setImageLoading] = React.useState(true);

    if (!announcement) return null;

    const hasImage = !!announcement.image_url;
    const hasButton = !!announcement.button_text;

    return (
        <Modal
            visible={visible}
            transparent
            animationType="fade"
            onRequestClose={onDismiss}
            statusBarTranslucent
        >
            <View style={styles.overlay}>
                <View style={styles.container}>
                    <LinearGradient
                        colors={[colors.brand.forestGreen, colors.brand.ultraDarkGreen]}
                        style={styles.content}
                    >
                        {/* Close Button */}
                        <TouchableOpacity
                            style={styles.closeButton}
                            onPress={onDismiss}
                            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                        >
                            <Ionicons name="close" size={24} color={colors.neutral.lightGray} />
                        </TouchableOpacity>

                        {/* Image */}
                        {hasImage && (
                            <View style={styles.imageContainer}>
                                {imageLoading && (
                                    <ActivityIndicator
                                        size="small"
                                        color={colors.brand.primary}
                                        style={styles.imageLoader}
                                    />
                                )}
                                <Image
                                    source={{ uri: announcement.image_url! }}
                                    style={styles.image}
                                    resizeMode="contain"
                                    onLoadStart={() => setImageLoading(true)}
                                    onLoadEnd={() => setImageLoading(false)}
                                />
                            </View>
                        )}

                        {/* Title */}
                        <Text style={styles.title}>{announcement.title}</Text>

                        {/* Message */}
                        <Text style={styles.message}>{announcement.message}</Text>

                        {/* Action Button */}
                        {hasButton && (
                            <TouchableOpacity
                                style={styles.actionButton}
                                onPress={onButtonPress}
                                activeOpacity={0.8}
                            >
                                {announcement.button_action === 'url' && (
                                    <Ionicons
                                        name="open-outline"
                                        size={18}
                                        color={colors.neutral.white}
                                        style={styles.buttonIcon}
                                    />
                                )}
                                <Text style={styles.actionButtonText}>{announcement.button_text}</Text>
                            </TouchableOpacity>
                        )}

                        {/* Dismiss Text */}
                        {!hasButton && (
                            <TouchableOpacity onPress={onDismiss} style={styles.dismissLink}>
                                <Text style={styles.dismissText}>Kapat</Text>
                            </TouchableOpacity>
                        )}
                    </LinearGradient>
                </View>
            </View>
        </Modal>
    );
};

// ============================================================================
// STYLES
// ============================================================================

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: colors.opacity.black80,
        justifyContent: 'center',
        alignItems: 'center',
        padding: spacing.xl,
    },
    container: {
        width: SCREEN_WIDTH - spacing.xl * 2,
        maxWidth: 340,
        borderRadius: borderRadius.xxl,
        overflow: 'hidden',
    },
    content: {
        padding: spacing.xl,
        paddingTop: spacing.xxxl,
        borderWidth: 1,
        borderColor: colors.opacity.primary20,
        borderRadius: borderRadius.xxl,
        alignItems: 'center',
    },
    closeButton: {
        position: 'absolute',
        top: spacing.md,
        right: spacing.md,
        width: 32,
        height: 32,
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 10,
    },
    imageContainer: {
        width: '100%',
        height: 150,
        marginBottom: spacing.lg,
        borderRadius: borderRadius.lg,
        overflow: 'hidden',
        backgroundColor: colors.opacity.white05,
        justifyContent: 'center',
        alignItems: 'center',
    },
    image: {
        width: '100%',
        height: '100%',
    },
    imageLoader: {
        position: 'absolute',
    },
    title: {
        fontFamily: typography.fonts.ui.bold,
        fontSize: typography.fontSize.heading.h3,
        color: colors.neutral.white,
        textAlign: 'center',
        marginBottom: spacing.md,
    },
    message: {
        fontFamily: typography.fonts.ui.regular,
        fontSize: typography.fontSize.body.medium,
        color: colors.neutral.lightGray,
        textAlign: 'center',
        lineHeight: 22,
        marginBottom: spacing.xl,
    },
    actionButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: colors.brand.primary,
        paddingVertical: spacing.md,
        paddingHorizontal: spacing.xxl,
        borderRadius: borderRadius.xl,
        gap: spacing.xs,
        minWidth: 200,
    },
    buttonIcon: {
        marginRight: spacing.xs,
    },
    actionButtonText: {
        fontFamily: typography.fonts.ui.bold,
        fontSize: typography.fontSize.button.medium,
        color: colors.neutral.white,
    },
    dismissLink: {
        paddingVertical: spacing.sm,
        paddingHorizontal: spacing.lg,
    },
    dismissText: {
        fontFamily: typography.fonts.ui.medium,
        fontSize: typography.fontSize.body.medium,
        color: colors.neutral.lightGray,
        textDecorationLine: 'underline',
    },
});

export default AnnouncementModal;
