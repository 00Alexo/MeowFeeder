import { StyleSheet, ScrollView, TouchableOpacity, useColorScheme, RefreshControl } from 'react-native'
import React, { useEffect } from 'react'
import { useRouter } from 'expo-router'
import { Ionicons } from '@expo/vector-icons'
import ThemedView from '../components/ThemedView'
import ThemedLogo from '../components/ThemedLogo'
import ThemedText from '../components/ThemedText'
import ThemedButton from '../components/ThemedButton'
import Spacer from '../components/Spacer'
import { useUserContext } from '../hooks/useUserContext'
import { useDashboardData } from '../hooks/useDashboardData'
import { useTheme } from '../contexts/ThemeContext'
import { Colors } from '../constants/Colors'

const Dashboard = () => {
    const { user, isAuthReady } = useUserContext()
    const { devices, recentActivity, stats, loading, error, refreshData } = useDashboardData()
    const { theme: currentTheme } = useTheme()
    const router = useRouter()
    const theme = Colors[currentTheme] ?? Colors.light

    useEffect(() => {
        if (isAuthReady && !user) {
            router.replace('/login')
        }
    }, [user, isAuthReady, router])

    if (!isAuthReady) {
        return (
            <ThemedView style={styles.loadingContainer}>
                <ThemedText>Loading...</ThemedText>
            </ThemedView>
        )
    }

    if (!user) {
        return null 
    }

    const quickActions = [
        {
            title: 'Configure Feeding',
            subtitle: 'Set schedules and portions',
            icon: 'settings',
            color: Colors.primary,
            route: '/configure-feeding'
        },
        {
            title: 'View Details',
            subtitle: 'Monitor feeding history',
            icon: 'analytics',
            color: '#10B981',
            route: '/view-details'
        },
        {
            title: 'Profile & Settings',
            subtitle: 'Account and preferences',
            icon: 'person',
            color: '#6366F1',
            route: '/profile'
        }
    ]

    const deviceStats = [
        { label: 'Active Devices', value: stats.activeDevices.toString(), icon: 'hardware-chip' },
        { label: 'Today\'s Feeds', value: stats.todaysFeeds.toString(), icon: 'restaurant' },
        { label: 'Scheduled', value: stats.scheduledFeeds.toString(), icon: 'time' }
    ]

    const getActivityIcon = (type, status) => {
        if (status === 'failed') return 'warning'
        return type === 'feed' ? 'restaurant' : 'time'
    }

    const getActivityColor = (type, status) => {
        if (status === 'failed') return '#EF4444'
        return type === 'feed' ? '#10B981' : Colors.primary
    }

    const getActivityTitle = (type, status) => {
        if (status === 'failed') return 'Feeding failed'
        return type === 'feed' ? 'Manual feed' : 'Scheduled feed'
    }

    return (
        <ThemedView style={styles.container} safe={true}>
            <ScrollView 
                style={styles.scrollView} 
                showsVerticalScrollIndicator={false}
                refreshControl={
                    <RefreshControl
                        refreshing={loading}
                        onRefresh={refreshData}
                        colors={[Colors.primary]}
                        tintColor={Colors.primary}
                    />
                }
            >
                
                {/* Header */}
                <ThemedView style={styles.header}>
                    <ThemedLogo style={styles.logo} />
                    <ThemedText style={styles.welcomeText}>
                        Welcome back, {user.username?.split('@')[0]}!
                    </ThemedText>
                    <ThemedText style={styles.subtitle}>
                        Your pets are well fed and happy
                    </ThemedText>
                </ThemedView>

                <Spacer height={30} />

                {/* Stats Overview */}
                <ThemedView style={styles.statsContainer}>
                    {deviceStats.map((stat, index) => (
                        <ThemedView key={index} style={[styles.statCard, { backgroundColor: theme.cardBackground }]} transparent={true}>
                            <Ionicons name={stat.icon} size={24} color={Colors.primary} />
                            <ThemedText style={styles.statValue}>{stat.value}</ThemedText>
                            <ThemedText style={styles.statLabel}>{stat.label}</ThemedText>
                        </ThemedView>
                    ))}
                </ThemedView>

                <Spacer height={30} />

                {/* Quick Actions */}
                <ThemedText style={styles.sectionTitle}>Quick Actions</ThemedText>
                <Spacer height={16} />
                
                <ThemedView style={styles.actionsContainer}>
                    {quickActions.map((action, index) => (
                        <TouchableOpacity
                            key={index}
                            style={[styles.actionCard, { backgroundColor: theme.cardBackground }]}
                            onPress={() => router.push(action.route)}
                        >
                            <ThemedView style={[styles.actionIcon, { backgroundColor: action.color }]} transparent={true}>
                                <Ionicons name={action.icon} size={24} color="#FFFFFF" />
                            </ThemedView>
                            <ThemedView style={styles.actionContent} transparent={true}>
                                <ThemedText style={styles.actionTitle}>{action.title}</ThemedText>
                                <ThemedText style={styles.actionSubtitle}>{action.subtitle}</ThemedText>
                            </ThemedView>
                            <Ionicons name="chevron-forward" size={20} color={theme.iconColor} />
                        </TouchableOpacity>
                    ))}
                </ThemedView>

                <Spacer height={30} />

                {/* Recent Activity */}
                <ThemedText style={styles.sectionTitle}>Recent Activity</ThemedText>
                <Spacer height={16} />
                
                {error ? (
                    <ThemedView style={[styles.activityCard, { backgroundColor: theme.cardBackground }]} transparent={true}>
                        <ThemedText style={[styles.errorText, { color: '#EF4444' }]}>
                            Error loading activity: {error}
                        </ThemedText>
                    </ThemedView>
                ) : loading ? (
                    <ThemedView style={[styles.activityCard, { backgroundColor: theme.cardBackground }]} transparent={true}>
                        <ThemedText style={styles.loadingText}>Loading recent activity...</ThemedText>
                    </ThemedView>
                ) : recentActivity.length === 0 ? (
                    <ThemedView style={[styles.activityCard, { backgroundColor: theme.cardBackground }]} transparent={true}>
                        <ThemedView style={styles.emptyState} transparent={true}>
                            <Ionicons name="restaurant-outline" size={48} color={theme.iconColor} style={{ opacity: 0.3 }} />
                            <ThemedText style={styles.emptyStateText}>No recent activity</ThemedText>
                            <ThemedText style={styles.emptyStateSubtext}>
                                Your feeding history will appear here
                            </ThemedText>
                        </ThemedView>
                    </ThemedView>
                ) : (
                    <ThemedView style={[styles.activityCard, { backgroundColor: theme.cardBackground }]} transparent={true}>
                        {recentActivity.map((activity, index) => (
                            <ThemedView key={activity.id} style={styles.activityItem} transparent={true}>
                                <Ionicons 
                                    name={getActivityIcon(activity.type, activity.status)} 
                                    size={20} 
                                    color={getActivityColor(activity.type, activity.status)} 
                                />
                                <ThemedView style={styles.activityContent} transparent={true}>
                                    <ThemedText style={styles.activityTitle}>
                                        {getActivityTitle(activity.type, activity.status)}
                                    </ThemedText>
                                    <ThemedText style={styles.activityTime}>
                                        {activity.device} • {activity.time}
                                    </ThemedText>
                                </ThemedView>
                            </ThemedView>
                        ))}
                    </ThemedView>
                )}

                <Spacer height={40} />
                
            </ScrollView>
        </ThemedView>
    )
}

export default Dashboard

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'stretch',
        paddingHorizontal: 20,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    scrollView: {
        flex: 1,
    },
    header: {
        alignItems: 'center',
        paddingTop: 20,
        paddingBottom: 10,
    },
    logo: {
        marginBottom: 16,
    },
    welcomeText: {
        fontSize: 24,
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 8,
    },
    subtitle: {
        fontSize: 16,
        textAlign: 'center',
        opacity: 0.7,
    },
    statsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        gap: 12,
    },
    statCard: {
        flex: 1,
        padding: 16,
        borderRadius: 12,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 3.84,
        elevation: 5,
    },
    statValue: {
        fontSize: 24,
        fontWeight: 'bold',
        marginTop: 8,
        color: '#F4B6C2',
    },
    statLabel: {
        fontSize: 12,
        opacity: 0.7,
        textAlign: 'center',
        marginTop: 4,
    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: '600',
        marginBottom: 8,
    },
    actionsContainer: {
        gap: 12,
    },
    actionCard: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 16,
        borderRadius: 12,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 3.84,
        elevation: 5,
    },
    actionIcon: {
        width: 48,
        height: 48,
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 16,
    },
    actionContent: {
        flex: 1,
    },
    actionTitle: {
        fontSize: 16,
        fontWeight: '600',
        marginBottom: 4,
    },
    actionSubtitle: {
        fontSize: 14,
        opacity: 0.7,
    },
    activityCard: {
        padding: 16,
        borderRadius: 12,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 3.84,
        elevation: 5,
    },
    activityItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 12,
    },
    activityContent: {
        flex: 1,
        marginLeft: 12,
    },
    activityTitle: {
        fontSize: 14,
        fontWeight: '500',
        marginBottom: 2,
    },
    activityTime: {
        fontSize: 12,
        opacity: 0.6,
    },
    errorText: {
        fontSize: 14,
        textAlign: 'center',
        padding: 16,
    },
    loadingText: {
        fontSize: 14,
        textAlign: 'center',
        padding: 16,
        opacity: 0.7,
    },
    emptyState: {
        alignItems: 'center',
        padding: 24,
    },
    emptyStateText: {
        fontSize: 16,
        fontWeight: '500',
        marginTop: 12,
        textAlign: 'center',
    },
    emptyStateSubtext: {
        fontSize: 14,
        opacity: 0.6,
        textAlign: 'center',
        marginTop: 4,
    },
})