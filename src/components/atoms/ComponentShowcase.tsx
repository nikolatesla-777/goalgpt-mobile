/**
 * Component Showcase
 * Demo screen showcasing all atomic components
 * Use this for testing and documentation
 */

import React, { useState } from 'react';
import { ScrollView, View, Text, StyleSheet } from 'react-native';
import { useTheme } from '../../context/ThemeContext';
import { spacing, typography } from '../../constants/theme';

// Import all components
import { Button } from './Button';
import { GlassCard } from './GlassCard';
import { NeonText, LiveIndicator, ScoreText, PercentageText } from './NeonText';
import { Input, SearchInput, PasswordInput, EmailInput, PhoneInput } from './Input';

// ============================================================================
// COMPONENT
// ============================================================================

export const ComponentShowcase: React.FC = () => {
  const { theme, isDark, toggleTheme } = useTheme();
  const [searchValue, setSearchValue] = useState('');
  const [emailValue, setEmailValue] = useState('');
  const [passwordValue, setPasswordValue] = useState('');

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: theme.background.primary }]}
      contentContainerStyle={styles.content}
    >
      {/* Header */}
      <View style={styles.header}>
        <Text style={[styles.title, { color: theme.text.primary }]}>Component Showcase</Text>
        <Text style={[styles.subtitle, { color: theme.text.secondary }]}>
          Phase 7 - Core Component Library
        </Text>
        <Button variant="secondary" size="small" onPress={toggleTheme} style={styles.themeToggle}>
          {isDark ? 'Light Mode' : 'Dark Mode'}
        </Button>
      </View>

      {/* Section: Buttons */}
      <Section title="Buttons" theme={theme}>
        <GlassCard intensity="medium" padding="md">
          <SectionTitle>Button Variants</SectionTitle>

          <View style={styles.buttonRow}>
            <Button variant="primary" size="medium" onPress={() => {}}>
              Primary
            </Button>
          </View>

          <View style={styles.buttonRow}>
            <Button variant="secondary" size="medium" onPress={() => {}}>
              Secondary
            </Button>
          </View>

          <View style={styles.buttonRow}>
            <Button variant="ghost" size="medium" onPress={() => {}}>
              Ghost
            </Button>
          </View>

          <View style={styles.buttonRow}>
            <Button variant="danger" size="medium" onPress={() => {}}>
              Danger
            </Button>
          </View>

          <View style={styles.buttonRow}>
            <Button variant="success" size="medium" onPress={() => {}}>
              Success
            </Button>
          </View>

          <SectionTitle style={{ marginTop: spacing[6] }}>Button Sizes</SectionTitle>

          <View style={styles.buttonRow}>
            <Button variant="primary" size="small" onPress={() => {}}>
              Small
            </Button>
          </View>

          <View style={styles.buttonRow}>
            <Button variant="primary" size="medium" onPress={() => {}}>
              Medium
            </Button>
          </View>

          <View style={styles.buttonRow}>
            <Button variant="primary" size="large" onPress={() => {}}>
              Large
            </Button>
          </View>

          <SectionTitle style={{ marginTop: spacing[6] }}>Button States</SectionTitle>

          <View style={styles.buttonRow}>
            <Button variant="primary" loading onPress={() => {}}>
              Loading
            </Button>
          </View>

          <View style={styles.buttonRow}>
            <Button variant="primary" disabled onPress={() => {}}>
              Disabled
            </Button>
          </View>

          <View style={styles.buttonRow}>
            <Button variant="primary" fullWidth onPress={() => {}}>
              Full Width
            </Button>
          </View>
        </GlassCard>
      </Section>

      {/* Section: Glass Cards */}
      <Section title="Glass Cards" theme={theme}>
        <View style={styles.cardRow}>
          <GlassCard intensity="light" padding="md" style={styles.demoCard}>
            <Text style={{ color: theme.text.primary, ...typography.body2 }}>Light Glass</Text>
          </GlassCard>
        </View>

        <View style={styles.cardRow}>
          <GlassCard intensity="medium" padding="md" style={styles.demoCard}>
            <Text style={{ color: theme.text.primary, ...typography.body2 }}>Medium Glass</Text>
          </GlassCard>
        </View>

        <View style={styles.cardRow}>
          <GlassCard intensity="heavy" padding="md" style={styles.demoCard}>
            <Text style={{ color: theme.text.primary, ...typography.body2 }}>Heavy Glass</Text>
          </GlassCard>
        </View>
      </Section>

      {/* Section: Neon Text */}
      <Section title="Neon Text" theme={theme}>
        <GlassCard intensity="medium" padding="md">
          <SectionTitle>Neon Colors</SectionTitle>

          <View style={styles.neonRow}>
            <NeonText color="primary" glow="medium">
              Primary Neon
            </NeonText>
          </View>

          <View style={styles.neonRow}>
            <NeonText color="success" glow="medium">
              Success Neon
            </NeonText>
          </View>

          <View style={styles.neonRow}>
            <NeonText color="error" glow="medium">
              Error Neon
            </NeonText>
          </View>

          <View style={styles.neonRow}>
            <NeonText color="warning" glow="medium">
              Warning Neon
            </NeonText>
          </View>

          <SectionTitle style={{ marginTop: spacing[6] }}>Glow Intensity</SectionTitle>

          <View style={styles.neonRow}>
            <NeonText color="primary" glow="small" size="lg">
              Small Glow
            </NeonText>
          </View>

          <View style={styles.neonRow}>
            <NeonText color="primary" glow="medium" size="lg">
              Medium Glow
            </NeonText>
          </View>

          <View style={styles.neonRow}>
            <NeonText color="primary" glow="large" size="lg">
              Large Glow
            </NeonText>
          </View>

          <SectionTitle style={{ marginTop: spacing[6] }}>Specialized Components</SectionTitle>

          <View style={styles.neonRow}>
            <LiveIndicator />
          </View>

          <View style={styles.neonRow}>
            <ScoreText color="primary">3 - 1</ScoreText>
          </View>

          <View style={styles.neonRow}>
            <PercentageText color="success">85%</PercentageText>
          </View>

          <View style={styles.neonRow}>
            <NeonText color="success" pulse glow="large" size="xl">
              Pulsing Text
            </NeonText>
          </View>
        </GlassCard>
      </Section>

      {/* Section: Inputs */}
      <Section title="Inputs" theme={theme}>
        <GlassCard intensity="medium" padding="md">
          <SectionTitle>Basic Input</SectionTitle>
          <Input
            label="Username"
            placeholder="Enter username"
            helperText="Choose a unique username"
          />

          <SectionTitle style={{ marginTop: spacing[4] }}>Input with Error</SectionTitle>
          <Input
            label="Email"
            placeholder="Enter email"
            value="invalid-email"
            error="Please enter a valid email address"
          />

          <SectionTitle style={{ marginTop: spacing[4] }}>Search Input</SectionTitle>
          <SearchInput
            value={searchValue}
            onChangeText={setSearchValue}
            placeholder="Search matches..."
          />

          <SectionTitle style={{ marginTop: spacing[4] }}>Email Input</SectionTitle>
          <EmailInput
            label="Email Address"
            value={emailValue}
            onChangeText={setEmailValue}
            placeholder="you@example.com"
          />

          <SectionTitle style={{ marginTop: spacing[4] }}>Password Input</SectionTitle>
          <PasswordInput
            label="Password"
            value={passwordValue}
            onChangeText={setPasswordValue}
            placeholder="Enter password"
          />

          <SectionTitle style={{ marginTop: spacing[4] }}>Phone Input</SectionTitle>
          <PhoneInput label="Phone Number" placeholder="+1 (555) 123-4567" />

          <SectionTitle style={{ marginTop: spacing[4] }}>Disabled Input</SectionTitle>
          <Input label="Disabled Field" value="Cannot edit this" disabled />
        </GlassCard>
      </Section>

      {/* Footer */}
      <View style={styles.footer}>
        <Text style={{ color: theme.text.tertiary, ...typography.caption }}>
          Phase 7 - Day 3 Complete ✅
        </Text>
        <Text style={{ color: theme.text.tertiary, ...typography.caption }}>
          4 Components • 0 TypeScript Errors
        </Text>
      </View>
    </ScrollView>
  );
};

// ============================================================================
// HELPER COMPONENTS
// ============================================================================

const Section: React.FC<{ title: string; children: React.ReactNode; theme: any }> = ({
  title,
  children,
  theme,
}) => (
  <View style={styles.section}>
    <Text style={[styles.sectionTitle, { color: theme.text.primary }]}>{title}</Text>
    {children}
  </View>
);

const SectionTitle: React.FC<{ children: string; style?: any }> = ({ children, style }) => {
  const { theme } = useTheme();
  return (
    <Text
      style={[
        {
          ...typography.subtitle2,
          color: theme.text.secondary,
          marginBottom: spacing[3],
        },
        style,
      ]}
    >
      {children}
    </Text>
  );
};

// ============================================================================
// STYLES
// ============================================================================

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: spacing[6],
  },
  header: {
    marginBottom: spacing[8],
    alignItems: 'center',
  },
  title: {
    ...typography.h1,
    marginBottom: spacing[2],
  },
  subtitle: {
    ...typography.body2,
    marginBottom: spacing[4],
  },
  themeToggle: {
    marginTop: spacing[2],
  },
  section: {
    marginBottom: spacing[8],
  },
  sectionTitle: {
    ...typography.h3,
    marginBottom: spacing[4],
  },
  buttonRow: {
    marginBottom: spacing[3],
  },
  cardRow: {
    marginBottom: spacing[4],
  },
  demoCard: {
    alignItems: 'center',
  },
  neonRow: {
    marginBottom: spacing[4],
  },
  footer: {
    alignItems: 'center',
    marginTop: spacing[8],
    marginBottom: spacing[4],
  },
});

// ============================================================================
// EXPORT
// ============================================================================

export default ComponentShowcase;
