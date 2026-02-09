import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Text, View, StyleSheet, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { theme } from '../styles/theme';

// Import screens
import HomeScreen from '../screens/HomeScreen';
import CameraScreen from '../screens/CameraScreen';
import AnalysisScreen from '../screens/AnalysisScreen';
import HistoryScreen from '../screens/HistoryScreen';
import EducationScreen from '../screens/EducationScreen';
import SettingsScreen from '../screens/SettingsScreen';
import ProfileScreen from '../screens/ProfileScreen';
import LoginScreen from '../screens/LoginScreen';
import RegisterScreen from '../screens/RegisterScreen';
import UserDetailsScreen from '../screens/UserDetailsScreen';
import { supabase } from '../services/supabaseClient';
import { profileService } from '../services/profileService';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

// Premium Tab Icon
const TabIcon = ({ name, focused }) => (
    <View style={styles.tabItem}>
        <Ionicons
            name={focused ? name : `${name}-outline`}
            size={26}
            color="#000000"
        />
        {focused && <View style={styles.activeDot} />}
    </View>
);

// Main tab navigator
function MainTabs() {
    const insets = useSafeAreaInsets();
    return (
        <Tab.Navigator
            screenOptions={{
                headerShown: false,
                tabBarActiveTintColor: theme.colors.primary,
                tabBarInactiveTintColor: theme.colors.textLight,
                tabBarStyle: {
                    backgroundColor: theme.colors.surface,
                    borderTopWidth: 0,
                    paddingTop: 12,
                    paddingBottom: insets.bottom > 0 ? insets.bottom : 12,
                    height: 65 + insets.bottom,
                    borderTopLeftRadius: 30,
                    borderTopRightRadius: 30,
                    position: 'absolute',
                    ...theme.shadows.lg,
                },
                tabBarLabelStyle: {
                    fontSize: theme.fontSizes.xs,
                    fontWeight: theme.fontWeights.medium,
                    marginBottom: 5,
                },
            }}
        >
            <Tab.Screen
                name="Home"
                component={HomeScreen}
                options={{
                    tabBarIcon: ({ focused }) => <TabIcon name="home" focused={focused} />,
                }}
            />
            <Tab.Screen
                name="History"
                component={HistoryScreen}
                options={{
                    tabBarIcon: ({ focused }) => <TabIcon name="clipboard" focused={focused} />,
                }}
            />
            <Tab.Screen
                name="Education"
                component={EducationScreen}
                options={{
                    tabBarIcon: ({ focused }) => <TabIcon name="book" focused={focused} />,
                }}
            />
            <Tab.Screen
                name="Profile"
                component={ProfileScreen}
                options={{
                    tabBarIcon: ({ focused }) => <TabIcon name="person" focused={focused} />,
                }}
            />
        </Tab.Navigator>
    );
}

// Root navigator
export default function AppNavigator() {
    const [session, setSession] = React.useState(null);
    const [loading, setLoading] = React.useState(true);
    const [profileComplete, setProfileComplete] = React.useState(false);
    const [checkingProfile, setCheckingProfile] = React.useState(false);

    // Check if profile is complete
    const checkProfileStatus = React.useCallback(async (userId) => {
        if (!userId) return false;
        setCheckingProfile(true);
        try {
            const isComplete = await profileService.isProfileComplete(userId);
            setProfileComplete(isComplete);
            return isComplete;
        } catch (error) {
            console.log('Profile check error:', error);
            setProfileComplete(false);
            return false;
        } finally {
            setCheckingProfile(false);
        }
    }, []);

    React.useEffect(() => {
        // Check initial session
        supabase.auth.getSession().then(async ({ data: { session } }) => {
            setSession(session);
            if (session?.user?.id) {
                await checkProfileStatus(session.user.id);
            }
            setLoading(false);
        });

        // Listen for auth changes
        const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
            setSession(session);
            if (session?.user?.id) {
                await checkProfileStatus(session.user.id);
            } else {
                setProfileComplete(false);
            }
        });

        return () => subscription.unsubscribe();
    }, [checkProfileStatus]);

    // Handler for when profile is completed
    const handleProfileComplete = React.useCallback(() => {
        setProfileComplete(true);
    }, []);

    if (loading || checkingProfile) {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: theme.colors.background }}>
                <ActivityIndicator size="large" color={theme.colors.primary} />
                <Text style={{ marginTop: 16, color: theme.colors.textSecondary }}>Loading...</Text>
            </View>
        );
    }

    return (
        <NavigationContainer>
            <Stack.Navigator
                screenOptions={{
                    headerShown: false,
                    animation: 'slide_from_right',
                }}
            >
                {session ? (
                    profileComplete ? (
                        <>
                            <Stack.Screen name="MainTabs" component={MainTabs} />
                            <Stack.Screen
                                name="Camera"
                                component={CameraScreen}
                                options={{
                                    animation: 'fade_from_bottom',
                                }}
                            />
                            <Stack.Screen
                                name="Analysis"
                                component={AnalysisScreen}
                            />
                            <Stack.Screen
                                name="Settings"
                                component={SettingsScreen}
                            />
                        </>
                    ) : (
                        <Stack.Screen name="UserDetails">
                            {(props) => (
                                <UserDetailsScreen
                                    {...props}
                                    onComplete={handleProfileComplete}
                                />
                            )}
                        </Stack.Screen>
                    )
                ) : (
                    <>
                        <Stack.Screen name="Login" component={LoginScreen} />
                        <Stack.Screen name="Register" component={RegisterScreen} />
                    </>
                )}
            </Stack.Navigator>
        </NavigationContainer>
    );
}

const styles = StyleSheet.create({
    tabItem: {
        alignItems: 'center',
        justifyContent: 'center',
    },
    tabIcon: {
        fontSize: 24,
    },
    activeDot: {
        width: 4,
        height: 4,
        borderRadius: 2,
        backgroundColor: theme.colors.primary,
        marginTop: 4,
    }
});
