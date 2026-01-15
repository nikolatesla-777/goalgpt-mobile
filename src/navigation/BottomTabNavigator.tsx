import React, { Suspense, lazy } from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import LoadingScreen from '../components/LoadingScreen';

// Eager load HomeScreen for fast startup (critical for first impression)
import HomeScreen from '../screens/home/HomeScreen';

// Lazy load other screens to reduce initial bundle size
const LiveScreen = lazy(() => import('../screens/live/LiveScreen'));
const PredictionsScreen = lazy(() => import('../screens/predictions/PredictionsScreen'));
const ProfileScreen = lazy(() => import('../screens/profile/ProfileScreen'));

// Wrapper components with Suspense for lazy-loaded screens
function LiveScreenWrapper() {
  return (
    <Suspense fallback={<LoadingScreen />}>
      <LiveScreen />
    </Suspense>
  );
}

function PredictionsScreenWrapper() {
  return (
    <Suspense fallback={<LoadingScreen />}>
      <PredictionsScreen />
    </Suspense>
  );
}

function ProfileScreenWrapper() {
  return (
    <Suspense fallback={<LoadingScreen />}>
      <ProfileScreen />
    </Suspense>
  );
}

const Tab = createBottomTabNavigator();

export default function BottomTabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: '#0F1419',
          borderTopWidth: 1,
          borderTopColor: '#1E2732',
          height: 60,
          paddingBottom: 8,
          paddingTop: 8,
        },
        tabBarActiveTintColor: '#2196F3',
        tabBarInactiveTintColor: '#6B7280',
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '600',
        },
      }}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          tabBarLabel: 'Ana Sayfa',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="home" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Live"
        component={LiveScreenWrapper}
        options={{
          tabBarLabel: 'Canlı',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="football" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Predictions"
        component={PredictionsScreenWrapper}
        options={{
          tabBarLabel: 'Tahminler',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="analytics" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreenWrapper}
        options={{
          tabBarLabel: 'Profil',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="person" size={size} color={color} />
          ),
        }}
      />
    </Tab.Navigator>
  );
}
