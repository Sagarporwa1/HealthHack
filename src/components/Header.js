import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { theme } from '../styles/theme';

export default function Header({ title, subtitle, showBack, onBackPress, rightAction }) {
    const insets = useSafeAreaInsets();
    return (
        <View style={[styles.header, { paddingTop: insets.top + 10 }]}>
            <View style={styles.content}>
                {showBack && (
                    <TouchableOpacity onPress={onBackPress} style={styles.backButton}>
                        <Text style={styles.backText}>‹</Text>
                    </TouchableOpacity>
                )}

                <View style={styles.titleContainer}>
                    <Text style={styles.title}>{title}</Text>
                    {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
                </View>

                {rightAction && (
                    <View style={styles.rightAction}>{rightAction}</View>
                )}
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    header: {
        backgroundColor: theme.colors.primary,
        paddingBottom: theme.spacing.md,
        paddingHorizontal: theme.spacing.md,
    },
    content: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    backButton: {
        marginRight: theme.spacing.md,
    },
    backText: {
        fontSize: 32,
        color: theme.colors.textWhite,
        fontWeight: theme.fontWeights.bold,
    },
    titleContainer: {
        flex: 1,
    },
    title: {
        fontSize: theme.fontSizes.xxl,
        fontWeight: theme.fontWeights.bold,
        color: theme.colors.textWhite,
    },
    subtitle: {
        fontSize: theme.fontSizes.sm,
        color: theme.colors.textWhite,
        opacity: 0.9,
        marginTop: theme.spacing.xs,
    },
    rightAction: {
        marginLeft: theme.spacing.md,
    },
});
