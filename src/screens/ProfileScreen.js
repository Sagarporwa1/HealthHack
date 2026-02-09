import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    Dimensions,
    ActivityIndicator,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { theme } from '../styles/theme';
import Button from '../components/Button';
import { profileService } from '../services/profileService';
import { authService } from '../services/authService';
import { storageService } from '../services/storageService';
import { supabase } from '../services/supabaseClient';

const { width } = Dimensions.get('window');

export default function ProfileScreen({ navigation }) {
    const insets = useSafeAreaInsets();
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState({
        scans: '0',
        health: 'N/A',
        points: '0',
    });

    useEffect(() => {
        loadProfileData();
        loadStats();
    }, []);

    const loadProfileData = async () => {
        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (user) {
                const profileData = await profileService.getProfile(user.id);
                const memberSince = await profileService.getMemberSince();
                setProfile({
                    ...profileData,
                    email: user.email,
                    memberSince,
                });
            }
        } catch (error) {
            console.log('Error loading profile:', error);
        } finally {
            setLoading(false);
        }
    };

    const loadStats = async () => {
        try {
            const scanStats = await storageService.getScanStats();
            if (scanStats) {
                setStats({
                    scans: String(scanStats.total || 0),
                    health: scanStats.lowRisk > scanStats.highRisk ? 'Good' : 'Fair',
                    points: String((scanStats.total || 0) * 25),
                });
            }
        } catch (error) {
            console.log('Error loading stats:', error);
        }
    };

    const handleSignOut = async () => {
        try {
            await authService.signOut();
        } catch (error) {
            console.log('Error signing out:', error);
        }
    };

    const statsData = [
        { label: 'Scans', value: stats.scans, icon: '🔍' },
        { label: 'Health', value: stats.health, icon: '💖' },
        { label: 'Points', value: stats.points, icon: '⭐' },
    ];

    if (loading) {
        return (
            <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
                <ActivityIndicator size="large" color={theme.colors.primary} />
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <ScrollView showsVerticalScrollIndicator={false}>
                {/* Profile Header */}
                <LinearGradient
                    colors={theme.colors.primaryGradient}
                    style={[styles.header, { paddingTop: insets.top + 20 }]}
                >
                    <View style={styles.profileInfo}>
                        <View style={styles.avatarContainer}>
                            <View style={styles.avatarPlaceholder}>
                                <Text style={styles.avatarEmoji}>
                                    {profile?.full_name ? profile.full_name.charAt(0).toUpperCase() : '👤'}
                                </Text>
                            </View>
                            <TouchableOpacity style={styles.editAvatar}>
                                <Text style={styles.editIcon}>✏️</Text>
                            </TouchableOpacity>
                        </View>
                        <Text style={styles.userName}>
                            {profile?.full_name || 'User'}
                        </Text>
                        <Text style={styles.userEmail}>
                            {profile?.email || ''}
                        </Text>
                    </View>

                    {/* Quick Stats */}
                    <View style={styles.statsContainer}>
                        {statsData.map((stat, index) => (
                            <View key={index} style={styles.statItem}>
                                <Text style={styles.statIcon}>{stat.icon}</Text>
                                <Text style={styles.statValue}>{stat.value}</Text>
                                <Text style={styles.statLabel}>{stat.label}</Text>
                            </View>
                        ))}
                    </View>
                </LinearGradient>

                <View style={styles.content}>
                    {/* Account Settings Section */}
                    <Text style={styles.sectionTitle}>Account Details</Text>
                    <View style={styles.card}>
                        <InfoRow label="Member Since" value={profile?.memberSince || 'N/A'} />
                        <InfoRow label="Gender" value={profile?.gender || 'Not specified'} />
                        <InfoRow label="Phone" value={profile?.phone_number || 'Not specified'} showBorder={true} />
                        <TouchableOpacity
                            style={styles.settingRow}
                            onPress={() => navigation.navigate('Settings')}
                        >
                            <View style={styles.settingRowLeft}>
                                <Ionicons name="settings-outline" size={20} color={theme.colors.textSecondary} />
                                <Text style={styles.settingRowLabel}>App Settings</Text>
                            </View>
                            <Ionicons name="chevron-forward" size={20} color={theme.colors.textLight} />
                        </TouchableOpacity>
                    </View>

                    {/* Medical Conditions Card */}
                    {profile?.medical_conditions && Array.isArray(profile.medical_conditions) && profile.medical_conditions.length > 0 && (
                        <>
                            <Text style={styles.sectionTitle}>Medical Conditions</Text>
                            <View style={styles.card}>
                                <View style={styles.conditionsRow}>
                                    {profile.medical_conditions.map((condition, index) => (
                                        <View key={index} style={styles.conditionBadge}>
                                            <Text style={styles.conditionText}>{condition}</Text>
                                        </View>
                                    ))}
                                </View>
                            </View>
                        </>
                    )}

                    {/* Premium Feature Card */}
                    <TouchableOpacity style={styles.premiumCard}>
                        <LinearGradient
                            colors={['#FFD700', '#FF8C00']}
                            style={styles.premiumGradient}
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 1 }}
                        >
                            <View>
                                <Text style={styles.premiumTitle}>Pro Membership</Text>
                                <Text style={styles.premiumText}>Unlimited AI scans & dentist consultations</Text>
                            </View>
                            <View style={styles.premiumBadge}>
                                <Text style={styles.premiumBadgeText}>UPGRADE</Text>
                            </View>
                        </LinearGradient>
                    </TouchableOpacity>

                    {/* Actions */}
                    <View style={styles.actions}>
                        <Button
                            title="Edit Profile"
                            onPress={() => { }}
                            variant="primary"
                            style={styles.actionBtn}
                        />
                        <Button
                            title="Privacy Controls"
                            onPress={() => { }}
                            variant="outline"
                            style={styles.actionBtn}
                        />
                        <Button
                            title="Sign Out"
                            onPress={handleSignOut}
                            variant="danger"
                            style={styles.actionBtn}
                        />
                    </View>
                </View>

                {/* Bottom Padding for Tab Bar */}
                <View style={{ height: 100 }} />
            </ScrollView>
        </View>
    );
}

function InfoRow({ label, value, showBorder = true }) {
    return (
        <View style={[styles.infoRow, showBorder && styles.borderBottom]}>
            <Text style={styles.infoLabel}>{label}</Text>
            <Text style={styles.infoValue}>{value}</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: theme.colors.background,
    },
    header: {
        paddingBottom: 40,
        paddingHorizontal: theme.spacing.lg,
        borderBottomLeftRadius: 40,
        borderBottomRightRadius: 40,
        alignItems: 'center',
    },
    profileInfo: {
        alignItems: 'center',
        marginBottom: 30,
    },
    avatarContainer: {
        position: 'relative',
        marginBottom: 16,
    },
    avatarPlaceholder: {
        width: 100,
        height: 100,
        borderRadius: 50,
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 2,
        borderColor: '#FFF',
    },
    avatarEmoji: {
        fontSize: 50,
    },
    editAvatar: {
        position: 'absolute',
        bottom: 0,
        right: 0,
        backgroundColor: theme.colors.surface,
        width: 32,
        height: 32,
        borderRadius: 16,
        justifyContent: 'center',
        alignItems: 'center',
        ...theme.shadows.sm,
    },
    editIcon: {
        fontSize: 16,
    },
    userName: {
        fontSize: 24,
        fontWeight: theme.fontWeights.bold,
        color: theme.colors.textWhite,
    },
    userEmail: {
        fontSize: 14,
        color: theme.colors.textWhite,
        opacity: 0.8,
        marginTop: 4,
    },
    statsContainer: {
        flexDirection: 'row',
        backgroundColor: 'rgba(255, 255, 255, 0.15)',
        borderRadius: 20,
        padding: 20,
        width: '100%',
        justifyContent: 'space-around',
    },
    statItem: {
        alignItems: 'center',
    },
    statIcon: {
        fontSize: 20,
        marginBottom: 4,
    },
    statValue: {
        fontSize: 18,
        fontWeight: 'bold',
        color: theme.colors.textWhite,
    },
    statLabel: {
        fontSize: 12,
        color: theme.colors.textWhite,
        opacity: 0.8,
    },
    content: {
        padding: theme.spacing.lg,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: theme.fontWeights.bold,
        color: theme.colors.textPrimary,
        marginBottom: 16,
    },
    card: {
        backgroundColor: theme.colors.surface,
        borderRadius: 20,
        padding: theme.spacing.md,
        ...theme.shadows.sm,
        marginBottom: 24,
    },
    infoRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingVertical: 14,
    },
    borderBottom: {
        borderBottomWidth: 1,
        borderBottomColor: theme.colors.borderLight,
    },
    infoLabel: {
        fontSize: 15,
        color: theme.colors.textSecondary,
    },
    infoValue: {
        fontSize: 15,
        fontWeight: '600',
        color: theme.colors.textPrimary,
    },
    settingRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 14,
    },
    settingRowLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    settingRowLabel: {
        fontSize: 15,
        color: theme.colors.textPrimary,
        fontWeight: '500',
    },
    premiumCard: {
        borderRadius: 20,
        overflow: 'hidden',
        marginBottom: 30,
        ...theme.shadows.md,
    },
    premiumGradient: {
        padding: 24,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    premiumTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#FFF',
    },
    premiumText: {
        fontSize: 12,
        color: '#FFF',
        opacity: 0.9,
        marginTop: 4,
        maxWidth: '70%',
    },
    premiumBadge: {
        backgroundColor: 'rgba(255, 255, 255, 0.25)',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 8,
    },
    premiumBadgeText: {
        color: '#FFF',
        fontWeight: 'bold',
        fontSize: 10,
    },
    actions: {
        gap: 16,
    },
    actionBtn: {
        width: '100%',
    },
    conditionsRow: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 10,
    },
    conditionBadge: {
        backgroundColor: theme.colors.primaryLight,
        paddingHorizontal: 14,
        paddingVertical: 8,
        borderRadius: 20,
    },
    conditionText: {
        fontSize: 13,
        color: theme.colors.primary,
        fontWeight: '500',
    },
});
