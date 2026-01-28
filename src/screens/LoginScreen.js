import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TextInput,
    TouchableOpacity,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    Dimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { theme } from '../styles/theme';
import Button from '../components/Button';

const { width } = Dimensions.get('window');

export default function LoginScreen({ navigation }) {
    const insets = useSafeAreaInsets();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleLogin = () => {
        setIsLoading(true);
        // Simulate login delay
        setTimeout(() => {
            setIsLoading(false);
            navigation.replace('MainTabs');
        }, 1500);
    };

    return (
        <View style={styles.container}>
            <LinearGradient
                colors={theme.colors.primaryGradient}
                style={styles.background}
            >
                <KeyboardAvoidingView
                    behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                    style={{ flex: 1 }}
                >
                    <ScrollView
                        contentContainerStyle={[
                            styles.scrollContent,
                            { paddingTop: insets.top + 60, paddingBottom: insets.bottom + 20 }
                        ]}
                        showsVerticalScrollIndicator={false}
                    >
                        {/* Logo & Intro */}
                        <View style={styles.header}>
                            <View style={styles.logoCircle}>
                                <Text style={styles.logoEmoji}>🦷</Text>
                            </View>
                            <Text style={styles.appName}>OralHealth AI</Text>
                            <Text style={styles.subtitle}>Your personal oral health assistant</Text>
                        </View>

                        {/* Login Card */}
                        <View style={styles.card}>
                            <Text style={styles.cardTitle}>Welcome Back</Text>
                            <Text style={styles.cardSubtitle}>Sign in to continue your journey</Text>

                            <View style={styles.inputContainer}>
                                <Text style={styles.inputLabel}>Email Address</Text>
                                <TextInput
                                    style={styles.input}
                                    placeholder="yourname@email.com"
                                    placeholderTextColor={theme.colors.textLight}
                                    value={email}
                                    onChangeText={setEmail}
                                    autoCapitalize="none"
                                    keyboardType="email-address"
                                />
                            </View>

                            <View style={styles.inputContainer}>
                                <Text style={styles.inputLabel}>Password</Text>
                                <TextInput
                                    style={styles.input}
                                    placeholder="••••••••"
                                    placeholderTextColor={theme.colors.textLight}
                                    value={password}
                                    onChangeText={setPassword}
                                    secureTextEntry
                                />
                                <TouchableOpacity style={styles.forgotPassword}>
                                    <Text style={styles.forgotText}>Forgot Password?</Text>
                                </TouchableOpacity>
                            </View>

                            <Button
                                title="Sign In"
                                onPress={handleLogin}
                                loading={isLoading}
                                style={styles.loginBtn}
                            />

                            <View style={styles.divider}>
                                <View style={styles.dividerLine} />
                                <Text style={styles.dividerText}>OR</Text>
                                <View style={styles.dividerLine} />
                            </View>

                            {/* Social Logins */}
                            <View style={styles.socialRow}>
                                <TouchableOpacity style={styles.socialBtn}>
                                    <Text style={styles.socialIcon}>G</Text>
                                </TouchableOpacity>
                                <TouchableOpacity style={styles.socialBtn}>
                                    <Text style={styles.socialIcon}>A</Text>
                                </TouchableOpacity>
                            </View>

                            <View style={styles.footer}>
                                <Text style={styles.footerText}>Don't have an account? </Text>
                                <TouchableOpacity>
                                    <Text style={styles.signUpText}>Sign Up</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </ScrollView>
                </KeyboardAvoidingView>
            </LinearGradient>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    background: {
        flex: 1,
    },
    scrollContent: {
        flexGrow: 1,
        paddingHorizontal: theme.spacing.xl,
    },
    header: {
        alignItems: 'center',
        marginBottom: 40,
    },
    logoCircle: {
        width: 100,
        height: 100,
        borderRadius: 50,
        backgroundColor: 'rgba(255, 255, 255, 0.25)',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 16,
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.3)',
    },
    logoEmoji: {
        fontSize: 50,
    },
    appName: {
        fontSize: 32,
        fontWeight: theme.fontWeights.bold,
        color: theme.colors.textWhite,
        letterSpacing: 0.5,
    },
    subtitle: {
        fontSize: 16,
        color: theme.colors.textWhite,
        opacity: 0.9,
        marginTop: 4,
    },
    card: {
        backgroundColor: theme.colors.surface,
        borderRadius: 30,
        padding: 30,
        width: '100%',
        ...theme.shadows.lg,
    },
    cardTitle: {
        fontSize: 24,
        fontWeight: theme.fontWeights.bold,
        color: theme.colors.textPrimary,
        textAlign: 'center',
    },
    cardSubtitle: {
        fontSize: 14,
        color: theme.colors.textSecondary,
        textAlign: 'center',
        marginBottom: 30,
        marginTop: 4,
    },
    inputContainer: {
        marginBottom: 20,
    },
    inputLabel: {
        fontSize: 14,
        fontWeight: '600',
        color: theme.colors.textPrimary,
        marginBottom: 8,
    },
    input: {
        backgroundColor: theme.colors.surfaceSubtle,
        borderRadius: 12,
        padding: 16,
        fontSize: 16,
        color: theme.colors.textPrimary,
        borderWidth: 1,
        borderColor: theme.colors.borderLight,
    },
    forgotPassword: {
        alignSelf: 'flex-end',
        marginTop: 8,
    },
    forgotText: {
        fontSize: 12,
        color: theme.colors.primary,
        fontWeight: '600',
    },
    loginBtn: {
        marginTop: 10,
    },
    divider: {
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: 25,
    },
    dividerLine: {
        flex: 1,
        height: 1,
        backgroundColor: theme.colors.border,
    },
    dividerText: {
        marginHorizontal: 15,
        color: theme.colors.textLight,
        fontSize: 12,
        fontWeight: 'bold',
    },
    socialRow: {
        flexDirection: 'row',
        justifyContent: 'center',
        gap: 20,
    },
    socialBtn: {
        width: 60,
        height: 60,
        borderRadius: 15,
        backgroundColor: theme.colors.surfaceSubtle,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: theme.colors.border,
    },
    socialIcon: {
        fontSize: 22,
        fontWeight: 'bold',
        color: theme.colors.textPrimary,
    },
    footer: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginTop: 30,
    },
    footerText: {
        color: theme.colors.textSecondary,
        fontSize: 14,
    },
    signUpText: {
        color: theme.colors.primary,
        fontWeight: 'bold',
        fontSize: 14,
    },
});
