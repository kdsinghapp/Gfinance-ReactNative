import React from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet } from 'react-native';
import { DrawerActions, useNavigation } from '@react-navigation/native';
import imageIndex from '../assets/imageIndex';
import ScreenNameEnum from '../routes/screenName.enum';

const HEADER_BG = '#035093';

interface DrawerHeaderProps {
  title: string;
  rightLabel?: string;
  onRightPress?: () => void;
  showNotification?: boolean;
}

const DrawerHeader: React.FC<DrawerHeaderProps> = ({
  title,
  rightLabel,
  onRightPress,
  showNotification = true,
}) => {
  const navigation = useNavigation();

  const openDrawer = () => {
    navigation.dispatch(DrawerActions.openDrawer());
  };

  const handleRightPress = () => {
    if (onRightPress) onRightPress();
    else if (showNotification) navigation.navigate(ScreenNameEnum.NotificationsScreen as never);
  };

  return (
    <View style={styles.header}>
      <TouchableOpacity
        style={styles.menuBtn}
        onPress={openDrawer}
        hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
      >
        <Image source={imageIndex.menus} style={styles.menuIcon} resizeMode="contain" />
      </TouchableOpacity>
      <View style={styles.headerCenter}>
        <Text style={styles.headerTitle}>{title}</Text>
      </View>
      
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: HEADER_BG,
    paddingHorizontal: 15,
    paddingVertical: 16,
    minHeight: 60,
  },
  menuBtn: { padding: 4 },
  menuIcon: { width: 22, height: 22, tintColor: '#fff' },
  headerCenter: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  headerTitle: { fontSize: 18, color: '#fff', fontWeight: '700' },
  rightBtn: { padding: 8, minWidth: 40, alignItems: 'flex-end' },
  notifIcon: { width: 24, height: 24, tintColor: '#fff' },
  rightLabel: { fontSize: 16, color: '#fff', fontWeight: '600' },
});

export default DrawerHeader;
