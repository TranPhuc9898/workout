import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import theme from '../theme';

/**
 * Shared header component for consistent top bar across all screens.
 * - layout="progress": Left=Back, Right=Notification (Progress screen).
 * - layout="default": Left=Noti(+3-dot when showBack), Right=Back or Settings.
 * - showNotification=false: hide notification (e.g. Settings).
 */
const ScreenHeader = ({
  showBack = false,
  title = '',
  showSettings = true,
  showNotification = true,
  onBack,
  layout = 'default',
}) => {
  const navigation = useNavigation();
  const handleBack = onBack || (() => navigation.goBack());
  const isProgressLayout = layout === 'progress';

  const renderBack = () => (
    <TouchableOpacity onPress={handleBack} style={styles.iconButton} activeOpacity={0.7}>
      <Ionicons name="chevron-back" size={26} color={theme.colors.textPrimary} />
    </TouchableOpacity>
  );

  const renderNoti = () => (
    <TouchableOpacity onPress={() => {}} style={styles.iconButton} activeOpacity={0.7}>
      <View style={styles.notiWrapper}>
        <Ionicons name="notifications-outline" size={24} color={theme.colors.textPrimary} />
        <View style={styles.badge} />
      </View>
    </TouchableOpacity>
  );

  const render3dot = () => (
    <TouchableOpacity
      onPress={() => navigation.navigate('Settings')}
      style={styles.iconButton}
      activeOpacity={0.7}
    >
      <Ionicons name="ellipsis-vertical" size={24} color={theme.colors.textPrimary} />
    </TouchableOpacity>
  );

  return (
    <View style={styles.header}>
      <View style={styles.leftGroup}>
        {isProgressLayout ? (
          showBack && renderBack()
        ) : (
          <>
            {showNotification && renderNoti()}
            {showBack && showSettings && render3dot()}
          </>
        )}
      </View>

      {title ? (
        <Text style={styles.title} numberOfLines={1}>{title}</Text>
      ) : (
        <View style={styles.titleSpacer} />
      )}

      <View style={styles.rightGroup}>
        {isProgressLayout ? (
          showNotification && renderNoti()
        ) : (
          showBack ? renderBack() : (showSettings ? render3dot() : <View style={styles.iconSpacer} />)
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  leftGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  rightGroup: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconButton: {
    width: 36,
    height: 36,
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconSpacer: {
    width: 36,
    height: 36,
  },
  notiWrapper: {
    position: 'relative',
    width: 24,
    height: 24,
  },
  badge: {
    position: 'absolute',
    top: -2,
    right: -2,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: theme.colors.primary,
  },
  title: {
    flex: 1,
    fontSize: 24,
    fontFamily: theme.fonts.bold,
    color: theme.colors.textPrimary,
    marginHorizontal: 8,
  },
  titleSpacer: {
    flex: 1,
  },
});

export default ScreenHeader;
