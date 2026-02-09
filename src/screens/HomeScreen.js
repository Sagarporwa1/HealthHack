import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Dimensions } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { theme } from '../styles/theme';
import Button from '../components/Button';
import ScanCard from '../components/ScanCard';
import { storageService } from '../services/storageService';
import { profileService } from '../services/profileService';
import { supabase } from '../services/supabaseClient';

const { width } = Dimensions.get('window');

export default function HomeScreen({ navigation }) {
    const insets = useSafeAreaInsets();
    const [stats, setStats] = useState(null);
    const [recentScans, setRecentScans] = useState([]);
    const [userName, setUserName] = useState('');

    useEffect(() => {
        loadData();
        loadUserName();
        const unsubscribe = navigation.addListener('focus', () => {
            loadData();
            loadUserName();
        });
        return unsubscribe;
    }, [navigation]);

    const loadData = async () => {
        const scanStats = await storageService.getScanStats();
        const allScans = await storageService.getAllScans();
        setStats(scanStats);
        setRecentScans(allScans.slice(0, 3));
    };

    const loadUserName = async () => {
        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (user) {
                const profile = await profileService.getProfile(user.id);
                if (profile?.full_name) {
                    // Get first name only
                    const firstName = profile.full_name.split(' ')[0];
                    setUserName(firstName);
                }
            }
        } catch (error) {
            console.log('Error loading user name:', error);
        }
    };

    const handleStartScan = () => {
        navigation.navigate('Camera');
    };

    const handleViewScan = (scan) => {
        navigation.navigate('Analysis', { scan, fromHistory: true });
    };

    return (
        <View style={styles.container}>
            <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
                {/* Stunning Gradient Header */}
                <LinearGradient
                    colors={theme.colors.primaryGradient}
                    style={[styles.header, { paddingTop: insets.top + 20 }]}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                >
                    <View style={styles.headerContent}>
                        <View>
                            <Text style={styles.greeting}>Hello 👋</Text>
                            <Text style={styles.userName}>{userName || 'User'}</Text>
                        </View>
                        <TouchableOpacity
                            style={styles.profileButton}
                            onPress={() => navigation.navigate('Profile')}
                        >
                            <Text style={styles.profileEmoji}>
                                {userName ? userName.charAt(0).toUpperCase() : '👤'}
                            </Text>
                        </TouchableOpacity>
                    </View>

                    {/* Quick Action Card (Floating) */}
                    <View style={styles.quickActionCard}>
                        <View style={styles.quickActionInfo}>
                            <Text style={styles.quickActionTitle}>Ready for a checkup?</Text>
                            <Text style={styles.quickActionText}>Perform a quick oral scan in under 1 minute.</Text>
                        </View>
                        <Button
                            title="Start Scan"
                            onPress={handleStartScan}
                            variant="primary"
                            size="md"
                            style={styles.scanButton}
                        />
                    </View>
                </LinearGradient>

                <View style={styles.content}>
                    {/* Stats Overview Dashboard */}
                    {stats && stats.total > 0 && (
                        <View style={styles.section}>
                            <Text style={styles.sectionTitle}>Overview</Text>
                            <View style={styles.statsGrid}>
                                <StatCard label="Total" value={stats.total} color={theme.colors.primary} />
                                <StatCard label="Low Risk" value={stats.lowRisk} color={theme.colors.riskLow} />
                                <StatCard label="Medium" value={stats.mediumRisk} color={theme.colors.riskMedium} />
                                <StatCard label="High Risk" value={stats.highRisk} color={theme.colors.riskHigh} />
                            </View>
                        </View>
                    )}

                    {/* Recent Scans */}
                    {recentScans.length > 0 && (
                        <View style={styles.section}>
                            <View style={styles.sectionHeader}>
                                <Text style={styles.sectionTitle}>Recent Scans</Text>
                                <TouchableOpacity onPress={() => navigation.navigate('History')}>
                                    <Text style={styles.viewAll}>View All</Text>
                                </TouchableOpacity>
                            </View>
                            {recentScans.map((scan) => (
                                <ScanCard
                                    key={scan.id}
                                    scan={scan}
                                    onPress={() => handleViewScan(scan)}
                                />
                            ))}
                        </View>
                    )}

                    {/* Health Education Content Placeholder */}
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>Daily Insights</Text>
                        <TouchableOpacity
                            style={styles.insightCard}
                            onPress={() => navigation.navigate('Education')}
                        >
                            <LinearGradient
                                colors={['#FFADAD', '#FFD6A5']}
                                style={styles.insightGradient}
                                start={{ x: 0, y: 0 }}
                                end={{ x: 1, y: 1 }}
                            >
                                <View style={styles.insightContent}>
                                    <Text style={styles.insightEmoji}>🍎</Text>
                                    <View>
                                        <Text style={styles.insightTitle}>Lifestyle Matters</Text>
                                        <Text style={styles.insightText}>Learn how diet affects oral health</Text>
                                    </View>
                                </View>
                            </LinearGradient>
                        </TouchableOpacity>
                    </View>
                </View>

                {/* Bottom Padding for Tab Bar */}
                <View style={{ height: 100 }} />
            </ScrollView>
        </View>
    );
}

function StatCard({ label, value, color }) {
    return (
        <View style={styles.statCard}>
            <Text style={[styles.statValue, { color }]}>{value}</Text>
            <Text style={styles.statLabel}>{label}</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: theme.colors.background,
    },
    scrollView: {
        flex: 1,
    },
    header: {
        paddingBottom: 80,
        paddingHorizontal: theme.spacing.lg,
        borderBottomLeftRadius: 40,
        borderBottomRightRadius: 40,
    },
    headerContent: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: theme.spacing.xl,
    },
    greeting: {
        fontSize: 18,
        color: theme.colors.textWhite,
        opacity: 0.85,
        letterSpacing: 0.5,
    },
    userName: {
        fontSize: 34,
        fontWeight: theme.fontWeights.extraBold,
        color: theme.colors.textWhite,
        marginTop: 2,
        letterSpacing: -0.5,
    },
    headerSubtitle: {
        fontSize: 26,
        fontWeight: theme.fontWeights.medium,
        color: theme.colors.textWhite,
        opacity: 0.9,
        marginTop: 8,
        letterSpacing: 0.3,
    },
    headerTitle: {
        fontSize: theme.fontSizes.xxxl,
        fontWeight: theme.fontWeights.bold,
        color: theme.colors.textWhite,
    },
    profileButton: {
        width: 50,
        height: 50,
        borderRadius: 25,
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    profileEmoji: {
        fontSize: 24,
    },
    quickActionCard: {
        position: 'absolute',
        bottom: -35,
        left: theme.spacing.lg,
        right: theme.spacing.lg,
        backgroundColor: theme.colors.surface,
        borderRadius: theme.borderRadius.xl,
        padding: theme.spacing.lg,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        ...theme.shadows.lg,
    },
    quickActionInfo: {
        flex: 1,
        marginRight: theme.spacing.md,
    },
    quickActionTitle: {
        fontSize: theme.fontSizes.md,
        fontWeight: theme.fontWeights.bold,
        color: theme.colors.textPrimary,
        marginBottom: 4,
    },
    quickActionText: {
        fontSize: theme.fontSizes.xs,
        color: theme.colors.textSecondary,
    },
    scanButton: {
        paddingHorizontal: theme.spacing.md,
    },
    content: {
        marginTop: 70,
        paddingHorizontal: theme.spacing.lg,
    },
    section: {
        marginBottom: theme.spacing.xl,
    },
    sectionHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: theme.spacing.md,
    },
    sectionTitle: {
        fontSize: theme.fontSizes.xl,
        fontWeight: theme.fontWeights.bold,
        color: theme.colors.textPrimary,
    },
    viewAll: {
        fontSize: theme.fontSizes.md,
        color: theme.colors.primary,
        fontWeight: theme.fontWeights.semibold,
    },
    statsGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        marginHorizontal: -theme.spacing.xs,
    },
    statCard: {
        width: (width - theme.spacing.lg * 2 - theme.spacing.xs * 4) / 2,
        backgroundColor: theme.colors.surface,
        borderRadius: theme.borderRadius.lg,
        padding: theme.spacing.md,
        margin: theme.spacing.xs,
        alignItems: 'center',
        ...theme.shadows.sm,
    },
    statValue: {
        fontSize: theme.fontSizes.xxl,
        fontWeight: theme.fontWeights.extraBold,
    },
    statLabel: {
        fontSize: theme.fontSizes.xs,
        color: theme.colors.textSecondary,
        marginTop: 4,
    },
    insightCard: {
        borderRadius: theme.borderRadius.xl,
        overflow: 'hidden',
        ...theme.shadows.md,
    },
    insightGradient: {
        padding: theme.spacing.lg,
    },
    insightContent: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    insightEmoji: {
        fontSize: 32,
        marginRight: theme.spacing.md,
    },
    insightTitle: {
        fontSize: theme.fontSizes.md,
        fontWeight: theme.fontWeights.bold,
        color: theme.colors.textPrimary,
    },
    insightText: {
        fontSize: theme.fontSizes.sm,
        color: theme.colors.textSecondary,
    },
});
