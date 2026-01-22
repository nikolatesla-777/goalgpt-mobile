/**
 * useAnnouncements Hook
 * 
 * Fetches and manages popup announcements from backend
 * Handles dismissal tracking
 */

import { useState, useEffect, useCallback } from 'react';
import { Linking } from 'react-native';
import apiClient from '../api/client';

// ============================================================================
// TYPES
// ============================================================================

export interface Announcement {
    id: string;
    title: string;
    message: string;
    image_url: string | null;
    button_text: string | null;
    button_url: string | null;
    button_action: 'url' | 'screen' | 'dismiss' | null;
    target_audience: 'all' | 'vip' | 'free' | 'new_users';
    announcement_type: 'popup' | 'banner' | 'fullscreen';
    priority: number;
    show_once: boolean;
}

// ============================================================================
// HOOK
// ============================================================================

export function useAnnouncements() {
    const [announcements, setAnnouncements] = useState<Announcement[]>([]);
    const [currentAnnouncement, setCurrentAnnouncement] = useState<Announcement | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Fetch active announcements
    const fetchAnnouncements = useCallback(async () => {
        try {
            setIsLoading(true);
            setError(null);

            const response = await apiClient.get('/announcements/active');

            if (response.data?.success) {
                const data = response.data.data as Announcement[];
                setAnnouncements(data);

                // Set the first announcement as current (highest priority)
                if (data.length > 0) {
                    setCurrentAnnouncement(data[0]);
                }
            }
        } catch (err: any) {
            // Silently fail - announcements are not critical
            setError(err.message || 'Duyurular alınamadı');
        } finally {
            setIsLoading(false);
        }
    }, []);

    // Dismiss an announcement
    const dismissAnnouncement = useCallback(async (announcementId: string) => {
        try {
            // Remove from local state immediately (optimistic)
            setAnnouncements(prev => prev.filter(a => a.id !== announcementId));

            // Clear current if it's the dismissed one
            if (currentAnnouncement?.id === announcementId) {
                const remaining = announcements.filter(a => a.id !== announcementId);
                setCurrentAnnouncement(remaining.length > 0 ? remaining[0] : null);
            }

            // Persist dismissal to backend
            await apiClient.post(`/announcements/${announcementId}/dismiss`);
        } catch (err: any) {
            // Silently fail - user experience preserved
            console.warn('Failed to dismiss announcement:', err.message);
        }
    }, [announcements, currentAnnouncement]);

    // Handle button action
    const handleButtonAction = useCallback(async (announcement: Announcement) => {
        if (!announcement.button_action || announcement.button_action === 'dismiss') {
            // Just dismiss
            await dismissAnnouncement(announcement.id);
            return;
        }

        if (announcement.button_action === 'url' && announcement.button_url) {
            // Open external URL (Telegram, website, etc.)
            try {
                const canOpen = await Linking.canOpenURL(announcement.button_url);
                if (canOpen) {
                    await Linking.openURL(announcement.button_url);
                }
            } catch (err) {
                console.warn('Failed to open URL:', announcement.button_url);
            }
        }

        // Dismiss after action
        await dismissAnnouncement(announcement.id);
    }, [dismissAnnouncement]);

    // Show next announcement
    const showNextAnnouncement = useCallback(() => {
        if (announcements.length > 1) {
            const currentIndex = announcements.findIndex(a => a.id === currentAnnouncement?.id);
            const nextIndex = (currentIndex + 1) % announcements.length;
            setCurrentAnnouncement(announcements[nextIndex]);
        } else {
            setCurrentAnnouncement(null);
        }
    }, [announcements, currentAnnouncement]);

    // Initial fetch
    useEffect(() => {
        fetchAnnouncements();
    }, [fetchAnnouncements]);

    return {
        // Data
        announcements,
        currentAnnouncement,
        isLoading,
        error,

        // Actions
        fetchAnnouncements,
        dismissAnnouncement,
        handleButtonAction,
        showNextAnnouncement,

        // Computed
        hasAnnouncements: announcements.length > 0,
        announcementCount: announcements.length,
    };
}
