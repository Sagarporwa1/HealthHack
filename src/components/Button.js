import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ActivityIndicator, View } from 'react-native';
import { theme } from '../styles/theme';

export default function Button({
    title,
    onPress,
    variant = 'primary',
    size = 'md',
    disabled = false,
    loading = false,
    style,
    icon,
}) {
    const buttonStyles = [
        styles.button,
        styles[variant],
        styles[size],
        disabled && styles.disabled,
        style,
    ];

    const textStyles = [
        styles.text,
        styles[`text_${variant}`],
        styles[`text_${size}`],
    ];

    return (
        <TouchableOpacity
            style={buttonStyles}
            onPress={onPress}
            disabled={disabled || loading}
            activeOpacity={0.8}
        >
            {loading ? (
                <ActivityIndicator color={variant === 'primary' || variant === 'secondary' || variant === 'danger' ? theme.colors.textWhite : theme.colors.primary} />
            ) : (
                <View style={styles.contentContainer}>
                    {icon && <View style={styles.iconContainer}>{icon}</View>}
                    <Text style={textStyles}>{title}</Text>
                </View>
            )}
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    button: {
        borderRadius: theme.borderRadius.lg,
        alignItems: 'center',
        justifyContent: 'center',
    },
    contentContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },
    iconContainer: {
        marginRight: theme.spacing.sm,
    },

    // Variants
    primary: {
        backgroundColor: theme.colors.primary,
        shadowColor: theme.colors.primary,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 6,
    },
    secondary: {
        backgroundColor: theme.colors.secondary,
        shadowColor: theme.colors.secondary,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 6,
    },
    outline: {
        backgroundColor: 'transparent',
        borderWidth: 1.5,
        borderColor: theme.colors.primary,
    },
    danger: {
        backgroundColor: theme.colors.danger,
        shadowColor: theme.colors.danger,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 6,
    },
    subtle: {
        backgroundColor: theme.colors.surfaceSubtle,
    },

    // Sizes
    sm: {
        paddingVertical: theme.spacing.sm,
        paddingHorizontal: theme.spacing.md,
        borderRadius: theme.borderRadius.md,
    },
    md: {
        paddingVertical: theme.spacing.md,
        paddingHorizontal: theme.spacing.lg,
    },
    lg: {
        paddingVertical: theme.spacing.lg,
        paddingHorizontal: theme.spacing.xl,
    },

    // Disabled state
    disabled: {
        opacity: 0.4,
        backgroundColor: theme.colors.textLight,
        shadowOpacity: 0,
        elevation: 0,
    },

    // Text styles
    text: {
        fontWeight: theme.fontWeights.semibold,
        textAlign: 'center',
    },
    text_primary: {
        color: theme.colors.textWhite,
    },
    text_secondary: {
        color: theme.colors.textWhite,
    },
    text_outline: {
        color: theme.colors.primary,
    },
    text_danger: {
        color: theme.colors.textWhite,
    },
    text_subtle: {
        color: theme.colors.textPrimary,
    },
    text_sm: {
        fontSize: theme.fontSizes.sm,
    },
    text_md: {
        fontSize: theme.fontSizes.md,
    },
    text_lg: {
        fontSize: theme.fontSizes.lg,
        fontWeight: theme.fontWeights.bold,
    },
});
