/**
 * LegalScreen
 *
 * Display legal documents (Privacy Policy, Terms of Service, EULA)
 * Opens web URLs in browser or web view
 */

import React from 'react';
import { View, ScrollView, StyleSheet, TouchableOpacity, Text, Linking, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { NeonText } from '../components/atoms/NeonText';
import { GlassCard } from '../components/atoms/GlassCard';
import { spacing, typography } from '../constants/tokens';

// ============================================================================
// CONSTANTS
// ============================================================================

const LEGAL_URLS = {
  privacy: 'https://goalgpt.com/privacy',
  terms: 'https://goalgpt.com/terms',
  eula: 'https://goalgpt.com/eula',
};

// ============================================================================
// TYPES
// ============================================================================

interface LegalDocument {
  key: string;
  icon: string;
  title: string;
  description: string;
  url: string;
}

// ============================================================================
// COMPONENT
// ============================================================================

export default function LegalScreen() {
  const navigation = useNavigation();

  const legalDocuments: LegalDocument[] = [
    {
      key: 'privacy',
      icon: '🔒',
      title: 'Privacy Policy',
      description: 'How we collect, use, and protect your data',
      url: LEGAL_URLS.privacy,
    },
    {
      key: 'terms',
      icon: '📄',
      title: 'Terms of Service',
      description: 'Rules and guidelines for using GoalGPT',
      url: LEGAL_URLS.terms,
    },
    {
      key: 'eula',
      icon: '⚖️',
      title: 'End User License Agreement',
      description: 'Software license terms and conditions',
      url: LEGAL_URLS.eula,
    },
  ];

  const openLegalDocument = async (document: LegalDocument) => {
    try {
      const supported = await Linking.canOpenURL(document.url);

      if (supported) {
        await Linking.openURL(document.url);
      } else {
        Alert.alert(
          'Cannot Open Link',
          `Unable to open ${document.title}. Please visit: ${document.url}`,
          [{ text: 'OK' }]
        );
      }
    } catch (error) {
      console.error('Error opening legal document:', error);
      Alert.alert(
        'Error',
        'Failed to open the document. Please try again later.',
        [{ text: 'OK' }]
      );
    }
  };

  const renderDocument = (document: LegalDocument) => (
    <TouchableOpacity
      key={document.key}
      onPress={() => openLegalDocument(document)}
      activeOpacity={0.7}
      style={styles.documentItem}
    >
      <GlassCard intensity="default" padding={spacing.md} style={styles.documentCard}>
        <View style={styles.documentContent}>
          <View style={styles.documentLeft}>
            <Text style={styles.documentIcon}>{document.icon}</Text>
            <View style={styles.documentInfo}>
              <Text style={styles.documentTitle}>{document.title}</Text>
              <Text style={styles.documentDescription}>{document.description}</Text>
            </View>
          </View>
          <Ionicons name="open-outline" size={24} color="rgba(255, 255, 255, 0.4)" />
        </View>
      </GlassCard>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color="#FFFFFF" />
          </TouchableOpacity>
          <NeonText color="white" glow="medium" size="large" weight="bold">
            Legal & Privacy
          </NeonText>
          <View style={styles.headerSpacer} />
        </View>

        {/* Content */}
        <ScrollView
          style={styles.scrollView}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          {/* Introduction */}
          <View style={styles.introSection}>
            <Text style={styles.introText}>
              Review our legal documents and privacy practices. Your privacy and trust are important to us.
            </Text>
          </View>

          {/* Legal Documents */}
          <View style={styles.documentsSection}>
            {legalDocuments.map(renderDocument)}
          </View>

          {/* Contact Information */}
          <GlassCard intensity="subtle" padding={spacing.lg} style={styles.contactCard}>
            <Text style={styles.contactTitle}>Questions or Concerns?</Text>
            <Text style={styles.contactText}>
              For privacy inquiries, contact us at:
            </Text>
            <Text style={styles.contactEmail}>privacy@goalgpt.com</Text>
            <Text style={styles.contactText} style={{ marginTop: spacing.sm }}>
              For legal matters, contact:
            </Text>
            <Text style={styles.contactEmail}>legal@goalgpt.com</Text>
          </GlassCard>

          {/* Footer Info */}
          <View style={styles.footerInfo}>
            <Text style={styles.footerText}>
              These documents were last updated on January 15, 2026.
            </Text>
            <Text style={styles.footerText}>
              We will notify you of any material changes to these policies.
            </Text>
          </View>

          {/* Bottom Spacing */}
          <View style={{ height: 40 }} />
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}

// ============================================================================
// STYLES
// ============================================================================

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#000000',
  },
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(75, 196, 30, 0.15)',
  },
  backButton: {
    padding: spacing.sm,
    marginLeft: -spacing.sm,
  },
  headerSpacer: {
    width: 40, // Same width as back button for centering
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.xl,
  },
  introSection: {
    marginBottom: spacing.xl,
  },
  introText: {
    fontFamily: typography.fonts.ui.regular,
    fontSize: typography.fontSize.button.medium,
    color: 'rgba(255, 255, 255, 0.7)',
    lineHeight: 22,
    textAlign: 'center',
  },
  documentsSection: {
    gap: spacing.md,
    marginBottom: spacing.xl,
  },
  documentItem: {
    marginBottom: 0,
  },
  documentCard: {
    borderWidth: 1,
    borderColor: 'rgba(75, 196, 30, 0.15)',
  },
  documentContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  documentLeft: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  documentIcon: {
    fontSize: 32,
  },
  documentInfo: {
    flex: 1,
  },
  documentTitle: {
    fontFamily: typography.fonts.ui.bold,
    fontSize: typography.fontSize.button.medium,
    color: '#FFFFFF',
    marginBottom: 4,
  },
  documentDescription: {
    fontFamily: typography.fonts.ui.regular,
    fontSize: typography.fontSize.button.small,
    color: 'rgba(255, 255, 255, 0.6)',
    lineHeight: 18,
  },
  contactCard: {
    marginBottom: spacing.xl,
    borderWidth: 1,
    borderColor: 'rgba(75, 196, 30, 0.15)',
  },
  contactTitle: {
    fontFamily: typography.fonts.ui.bold,
    fontSize: typography.fontSize.button.medium,
    color: '#4BC41E',
    marginBottom: spacing.sm,
  },
  contactText: {
    fontFamily: typography.fonts.ui.regular,
    fontSize: typography.fontSize.button.small,
    color: 'rgba(255, 255, 255, 0.7)',
    marginBottom: 4,
  },
  contactEmail: {
    fontFamily: typography.fonts.mono.regular,
    fontSize: typography.fontSize.button.small,
    color: '#4BC41E',
  },
  footerInfo: {
    paddingVertical: spacing.lg,
    gap: spacing.sm,
  },
  footerText: {
    fontFamily: typography.fonts.ui.regular,
    fontSize: typography.fontSize.button.small,
    color: 'rgba(255, 255, 255, 0.5)',
    textAlign: 'center',
    lineHeight: 18,
  },
});
