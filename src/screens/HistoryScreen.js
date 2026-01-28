import React, { useState, useEffect, useMemo } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    Alert,
    TextInput,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { theme } from '../styles/theme';
import ScanCard from '../components/ScanCard';
import Button from '../components/Button';
import { storageService } from '../services/storageService';

export default function HistoryScreen({ navigation }) {
    const insets = useSafeAreaInsets();
    const [scans, setScans] = useState([]);
    const [stats, setStats] = useState(null);
    const [filter, setFilter] = useState('all');
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        loadScans();
        const unsubscribe = navigation.addListener('focus', loadScans);
        return unsubscribe;
    }, [navigation]);

    const loadScans = async () => {
        const allScans = await storageService.getAllScans();
        const scanStats = await storageService.getScanStats();
        setScans(allScans);
        setStats(scanStats);
    };

    const handleViewScan = (scan) => {
        navigation.navigate('Analysis', { scan, fromHistory: true });
    };

    const handleClearHistory = () => {
        Alert.alert(
            'Clear All History',
            'Are you sure you want to delete all scan history? This action cannot be undone.',
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Delete',
                    style: 'destructive',
                    onPress: async () => {
                        await storageService.clearAllScans();
                        loadScans();
                    },
                },
            ]
        );
    };

    const filteredScans = useMemo(() => {
        return scans.filter((scan) => {
            const matchesFilter = filter === 'all' || scan.riskLevel === filter;
            const matchesSearch = searchQuery === '' ||
                (scan.findings && scan.findings.some(f => f.toLowerCase().includes(searchQuery.toLowerCase()))) ||
                (scan.date && new Date(scan.date).toLocaleDateString().includes(searchQuery));
            return matchesFilter && matchesSearch;
        });
    }, [scans, filter, searchQuery]);

    return (
        <View style={styles.container}>
            {/* Header */}
            <View style={[styles.header, { paddingTop: insets.top + 10 }]}>
                <Text style={styles.headerTitle}>Scan History</Text>
                <Text style={styles.headerSubtitle}>
                    {stats ? `${stats.total} total scans` : 'No scans yet'}
                </Text>

                {/* Search Bar */}
                <View style={styles.searchContainer}>
                    <Text style={styles.searchIcon}>🔍</Text>
                    <TextInput
                        style={styles.searchInput}
                        placeholder="Search findings or dates..."
                        placeholderTextColor={theme.colors.textLight}
                        value={searchQuery}
                        onChangeText={setSearchQuery}
                    />
                    {searchQuery.length > 0 && (
                        <TouchableOpacity onPress={() => setSearchQuery('')}>
                            <Text style={styles.clearSearch}>✕</Text>
                        </TouchableOpacity>
                    )}
                </View>
            </View>

            {/* Filter Pills */}
            <View style={styles.filtersWrapper}>
                <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={styles.filtersContent}
                >
                    <FilterPill
                        title="All"
                        active={filter === 'all'}
                        onPress={() => setFilter('all')}
                        count={stats?.total}
                    />
                    <FilterPill
                        title="Low"
                        active={filter === 'low'}
                        onPress={() => setFilter('low')}
                        color={theme.colors.riskLow}
                        count={stats?.lowRisk}
                    />
                    <FilterPill
                        title="Medium"
                        active={filter === 'medium'}
                        onPress={() => setFilter('medium')}
                        color={theme.colors.riskMedium}
                        count={stats?.mediumRisk}
                    />
                    <FilterPill
                        title="High"
                        active={filter === 'high'}
                        onPress={() => setFilter('high')}
                        color={theme.colors.riskHigh}
                        count={stats?.highRisk}
                    />
                </ScrollView>
            </View>

            {/* Scan List */}
            <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
                {filteredScans.length === 0 ? (
                    <View style={styles.emptyState}>
                        <Text style={styles.emptyIcon}>{searchQuery ? '🔎' : '📋'}</Text>
                        <Text style={styles.emptyTitle}>
                            {searchQuery ? 'No Results' : 'No Scans Found'}
                        </Text>
                        <Text style={styles.emptyText}>
                            {searchQuery
                                ? 'Try searching for something else.'
                                : scans.length === 0
                                    ? 'Start your first scan to begin tracking your oral health.'
                                    : 'No scans match the selected filter.'}
                        </Text>
                    </View>
                ) : (
                    <View style={styles.scanList}>
                        {filteredScans.map((scan) => (
                            <ScanCard
                                key={scan.id}
                                scan={scan}
                                onPress={() => handleViewScan(scan)}
                            />
                        ))}

                        <Button
                            title="Clear All History"
                            onPress={handleClearHistory}
                            variant="subtle"
                            style={styles.clearButton}
                        />
                    </View>
                )}
                {/* Bottom Padding */}
                <View style={{ height: 100 }} />
            </ScrollView>
        </View>
    );
}

function FilterPill({ title, active, onPress, color, count }) {
    return (
        <TouchableOpacity
            style={[
                styles.filterPill,
                active && { backgroundColor: color || theme.colors.primary }
            ]}
            onPress={onPress}
        >
            <Text style={[styles.filterText, active && styles.filterTextActive]}>
                {title} {count !== undefined && `(${count})`}
            </Text>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: theme.colors.background,
    },
    header: {
        backgroundColor: theme.colors.surface,
        paddingBottom: theme.spacing.md,
        paddingHorizontal: theme.spacing.lg,
        ...theme.shadows.sm,
    },
    headerTitle: {
        fontSize: theme.fontSizes.xxl,
        fontWeight: theme.fontWeights.bold,
        color: theme.colors.textPrimary,
    },
    headerSubtitle: {
        fontSize: theme.fontSizes.sm,
        color: theme.colors.textSecondary,
        marginBottom: theme.spacing.md,
    },
    searchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: theme.colors.surfaceSubtle,
        borderRadius: theme.borderRadius.md,
        paddingHorizontal: theme.spacing.md,
        height: 45,
    },
    searchIcon: {
        marginRight: theme.spacing.sm,
        fontSize: 16,
    },
    searchInput: {
        flex: 1,
        fontSize: theme.fontSizes.md,
        color: theme.colors.textPrimary,
    },
    clearSearch: {
        fontSize: 18,
        color: theme.colors.textLight,
        marginLeft: theme.spacing.sm,
    },
    filtersWrapper: {
        backgroundColor: theme.colors.background,
    },
    filtersContent: {
        paddingHorizontal: theme.spacing.lg,
        paddingVertical: theme.spacing.md,
    },
    filterPill: {
        paddingHorizontal: theme.spacing.lg,
        paddingVertical: theme.spacing.sm,
        borderRadius: theme.borderRadius.round,
        marginRight: theme.spacing.sm,
        backgroundColor: theme.colors.surface,
        borderWidth: 1,
        borderColor: theme.colors.border,
    },
    filterText: {
        fontSize: theme.fontSizes.sm,
        color: theme.colors.textSecondary,
        fontWeight: theme.fontWeights.medium,
    },
    filterTextActive: {
        color: theme.colors.textWhite,
    },
    content: {
        flex: 1,
    },
    scanList: {
        paddingHorizontal: theme.spacing.lg,
    },
    emptyState: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        padding: theme.spacing.xl,
        marginTop: 60,
    },
    emptyIcon: {
        fontSize: 64,
        marginBottom: theme.spacing.md,
    },
    emptyTitle: {
        fontSize: theme.fontSizes.xxl,
        fontWeight: theme.fontWeights.bold,
        color: theme.colors.textPrimary,
        marginBottom: theme.spacing.sm,
    },
    emptyText: {
        fontSize: theme.fontSizes.md,
        color: theme.colors.textSecondary,
        textAlign: 'center',
        lineHeight: 22,
    },
    clearButton: {
        marginTop: theme.spacing.lg,
        marginBottom: theme.spacing.xl,
    },
});
