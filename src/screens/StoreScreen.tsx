/**
 * StoreScreen (Mağaza)
 *
 * VIP subscription plans and features
 * Master Plan compliant - Tab 4
 */

import React, { useState } from 'react';
import { View, ScrollView, StyleSheet, TouchableOpacity, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NeonText } from '../components/atoms/NeonText';
import { Button } from '../components/atoms/Button';
import { GlassCard } from '../components/atoms/GlassCard';
import { useTheme } from '../theme/ThemeProvider';
import { spacing, typography } from '../constants/tokens';

// ============================================================================
// TYPES
// ============================================================================

type PlanPeriod = 'weekly' | 'monthly' | '6months' | 'yearly';

interface PricingPlan {
  id: PlanPeriod;
  title: string;
  price: string;
  period: string;
  savings?: string;
  popular?: boolean;
  features: string[];
}

export interface StoreScreenProps {
  /** Current user plan */
  currentPlan?: 'free' | PlanPeriod;

  /** On plan select */
  onSelectPlan?: (planId: PlanPeriod) => void;

  /** On purchase */
  onPurchase?: (planId: PlanPeriod) => void;
}

// ============================================================================
// PRICING DATA
// ============================================================================

const PRICING_PLANS: PricingPlan[] = [
  {
    id: 'weekly',
    title: 'Weekly',
    price: '₺49',
    period: '/week',
    features: ['7 days access', 'All AI bots', 'Premium predictions'],
  },
  {
    id: 'monthly',
    title: 'Monthly',
    price: '₺149',
    period: '/month',
    savings: 'Save 24%',
    popular: true,
    features: ['30 days access', 'All AI bots', 'Premium predictions', 'Priority support'],
  },
  {
    id: '6months',
    title: '6 Months',
    price: '₺699',
    period: '/6mo',
    savings: 'Save 44%',
    features: ['180 days access', 'All AI bots', 'Premium predictions', 'Priority support', 'Exclusive insights'],
  },
  {
    id: 'yearly',
    title: 'Yearly',
    price: '₺1,199',
    period: '/year',
    savings: 'Save 59%',
    features: ['365 days access', 'All AI bots', 'Premium predictions', 'Priority support', 'Exclusive insights', 'Early access to features'],
  },
];

const VIP_FEATURES = [
  { icon: '🤖', title: 'All AI Bots', description: 'Access to all premium prediction bots' },
  { icon: '📊', title: 'Advanced Stats', description: 'Detailed match analysis and trends' },
  { icon: '⚡', title: 'Real-time Alerts', description: 'Instant notifications for predictions' },
  { icon: '👑', title: 'VIP Badge', description: 'Show your premium status' },
  { icon: '📈', title: 'Historical Data', description: 'Access to all past predictions' },
  { icon: '💬', title: 'Priority Support', description: '24/7 premium customer support' },
];

// ============================================================================
// COMPONENT
// ============================================================================

export const StoreScreen: React.FC<StoreScreenProps> = ({
  currentPlan = 'free',
  onSelectPlan,
  onPurchase,
}) => {
  const { theme } = useTheme();
  const [selectedPlan, setSelectedPlan] = useState<PlanPeriod>('monthly');

  // ============================================================================
  // HANDLERS
  // ============================================================================

  const handleSelectPlan = (planId: PlanPeriod) => {
    setSelectedPlan(planId);
    onSelectPlan?.(planId);
  };

  const handlePurchase = () => {
    onPurchase?.(selectedPlan);
  };

  // ============================================================================
  // RENDER CURRENT PLAN
  // ============================================================================

  const renderCurrentPlan = () => {
    if (currentPlan === 'free') {
      return (
        <GlassCard intensity="subtle" padding={spacing.md} style={styles.currentPlanCard}>
          <View style={styles.currentPlanRow}>
            <Text style={styles.currentPlanLabel}>Current Plan:</Text>
            <Text style={styles.currentPlanFree}>FREE</Text>
          </View>
          <Text style={styles.currentPlanSubtext}>Upgrade to unlock all features</Text>
        </GlassCard>
      );
    }

    return (
      <GlassCard intensity="default" padding={spacing.md} style={styles.currentPlanCard}>
        <View style={styles.currentPlanRow}>
          <Text style={styles.currentPlanLabel}>Current Plan:</Text>
          <View style={styles.vipBadge}>
            <Text style={styles.vipBadgeText}>👑 VIP</Text>
          </View>
        </View>
        <Text style={styles.currentPlanSubtext}>
          {PRICING_PLANS.find(p => p.id === currentPlan)?.title || 'Premium Member'}
        </Text>
      </GlassCard>
    );
  };

  // ============================================================================
  // RENDER HERO
  // ============================================================================

  const renderHero = () => {
    return (
      <View style={styles.hero}>
        <NeonText color="brand" glow="large" size="large" weight="bold" style={styles.heroTitle}>
          Level Up with VIP
        </NeonText>
        <Text style={styles.heroSubtitle}>
          Get access to premium AI predictions and advanced features
        </Text>
      </View>
    );
  };

  // ============================================================================
  // RENDER PRICING CARD
  // ============================================================================

  const renderPricingCard = (plan: PricingPlan) => {
    const isSelected = selectedPlan === plan.id;
    const isCurrent = currentPlan === plan.id;

    return (
      <TouchableOpacity
        key={plan.id}
        style={[
          styles.pricingCard,
          isSelected && styles.pricingCardSelected,
          isCurrent && styles.pricingCardCurrent,
        ]}
        onPress={() => handleSelectPlan(plan.id)}
        activeOpacity={0.8}
      >
        {/* Popular Badge */}
        {plan.popular && (
          <View style={styles.popularBadge}>
            <Text style={styles.popularBadgeText}>MOST POPULAR</Text>
          </View>
        )}

        {/* Current Badge */}
        {isCurrent && (
          <View style={styles.currentBadge}>
            <Text style={styles.currentBadgeText}>CURRENT</Text>
          </View>
        )}

        {/* Plan Title */}
        <Text style={styles.planTitle}>{plan.title}</Text>

        {/* Price */}
        <View style={styles.priceRow}>
          <Text style={styles.price}>{plan.price}</Text>
          <Text style={styles.period}>{plan.period}</Text>
        </View>

        {/* Savings */}
        {plan.savings && (
          <View style={styles.savingsBadge}>
            <Text style={styles.savingsText}>{plan.savings}</Text>
          </View>
        )}

        {/* Features */}
        <View style={styles.featuresContainer}>
          {plan.features.map((feature, index) => (
            <View key={index} style={styles.featureRow}>
              <Text style={styles.featureIcon}>✓</Text>
              <Text style={styles.featureText}>{feature}</Text>
            </View>
          ))}
        </View>

        {/* Select Indicator */}
        {isSelected && !isCurrent && (
          <View style={styles.selectedIndicator}>
            <Text style={styles.selectedIcon}>✓</Text>
          </View>
        )}
      </TouchableOpacity>
    );
  };

  // ============================================================================
  // RENDER FEATURES
  // ============================================================================

  const renderFeatures = () => {
    return (
      <View style={styles.featuresSection}>
        <NeonText color="white" glow="small" size="medium" weight="bold" style={styles.sectionTitle}>
          VIP Membership Access
        </NeonText>

        {VIP_FEATURES.map((feature, index) => (
          <GlassCard key={index} intensity="subtle" padding={spacing.md} style={styles.featureCard}>
            <Text style={styles.featureIconLarge}>{feature.icon}</Text>
            <View style={styles.featureContent}>
              <Text style={styles.featureTitle}>{feature.title}</Text>
              <Text style={styles.featureDescription}>{feature.description}</Text>
            </View>
          </GlassCard>
        ))}
      </View>
    );
  };

  // ============================================================================
  // RENDER
  // ============================================================================

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <View style={styles.container}>
        <ScrollView
          style={styles.scrollView}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
        {/* Current Plan */}
        {renderCurrentPlan()}

        {/* Hero */}
        {renderHero()}

        {/* Pricing Grid */}
        <View style={styles.pricingGrid}>
          {PRICING_PLANS.map(renderPricingCard)}
        </View>

        {/* Features */}
        {renderFeatures()}

        {/* Spacer for sticky button */}
        <View style={{ height: 100 }} />
      </ScrollView>

      {/* Purchase Button (Sticky) */}
      {currentPlan === 'free' && (
        <View style={styles.purchaseButtonContainer}>
          <Button
            variant="vip"
            size="large"
            fullWidth
            onPress={handlePurchase}
          >
            Upgrade to {PRICING_PLANS.find(p => p.id === selectedPlan)?.title} - {PRICING_PLANS.find(p => p.id === selectedPlan)?.price}
          </Button>
        </View>
      )}
      </View>
    </SafeAreaView>
  );
};

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
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: spacing.lg,
  },
  currentPlanCard: {
    marginBottom: spacing.lg,
  },
  currentPlanRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.xs,
  },
  currentPlanLabel: {
    fontFamily: typography.fonts.ui.regular,
    fontSize: typography.fontSize.button.small,
    color: 'rgba(255, 255, 255, 0.6)',
  },
  currentPlanFree: {
    fontFamily: typography.fonts.ui.bold,
    fontSize: typography.fontSize.button.medium,
    color: 'rgba(255, 255, 255, 0.8)',
  },
  vipBadge: {
    backgroundColor: 'rgba(255, 215, 0, 0.2)',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#FFD700',
  },
  vipBadgeText: {
    fontFamily: typography.fonts.ui.bold,
    fontSize: typography.fontSize.button.small,
    color: '#FFD700',
  },
  currentPlanSubtext: {
    fontFamily: typography.fonts.ui.regular,
    fontSize: typography.fontSize.button.small,
    color: 'rgba(255, 255, 255, 0.5)',
  },
  hero: {
    alignItems: 'center',
    marginBottom: spacing.xl,
  },
  heroTitle: {
    marginBottom: spacing.sm,
  },
  heroSubtitle: {
    fontFamily: typography.fonts.ui.regular,
    fontSize: typography.fontSize.button.medium,
    color: 'rgba(255, 255, 255, 0.7)',
    textAlign: 'center',
  },
  pricingGrid: {
    gap: spacing.md,
    marginBottom: spacing.xl,
  },
  pricingCard: {
    backgroundColor: 'rgba(23, 80, 61, 0.65)',
    borderRadius: 16,
    padding: spacing.lg,
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    position: 'relative',
  },
  pricingCardSelected: {
    borderColor: '#4BC41E',
    backgroundColor: 'rgba(75, 196, 30, 0.1)',
  },
  pricingCardCurrent: {
    borderColor: '#FFD700',
    backgroundColor: 'rgba(255, 215, 0, 0.1)',
  },
  popularBadge: {
    position: 'absolute',
    top: -12,
    right: 20,
    backgroundColor: '#4BC41E',
    paddingHorizontal: spacing.md,
    paddingVertical: 4,
    borderRadius: 12,
  },
  popularBadgeText: {
    fontFamily: typography.fonts.ui.bold,
    fontSize: 10,
    color: '#000000',
  },
  currentBadge: {
    position: 'absolute',
    top: -12,
    right: 20,
    backgroundColor: '#FFD700',
    paddingHorizontal: spacing.md,
    paddingVertical: 4,
    borderRadius: 12,
  },
  currentBadgeText: {
    fontFamily: typography.fonts.ui.bold,
    fontSize: 10,
    color: '#000000',
  },
  planTitle: {
    fontFamily: typography.fonts.ui.bold,
    fontSize: typography.fontSize.button.large,
    color: '#FFFFFF',
    marginBottom: spacing.sm,
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginBottom: spacing.xs,
  },
  price: {
    fontFamily: typography.fonts.mono.bold,
    fontSize: 32,
    color: '#4BC41E',
  },
  period: {
    fontFamily: typography.fonts.ui.regular,
    fontSize: typography.fontSize.button.small,
    color: 'rgba(255, 255, 255, 0.6)',
    marginLeft: 4,
  },
  savingsBadge: {
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(255, 215, 0, 0.2)',
    paddingHorizontal: spacing.sm,
    paddingVertical: 4,
    borderRadius: 8,
    marginBottom: spacing.md,
  },
  savingsText: {
    fontFamily: typography.fonts.ui.semibold,
    fontSize: typography.fontSize.button.small,
    color: '#FFD700',
  },
  featuresContainer: {
    gap: spacing.xs,
  },
  featureRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  featureIcon: {
    fontSize: 16,
    color: '#4BC41E',
  },
  featureText: {
    fontFamily: typography.fonts.ui.regular,
    fontSize: typography.fontSize.button.small,
    color: 'rgba(255, 255, 255, 0.8)',
  },
  selectedIndicator: {
    position: 'absolute',
    top: spacing.md,
    right: spacing.md,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#4BC41E',
    justifyContent: 'center',
    alignItems: 'center',
  },
  selectedIcon: {
    fontSize: 20,
    color: '#000000',
  },
  featuresSection: {
    gap: spacing.md,
  },
  sectionTitle: {
    marginBottom: spacing.sm,
  },
  featureCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  featureIconLarge: {
    fontSize: 32,
  },
  featureContent: {
    flex: 1,
  },
  featureTitle: {
    fontFamily: typography.fonts.ui.semibold,
    fontSize: typography.fontSize.button.medium,
    color: '#FFFFFF',
    marginBottom: 4,
  },
  featureDescription: {
    fontFamily: typography.fonts.ui.regular,
    fontSize: typography.fontSize.button.small,
    color: 'rgba(255, 255, 255, 0.6)',
  },
  purchaseButtonContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: spacing.lg,
    backgroundColor: 'rgba(0, 0, 0, 0.95)',
    borderTopWidth: 1,
    borderTopColor: 'rgba(75, 196, 30, 0.2)',
  },
});

// ============================================================================
// EXPORT
// ============================================================================

export default StoreScreen;
