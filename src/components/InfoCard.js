import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { theme } from '../styles/theme';

export default function InfoCard({ title, content, icon, variant = 'default' }) {
    const variantColors = {
        default: theme.colors.primary,
        success: theme.colors.success,
        warning: theme.colors.warning,
        danger: theme.colors.danger,
        info: theme.colors.info,
    };

    const accentColor = variantColors[variant];

    return (
        <View style={[styles.card, { borderLeftColor: accentColor }]}>
            <View style={styles.content}>
                <Text style={styles.title}>{title}</Text>
                <Text style={styles.text}>{content}</Text>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    card: {
        backgroundColor: theme.colors.surface,
        borderRadius: theme.borderRadius.lg,
        padding: theme.spacing.md,
        marginBottom: theme.spacing.md,
        borderLeftWidth: 4,
        ...theme.shadows.sm,
    },
    content: {
        flex: 1,
    },
    title: {
        fontSize: theme.fontSizes.lg,
        fontWeight: theme.fontWeights.bold,
        color: theme.colors.textPrimary,
        marginBottom: theme.spacing.sm,
    },
    text: {
        fontSize: theme.fontSizes.md,
        color: theme.colors.textSecondary,
        lineHeight: 22,
    },
});
