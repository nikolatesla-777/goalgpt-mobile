/**
 * ProfileScreenContainer
 * 
 * Container component that provides user data from auth context to ProfileScreen.
 * Extracted from AppNavigator to remove hardcoded profile data.
 * 
 * @module screens/ProfileScreenContainer
 */

import React, { Suspense, lazy } from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { useAuth } from '../context/AuthContext';
import { NeonText } from '../components/atoms/NeonText';

// Lazy load ProfileScreen
const ProfileScreen = lazy(() => import('./ProfileScreen').then(m => ({ default: m.ProfileScreen })));

// ============================================================================
// TYPES
// ============================================================================

interface ProfileScreenContainerProps {
    navigation: any;
}

interface MappedProfile {
    id: string;
    name: string;
    email: string;
    vipStatus: 'free' | 'vip';
    dayCounter: number;
    stats: {
        totalPredictions: number;
        winRate: number;
        currentStreak: number;
        level: number;
        xp: number;
        xpToNextLevel: number;
    };
    badges: string[];
    favoriteTeams: string[];
}

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

/**
 * Maps auth user data to ProfileScreen's expected profile format
 */
function mapUserToProfile(user: any): MappedProfile {
    return {
        id: user?.id || 'guest',
        name: user?.username || user?.name || 'Guest User',
        email: user?.email || '',
        vipStatus: user?.subscription?.status === 'active' ? 'vip' : 'free',
        dayCounter: calculateDayCounter(user?.createdAt),
        stats: {
            totalPredictions: user?.stats?.totalPredictions || 0,
            winRate: user?.stats?.winRate || 0,
            currentStreak: user?.stats?.currentStreak || 0,
            level: user?.xp?.level || 1,
            xp: user?.xp?.current || 0,
            xpToNextLevel: user?.xp?.nextLevel || 1000,
        },
        badges: user?.achievements?.badges || ['🏆'],
        favoriteTeams: user?.favoriteTeams || [],
    };
}

/**
 * Calculate days since user registration
 */
function calculateDayCounter(createdAt?: string): number {
    if (!createdAt) return 1;

    const created = new Date(createdAt);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - created.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    return Math.max(1, diffDays);
}

// ============================================================================
// LOADING SKELETON
// ============================================================================

const ProfileSkeleton: React.FC = () => (
    <View style={styles.skeleton}>
        <ActivityIndicator size="large" color="#4ade80" />
        <NeonText size="small" style={styles.skeletonText}>
            Profil yükleniyor...
        </NeonText>
    </View>
);

// ============================================================================
// COMPONENT
// ============================================================================

export const ProfileScreenContainer: React.FC<ProfileScreenContainerProps> = ({ navigation }) => {
    const { user, signOut } = useAuth();

    // Show skeleton while waiting for user data
    if (!user) {
        return <ProfileSkeleton />;
    }

    const profile = mapUserToProfile(user);

    return (
        <Suspense fallback={<ProfileSkeleton />}>
            <ProfileScreen
                profile={profile}
                onEditProfile={() => {
                    console.log('Edit profile');
                    // TODO: Navigate to edit profile screen
                }}
                onSettings={() => {
                    console.log('Settings');
                    // TODO: Navigate to settings screen
                }}
                onLogout={async () => {
                    try {
                        await signOut();
                    } catch (error) {
                        console.error('Logout failed:', error);
                    }
                }}
                onNavigate={(section) => {
                    console.log('Navigate to:', section);
                    if (section === 'legal') {
                        const parent = navigation.getParent();
                        if (parent) {
                            parent.navigate('Legal');
                        }
                    }
                }}
            />
        </Suspense>
    );
};

// ============================================================================
// STYLES
// ============================================================================

const styles = StyleSheet.create({
    skeleton: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#0a0a0a',
    },
    skeletonText: {
        marginTop: 16,
        opacity: 0.6,
    },
});

export default ProfileScreenContainer;
