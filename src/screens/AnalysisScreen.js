import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    Image,
    TouchableOpacity,
    Alert,
    StatusBar,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { theme } from '../styles/theme';
import Button from '../components/Button';
import { RISK_LABELS, RISK_DESCRIPTIONS } from '../utils/constants';
import { storageService } from '../services/storageService';

export default function AnalysisScreen({ route, navigation }) {
    const insets = useSafeAreaInsets();
    const { scan, fromHistory } = route.params;
    const [isSaving, setIsSaving] = useState(false);

    const riskColor = {
        low: theme.colors.riskLow,
        medium: theme.colors.riskMedium,
        high: theme.colors.riskHigh,
    }[scan.riskLevel];

    const handleSave = async () => {
        if (fromHistory) {
            navigation.goBack();
            return;
        }

        setIsSaving(true);
        try {
            await storageService.saveScan(scan);
            Alert.alert(
                'Scan Saved',
                'Your scan has been safely stored in your history.',
                [{ text: 'Great', onPress: () => navigation.navigate('MainTabs', { screen: 'History' }) }]
            );
        } catch (error) {
            Alert.alert('Error', 'Failed to save scan.');
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <View style={styles.container}>
            <StatusBar barStyle="light-content" />

            {/* Elegant Header with Risk Indicator */}
            <LinearGradient
                colors={scan.riskLevel === 'high' ? ['#DA1E28', '#8A1016'] : theme.colors.primaryGradient}
                style={[styles.header, { paddingTop: insets.top + 10 }]}
            >
                <View style={styles.headerContent}>
                    <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                        <Text style={styles.backIcon}>←</Text>
                    </TouchableOpacity>
                    <Text style={styles.headerTitle}>Medical Analysis</Text>
                    <View style={styles.placeholder} />
                </View>
            </LinearGradient>

            <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
                {/* Captured Image with Frame */}
                <View style={styles.imageSection}>
                    <View style={styles.imageFrame}>
                        <Image source={{ uri: scan.imageUri }} style={styles.image} resizeMode="cover" />
                        <View style={[styles.statusBadge, { backgroundColor: riskColor }]}>
                            <Text style={styles.statusText}>{RISK_LABELS[scan.riskLevel].toUpperCase()}</Text>
                        </View>
                    </View>
                </View>

                {/* Analysis Card */}
                <View style={[styles.mainCard, { borderLeftColor: riskColor }]}>
                    <View style={styles.cardHeader}>
                        <Text style={styles.cardTitle}>Diagnostic Assessment</Text>
                        <View style={styles.confidenceBadge}>
                            <Text style={styles.confidenceText}>{scan.confidence}% Confidence</Text>
                        </View>
                    </View>

                    <Text style={styles.description}>
                        {RISK_DESCRIPTIONS[scan.riskLevel]}
                    </Text>

                    {/* Score Bar */}
                    <View style={styles.scoreBarContainer}>
                        <View style={styles.scoreBarBackground}>
                            <View
                                style={[
                                    styles.scoreBarFill,
                                    { width: `${scan.confidence}%`, backgroundColor: riskColor }
                                ]}
                            />
                        </View>
                        <View style={styles.scoreLabels}>
                            <Text style={styles.scoreLabel}>Low</Text>
                            <Text style={styles.scoreLabel}>High</Text>
                        </View>
                    </View>
                </View>

                {/* Detailed Findings */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Key Findings</Text>
                    <View style={styles.findingsList}>
                        {scan.findings.map((finding, idx) => (
                            <View key={idx} style={styles.findingItem}>
                                <View style={[styles.findingBullet, { backgroundColor: riskColor }]} />
                                <Text style={styles.findingText}>{finding}</Text>
                            </View>
                        ))}
                    </View>
                </View>

                {/* Recommendations */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Recommendations</Text>
                    {scan.recommendations.map((rec, idx) => (
                        <View key={idx} style={styles.recCard}>
                            <Text style={styles.recNumber}>{idx + 1}</Text>
                            <Text style={styles.recText}>{rec}</Text>
                        </View>
                    ))}
                </View>

                {/* Disclaimer */}
                <View style={styles.disclaimerCard}>
                    <Text style={styles.disclaimerTitle}>⚠️ Medical Disclaimer</Text>
                    <Text style={styles.disclaimerText}>
                        This AI-generated analysis is for informational purposes only. It is NOT a professional medical diagnosis. Please consult a qualified dentist or oncologist for any concerning lesions.
                    </Text>
                </View>

                {/* Actions */}
                <View style={styles.actions}>
                    {!fromHistory && (
                        <Button
                            title="Save to My History"
                            onPress={handleSave}
                            loading={isSaving}
                            style={styles.actionBtn}
                        />
                    )}
                    <Button
                        title={fromHistory ? "Back to History" : "Done"}
                        onPress={() => navigation.goBack()}
                        variant="outline"
                        style={styles.actionBtn}
                    />
                </View>

                <View style={{ height: insets.bottom + 40 }} />
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: theme.colors.background,
    },
    header: {
        paddingBottom: 30,
        borderBottomLeftRadius: 30,
        borderBottomRightRadius: 30,
    },
    headerContent: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: theme.spacing.lg,
        marginTop: 10,
    },
    backButton: {
        width: 40,
        height: 40,
        justifyContent: 'center',
    },
    backIcon: {
        fontSize: 28,
        color: theme.colors.textWhite,
        fontWeight: 'bold',
    },
    headerTitle: {
        fontSize: theme.fontSizes.lg,
        fontWeight: theme.fontWeights.bold,
        color: theme.colors.textWhite,
    },
    placeholder: {
        width: 40,
    },
    content: {
        flex: 1,
    },
    imageSection: {
        padding: theme.spacing.lg,
        marginTop: -10,
    },
    imageFrame: {
        borderRadius: theme.borderRadius.xl,
        overflow: 'hidden',
        height: 250,
        backgroundColor: '#000',
        ...theme.shadows.lg,
    },
    image: {
        width: '100%',
        height: '100%',
    },
    statusBadge: {
        position: 'absolute',
        top: 16,
        right: 16,
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 8,
    },
    statusText: {
        color: '#FFF',
        fontWeight: 'bold',
        fontSize: 12,
    },
    mainCard: {
        backgroundColor: theme.colors.surface,
        marginHorizontal: theme.spacing.lg,
        padding: theme.spacing.xl,
        borderRadius: theme.borderRadius.lg,
        borderLeftWidth: 6,
        ...theme.shadows.md,
    },
    cardHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: theme.spacing.md,
    },
    cardTitle: {
        fontSize: theme.fontSizes.lg,
        fontWeight: theme.fontWeights.bold,
        color: theme.colors.textPrimary,
        flex: 1,
    },
    confidenceBadge: {
        backgroundColor: theme.colors.primaryLight,
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 6,
    },
    confidenceText: {
        fontSize: 10,
        color: theme.colors.primaryDark,
        fontWeight: 'bold',
    },
    description: {
        fontSize: theme.fontSizes.md,
        color: theme.colors.textSecondary,
        lineHeight: 24,
        marginBottom: theme.spacing.lg,
    },
    scoreBarContainer: {
        marginTop: theme.spacing.sm,
    },
    scoreBarBackground: {
        height: 8,
        backgroundColor: theme.colors.surfaceSubtle,
        borderRadius: 4,
        overflow: 'hidden',
    },
    scoreBarFill: {
        height: '100%',
        borderRadius: 4,
    },
    scoreLabels: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 6,
    },
    scoreLabel: {
        fontSize: 10,
        color: theme.colors.textLight,
        textTransform: 'uppercase',
    },
    section: {
        paddingHorizontal: theme.spacing.lg,
        marginTop: theme.spacing.xl,
    },
    sectionTitle: {
        fontSize: theme.fontSizes.lg,
        fontWeight: theme.fontWeights.bold,
        color: theme.colors.textPrimary,
        marginBottom: theme.spacing.md,
    },
    findingsList: {
        backgroundColor: theme.colors.surface,
        borderRadius: theme.borderRadius.lg,
        padding: theme.spacing.md,
        ...theme.shadows.sm,
    },
    findingItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: theme.spacing.sm,
    },
    findingBullet: {
        width: 8,
        height: 8,
        borderRadius: 4,
        marginRight: 12,
    },
    findingText: {
        fontSize: theme.fontSizes.md,
        color: theme.colors.textPrimary,
    },
    recCard: {
        backgroundColor: theme.colors.surface,
        flexDirection: 'row',
        alignItems: 'center',
        padding: theme.spacing.md,
        borderRadius: theme.borderRadius.md,
        marginBottom: theme.spacing.sm,
        ...theme.shadows.sm,
    },
    recNumber: {
        fontSize: 18,
        fontWeight: 'bold',
        color: theme.colors.primary,
        marginRight: 16,
        width: 25,
    },
    recText: {
        flex: 1,
        fontSize: theme.fontSizes.md,
        color: theme.colors.textPrimary,
    },
    disclaimerCard: {
        margin: theme.spacing.lg,
        padding: theme.spacing.lg,
        backgroundColor: '#FFF4F4',
        borderRadius: theme.borderRadius.lg,
        borderWidth: 1,
        borderColor: '#FFE0E0',
    },
    disclaimerTitle: {
        color: theme.colors.danger,
        fontWeight: 'bold',
        marginBottom: 8,
    },
    disclaimerText: {
        fontSize: 12,
        color: '#666',
        lineHeight: 18,
    },
    actions: {
        paddingHorizontal: theme.spacing.lg,
        marginTop: theme.spacing.md,
    },
    actionBtn: {
        marginBottom: theme.spacing.md,
    }
});
