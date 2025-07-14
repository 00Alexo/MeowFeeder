import { StyleSheet, ScrollView, TouchableOpacity, Switch, Alert, Modal, TextInput } from 'react-native'
import React, { useState, useEffect } from 'react'
import { useRouter } from 'expo-router'
import { Ionicons } from '@expo/vector-icons'
import ThemedView from '../components/ThemedView'
import ThemedText from '../components/ThemedText'
import ThemedButton from '../components/ThemedButton'
import Spacer from '../components/Spacer'
import ProtectedRoute from '../components/ProtectedRoute'
import { useTheme } from '../contexts/ThemeContext'
import { useDashboardData } from '../hooks/useDashboardData'
import { useSchedules } from '../hooks/useSchedules'
import { Colors } from '../constants/Colors'

const ConfigureFeeding = () => {
    const [selectedDevice, setSelectedDevice] = useState(null)
    const [autoFeeding, setAutoFeeding] = useState(true)
    const [updatingAutoFeeding, setUpdatingAutoFeeding] = useState(false)
    const [showAddScheduleModal, setShowAddScheduleModal] = useState(false)
    const [newScheduleTime, setNewScheduleTime] = useState('')
    const [newScheduleHour, setNewScheduleHour] = useState('')
    const [newScheduleMinute, setNewScheduleMinute] = useState('')
    const [addingSchedule, setAddingSchedule] = useState(false)
    const [feedingNow, setFeedingNow] = useState(false)
    
    const { theme: currentTheme } = useTheme()
    const { devices, loading: devicesLoading, error: devicesError } = useDashboardData()
    const { schedules, loading: schedulesLoading, error: schedulesError, toggleSchedule, updateAutoFeeding, addSchedule, deleteSchedule, feedNow, isWebSocketConnected, webSocketError } = useSchedules(selectedDevice)
    const router = useRouter()
    const theme = Colors[currentTheme] ?? Colors.light

    useEffect(() => {
        if (devices && devices.length > 0 && !selectedDevice) {
            const firstDevice = devices[0]
            setSelectedDevice(firstDevice._id || firstDevice.id || firstDevice.name)
            setAutoFeeding(firstDevice.autoFeeding !== false)
        }
    }, [devices, selectedDevice])

    useEffect(() => {
        if (selectedDevice && devices) {
            const device = devices.find(d => (d._id || d.id || d.name) === selectedDevice)
            if (device) {
                setAutoFeeding(device.autoFeeding !== false)
            }
        }
    }, [selectedDevice, devices])

    const handleDeviceChange = (deviceId) => {
        setSelectedDevice(deviceId)
        const device = devices.find(d => (d._id || d.id || d.name) === deviceId)
        if (device) {
            setAutoFeeding(device.autoFeeding !== false)
        }
    }

    const handleAutoFeedingToggle = async (value) => {
        if (!selectedDevice) return
        
        setUpdatingAutoFeeding(true)
        const success = await updateAutoFeeding(selectedDevice, value)
        
        if (success) {
            setAutoFeeding(value)
        } else {
            Alert.alert('Error', 'Failed to update auto feeding setting')
        }
        
        setUpdatingAutoFeeding(false)
    }

    const handleScheduleToggle = async (scheduleId, enabled) => {
        await toggleSchedule(scheduleId, enabled)
    }

    const handleDeleteSchedule = async (scheduleIndex) => {
        if (!selectedDevice) return
        
        Alert.alert(
            'Delete Schedule',
            'Are you sure you want to delete this feeding schedule?',
            [
                { text: 'Cancel', style: 'cancel' },
                { 
                    text: 'Delete', 
                    style: 'destructive',
                    onPress: async () => {
                        const success = await deleteSchedule(selectedDevice, scheduleIndex)
                        if (success) {
                            Alert.alert('Success', 'Schedule deleted successfully!')
                        } else {
                            Alert.alert('Error', 'Failed to delete schedule')
                        }
                    }
                }
            ]
        )
    }

    const handleAddSchedule = () => {
        setShowAddScheduleModal(true)
        setNewScheduleTime('')
        setNewScheduleHour('')
        setNewScheduleMinute('')
    }

    const handleSaveSchedule = async () => {
        if (!selectedDevice) return
        
        let timeString = ''
        if (newScheduleTime) {
            timeString = newScheduleTime
        } else if (newScheduleHour && newScheduleMinute) {
            const hour = parseInt(newScheduleHour)
            const minute = parseInt(newScheduleMinute)
            
            if (hour < 0 || hour > 23 || minute < 0 || minute > 59) {
                Alert.alert('Invalid Time', 'Please enter a valid time (Hour: 0-23, Minute: 0-59)')
                return
            }
            
            timeString = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`
        } else {
            Alert.alert('Missing Time', 'Please enter a valid time')
            return
        }
        
        setAddingSchedule(true)
        
        try {
            const success = await addSchedule(selectedDevice, timeString)
            if (success) {
                setShowAddScheduleModal(false)
                setNewScheduleTime('')
                setNewScheduleHour('')
                setNewScheduleMinute('')
                Alert.alert('Success', 'Schedule added successfully!')
            } else {
                Alert.alert('Error', 'Failed to add schedule')
            }
        } catch (error) {
            Alert.alert('Error', 'Failed to add schedule')
        }
        
        setAddingSchedule(false)
    }

    const handleCancelAddSchedule = () => {
        setShowAddScheduleModal(false)
        setNewScheduleTime('')
        setNewScheduleHour('')
        setNewScheduleMinute('')
    }

    const handleFeedNow = async () => {
        if (!selectedDevice) {
            Alert.alert('Error', 'Please select a device first')
            return
        }
        
        setFeedingNow(true)
        
        try {
            const success = await feedNow(selectedDevice)
            if (success) {
                let successMessage = 'Feeding command sent successfully!'
                if (isWebSocketConnected) {
                    successMessage += ' Device is connected and should start feeding immediately.'
                } else {
                    successMessage += ' Command recorded in system.'
                }
                Alert.alert('Success', successMessage)
            } else {
                Alert.alert('Error', 'Failed to send feeding command')
            }
        } catch (error) {
            Alert.alert('Error', 'Failed to send feeding command')
        }
        
        setFeedingNow(false)
    }



    return (
        <ProtectedRoute>
            <ThemedView style={styles.container} safe={true}>
                <ThemedView style={styles.header} transparent={true}>
                    <TouchableOpacity onPress={() => router.back()}>
                        <Ionicons name="arrow-back" size={24} color={theme.title} />
                    </TouchableOpacity>
                    <ThemedText style={styles.title}>Configure Feeding</ThemedText>
                    <ThemedView style={{ width: 24 }} transparent={true} />
                </ThemedView>

                <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
                    
                    {/* Device Selection */}
                    <ThemedView style={styles.section}>
                        <ThemedText style={styles.sectionTitle}>Select Device</ThemedText>
                        <Spacer height={12} />
                        
                        {devicesLoading ? (
                            <ThemedView style={[styles.deviceCard, { backgroundColor: theme.cardBackground }]} transparent={true}>
                                <ThemedText style={styles.loadingText}>Loading devices...</ThemedText>
                            </ThemedView>
                        ) : devicesError ? (
                            <ThemedView style={[styles.deviceCard, { backgroundColor: theme.cardBackground }]} transparent={true}>
                                <ThemedText style={[styles.errorText, { color: '#EF4444' }]}>
                                    Error loading devices: {devicesError}
                                </ThemedText>
                            </ThemedView>
                        ) : devices.length === 0 ? (
                            <ThemedView style={[styles.deviceCard, { backgroundColor: theme.cardBackground }]} transparent={true}>
                                <ThemedText style={styles.emptyText}>No devices found</ThemedText>
                            </ThemedView>
                        ) : (
                            devices.map((device, index) => (
                                <TouchableOpacity
                                    key={device._id || device.id || `device-${index}`}
                                    style={[
                                        styles.deviceCard,
                                        { 
                                            backgroundColor: theme.cardBackground,
                                            borderColor: selectedDevice === (device._id || device.id || device.name) ? Colors.primary : theme.border
                                        }
                                    ]}
                                    onPress={() => handleDeviceChange(device._id || device.id || device.name)}
                                >
                                    <ThemedView style={styles.deviceInfo} transparent={true}>
                                        <ThemedText style={styles.deviceName}>{device.name || 'MeowFeeder'}</ThemedText>
                                        <ThemedView style={[
                                            styles.statusDot, 
                                            { backgroundColor: device.status === 'online' ? '#10B981' : '#EF4444' }
                                        ]} transparent={true} />
                                        {selectedDevice === (device._id || device.id || device.name) && isWebSocketConnected && (
                                            <ThemedView style={[
                                                styles.webSocketDot,
                                                { backgroundColor: '#3B82F6' }
                                            ]} transparent={true} />
                                        )}
                                    </ThemedView>
                                    {selectedDevice === (device._id || device.id || device.name) && (
                                        <Ionicons name="checkmark-circle" size={20} color={Colors.primary} />
                                    )}
                                </TouchableOpacity>
                            ))
                        )}
                    </ThemedView>

                    <Spacer height={24} />

                    {/* Auto Feeding Toggle */}
                    <ThemedView style={styles.section}>
                        <ThemedView style={styles.toggleRow} transparent={true}>
                            <ThemedView transparent={true}>
                                <ThemedText style={styles.sectionTitle}>Auto Feeding</ThemedText>
                                <ThemedText style={styles.toggleSubtitle}>Enable scheduled feeding</ThemedText>
                            </ThemedView>
                            <Switch
                                value={autoFeeding}
                                onValueChange={handleAutoFeedingToggle}
                                disabled={updatingAutoFeeding || !selectedDevice}
                                trackColor={{ false: theme.border, true: Colors.primary }}
                                thumbColor="#FFFFFF"
                            />
                        </ThemedView>
                    </ThemedView>

                    <Spacer height={24} />

                    {/* Feeding Schedules */}
                    {autoFeeding && (
                        <>
                            <ThemedView style={styles.section}>
                                <ThemedText style={styles.sectionTitle}>Feeding Schedules</ThemedText>
                                <Spacer height={12} />
                                
                                {schedulesLoading ? (
                                    <ThemedView style={[styles.emptyScheduleCard, { backgroundColor: theme.cardBackground }]} transparent={true}>
                                        <ThemedText style={styles.loadingText}>Loading schedules...</ThemedText>
                                    </ThemedView>
                                ) : schedulesError ? (
                                    <ThemedView style={[styles.emptyScheduleCard, { backgroundColor: theme.cardBackground }]} transparent={true}>
                                        <Ionicons name="warning" size={32} color="#EF4444" style={{ opacity: 0.7 }} />
                                        <ThemedText style={[styles.errorText, { color: '#EF4444' }]}>
                                            Error loading schedules: {schedulesError}
                                        </ThemedText>
                                    </ThemedView>
                                ) : schedules.length === 0 ? (
                                    <ThemedView style={[styles.emptyScheduleCard, { backgroundColor: theme.cardBackground }]} transparent={true}>
                                        <Ionicons name="time-outline" size={32} color={theme.iconColor} style={{ opacity: 0.3 }} />
                                        <ThemedText style={styles.emptyScheduleText}>No schedules configured</ThemedText>
                                        <ThemedText style={styles.emptyScheduleSubtext}>
                                            Add a schedule to automate feeding times
                                        </ThemedText>
                                    </ThemedView>
                                ) : (
                                    schedules.map((schedule, index) => (
                                        <ThemedView key={schedule.id || index} style={[styles.scheduleCard, { backgroundColor: theme.cardBackground }]} transparent={true}>
                                            <ThemedView style={styles.scheduleInfo} transparent={true}>
                                                <ThemedText style={styles.scheduleTime}>
                                                    {schedule.time || `${schedule.hour}:${schedule.minute?.toString().padStart(2, '0')}`}
                                                </ThemedText>
                                                <ThemedText style={styles.scheduleAmount}>
                                                    {schedule.portion || 'Standard portion'}
                                                </ThemedText>
                                            </ThemedView>
                                            <TouchableOpacity
                                                onPress={() => handleDeleteSchedule(index)}
                                                style={styles.deleteButton}
                                            >
                                                <Ionicons name="trash-outline" size={20} color="#EF4444" />
                                            </TouchableOpacity>
                                        </ThemedView>
                                    ))
                                )}
                                
                                <TouchableOpacity 
                                    style={[styles.addScheduleButton, { borderColor: theme.border }]}
                                    disabled={!selectedDevice}
                                    onPress={handleAddSchedule}
                                >
                                    <Ionicons name="add" size={20} color={selectedDevice ? Colors.primary : theme.iconColor} />
                                    <ThemedText style={[
                                        styles.addScheduleText,
                                        { color: selectedDevice ? '#F4B6C2' : theme.iconColor, opacity: selectedDevice ? 1 : 0.5 }
                                    ]}>
                                        Add Schedule
                                    </ThemedText>
                                </TouchableOpacity>
                            </ThemedView>

                            <Spacer height={24} />
                        </>
                    )}

                    {/* Manual Feeding */}
                    <ThemedView style={styles.section}>
                        <ThemedText style={styles.sectionTitle}>Manual Feeding</ThemedText>
                        <Spacer height={12} />
                        
                        {/* Connection Status */}
                        <ThemedView style={styles.connectionStatus} transparent={true}>
                            <ThemedView style={[
                                styles.connectionDot,
                                { backgroundColor: isWebSocketConnected ? '#10B981' : '#F59E0B' }
                            ]} transparent={true} />
                            <ThemedText style={styles.connectionText}>
                                {isWebSocketConnected ? 'Device connected - Real-time feeding' : 'Offline mode - Commands will be recorded'}
                            </ThemedText>
                        </ThemedView>
                        
                        <Spacer height={12} />
                        
                        <ThemedButton 
                            style={styles.feedNowButton}
                            onPress={handleFeedNow}
                            disabled={!selectedDevice || feedingNow}
                        >
                            <Ionicons name="restaurant" size={20} color="#FFFFFF" />
                            <ThemedText style={styles.feedNowText}>
                                {feedingNow ? 'Feeding...' : 'Feed Now'}
                            </ThemedText>
                        </ThemedButton>
                    </ThemedView>

                    <Spacer height={40} />
                    
                </ScrollView>

                {/* Add Schedule Modal */}
                <Modal
                    animationType="slide"
                    transparent={true}
                    visible={showAddScheduleModal}
                    onRequestClose={handleCancelAddSchedule}
                >
                    <ThemedView style={styles.modalOverlay} transparent={true}>
                        <ThemedView style={[styles.modalContainer, { backgroundColor: theme.background }]}>
                            <ThemedView style={styles.modalHeader} transparent={true}>
                                <ThemedText style={styles.modalTitle}>Add Schedule</ThemedText>
                                <TouchableOpacity onPress={handleCancelAddSchedule}>
                                    <Ionicons name="close" size={24} color={theme.title} />
                                </TouchableOpacity>
                            </ThemedView>

                            <ThemedView style={styles.modalContent} transparent={true}>
                                <ThemedText style={styles.modalLabel}>Feeding Time</ThemedText>
                                <Spacer height={12} />
                                
                                <ThemedView style={styles.timeInputContainer} transparent={true}>
                                    <TextInput
                                        style={[styles.timeInput, { 
                                            backgroundColor: theme.cardBackground,
                                            color: theme.title,
                                            borderColor: theme.border
                                        }]}
                                        placeholder="HH:MM (e.g., 08:30)"
                                        placeholderTextColor={theme.iconColor}
                                        value={newScheduleTime}
                                        onChangeText={setNewScheduleTime}
                                        maxLength={5}
                                    />
                                </ThemedView>

                                <ThemedText style={styles.orText}>OR</ThemedText>

                                <ThemedView style={styles.separateTimeContainer} transparent={true}>
                                    <ThemedView style={styles.separateTimeInput} transparent={true}>
                                        <ThemedText style={styles.timeLabel}>Hour</ThemedText>
                                        <TextInput
                                            style={[styles.separateInput, { 
                                                backgroundColor: theme.cardBackground,
                                                color: theme.title,
                                                borderColor: theme.border
                                            }]}
                                            placeholder="00"
                                            placeholderTextColor={theme.iconColor}
                                            value={newScheduleHour}
                                            onChangeText={setNewScheduleHour}
                                            keyboardType="numeric"
                                            maxLength={2}
                                        />
                                    </ThemedView>
                                    
                                    <ThemedText style={styles.timeSeparator}>:</ThemedText>
                                    
                                    <ThemedView style={styles.separateTimeInput} transparent={true}>
                                        <ThemedText style={styles.timeLabel}>Minute</ThemedText>
                                        <TextInput
                                            style={[styles.separateInput, { 
                                                backgroundColor: theme.cardBackground,
                                                color: theme.title,
                                                borderColor: theme.border
                                            }]}
                                            placeholder="00"
                                            placeholderTextColor={theme.iconColor}
                                            value={newScheduleMinute}
                                            onChangeText={setNewScheduleMinute}
                                            keyboardType="numeric"
                                            maxLength={2}
                                        />
                                    </ThemedView>
                                </ThemedView>
                            </ThemedView>

                            <ThemedView style={styles.modalButtons} transparent={true}>
                                <TouchableOpacity 
                                    style={[styles.modalButton, styles.cancelButton, { borderColor: theme.border }]}
                                    onPress={handleCancelAddSchedule}
                                >
                                    <ThemedText style={[styles.cancelButtonText, { color: theme.title }]}>Cancel</ThemedText>
                                </TouchableOpacity>
                                
                                <TouchableOpacity 
                                    style={[styles.modalButton, styles.saveButton, { backgroundColor: Colors.primary }]}
                                    onPress={handleSaveSchedule}
                                    disabled={addingSchedule}
                                >
                                    <ThemedText style={styles.saveButtonText}>
                                        {addingSchedule ? 'Adding...' : 'Add Schedule'}
                                    </ThemedText>
                                </TouchableOpacity>
                            </ThemedView>
                        </ThemedView>
                    </ThemedView>
                </Modal>
            </ThemedView>
        </ProtectedRoute>
    )
}

export default ConfigureFeeding

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
    section: {
        marginBottom: 16,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: '600',
        marginBottom: 8,
    },
    deviceCard: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 16,
        borderRadius: 12,
        borderWidth: 2,
        marginBottom: 8,
    },
    deviceInfo: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
    },
    deviceName: {
        fontSize: 16,
        fontWeight: '500',
        flex: 1,
    },
    statusDot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        marginLeft: 8,
    },
    webSocketDot: {
        width: 6,
        height: 6,
        borderRadius: 3,
        marginLeft: 4,
    },
    toggleRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    toggleSubtitle: {
        fontSize: 14,
        opacity: 0.7,
        marginTop: 2,
    },
    scheduleCard: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 16,
        borderRadius: 12,
        marginBottom: 8,
    },
    scheduleInfo: {
        flex: 1,
    },
    scheduleTime: {
        fontSize: 16,
        fontWeight: '500',
    },
    scheduleAmount: {
        fontSize: 14,
        opacity: 0.7,
        marginTop: 2,
    },
    deleteButton: {
        padding: 8,
        borderRadius: 8,
        backgroundColor: 'rgba(239, 68, 68, 0.1)',
        alignItems: 'center',
        justifyContent: 'center',
    },
    addScheduleButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 16,
        borderRadius: 12,
        borderWidth: 2,
        borderStyle: 'dashed',
        marginTop: 8,
    },
    addScheduleText: {
        marginLeft: 8,
        fontSize: 16,
        fontWeight: '500',
        color: '#F4B6C2',
    },
    feedNowButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 16,
        borderRadius: 12,
        gap: 8,
    },
    feedNowText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: '600',
    },
    connectionStatus: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 12,
        paddingVertical: 8,
        borderRadius: 8,
        backgroundColor: 'rgba(0, 0, 0, 0.05)',
    },
    connectionDot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        marginRight: 8,
    },
    connectionText: {
        fontSize: 12,
        opacity: 0.8,
        flex: 1,
    },
    debugContainer: {
        marginTop: 12,
        padding: 12,
        borderRadius: 8,
        backgroundColor: 'rgba(0,0,0,0.05)',
    },
    debugText: {
        fontSize: 12,
        opacity: 0.7,
        marginBottom: 4,
    },
    debugButton: {
        backgroundColor: 'rgba(0,0,0,0.1)',
        padding: 8,
        borderRadius: 4,
        marginTop: 8,
        alignItems: 'center',
    },
    debugButtonText: {
        fontSize: 12,
        fontWeight: '500',
    },
    loadingText: {
        fontSize: 14,
        opacity: 0.7,
        textAlign: 'center',
        padding: 8,
    },
    errorText: {
        fontSize: 14,
        textAlign: 'center',
        padding: 8,
    },
    emptyText: {
        fontSize: 14,
        opacity: 0.7,
        textAlign: 'center',
        padding: 8,
    },
    emptyScheduleCard: {
        padding: 24,
        borderRadius: 12,
        alignItems: 'center',
        marginBottom: 12,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 3.84,
        elevation: 5,
    },
    emptyScheduleText: {
        fontSize: 16,
        fontWeight: '500',
        marginTop: 12,
        textAlign: 'center',
    },
    emptyScheduleSubtext: {
        fontSize: 14,
        opacity: 0.6,
        textAlign: 'center',
        marginTop: 4,
    },
    // Modal styles
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalContainer: {
        width: '90%',
        maxWidth: 400,
        borderRadius: 16,
        padding: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.25,
        shadowRadius: 10,
        elevation: 10,
    },
    modalHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 24,
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: '600',
    },
    modalContent: {
        marginBottom: 24,
    },
    modalLabel: {
        fontSize: 16,
        fontWeight: '500',
        marginBottom: 8,
    },
    timeInputContainer: {
        marginBottom: 16,
    },
    timeInput: {
        borderWidth: 2,
        borderRadius: 12,
        padding: 16,
        fontSize: 16,
        textAlign: 'center',
    },
    orText: {
        textAlign: 'center',
        fontSize: 14,
        opacity: 0.7,
        marginVertical: 16,
    },
    separateTimeContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 16,
    },
    separateTimeInput: {
        flex: 1,
        alignItems: 'center',
    },
    timeLabel: {
        fontSize: 12,
        marginBottom: 8,
        opacity: 0.7,
    },
    separateInput: {
        borderWidth: 2,
        borderRadius: 12,
        padding: 12,
        fontSize: 16,
        textAlign: 'center',
        width: '100%',
    },
    timeSeparator: {
        fontSize: 24,
        fontWeight: '600',
        marginTop: 20,
    },
    modalButtons: {
        flexDirection: 'row',
        gap: 12,
    },
    modalButton: {
        flex: 1,
        padding: 16,
        borderRadius: 12,
        alignItems: 'center',
    },
    cancelButton: {
        borderWidth: 2,
    },
    saveButton: {
        // backgroundColor set dynamically
    },
    cancelButtonText: {
        fontSize: 16,
        fontWeight: '500',
    },
    saveButtonText: {
        fontSize: 16,
        fontWeight: '600',
        color: '#FFFFFF',
    },
})
