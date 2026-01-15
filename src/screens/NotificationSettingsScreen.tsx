/**
 * NotificationSettingsScreen
 *
 * Screen for managing notification preferences
 * Users can enable/disable notification types and set quiet hours
 */

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Switch,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { spacing, typography } from '../constants/tokens';
import type { NotificationSettings } from '../types/notification.types';
import * as NotificationService from '../services/notification.service';

// ============================================================================
// TYPES
// ============================================================================

export interface NotificationSettingsScreenProps {
  onBack?: () => void;
}

// ============================================================================
// COMPONENT
// ============================================================================

export const NotificationSettingsScreen: React.FC<NotificationSettingsScreenProps> = ({
  onBack,
}) => {
  const [settings, setSettings] = useState<NotificationSettings | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [permissionStatus, setPermissionStatus] = useState<string>('undetermined');

  // ============================================================================
  // LOAD SETTINGS
  // ============================================================================

  useEffect(() => {
    loadSettings();
    checkPermissions();
  }, []);

  const loadSettings = async () => {
    try {
      setIsLoading(true);
      const loadedSettings = await NotificationService.loadNotificationSettings();
      setSettings(loadedSettings);
    } catch (error) {
      console.error('❌ Failed to load settings:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const checkPermissions = async () => {
    const status = await NotificationService.getPermissionStatus();
    setPermissionStatus(status);
  };

  // ============================================================================
  // SAVE SETTINGS
  // ============================================================================

  const saveSettings = async (newSettings: NotificationSettings) => {
    try {
      setIsSaving(true);
      await NotificationService.saveNotificationSettings(newSettings);
      setSettings(newSettings);
      console.log('✅ Settings saved');
    } catch (error) {
      console.error('❌ Failed to save settings:', error);
      Alert.alert('Error', 'Failed to save settings');
    } finally {
      setIsSaving(false);
    }
  };

  // ============================================================================
  // HANDLERS
  // ============================================================================

  const handleToggleSetting = async (
    key: keyof NotificationSettings,
    value: boolean | string
  ) => {
    if (!settings) return;

    const newSettings = {
      ...settings,
      [key]: value,
    };

    await saveSettings(newSettings);
  };

  const handleRequestPermissions = async () => {
    const status = await NotificationService.requestPermissions();
    setPermissionStatus(status);

    if (status === 'granted') {
      Alert.alert('Success', 'Notifications enabled!');
      // Get push token
      await NotificationService.getExpoPushToken();
    } else {
      Alert.alert(
        'Permissions Denied',
        'Please enable notifications in your device settings to receive updates.'
      );
    }
  };

  const handleTestNotification = async () => {
    if (permissionStatus !== 'granted') {
      Alert.alert('Permissions Required', 'Please enable notifications first');
      return;
    }

    const notification = NotificationService.createMatchStartNotification(
      123,
      'Man United',
      'Liverpool',
      'Premier League'
    );

    await NotificationService.scheduleLocalNotification(notification, 3);
    Alert.alert('Test Notification', 'A test notification will appear in 3 seconds');
  };

  // ============================================================================
  // RENDER
  // ============================================================================

  if (isLoading) {
    return (
      <SafeAreaView style={styles.safeArea} edges={['top']}>
        <View style={styles.centerContent}>
          <ActivityIndicator size="large" color="#4BC41E" />
          <Text style={styles.loadingText}>Loading settings...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (!settings) {
    return null;
  }

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          {onBack && (
            <TouchableOpacity style={styles.backButton} onPress={onBack} activeOpacity={0.7}>
              <Text style={styles.backIcon}>←</Text>
              <Text style={styles.backText}>Back</Text>
            </TouchableOpacity>
          )}
          <Text style={styles.headerTitle}>Notifications</Text>
        </View>

        <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
          {/* Permission Status */}
          {permissionStatus !== 'granted' && (
            <View style={styles.permissionBanner}>
              <Text style={styles.permissionIcon}>🔔</Text>
              <View style={styles.permissionTextContainer}>
                <Text style={styles.permissionTitle}>Enable Notifications</Text>
                <Text style={styles.permissionSubtitle}>
                  Get instant updates on your favorite matches
                </Text>
              </View>
              <TouchableOpacity
                style={styles.enableButton}
                onPress={handleRequestPermissions}
                activeOpacity={0.7}
              >
                <Text style={styles.enableButtonText}>Enable</Text>
              </TouchableOpacity>
            </View>
          )}

          {/* Master Toggle */}
          <View style={styles.section}>
            <View style={styles.settingRow}>
              <View style={styles.settingInfo}>
                <Text style={styles.settingTitle}>Notifications</Text>
                <Text style={styles.settingSubtitle}>Master notification toggle</Text>
              </View>
              <Switch
                value={settings.enabled}
                onValueChange={(value) => handleToggleSetting('enabled', value)}
                trackColor={{ false: '#3e3e3e', true: '#4BC41E' }}
                thumbColor="#f4f3f4"
                disabled={isSaving || permissionStatus !== 'granted'}
              />
            </View>
          </View>

          {/* Match Notifications */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Match Notifications</Text>

            <View style={styles.settingRow}>
              <View style={styles.settingInfo}>
                <Text style={styles.settingTitle}>Match Start</Text>
                <Text style={styles.settingSubtitle}>Notify when a match begins</Text>
              </View>
              <Switch
                value={settings.matchStart}
                onValueChange={(value) => handleToggleSetting('matchStart', value)}
                trackColor={{ false: '#3e3e3e', true: '#4BC41E' }}
                thumbColor="#f4f3f4"
                disabled={isSaving || !settings.enabled}
              />
            </View>

            <View style={styles.settingRow}>
              <View style={styles.settingInfo}>
                <Text style={styles.settingTitle}>Goals</Text>
                <Text style={styles.settingSubtitle}>Notify on goals scored</Text>
              </View>
              <Switch
                value={settings.goals}
                onValueChange={(value) => handleToggleSetting('goals', value)}
                trackColor={{ false: '#3e3e3e', true: '#4BC41E' }}
                thumbColor="#f4f3f4"
                disabled={isSaving || !settings.enabled}
              />
            </View>

            <View style={styles.settingRow}>
              <View style={styles.settingInfo}>
                <Text style={styles.settingTitle}>Match End</Text>
                <Text style={styles.settingSubtitle}>Notify when match finishes</Text>
              </View>
              <Switch
                value={settings.matchEnd}
                onValueChange={(value) => handleToggleSetting('matchEnd', value)}
                trackColor={{ false: '#3e3e3e', true: '#4BC41E' }}
                thumbColor="#f4f3f4"
                disabled={isSaving || !settings.enabled}
              />
            </View>
          </View>

          {/* Prediction Notifications */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Prediction Notifications</Text>

            <View style={styles.settingRow}>
              <View style={styles.settingInfo}>
                <Text style={styles.settingTitle}>Prediction Results</Text>
                <Text style={styles.settingSubtitle}>Notify on prediction outcomes</Text>
              </View>
              <Switch
                value={settings.predictionResults}
                onValueChange={(value) => handleToggleSetting('predictionResults', value)}
                trackColor={{ false: '#3e3e3e', true: '#4BC41E' }}
                thumbColor="#f4f3f4"
                disabled={isSaving || !settings.enabled}
              />
            </View>
          </View>

          {/* Favorites */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Favorites</Text>

            <View style={styles.settingRow}>
              <View style={styles.settingInfo}>
                <Text style={styles.settingTitle}>Only Notify Favorites</Text>
                <Text style={styles.settingSubtitle}>Only get updates for favorited items</Text>
              </View>
              <Switch
                value={settings.notifyFavorites}
                onValueChange={(value) => handleToggleSetting('notifyFavorites', value)}
                trackColor={{ false: '#3e3e3e', true: '#4BC41E' }}
                thumbColor="#f4f3f4"
                disabled={isSaving || !settings.enabled}
              />
            </View>
          </View>

          {/* Sound & Vibration */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Sound & Vibration</Text>

            <View style={styles.settingRow}>
              <View style={styles.settingInfo}>
                <Text style={styles.settingTitle}>Sound</Text>
                <Text style={styles.settingSubtitle}>Play sound for notifications</Text>
              </View>
              <Switch
                value={settings.sound}
                onValueChange={(value) => handleToggleSetting('sound', value)}
                trackColor={{ false: '#3e3e3e', true: '#4BC41E' }}
                thumbColor="#f4f3f4"
                disabled={isSaving || !settings.enabled}
              />
            </View>

            <View style={styles.settingRow}>
              <View style={styles.settingInfo}>
                <Text style={styles.settingTitle}>Vibration</Text>
                <Text style={styles.settingSubtitle}>Vibrate for notifications</Text>
              </View>
              <Switch
                value={settings.vibration}
                onValueChange={(value) => handleToggleSetting('vibration', value)}
                trackColor={{ false: '#3e3e3e', true: '#4BC41E' }}
                thumbColor="#f4f3f4"
                disabled={isSaving || !settings.enabled}
              />
            </View>
          </View>

          {/* Test Notification */}
          {permissionStatus === 'granted' && (
            <View style={styles.section}>
              <TouchableOpacity
                style={styles.testButton}
                onPress={handleTestNotification}
                activeOpacity={0.7}
              >
                <Text style={styles.testButtonText}>Send Test Notification</Text>
              </TouchableOpacity>
            </View>
          )}

          {/* Info */}
          <View style={styles.section}>
            <Text style={styles.infoText}>
              💡 Notifications help you stay updated on live matches, goals, and AI predictions.
              {settings.notifyFavorites &&
                ' You will only receive notifications for items you have favorited.'}
            </Text>
          </View>
        </ScrollView>
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
  header: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(75, 196, 30, 0.2)',
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: spacing.sm,
  },
  backIcon: {
    fontSize: 28,
    color: '#FFFFFF',
  },
  backText: {
    fontFamily: typography.fonts.ui.semibold,
    fontSize: 17,
    color: '#FFFFFF',
  },
  headerTitle: {
    fontFamily: typography.fonts.ui.bold,
    fontSize: 28,
    color: '#FFFFFF',
  },
  scrollView: {
    flex: 1,
  },
  centerContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.xl,
  },
  loadingText: {
    fontFamily: typography.fonts.ui.regular,
    fontSize: typography.fontSize.button.medium,
    color: 'rgba(255, 255, 255, 0.6)',
    marginTop: spacing.md,
  },
  permissionBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(75, 196, 30, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(75, 196, 30, 0.3)',
    borderRadius: 12,
    padding: spacing.md,
    margin: spacing.lg,
    gap: spacing.sm,
  },
  permissionIcon: {
    fontSize: 32,
  },
  permissionTextContainer: {
    flex: 1,
  },
  permissionTitle: {
    fontFamily: typography.fonts.ui.semibold,
    fontSize: typography.fontSize.button.medium,
    color: '#FFFFFF',
    marginBottom: 4,
  },
  permissionSubtitle: {
    fontFamily: typography.fonts.ui.regular,
    fontSize: typography.fontSize.button.small,
    color: 'rgba(255, 255, 255, 0.7)',
  },
  enableButton: {
    backgroundColor: '#4BC41E',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    borderRadius: 8,
  },
  enableButtonText: {
    fontFamily: typography.fonts.ui.semibold,
    fontSize: typography.fontSize.button.small,
    color: '#FFFFFF',
  },
  section: {
    marginTop: spacing.lg,
    paddingHorizontal: spacing.lg,
  },
  sectionTitle: {
    fontFamily: typography.fonts.ui.semibold,
    fontSize: typography.fontSize.button.small,
    color: 'rgba(255, 255, 255, 0.5)',
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: spacing.sm,
  },
  settingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 12,
    padding: spacing.md,
    marginBottom: spacing.sm,
  },
  settingInfo: {
    flex: 1,
    marginRight: spacing.md,
  },
  settingTitle: {
    fontFamily: typography.fonts.ui.semibold,
    fontSize: typography.fontSize.button.medium,
    color: '#FFFFFF',
    marginBottom: 4,
  },
  settingSubtitle: {
    fontFamily: typography.fonts.ui.regular,
    fontSize: typography.fontSize.button.small,
    color: 'rgba(255, 255, 255, 0.6)',
  },
  testButton: {
    backgroundColor: 'rgba(75, 196, 30, 0.2)',
    borderWidth: 1,
    borderColor: '#4BC41E',
    borderRadius: 12,
    padding: spacing.md,
    alignItems: 'center',
  },
  testButtonText: {
    fontFamily: typography.fonts.ui.semibold,
    fontSize: typography.fontSize.button.medium,
    color: '#4BC41E',
  },
  infoText: {
    fontFamily: typography.fonts.ui.regular,
    fontSize: typography.fontSize.button.small,
    color: 'rgba(255, 255, 255, 0.5)',
    lineHeight: 20,
  },
});

// ============================================================================
// EXPORT
// ============================================================================

export default NotificationSettingsScreen;
