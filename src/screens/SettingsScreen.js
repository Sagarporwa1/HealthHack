import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    Alert,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '../styles/theme';
import { storageService } from '../services/storageService';

export default function SettingsScreen({ navigation }) {
    const insets = useSafeAreaInsets();
    const handleClearData = () => {
        Alert.alert(
            'Clear All Data',
            'This will delete all your scan history. This action cannot be undone. Are you sure?',
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Clear',
                    style: 'destructive',
                    onPress: async () => {
                        await storageService.clearAllScans();
                        Alert.alert('Success', 'All data has been cleared.');
                    },
                },
            ]
        );
    };

    const handleAbout = () => {
        Alert.alert(
            'About Oral Cancer Detection App',
            'Version 1.0.0 (2026 Build)\n\nThis app helps with early detection of oral cancer through image analysis. It is not a substitute for professional medical advice.\n\nAlways consult with healthcare professionals for medical concerns.'
        );
    };

    return (
        <View style={styles.container}>
            <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
                {/* Header */}
                <LinearGradient
                    colors={[theme.colors.primaryDark, theme.colors.primary]}
                    style={[styles.header, { paddingTop: insets.top + 10 }]}
                >
                    <TouchableOpacity
                        onPress={() => navigation.goBack()}
                        style={styles.backButton}
                    >
                        <Ionicons name="chevron-back" size={28} color={theme.colors.textWhite} />
                    </TouchableOpacity>
                    <Text style={styles.headerTitle}>Settings</Text>
                    <Text style={styles.headerSubtitle}>Personalize your experience</Text>
                </LinearGradient>

                <View style={styles.body}>
                    {/* User Profile Section */}
                    <View style={styles.section}>
                        <Text style={styles.sectionHeader}>ACCOUNT</Text>
                        <View style={styles.card}>
                            <SettingItem
                                icon="👤"
                                title="Profile Information"
                                description="User"
                                onPress={() => Alert.alert('Coming Soon', 'Profile editing will be available in a future update.')}
                            />
                            <SettingItem
                                icon="🔔"
                                title="Notifications"
                                description="Off"
                                onPress={() => Alert.alert('Coming Soon', 'Notification settings will be available in a future update.')}
                                showBorder={false}
                            />
                        </View>
                    </View>

                    {/* Security & Data */}
                    <View style={styles.section}>
                        <Text style={styles.sectionHeader}>PRIVACY & DATA</Text>
                        <View style={styles.card}>
                            <SettingItem
                                icon="🔒"
                                title="Data Storage"
                                description="Local Only (Encrypted)"
                                onPress={() => Alert.alert(
                                    'Data Storage',
                                    'All your data is stored locally on your device. No data is sent to external servers.'
                                )}
                            />
                            <SettingItem
                                icon="🗑️"
                                title="Clear All History"
                                description="Permanently delete all scans"
                                onPress={handleClearData}
                                danger
                                showBorder={false}
                            />
                        </View>
                    </View>

                    {/* Support & Legal */}
                    <View style={styles.section}>
                        <Text style={styles.sectionHeader}>SUPPORT</Text>
                        <View style={styles.card}>
                            <SettingItem
                                icon="ℹ️"
                                title="About"
                                description="Version 1.0.0"
                                onPress={handleAbout}
                            />
                            <SettingItem
                                icon="📄"
                                title="Privacy Policy"
                                onPress={() => Alert.alert('Privacy Policy', 'Your privacy is important to us. All data is stored locally.')}
                            />
                            <SettingItem
                                icon="⚖️"
                                title="Terms of Service"
                                onPress={() => Alert.alert('Terms of Service', 'This app is for informational purposes only.')}
                                showBorder={false}
                            />
                        </View>
                    </View>

                    {/* Version Info */}
                    <View style={styles.footer}>
                        <Text style={styles.footerText}>Oral Health Assistant</Text>
                        <Text style={styles.versionText}>Build 4.16.0.2026</Text>
                    </View>
                </View>

                {/* Bottom Padding */}
                <View style={{ height: 100 }} />
            </ScrollView>
        </View>
    );
}

function SettingItem({ icon, title, description, onPress, danger, showBorder = true }) {
    return (
        <TouchableOpacity
            style={[styles.settingItem, !showBorder && styles.settingItemNoBorder]}
            onPress={onPress}
            activeOpacity={0.6}
        >
            <View style={styles.settingMain}>
                <View style={styles.iconContainer}>
                    <Text style={styles.settingIcon}>{icon}</Text>
                </View>
                <View>
                    <Text style={[styles.settingTitle, danger && styles.settingTitleDanger]}>
                        {title}
                    </Text>
                    {description && <Text style={styles.settingDescription}>{description}</Text>}
                </View>
            </View>
            <Text style={styles.settingArrow}>›</Text>
        </TouchableOpacity>
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
        borderBottomLeftRadius: 30,
        borderBottomRightRadius: 30,
    },
    backButton: {
        marginBottom: 10,
        marginLeft: -10,
        width: 40,
        height: 40,
        justifyContent: 'center',
    },
    headerTitle: {
        fontSize: theme.fontSizes.xxl,
        fontWeight: theme.fontWeights.bold,
        color: theme.colors.textWhite,
    },
    headerSubtitle: {
        fontSize: theme.fontSizes.md,
        color: theme.colors.textWhite,
        opacity: 0.9,
    },
    body: {
        paddingHorizontal: theme.spacing.lg,
        marginTop: 20,
    },
    section: {
        marginBottom: theme.spacing.xl,
    },
    sectionHeader: {
        fontSize: 12,
        fontWeight: 'bold',
        color: theme.colors.textLight,
        marginBottom: 10,
        marginLeft: 4,
        letterSpacing: 1,
    },
    card: {
        backgroundColor: theme.colors.surface,
        borderRadius: theme.borderRadius.xl,
        overflow: 'hidden',
        ...theme.shadows.sm,
    },
    settingItem: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: theme.spacing.lg,
        borderBottomWidth: 1,
        borderBottomColor: theme.colors.borderLight,
    },
    settingItemNoBorder: {
        borderBottomWidth: 0,
    },
    settingMain: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    iconContainer: {
        width: 40,
        height: 40,
        borderRadius: 12,
        backgroundColor: theme.colors.surfaceSubtle,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 16,
    },
    settingIcon: {
        fontSize: 20,
    },
    settingTitle: {
        fontSize: theme.fontSizes.md,
        color: theme.colors.textPrimary,
        fontWeight: '600',
    },
    settingTitleDanger: {
        color: theme.colors.danger,
    },
    settingDescription: {
        fontSize: theme.fontSizes.xs,
        color: theme.colors.textSecondary,
        marginTop: 2,
    },
    settingArrow: {
        fontSize: 24,
        color: theme.colors.textLight,
    },
    footer: {
        alignItems: 'center',
        marginTop: 20,
        marginBottom: 40,
    },
    footerText: {
        fontSize: 14,
        color: theme.colors.textLight,
        fontWeight: '600',
    },
    versionText: {
        fontSize: 12,
        color: theme.colors.textLight,
        marginTop: 4,
    },
});
