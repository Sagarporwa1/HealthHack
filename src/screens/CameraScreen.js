import React, { useState, useRef, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    Image,
    Alert,
    ActivityIndicator,
} from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import * as ImagePicker from 'expo-image-picker';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { theme } from '../styles/theme';
import Button from '../components/Button';
import { detectionService } from '../services/detectionService';

export default function CameraScreen({ navigation }) {
    const insets = useSafeAreaInsets();
    const [permission, requestPermission] = useCameraPermissions();
    const [capturedImage, setCapturedImage] = useState(null);
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [facing, setFacing] = useState('back');
    const cameraRef = useRef(null);

    useEffect(() => {
        if (permission && !permission.granted) {
            requestPermission();
        }
    }, [permission]);

    const handleCapture = async () => {
        if (cameraRef.current) {
            try {
                const photo = await cameraRef.current.takePictureAsync({
                    quality: 0.8,
                });
                setCapturedImage(photo.uri);
            } catch (error) {
                console.error('Error taking picture:', error);
                Alert.alert('Error', 'Failed to capture image. Please try again.');
            }
        }
    };

    const handlePickImage = async () => {
        try {
            const result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.Images,
                allowsEditing: true,
                aspect: [4, 3],
                quality: 0.8,
            });

            if (!result.canceled && result.assets && result.assets.length > 0) {
                setCapturedImage(result.assets[0].uri);
            }
        } catch (error) {
            console.error('Error picking image:', error);
            Alert.alert('Error', 'Failed to select image. Please try again.');
        }
    };

    const handleAnalyze = async () => {
        if (!capturedImage) return;

        setIsAnalyzing(true);
        try {
            const result = await detectionService.analyzeImage(capturedImage);

            if (result.success) {
                navigation.replace('Analysis', { scan: result });
            } else {
                Alert.alert('Analysis Failed', result.error || 'Unable to analyze image');
            }
        } catch (error) {
            console.error('Analysis error:', error);
            Alert.alert('Error', 'Failed to analyze image. Please try again.');
        } finally {
            setIsAnalyzing(false);
        }
    };

    const handleRetake = () => {
        setCapturedImage(null);
    };

    const handleClose = () => {
        navigation.goBack();
    };

    const toggleCameraFacing = () => {
        setFacing(current => (current === 'back' ? 'front' : 'back'));
    };

    if (!permission) {
        return (
            <View style={styles.container}>
                <ActivityIndicator size="large" color={theme.colors.primary} />
            </View>
        );
    }

    if (!permission.granted) {
        return (
            <View style={styles.container}>
                <View style={styles.permissionContainer}>
                    <Text style={styles.permissionTitle}>Camera Permission Required</Text>
                    <Text style={styles.permissionText}>
                        This app needs camera access to capture images for oral health screening.
                    </Text>
                    <Button title="Grant Permission" onPress={requestPermission} />
                    <Button
                        title="Cancel"
                        onPress={handleClose}
                        variant="outline"
                        style={{ marginTop: theme.spacing.md }}
                    />
                </View>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            {/* Header */}
            <View style={[styles.header, { paddingTop: insets.top + 10 }]}>
                <TouchableOpacity onPress={handleClose} style={styles.closeButton}>
                    <Text style={styles.closeText}>✕</Text>
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Capture Image</Text>
                <View style={styles.placeholder} />
            </View>

            {/* Camera or Preview */}
            <View style={styles.cameraContainer}>
                {capturedImage ? (
                    <Image source={{ uri: capturedImage }} style={styles.preview} resizeMode="contain" />
                ) : (
                    <View style={styles.camera}>
                        <CameraView style={StyleSheet.absoluteFill} facing={facing} ref={cameraRef} />
                        <View style={styles.cameraOverlay}>
                            <View style={styles.guideline} />
                            <Text style={styles.guideText}>
                                Position the area to examine within the frame
                            </Text>
                        </View>
                    </View>
                )}
            </View>

            {/* Instructions */}
            <View style={styles.instructions}>
                <Text style={styles.instructionTitle}>📸 Capture Tips:</Text>
                <Text style={styles.instructionText}>
                    • Ensure good lighting{'\n'}
                    • Hold camera steady{'\n'}
                    • Focus on the specific area{'\n'}
                    • Avoid blurry images
                </Text>
            </View>

            {/* Controls */}
            <View style={[styles.controls, { paddingBottom: Math.max(insets.bottom, theme.spacing.lg) }]}>
                {capturedImage ? (
                    <View style={styles.previewControls}>
                        <Button
                            title="Retake"
                            onPress={handleRetake}
                            variant="outline"
                            style={styles.controlButton}
                        />
                        <Button
                            title="Analyze"
                            onPress={handleAnalyze}
                            loading={isAnalyzing}
                            disabled={isAnalyzing}
                            style={styles.controlButton}
                        />
                    </View>
                ) : (
                    <View style={styles.captureControls}>
                        <TouchableOpacity onPress={handlePickImage} style={styles.iconButton}>
                            <Text style={styles.iconText}>🖼️</Text>
                        </TouchableOpacity>

                        <TouchableOpacity onPress={handleCapture} style={styles.captureButton}>
                            <View style={styles.captureButtonInner} />
                        </TouchableOpacity>

                        <TouchableOpacity onPress={toggleCameraFacing} style={styles.iconButton}>
                            <Text style={styles.iconText}>🔄</Text>
                        </TouchableOpacity>
                    </View>
                )}
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#000',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingBottom: theme.spacing.md,
        paddingHorizontal: theme.spacing.md,
        backgroundColor: theme.colors.primary,
    },
    closeButton: {
        width: 40,
    },
    closeText: {
        fontSize: 28,
        color: theme.colors.textWhite,
    },
    headerTitle: {
        fontSize: theme.fontSizes.xl,
        fontWeight: theme.fontWeights.bold,
        color: theme.colors.textWhite,
    },
    placeholder: {
        width: 40,
    },
    cameraContainer: {
        flex: 1,
        backgroundColor: '#000',
    },
    camera: {
        flex: 1,
    },
    cameraOverlay: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    guideline: {
        width: 300,
        height: 300,
        borderWidth: 2,
        borderColor: theme.colors.primaryLight,
        borderRadius: theme.borderRadius.lg,
        backgroundColor: 'transparent',
    },
    guideText: {
        color: theme.colors.textWhite,
        fontSize: theme.fontSizes.sm,
        textAlign: 'center',
        marginTop: theme.spacing.lg,
        backgroundColor: 'rgba(0,0,0,0.5)',
        padding: theme.spacing.sm,
        borderRadius: theme.borderRadius.md,
    },
    preview: {
        flex: 1,
        backgroundColor: '#000',
    },
    instructions: {
        backgroundColor: theme.colors.surface,
        padding: theme.spacing.md,
    },
    instructionTitle: {
        fontSize: theme.fontSizes.md,
        fontWeight: theme.fontWeights.bold,
        color: theme.colors.textPrimary,
        marginBottom: theme.spacing.xs,
    },
    instructionText: {
        fontSize: theme.fontSizes.sm,
        color: theme.colors.textSecondary,
        lineHeight: 20,
    },
    controls: {
        backgroundColor: theme.colors.surface,
        paddingVertical: theme.spacing.lg,
        paddingHorizontal: theme.spacing.md,
    },
    captureControls: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
    },
    captureButton: {
        width: 70,
        height: 70,
        borderRadius: 35,
        backgroundColor: theme.colors.textWhite,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 4,
        borderColor: theme.colors.primary,
    },
    captureButtonInner: {
        width: 56,
        height: 56,
        borderRadius: 28,
        backgroundColor: theme.colors.primary,
    },
    iconButton: {
        width: 50,
        height: 50,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: theme.colors.overlayLight,
        borderRadius: 25,
    },
    iconText: {
        fontSize: 24,
    },
    previewControls: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    controlButton: {
        flex: 1,
        marginHorizontal: theme.spacing.xs,
    },
    permissionContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: theme.spacing.xl,
        backgroundColor: theme.colors.background,
    },
    permissionTitle: {
        fontSize: theme.fontSizes.xxl,
        fontWeight: theme.fontWeights.bold,
        color: theme.colors.textPrimary,
        marginBottom: theme.spacing.md,
        textAlign: 'center',
    },
    permissionText: {
        fontSize: theme.fontSizes.md,
        color: theme.colors.textSecondary,
        textAlign: 'center',
        marginBottom: theme.spacing.lg,
        lineHeight: 22,
    },
});
