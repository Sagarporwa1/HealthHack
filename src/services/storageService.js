import AsyncStorage from '@react-native-async-storage/async-storage';
import { STORAGE_KEYS } from '../utils/constants';

// Storage Service for persisting scan data
export const storageService = {
    // Save a new scan
    async saveScan(scanData) {
        try {
            const existingScans = await this.getAllScans();
            const newScan = {
                id: Date.now().toString(),
                timestamp: new Date().toISOString(),
                ...scanData,
            };

            const updatedScans = [newScan, ...existingScans];
            await AsyncStorage.setItem(STORAGE_KEYS.SCANS, JSON.stringify(updatedScans));

            return newScan;
        } catch (error) {
            console.error('Error saving scan:', error);
            throw error;
        }
    },

    // Get all scans
    async getAllScans() {
        try {
            const scansJson = await AsyncStorage.getItem(STORAGE_KEYS.SCANS);
            return scansJson ? JSON.parse(scansJson) : [];
        } catch (error) {
            console.error('Error getting scans:', error);
            return [];
        }
    },

    // Get scan by ID
    async getScanById(id) {
        try {
            const scans = await this.getAllScans();
            return scans.find(scan => scan.id === id);
        } catch (error) {
            console.error('Error getting scan by ID:', error);
            return null;
        }
    },

    // Delete a scan
    async deleteScan(id) {
        try {
            const scans = await this.getAllScans();
            const updatedScans = scans.filter(scan => scan.id !== id);
            await AsyncStorage.setItem(STORAGE_KEYS.SCANS, JSON.stringify(updatedScans));
            return true;
        } catch (error) {
            console.error('Error deleting scan:', error);
            return false;
        }
    },

    // Clear all scans
    async clearAllScans() {
        try {
            await AsyncStorage.removeItem(STORAGE_KEYS.SCANS);
            return true;
        } catch (error) {
            console.error('Error clearing scans:', error);
            return false;
        }
    },

    // Get scan statistics
    async getScanStats() {
        try {
            const scans = await this.getAllScans();
            return {
                total: scans.length,
                lowRisk: scans.filter(s => s.riskLevel === 'low').length,
                mediumRisk: scans.filter(s => s.riskLevel === 'medium').length,
                highRisk: scans.filter(s => s.riskLevel === 'high').length,
                lastScan: scans.length > 0 ? scans[0] : null,
            };
        } catch (error) {
            console.error('Error getting scan stats:', error);
            return { total: 0, lowRisk: 0, mediumRisk: 0, highRisk: 0, lastScan: null };
        }
    },
};
