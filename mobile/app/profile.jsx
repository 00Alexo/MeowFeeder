import { StyleSheet, ScrollView, TouchableOpacity, useColorScheme, Switch } from 'react-native'
import React, { useState, useEffect } from 'react'
import { useRouter } from 'expo-router'
import { Ionicons } from '@expo/vector-icons'
import AsyncStorage from '@react-native-async-storage/async-storage'

import Spacer from "../components/Spacer"
import ThemedText from "../components/ThemedText"
import ThemedView from "../components/ThemedView"
import ThemedButton from "../components/ThemedButton"
import ThemedLogo from "../components/ThemedLogo"
import ProtectedRoute from "../components/ProtectedRoute"
import { useUserContext } from "../hooks/useUserContext"
import { useLogout } from "../hooks/useLogout"
import { useDashboardData } from "../hooks/useDashboardData"
import { useTheme } from "../contexts/ThemeContext"
import { Colors } from "../constants/Colors"

const Profile = () => {
  const { user } = useUserContext()
  const { logout } = useLogout()
  const { devices, recentActivity, stats, loading, error } = useDashboardData()
  const { theme: currentTheme, isDark, toggleTheme } = useTheme()
  const router = useRouter()
  const theme = Colors[currentTheme] ?? Colors.light

  const [notifications, setNotifications] = useState(true)
  const [autoFeeding, setAutoFeeding] = useState(true)

  const getMemberSince = () => {
    return "March 2024"
  }

  const getTotalFeeds = () => {
    return recentActivity ? recentActivity.length : 0
  }

  const getTotalSchedules = () => {
    return stats.scheduledFeeds || 0
  }

  const handleLogout = async () => {
    await logout()
  }

  const settingsOptions = [
    {
      title: 'Dark Mode',
      subtitle: 'Use dark theme',
      icon: 'moon',
      type: 'toggle',
      value: isDark,
      onToggle: toggleTheme
    },
  ]

  const menuOptions = [
    // {
    //   title: 'Account Settings',
    //   subtitle: 'Manage your account',
    //   icon: 'person-circle',
    //   route: '/account-settings'
    // },
    // {
    //   title: 'Device Management',
    //   subtitle: 'Add or remove devices',
    //   icon: 'hardware-chip',
    //   route: '/device-management'
    // },
    {
      title: 'Feeding History',
      subtitle: 'View detailed history',
      icon: 'analytics',
      route: '/view-details'
    },
    {
      title: 'Help & Support',
      subtitle: 'Get help and contact support',
      icon: 'help-circle',
      route: '/help'
    },
    // {
    //   title: 'Privacy Policy',
    //   subtitle: 'Read our privacy policy',
    //   icon: 'shield-checkmark',
    //   route: '/privacy'
    // }
  ]

  return (
    <ProtectedRoute>
      <ThemedView style={styles.container} safe={true}>
        <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
          
          {/* Profile Header */}
          <ThemedView style={styles.profileHeader} transparent={true}>
            <ThemedLogo style={styles.logo} />
            <ThemedText style={styles.userName}>
              {user?.username?.split('@')[0] || 'User'}
            </ThemedText>
            <ThemedText style={styles.userEmail}>{user?.username}</ThemedText>
            <ThemedText style={styles.memberSince}>Member since {getMemberSince()}</ThemedText>
          </ThemedView>

          <Spacer height={30} />

          {/* Quick Stats */}
          <ThemedView style={styles.statsContainer}>
            <ThemedView style={[styles.statCard, { backgroundColor: theme.cardBackground }]} transparent={true}>
              <ThemedText style={styles.statNumber}>
                {loading ? '...' : getTotalFeeds()}
              </ThemedText>
              <ThemedText style={styles.statLabel}>Total Feeds</ThemedText>
            </ThemedView>
            
            <ThemedView style={[styles.statCard, { backgroundColor: theme.cardBackground }]} transparent={true}>
              <ThemedText style={styles.statNumber}>
                {loading ? '...' : devices.length}
              </ThemedText>
              <ThemedText style={styles.statLabel}>Devices</ThemedText>
            </ThemedView>
            
            <ThemedView style={[styles.statCard, { backgroundColor: theme.cardBackground }]} transparent={true}>
              <ThemedText style={styles.statNumber}>
                {loading ? '...' : getTotalSchedules()}
              </ThemedText>
              <ThemedText style={styles.statLabel}>Schedules</ThemedText>
            </ThemedView>
          </ThemedView>

          {/* Error State */}
          {error && (
            <>
              <Spacer height={20} />
              <ThemedView style={[styles.errorCard, { backgroundColor: theme.cardBackground }]} transparent={true}>
                <Ionicons name="warning" size={24} color="#EF4444" />
                <ThemedText style={[styles.errorText, { color: '#EF4444' }]}>
                  Error loading data: {error}
                </ThemedText>
              </ThemedView>
            </>
          )}

          <Spacer height={30} />

          {/* Settings */}
          <ThemedView style={styles.section}>
            <ThemedText style={styles.sectionTitle}>Settings</ThemedText>
            <Spacer height={12} />
            
            {settingsOptions.map((option, index) => (
              <ThemedView key={index} style={[styles.settingItem, { backgroundColor: theme.cardBackground }]} transparent={true}>
                <ThemedView style={styles.settingIcon} transparent={true}>
                  <Ionicons name={option.icon} size={20} color={theme.iconColor} />
                </ThemedView>
                <ThemedView style={styles.settingContent} transparent={true}>
                  <ThemedText style={styles.settingTitle}>{option.title}</ThemedText>
                  <ThemedText style={styles.settingSubtitle}>{option.subtitle}</ThemedText>
                </ThemedView>
                <Switch
                  value={option.value}
                  onValueChange={option.onToggle}
                  trackColor={{ false: theme.border, true: Colors.primary }}
                  thumbColor="#FFFFFF"
                />
              </ThemedView>
            ))}
          </ThemedView>

          <Spacer height={30} />

          {/* Menu Options */}
          <ThemedView style={styles.section}>
            <ThemedText style={styles.sectionTitle}>More Options</ThemedText>
            <Spacer height={12} />
            
            {menuOptions.map((option, index) => (
              <TouchableOpacity
                key={index}
                style={[styles.menuItem, { backgroundColor: theme.cardBackground }]}
                onPress={() => router.push(option.route)}
              >
                <ThemedView style={styles.menuIcon} transparent={true}>
                  <Ionicons name={option.icon} size={20} color={theme.iconColor} />
                </ThemedView>
                <ThemedView style={styles.menuContent} transparent={true}>
                  <ThemedText style={styles.menuTitle}>{option.title}</ThemedText>
                  <ThemedText style={styles.menuSubtitle}>{option.subtitle}</ThemedText>
                </ThemedView>
                <Ionicons name="chevron-forward" size={20} color={theme.iconColor} />
              </TouchableOpacity>
            ))}
          </ThemedView>

          <Spacer height={30} />

          {/* Logout Button */}
          <ThemedButton 
            style={styles.logoutButton}
            onPress={handleLogout}
          >
            <Ionicons name="log-out" size={20} color="#FFFFFF" />
            <ThemedText style={styles.logoutText}>Sign Out</ThemedText>
          </ThemedButton>

          <Spacer height={40} />
          
        </ScrollView>
      </ThemedView>
    </ProtectedRoute>
  )
}

export default Profile

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'stretch',
    paddingHorizontal: 20,
  },
  scrollView: {
    flex: 1,
  },
  profileHeader: {
    alignItems: 'center',
    paddingTop: 30,
    paddingBottom: 20,
  },
  logo: {
    marginBottom: 16,
  },
  userName: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  userEmail: {
    fontSize: 16,
    opacity: 0.7,
    marginBottom: 8,
  },
  memberSince: {
    fontSize: 14,
    opacity: 0.5,
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
  statNumber: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#F4B6C2',
  },
  statLabel: {
    fontSize: 12,
    opacity: 0.7,
    textAlign: 'center',
    marginTop: 4,
  },
  section: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 8,
  },
  settingItem: {
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
  settingIcon: {
    marginRight: 12,
  },
  settingContent: {
    flex: 1,
  },
  settingTitle: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 2,
  },
  settingSubtitle: {
    fontSize: 14,
    opacity: 0.7,
  },
  menuItem: {
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
  menuIcon: {
    marginRight: 12,
  },
  menuContent: {
    flex: 1,
  },
  menuTitle: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 2,
  },
  menuSubtitle: {
    fontSize: 14,
    opacity: 0.7,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderRadius: 12,
    backgroundColor: '#EF4444',
    gap: 8,
  },
  logoutText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  errorCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    gap: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  errorText: {
    flex: 1,
    fontSize: 14,
  },
})