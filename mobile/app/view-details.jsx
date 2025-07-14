import { StyleSheet, ScrollView, TouchableOpacity, useColorScheme } from 'react-native'
import React, { useState } from 'react'
import { useRouter } from 'expo-router'
import { Ionicons } from '@expo/vector-icons'
import ThemedView from '../components/ThemedView'
import ThemedText from '../components/ThemedText'
import Spacer from '../components/Spacer'
import ProtectedRoute from '../components/ProtectedRoute'
import { Colors } from '../constants/Colors'
import { useDashboardData } from '../hooks/useDashboardData'

const ViewDetails = () => {
    const [selectedPeriod, setSelectedPeriod] = useState('today')
    const colorScheme = useColorScheme()
    const theme = Colors[colorScheme] ?? Colors.light
    const router = useRouter()
    const { devices, recentActivity, stats, loading, error, refreshData } = useDashboardData()

    const periods = [
        { id: 'today', label: 'Today' },
        { id: 'week', label: 'This Week' },
        { id: 'month', label: 'This Month' }
    ]

    const getFilteredActivity = () => {
        if (!recentActivity) return []
        
        const now = new Date()
        const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
        const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000)
        const monthAgo = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000)
        
        return recentActivity.filter(activity => {
            const activityDate = new Date(activity.timestamp)
            switch (selectedPeriod) {
                case 'today':
                    return activityDate >= today
                case 'week':
                    return activityDate >= weekAgo
                case 'month':
                    return activityDate >= monthAgo
                default:
                    return true
            }
        })
    }

    const getSummaryStats = () => {
        const filteredActivity = getFilteredActivity()
        const totalFeeds = filteredActivity.length
        const successfulFeeds = filteredActivity.filter(activity => activity.status === 'success').length
        const failedFeeds = totalFeeds - successfulFeeds
        
        return {
            totalFeeds,
            successfulFeeds,
            failedFeeds
        }
    }

    const getDeviceStats = () => {
        if (!devices || devices.length === 0) return []
        
        const filteredActivity = getFilteredActivity()
        
        return devices.map(device => {
            const deviceActivity = filteredActivity.filter(activity => 
                activity.device === device.name || activity.device === 'MeowFeeder'
            )
            const deviceFeeds = deviceActivity.length
            const deviceSuccess = deviceActivity.filter(activity => activity.status === 'success').length
            
            return {
                device: device.name || 'MeowFeeder',
                feeds: deviceFeeds,
                success: deviceSuccess,
            }
        })
    }

    const formatDate = (timestamp) => {
        const date = new Date(timestamp)
        const now = new Date()
        const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
        const yesterday = new Date(today.getTime() - 24 * 60 * 60 * 1000)
        
        if (date >= today) {
            return 'Today'
        } else if (date >= yesterday) {
            return 'Yesterday'
        } else {
            return date.toLocaleDateString()
        }
    }

    const getFeedingHistory = () => {
        const filteredActivity = getFilteredActivity()
        
        return filteredActivity.map(activity => ({
            id: activity.id,
            device: activity.device,
            time: new Date(activity.timestamp).toLocaleTimeString('en-US', { 
                hour: '2-digit', 
                minute: '2-digit', 
                hour12: false 
            }),
            status: activity.status,
            date: formatDate(activity.timestamp)
        }))
    }

    const summaryStats = getSummaryStats()
    const deviceStats = getDeviceStats()
    const feedingHistory = getFeedingHistory()
    
    return (
        <ProtectedRoute>
            <ThemedView style={styles.container} safe={true}>
                <ThemedView style={styles.header} transparent={true}>
                    <TouchableOpacity onPress={() => router.back()}>
                        <Ionicons name="arrow-back" size={24} color={theme.title} />
                    </TouchableOpacity>
                    <ThemedText style={styles.title}>View Details</ThemedText>
                    <ThemedView style={{ width: 24 }} transparent={true} />
                </ThemedView>

                <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
                    
                    {/* Loading State */}
                    {loading && (
                        <ThemedView style={[styles.loadingCard, { backgroundColor: theme.cardBackground }]} transparent={true}>
                            <ThemedText style={styles.loadingText}>Loading data...</ThemedText>
                        </ThemedView>
                    )}
                    
                    {/* Error State */}
                    {error && (
                        <ThemedView style={[styles.errorCard, { backgroundColor: theme.cardBackground }]} transparent={true}>
                            <ThemedText style={[styles.errorText, { color: '#EF4444' }]}>
                                Error: {error}
                            </ThemedText>
                        </ThemedView>
                    )}
                    
                    {!loading && !error && (
                        <>
                            {/* Period Selector */}
                            <ThemedView style={styles.periodSelector}>
                                {periods.map((period) => (
                                    <TouchableOpacity
                                        key={period.id}
                                        style={[
                                            styles.periodButton,
                                            { 
                                                backgroundColor: selectedPeriod === period.id ? Colors.primary : theme.cardBackground,
                                                borderColor: selectedPeriod === period.id ? Colors.primary : theme.border
                                            }
                                        ]}
                                        onPress={() => setSelectedPeriod(period.id)}
                                    >
                                        <ThemedText style={[
                                            styles.periodText,
                                            { color: selectedPeriod === period.id ? '#FFFFFF' : theme.text }
                                        ]}>
                                            {period.label}
                                        </ThemedText>
                                    </TouchableOpacity>
                                ))}
                            </ThemedView>

                            <Spacer height={24} />

                            {/* Summary Stats */}
                            <ThemedView style={styles.section}>
                                <ThemedText style={styles.sectionTitle}>Summary</ThemedText>
                                <Spacer height={12} />
                                
                                <ThemedView style={styles.summaryGrid}>
                                    <ThemedView style={[styles.summaryCard, { backgroundColor: theme.cardBackground }]} transparent={true}>
                                        <Ionicons name="restaurant" size={24} color="#10B981" />
                                        <ThemedText style={styles.summaryNumber}>{summaryStats.totalFeeds}</ThemedText>
                                        <ThemedText style={styles.summaryLabel}>Total Feeds</ThemedText>
                                    </ThemedView>
                                    
                                    <ThemedView style={[styles.summaryCard, { backgroundColor: theme.cardBackground }]} transparent={true}>
                                        <Ionicons name="checkmark-circle" size={24} color={Colors.primary} />
                                        <ThemedText style={styles.summaryNumber}>{summaryStats.successfulFeeds}</ThemedText>
                                        <ThemedText style={styles.summaryLabel}>Successful</ThemedText>
                                    </ThemedView>
                                    
                                    <ThemedView style={[styles.summaryCard, { backgroundColor: theme.cardBackground }]} transparent={true}>
                                        <Ionicons name="close-circle" size={24} color="#EF4444" />
                                        <ThemedText style={styles.summaryNumber}>{summaryStats.failedFeeds}</ThemedText>
                                        <ThemedText style={styles.summaryLabel}>Failed</ThemedText>
                                    </ThemedView>
                                </ThemedView>
                            </ThemedView>

                            <Spacer height={24} />

                            {/* Device Performance */}
                            <ThemedView style={styles.section}>
                                <ThemedText style={styles.sectionTitle}>Device Performance</ThemedText>
                                <Spacer height={12} />
                                
                                {deviceStats.length === 0 ? (
                                    <ThemedView style={[styles.emptyCard, { backgroundColor: theme.cardBackground }]} transparent={true}>
                                        <ThemedText style={styles.emptyText}>No devices found</ThemedText>
                                    </ThemedView>
                                ) : (
                                    deviceStats.map((device, index) => (
                                        <ThemedView key={index} style={[styles.deviceStatsCard, { backgroundColor: theme.cardBackground }]} transparent={true}>
                                            <ThemedView style={styles.deviceHeader} transparent={true}>
                                                <ThemedText style={styles.deviceName}>{device.device}</ThemedText>
                                            </ThemedView>
                                            
                                            <ThemedView style={styles.deviceMetrics} transparent={true}>
                                                <ThemedView style={styles.metric} transparent={true}>
                                                    <ThemedText style={styles.metricValue}>{device.feeds}</ThemedText>
                                                    <ThemedText style={styles.metricLabel}>Feeds</ThemedText>
                                                </ThemedView>
                                                <ThemedView style={styles.metric} transparent={true}>
                                                    <ThemedText style={styles.metricValue}>{device.success}</ThemedText>
                                                    <ThemedText style={styles.metricLabel}>Success</ThemedText>
                                                </ThemedView>
                                                <ThemedView style={styles.metric} transparent={true}>
                                                    <ThemedText style={styles.metricValue}>
                                                        {device.feeds > 0 ? Math.round((device.success / device.feeds) * 100) : 0}%
                                                    </ThemedText>
                                                    <ThemedText style={styles.metricLabel}>Success Rate</ThemedText>
                                                </ThemedView>
                                            </ThemedView>
                                        </ThemedView>
                                    ))
                                )}
                            </ThemedView>

                            <Spacer height={24} />

                            {/* Feeding History */}
                            <ThemedView style={styles.section}>
                                <ThemedText style={styles.sectionTitle}>Feeding History</ThemedText>
                                <Spacer height={12} />
                                
                                {feedingHistory.length === 0 ? (
                                    <ThemedView style={[styles.emptyCard, { backgroundColor: theme.cardBackground }]} transparent={true}>
                                        <Ionicons name="restaurant-outline" size={48} color={theme.iconColor} style={{ opacity: 0.3 }} />
                                        <ThemedText style={styles.emptyText}>No feeding history</ThemedText>
                                        <ThemedText style={styles.emptySubtext}>
                                            Feeding history for this period will appear here
                                        </ThemedText>
                                    </ThemedView>
                                ) : (
                                    feedingHistory.map((feed) => (
                                        <ThemedView key={feed.id} style={[styles.historyCard, { backgroundColor: theme.cardBackground }]} transparent={true}>
                                            <ThemedView style={styles.historyIcon} transparent={true}>
                                                <Ionicons 
                                                    name={feed.status === 'success' ? 'checkmark-circle' : 'close-circle'} 
                                                    size={24} 
                                                    color={feed.status === 'success' ? '#10B981' : '#EF4444'} 
                                                />
                                            </ThemedView>
                                            
                                            <ThemedView style={styles.historyContent} transparent={true}>
                                                <ThemedText style={styles.historyDevice}>{feed.device}</ThemedText>
                                                <ThemedText style={styles.historyDetails}>
                                                    Standard portion • {feed.time}
                                                </ThemedText>
                                            </ThemedView>
                                            
                                            <ThemedView style={styles.historyMeta} transparent={true}>
                                                <ThemedText style={styles.historyDate}>{feed.date}</ThemedText>
                                                <ThemedText style={[
                                                    styles.historyStatus,
                                                    { color: feed.status === 'success' ? '#10B981' : '#EF4444' }
                                                ]}>
                                                    {feed.status}
                                                </ThemedText>
                                            </ThemedView>
                                        </ThemedView>
                                    ))
                                )}
                            </ThemedView>
                        </>
                    )}

                    <Spacer height={40} />
                    
                </ScrollView>
            </ThemedView>
        </ProtectedRoute>
    )
}

export default ViewDetails

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'stretch',
        paddingHorizontal: 20,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#E5E7EB',
        marginBottom: 20,
    },
    title: {
        fontSize: 20,
        fontWeight: '600',
    },
    scrollView: {
        flex: 1,
    },
    periodSelector: {
        flexDirection: 'row',
        gap: 8,
    },
    periodButton: {
        flex: 1,
        padding: 12,
        borderRadius: 8,
        borderWidth: 1,
        alignItems: 'center',
    },
    periodText: {
        fontSize: 14,
        fontWeight: '500',
    },
    section: {
        marginBottom: 16,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: '600',
        marginBottom: 8,
    },
    summaryGrid: {
        flexDirection: 'row',
        gap: 12,
    },
    summaryCard: {
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
    summaryNumber: {
        fontSize: 24,
        fontWeight: 'bold',
        marginTop: 8,
        color: '#F4B6C2',
    },
    summaryLabel: {
        fontSize: 12,
        opacity: 0.7,
        textAlign: 'center',
        marginTop: 4,
    },
    deviceStatsCard: {
        padding: 16,
        borderRadius: 12,
        marginBottom: 12,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 3.84,
        elevation: 5,
    },
    deviceHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 12,
    },
    deviceName: {
        fontSize: 16,
        fontWeight: '600',
    },
    deviceMetrics: {
        flexDirection: 'row',
        justifyContent: 'space-around',
    },
    metric: {
        alignItems: 'center',
    },
    metricValue: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#F4B6C2',
    },
    metricLabel: {
        fontSize: 12,
        opacity: 0.7,
        marginTop: 2,
    },
    historyCard: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 16,
        borderRadius: 12,
        marginBottom: 8,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 3.84,
        elevation: 5,
    },
    historyIcon: {
        marginRight: 12,
    },
    historyContent: {
        flex: 1,
    },
    historyDevice: {
        fontSize: 16,
        fontWeight: '500',
        marginBottom: 2,
    },
    historyDetails: {
        fontSize: 14,
        opacity: 0.7,
    },
    historyMeta: {
        alignItems: 'flex-end',
    },
    historyDate: {
        fontSize: 12,
        opacity: 0.6,
        marginBottom: 2,
    },
    historyStatus: {
        fontSize: 12,
        fontWeight: '500',
        textTransform: 'capitalize',
    },
    loadingCard: {
        padding: 20,
        borderRadius: 12,
        alignItems: 'center',
        marginBottom: 20,
    },
    loadingText: {
        fontSize: 14,
        opacity: 0.7,
    },
    errorCard: {
        padding: 20,
        borderRadius: 12,
        alignItems: 'center',
        marginBottom: 20,
    },
    errorText: {
        fontSize: 14,
        textAlign: 'center',
    },
    emptyCard: {
        padding: 24,
        borderRadius: 12,
        alignItems: 'center',
        marginBottom: 12,
    },
    emptyText: {
        fontSize: 16,
        fontWeight: '500',
        marginTop: 12,
        textAlign: 'center',
    },
    emptySubtext: {
        fontSize: 14,
        opacity: 0.6,
        textAlign: 'center',
        marginTop: 4,
    },
})
