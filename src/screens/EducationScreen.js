import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { theme } from '../styles/theme';
import InfoCard from '../components/InfoCard';
import { EDUCATION_TOPICS } from '../utils/constants';

export default function EducationScreen() {
    const insets = useSafeAreaInsets();
    return (
        <View style={styles.container}>
            <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
                {/* Stunning Header */}
                <LinearGradient
                    colors={[theme.colors.secondary, theme.colors.secondaryDark]}
                    style={[styles.header, { paddingTop: insets.top + 20 }]}
                >
                    <Text style={styles.headerTitle}>Learning Center</Text>
                    <Text style={styles.headerSubtitle}>Empower yourself with knowledge</Text>
                </LinearGradient>

                <View style={styles.body}>
                    {/* Introduction */}
                    <View style={styles.introCard}>
                        <Text style={styles.introText}>
                            Understanding the signs and risk factors is the first step in preventive care.
                        </Text>
                    </View>

                    {/* Education Topics */}
                    <Text style={styles.sectionTitle}>Key Topics</Text>
                    <View style={styles.topicsGrid}>
                        {EDUCATION_TOPICS.map((topic, index) => (
                            <InfoCard
                                key={topic.id}
                                title={topic.title}
                                content={topic.content}
                                variant={index % 2 === 0 ? 'info' : 'success'}
                                style={styles.topicCard}
                            />
                        ))}
                    </View>

                    {/* Proactive Checklist */}
                    <View style={styles.ctaCard}>
                        <LinearGradient
                            colors={['#FFF9C4', '#FFF176']}
                            style={styles.ctaGradient}
                        >
                            <Text style={styles.ctaTitle}>🩺 Quick Checklist</Text>
                            <Text style={styles.ctaLabel}>See a doctor if you notice:</Text>
                            <View style={styles.checklist}>
                                <CheckItem text="Persistent mouth sores (> 2 weeks)" />
                                <CheckItem text="Unexplained lumps or thickening" />
                                <CheckItem text="Red or white patches" />
                                <CheckItem text="Difficulty swallowing" />
                            </View>
                        </LinearGradient>
                    </View>

                    {/* Resources */}
                    <View style={styles.resourcesSection}>
                        <Text style={styles.sectionTitle}>Global Resources</Text>
                        <View style={styles.resourceCard}>
                            <ResourceItem name="National Cancer Institute" />
                            <ResourceItem name="American Dental Association" />
                            <ResourceItem name="Oral Cancer Foundation" />
                        </View>
                    </View>
                </View>

                {/* Bottom Padding */}
                <View style={{ height: 100 }} />
            </ScrollView>
        </View>
    );
}

function CheckItem({ text }) {
    return (
        <View style={styles.checkItem}>
            <Text style={styles.checkIcon}>✓</Text>
            <Text style={styles.checkText}>{text}</Text>
        </View>
    );
}

function ResourceItem({ name }) {
    return (
        <View style={styles.resourceItem}>
            <Text style={styles.resourceDot}>•</Text>
            <Text style={styles.resourceName}>{name}</Text>
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
        borderBottomLeftRadius: 30,
        borderBottomRightRadius: 30,
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
    introCard: {
        backgroundColor: theme.colors.surface,
        borderRadius: theme.borderRadius.lg,
        padding: theme.spacing.lg,
        marginBottom: theme.spacing.xl,
        borderLeftWidth: 4,
        borderLeftColor: theme.colors.secondary,
        ...theme.shadows.sm,
    },
    introText: {
        fontSize: theme.fontSizes.md,
        color: theme.colors.textSecondary,
        lineHeight: 22,
        fontStyle: 'italic',
    },
    sectionTitle: {
        fontSize: theme.fontSizes.lg,
        fontWeight: theme.fontWeights.bold,
        color: theme.colors.textPrimary,
        marginBottom: theme.spacing.md,
    },
    topicsGrid: {
        marginBottom: theme.spacing.xl,
    },
    topicCard: {
        marginBottom: theme.spacing.md,
    },
    ctaCard: {
        borderRadius: theme.borderRadius.xl,
        overflow: 'hidden',
        marginBottom: theme.spacing.xl,
        ...theme.shadows.md,
    },
    ctaGradient: {
        padding: theme.spacing.xl,
    },
    ctaTitle: {
        fontSize: theme.fontSizes.xl,
        fontWeight: theme.fontWeights.bold,
        color: '#5D4037',
        marginBottom: 8,
    },
    ctaLabel: {
        fontSize: theme.fontSizes.sm,
        color: '#795548',
        marginBottom: 16,
        fontWeight: '600',
    },
    checklist: {
        gap: 12,
    },
    checkItem: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    checkIcon: {
        color: '#43A047',
        fontWeight: 'bold',
        marginRight: 12,
        fontSize: 18,
    },
    checkText: {
        fontSize: theme.fontSizes.md,
        color: '#3E2723',
    },
    resourcesSection: {
        marginBottom: 20,
    },
    resourceCard: {
        backgroundColor: theme.colors.surface,
        borderRadius: theme.borderRadius.lg,
        padding: theme.spacing.lg,
        ...theme.shadows.sm,
    },
    resourceItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 8,
    },
    resourceDot: {
        color: theme.colors.secondary,
        marginRight: 10,
        fontSize: 20,
    },
    resourceName: {
        fontSize: theme.fontSizes.md,
        color: theme.colors.textPrimary,
    },
});
