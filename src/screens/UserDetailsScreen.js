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
import { profileService } from '../services/profileService';
import { supabase } from '../services/supabaseClient';

const { width } = Dimensions.get('window');

const GENDER_OPTIONS = ['Male', 'Female', 'Other', 'Prefer not to say'];
const MEDICAL_CONDITIONS = [
    'Diabetes',
    'Heart Disease',
    'Hypertension',
    'Respiratory Issues',
    'Allergies',
    'None',
];

export default function UserDetailsScreen({ navigation, onComplete }) {
    const insets = useSafeAreaInsets();
    const [fullName, setFullName] = useState('');
    const [dateOfBirth, setDateOfBirth] = useState('');
    const [gender, setGender] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [selectedConditions, setSelectedConditions] = useState([]);
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [showGenderPicker, setShowGenderPicker] = useState(false);

    const toggleCondition = (condition) => {
        if (condition === 'None') {
            setSelectedConditions(['None']);
        } else {
            setSelectedConditions((prev) => {
                const filtered = prev.filter((c) => c !== 'None');
                if (filtered.includes(condition)) {
                    return filtered.filter((c) => c !== condition);
                }
                return [...filtered, condition];
            });
        }
    };

    const handleSubmit = async () => {
        if (!fullName.trim()) {
            setError('Please enter your full name');
            return;
        }

        setIsLoading(true);
        setError('');

        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) throw new Error('Not authenticated');

            await profileService.saveProfile(user.id, {
                fullName: fullName.trim(),
                dateOfBirth: dateOfBirth || null,
                gender: gender || null,
                phoneNumber: phoneNumber || null,
                medicalConditions: selectedConditions.length > 0 ? selectedConditions : null,
                avatarUrl: null,
            });

            // Call the onComplete callback to update navigation state
            if (onComplete) {
                onComplete();
            }
        } catch (err) {
            setError(err.message || 'Failed to save profile');
        } finally {
            setIsLoading(false);
        }
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
                            { paddingTop: insets.top + 30, paddingBottom: insets.bottom + 20 }
                        ]}
                        showsVerticalScrollIndicator={false}
                    >
                        {/* Header */}
                        <View style={styles.header}>
                            <View style={styles.stepBadge}>
                                <Text style={styles.stepText}>Step 2 of 2</Text>
                            </View>
                            <Text style={styles.title}>Complete Your Profile</Text>
                            <Text style={styles.subtitle}>
                                Help us personalize your oral health experience
                            </Text>
                        </View>

                        {/* Form Card */}
                        <View style={styles.card}>
                            {error ? (
                                <View style={styles.errorContainer}>
                                    <Text style={styles.errorText}>{error}</Text>
                                </View>
                            ) : null}

                            {/* Full Name */}
                            <View style={styles.inputContainer}>
                                <Text style={styles.inputLabel}>Full Name *</Text>
                                <TextInput
                                    style={styles.input}
                                    placeholder="Enter your full name"
                                    placeholderTextColor={theme.colors.textLight}
                                    value={fullName}
                                    onChangeText={setFullName}
                                    autoCapitalize="words"
                                />
                            </View>

                            {/* Date of Birth */}
                            <View style={styles.inputContainer}>
                                <Text style={styles.inputLabel}>Date of Birth</Text>
                                <TextInput
                                    style={styles.input}
                                    placeholder="DD/MM/YYYY"
                                    placeholderTextColor={theme.colors.textLight}
                                    value={dateOfBirth}
                                    onChangeText={setDateOfBirth}
                                    keyboardType="numeric"
                                />
                            </View>

                            {/* Gender */}
                            <View style={styles.inputContainer}>
                                <Text style={styles.inputLabel}>Gender</Text>
                                <TouchableOpacity
                                    style={styles.input}
                                    onPress={() => setShowGenderPicker(!showGenderPicker)}
                                >
                                    <Text style={gender ? styles.inputText : styles.placeholderText}>
                                        {gender || 'Select gender'}
                                    </Text>
                                </TouchableOpacity>
                                {showGenderPicker && (
                                    <View style={styles.optionsContainer}>
                                        {GENDER_OPTIONS.map((option) => (
                                            <TouchableOpacity
                                                key={option}
                                                style={[
                                                    styles.optionItem,
                                                    gender === option && styles.optionItemActive
                                                ]}
                                                onPress={() => {
                                                    setGender(option);
                                                    setShowGenderPicker(false);
                                                }}
                                            >
                                                <Text style={[
                                                    styles.optionText,
                                                    gender === option && styles.optionTextActive
                                                ]}>
                                                    {option}
                                                </Text>
                                            </TouchableOpacity>
                                        ))}
                                    </View>
                                )}
                            </View>

                            {/* Phone Number */}
                            <View style={styles.inputContainer}>
                                <Text style={styles.inputLabel}>Phone Number</Text>
                                <TextInput
                                    style={styles.input}
                                    placeholder="+91 XXXXXXXXXX"
                                    placeholderTextColor={theme.colors.textLight}
                                    value={phoneNumber}
                                    onChangeText={setPhoneNumber}
                                    keyboardType="phone-pad"
                                />
                            </View>

                            {/* Medical Conditions */}
                            <View style={styles.inputContainer}>
                                <Text style={styles.inputLabel}>Medical Conditions</Text>
                                <Text style={styles.inputHint}>
                                    Select any that apply to you
                                </Text>
                                <View style={styles.conditionsGrid}>
                                    {MEDICAL_CONDITIONS.map((condition) => (
                                        <TouchableOpacity
                                            key={condition}
                                            style={[
                                                styles.conditionChip,
                                                selectedConditions.includes(condition) && styles.conditionChipActive
                                            ]}
                                            onPress={() => toggleCondition(condition)}
                                        >
                                            <Text style={[
                                                styles.conditionText,
                                                selectedConditions.includes(condition) && styles.conditionTextActive
                                            ]}>
                                                {condition}
                                            </Text>
                                        </TouchableOpacity>
                                    ))}
                                </View>
                            </View>

                            <Button
                                title="Complete Profile"
                                onPress={handleSubmit}
                                loading={isLoading}
                                style={styles.submitBtn}
                            />

                            <TouchableOpacity
                                style={styles.skipBtn}
                                onPress={() => {
                                    // Allow skipping but save minimal profile
                                    handleSubmit();
                                }}
                            >
                                <Text style={styles.skipText}>I'll do this later</Text>
                            </TouchableOpacity>
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
        marginBottom: 30,
    },
    stepBadge: {
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 20,
        marginBottom: 16,
    },
    stepText: {
        color: theme.colors.textWhite,
        fontSize: 12,
        fontWeight: '600',
    },
    title: {
        fontSize: 28,
        fontWeight: theme.fontWeights.bold,
        color: theme.colors.textWhite,
        textAlign: 'center',
    },
    subtitle: {
        fontSize: 14,
        color: theme.colors.textWhite,
        opacity: 0.9,
        marginTop: 8,
        textAlign: 'center',
    },
    card: {
        backgroundColor: theme.colors.surface,
        borderRadius: 30,
        padding: 25,
        width: '100%',
        ...theme.shadows.lg,
    },
    errorContainer: {
        backgroundColor: '#FFE5E5',
        padding: 10,
        borderRadius: 8,
        marginBottom: 15,
        borderWidth: 1,
        borderColor: '#FFB2B2',
    },
    errorText: {
        color: '#D32F2F',
        fontSize: 13,
        textAlign: 'center',
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
    inputHint: {
        fontSize: 12,
        color: theme.colors.textSecondary,
        marginBottom: 10,
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
    inputText: {
        fontSize: 16,
        color: theme.colors.textPrimary,
    },
    placeholderText: {
        fontSize: 16,
        color: theme.colors.textLight,
    },
    optionsContainer: {
        marginTop: 8,
        backgroundColor: theme.colors.surface,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: theme.colors.border,
        overflow: 'hidden',
    },
    optionItem: {
        padding: 14,
        borderBottomWidth: 1,
        borderBottomColor: theme.colors.borderLight,
    },
    optionItemActive: {
        backgroundColor: theme.colors.primaryLight,
    },
    optionText: {
        fontSize: 15,
        color: theme.colors.textPrimary,
    },
    optionTextActive: {
        color: theme.colors.primary,
        fontWeight: '600',
    },
    conditionsGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 10,
    },
    conditionChip: {
        paddingHorizontal: 16,
        paddingVertical: 10,
        borderRadius: 20,
        backgroundColor: theme.colors.surfaceSubtle,
        borderWidth: 1,
        borderColor: theme.colors.border,
    },
    conditionChipActive: {
        backgroundColor: theme.colors.primary,
        borderColor: theme.colors.primary,
    },
    conditionText: {
        fontSize: 13,
        color: theme.colors.textSecondary,
        fontWeight: '500',
    },
    conditionTextActive: {
        color: theme.colors.textWhite,
    },
    submitBtn: {
        marginTop: 10,
    },
    skipBtn: {
        alignItems: 'center',
        marginTop: 20,
        paddingVertical: 10,
    },
    skipText: {
        color: theme.colors.textSecondary,
        fontSize: 14,
    },
});
