import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { theme } from '../styles/theme';
import { RISK_LABELS } from '../utils/constants';

export default function ScanCard({ scan, onPress }) {
    const riskColor = {
        low: theme.colors.riskLow,
        medium: theme.colors.riskMedium,
        high: theme.colors.riskHigh,
    }[scan.riskLevel];

    const formatDate = (timestamp) => {
        const date = new Date(timestamp);
        return date.toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    return (
        <TouchableOpacity
            style={styles.card}
            onPress={onPress}
            activeOpacity={0.7}
        >
            <View style={styles.content}>
                <View style={styles.header}>
                    <View style={[styles.riskBadge, { backgroundColor: riskColor }]}>
                        <Text style={styles.riskText}>{RISK_LABELS[scan.riskLevel]}</Text>
                    </View>
                    <Text style={styles.confidence}>{scan.confidence}% confidence</Text>
                </View>

                <Text style={styles.date}>{formatDate(scan.timestamp)}</Text>

                {scan.findings && scan.findings.length > 0 && (
                    <Text style={styles.findings} numberOfLines={2}>
                        {scan.findings[0]}
                    </Text>
                )}
            </View>

            <View style={styles.arrow}>
                <Text style={styles.arrowText}>›</Text>
            </View>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    card: {
        backgroundColor: theme.colors.surface,
        borderRadius: theme.borderRadius.lg,
        padding: theme.spacing.md,
        marginBottom: theme.spacing.md,
        flexDirection: 'row',
        alignItems: 'center',
        ...theme.shadows.md,
    },
    content: {
        flex: 1,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: theme.spacing.sm,
    },
    riskBadge: {
        paddingHorizontal: theme.spacing.md,
        paddingVertical: theme.spacing.xs,
        borderRadius: theme.borderRadius.round,
        marginRight: theme.spacing.sm,
    },
    riskText: {
        color: theme.colors.textWhite,
        fontSize: theme.fontSizes.sm,
        fontWeight: theme.fontWeights.bold,
    },
    confidence: {
        fontSize: theme.fontSizes.sm,
        color: theme.colors.textSecondary,
    },
    date: {
        fontSize: theme.fontSizes.sm,
        color: theme.colors.textSecondary,
        marginBottom: theme.spacing.xs,
    },
    findings: {
        fontSize: theme.fontSizes.md,
        color: theme.colors.textPrimary,
    },
    arrow: {
        marginLeft: theme.spacing.sm,
    },
    arrowText: {
        fontSize: 24,
        color: theme.colors.textLight,
    },
});
