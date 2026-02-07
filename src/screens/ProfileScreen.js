import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    Image,
    ScrollView,
    TouchableOpacity,
    Dimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { theme } from '../styles/theme';
import Button from '../components/Button';

const { width } = Dimensions.get('window');

export default function ProfileScreen({ navigation }) {
    const insets = useSafeAreaInsets();

    const stats = [
        { label: 'Scans', value: '12', icon: '🔍' },
        { label: 'Health', value: 'Good', icon: '💖' },
        { label: 'Points', value: '250', icon: '⭐' },
    ];

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
                                <Text style={styles.avatarEmoji}>👤</Text>
                            </View>
                            <TouchableOpacity style={styles.editAvatar}>
                                <Text style={styles.editIcon}>✏️</Text>
                            </TouchableOpacity>
                        </View>
                        <Text style={styles.userName}>Harsh Vardhan</Text>
                        <Text style={styles.userEmail}>harshvardhan@example.com</Text>
                    </View>

                    {/* Quick Stats */}
                    <View style={styles.statsContainer}>
                        {stats.map((stat, index) => (
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
                        <InfoRow label="Member Since" value="Jan 2026" />
                        <InfoRow label="Oral Health Score" value="85 / 100" />
                        <InfoRow label="Last Scan Date" value="Jan 28, 2026" showBorder={true} />
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
                            onPress={() => navigation.replace('Login')}
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
});
