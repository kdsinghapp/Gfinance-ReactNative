import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { DrawerContentScrollView, DrawerContentComponentProps } from '@react-navigation/drawer';
import imageIndex from '../assets/imageIndex';
import ScreenNameEnum from '../routes/screenName.enum';

const DRAWER_ICON_COLOR = '#035093';
const ACTIVE_BG = '#E4EDF8';

type DrawerRouteName =
  | ScreenNameEnum.DeliveryTabNavigator
  | ScreenNameEnum.DeliveryOrdersList
  | ScreenNameEnum.DeliveryProfileScreen
  | ScreenNameEnum.DeliveryEarningsScreen
  | ScreenNameEnum.DeliveryPayoutHistoryScreen
  | ScreenNameEnum.DeliveryDocumentsScreen;

const MENU_ITEMS: { name: DrawerRouteName; label: string; icon: any }[] = [
  { name: ScreenNameEnum.DeliveryTabNavigator, label: 'Home', icon: imageIndex.Location },
  { name: ScreenNameEnum.DeliveryOrdersList, label: 'Orders', icon: imageIndex.order },
  { name: ScreenNameEnum.DeliveryProfileScreen, label: 'Profile', icon: imageIndex.prfile },
];

const DeliveryDrawerContent: React.FC<DrawerContentComponentProps> = (props) => {
  const { state, navigation } = props;

  return (
    <DrawerContentScrollView
      {...props}
      contentContainerStyle={styles.scrollContent}
      style={styles.drawerScroll}
      showsVerticalScrollIndicator={false}
    >
      <View style={[styles.menuList, { marginTop: 30 }]}>
        {MENU_ITEMS.map((item) => {
          const isFocused = state.routes[state.index].name === item.name;
          return (
            <TouchableOpacity
              key={item.name}
              style={[styles.menuItem, isFocused && styles.menuItemActive]}
              onPress={() => {
                navigation.navigate(item.name);
                navigation.closeDrawer();
              }}
              activeOpacity={0.7}
            >
              <View style={[styles.iconWrap, isFocused && styles.iconWrapActive]}>
                <Image
                  source={item.icon}
                  style={[styles.menuIcon, { tintColor: DRAWER_ICON_COLOR }]}
                  resizeMode="contain"
                />
              </View>
              <Text style={[styles.menuLabel, isFocused && styles.menuLabelActive, { color: '#352C48' }]}>
                {item.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </DrawerContentScrollView>
  );
};

const styles = StyleSheet.create({
  drawerScroll: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  scrollContent: {
    paddingTop: 24,
    paddingHorizontal: 16,
    flexGrow: 1,
  },
  menuList: { gap: 4 },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 12,
    borderRadius: 12,
    marginBottom: 4,
  },
  menuItemActive: { backgroundColor: ACTIVE_BG },
  iconWrap: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(3, 80, 147, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
  },
  iconWrapActive: { backgroundColor: 'rgba(3, 80, 147, 0.15)' },
  menuIcon: { width: 22, height: 22 },
  menuLabel: { fontSize: 16, fontWeight: '500' },
  menuLabelActive: { fontWeight: '600' },
});

export default DeliveryDrawerContent;
