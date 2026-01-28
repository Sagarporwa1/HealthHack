import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Text, View, StyleSheet } from 'react-native';
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
    return (
        <NavigationContainer>
            <Stack.Navigator
                initialRouteName="Login"
                screenOptions={{
                    headerShown: false,
                    animation: 'slide_from_right',
                }}
            >
                <Stack.Screen name="Login" component={LoginScreen} />
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
