import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { Star, FunnelSimple, MagnifyingGlass, Bell } from 'phosphor-react-native';
import { brandColors, darkTheme } from '../../constants/theme';

interface HeaderProps {
    dayStreak?: number;
    isVip?: boolean;
    notificationCount?: number;
    onNotificationPress?: () => void;
    onSearchPress?: () => void;
    onFilterPress?: () => void;
}

const Header: React.FC<HeaderProps> = ({
    dayStreak = 365,
    isVip = true,
    notificationCount = 3,
    onNotificationPress,
    onSearchPress,
    onFilterPress,
}) => {
    return (
          <View style={styles.container}>
            {/* Left Section - Logo & Info */}
                  <View style={styles.leftSection}>
                            <Image
                                        source={require('../../../assets/images/logo.png')}
                                        style={styles.logo}
                                        resizeMode="contain"
                                      />
                            <View style={styles.infoContainer}>
                                        <View style={styles.titleRow}>
                                                      <Text style={styles.title}>GoalGPT</Text>Text>
                                          {isVip && (
                          <View style={styles.vipBadge}>
                                            <Text style={styles.vipText}>VIP</Text>Text>
                          </View>View>
                        )}
                                        </View>View>
                                        <View style={styles.streakRow}>
                                                      <Text style={styles.streakIcon}>📅</Text>Text>
                                                      <Text style={styles.streakText}>Day {dayStreak}</Text>Text>
                                                      <View style={styles.planBadge}>
                                                                      <Text style={styles.planText}>Yearly</Text>Text>
                                                      </View>View>
                                        </View>View>
                            </View>View>
                  </View>View>

            {/* Right Section - Icons */}
                  <View style={styles.rightSection}>
                            <TouchableOpacity style={styles.iconButton} onPress={onSearchPress}>
                                        <Star size={20} color="#FFD700" weight="fill" />
                            </TouchableOpacity>TouchableOpacity>

                            <TouchableOpacity style={styles.iconButton} onPress={onNotificationPress}>
                                        <View>
                                                    <Bell size={20} color={darkTheme.text.secondary} weight="regular" />
                                          {notificationCount > 0 && (
                          <View style={styles.notificationBadge}>
                                          <Text style={styles.notificationCount}>{notificationCount}</Text>Text>
                          </View>View>
                                                    )}
                                        </View>View>
                            </TouchableOpacity>TouchableOpacity>
                  
                          <TouchableOpacity style={styles.iconButton} onPress={onFilterPress}>
                                    <FunnelSimple size={20} color={darkTheme.text.secondary} weight="regular" />
                          </TouchableOpacity>TouchableOpacity>
                  
                          <TouchableOpacity style={styles.iconButton} onPress={onSearchPress}>
                                    <MagnifyingGlass size={20} color={darkTheme.text.secondary} weight="regular" />
                          </TouchableOpacity>TouchableOpacity>
                  </View>View>
          </View>View>
        );
};

const styles = StyleSheet.create({
    container: {
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          paddingHorizontal: 16,
          paddingVertical: 12,
          backgroundColor: darkTheme.background.primary,
    },
    leftSection: {
          flexDirection: 'row',
          alignItems: 'center',
    },
    logo: {
          width: 40,
          height: 40,
          borderRadius: 10,
    },
    infoContainer: {
          marginLeft: 8,
    },
    titleRow: {
          flexDirection: 'row',
          alignItems: 'center',
    },
    title: {
          fontFamily: 'Nohemi-Bold',
          fontSize: 16,
          color: darkTheme.text.primary,
    },
    vipBadge: {
          backgroundColor: brandColors.green[500],
          paddingHorizontal: 8,
          paddingVertical: 2,
          borderRadius: 4,
          marginLeft: 4,
    },
    vipText: {
          fontFamily: 'Nohemi-Bold',
          fontSize: 10,
          color: '#FFFFFF',
    },
    streakRow: {
          flexDirection: 'row',
          alignItems: 'center',
          marginTop: 2,
    },
    streakIcon: {
          fontSize: 10,
    },
    streakText: {
          fontFamily: 'Nohemi-Regular',
          fontSize: 10,
          color: darkTheme.text.secondary,
          marginLeft: 4,
    },
    planBadge: {
          backgroundColor: darkTheme.background.tertiary,
          paddingHorizontal: 8,
          paddingVertical: 2,
          borderRadius: 4,
          marginLeft: 8,
    },
    planText: {
          fontFamily: 'Nohemi-Medium',
          fontSize: 10,
          color: darkTheme.text.secondary,
    },
    rightSection: {
          flexDirection: 'row',
          alignItems: 'center',
    },
    iconButton: {
          padding: 4,
          marginLeft: 4,
    },
    notificationBadge: {
          position: 'absolute',
          top: -4,
          right: -4,
          backgroundColor: '#EF4444',
          borderRadius: 10,
          minWidth: 16,
          height: 16,
          justifyContent: 'center',
          alignItems: 'center',
    },
    notificationCount: {
          fontFamily: 'Nohemi-Bold',
          fontSize: 10,
          color: '#FFFFFF',
    },
});

export default Header;</View>
