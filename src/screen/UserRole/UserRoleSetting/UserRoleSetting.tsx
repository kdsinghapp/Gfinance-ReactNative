import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  StyleSheet,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, CommonActions } from '@react-navigation/native';
import { useDispatch } from 'react-redux';
import StatusBarComponent from '../../../compoent/StatusBarCompoent';
import imageIndex from '../../../assets/imageIndex';
import ScreenNameEnum from '../../../routes/screenName.enum';
import { handleLogout } from '../../../Api/apiRequest';
import { color } from '../../../constant';

const HEADER_BG = '#035093';
const CARD_BG = '#FFFFFF';
const SECTION_TEXT = '#64748B';
const LABEL_TEXT = '#0F172A';

const MENU_ITEMS = [
  {
    key: 'profile',
    label: 'Edit Profile',
    icon: imageIndex.prfile,
    screen: ScreenNameEnum.EditProfile,
  },
  {
    key: 'notifications',
    label: 'Notifications',
    icon: imageIndex.Notification,
    screen: ScreenNameEnum.NotificationsScreen,
  },
  // {
  //   key: 'help',
  //   label: 'Help & Support',
  //   icon: imageIndex.helpPrva,
  //   screen: ScreenNameEnum.Help,
  // },
];

const UserRoleSetting = () => {
  const navigation = useNavigation<any>();
  const dispatch = useDispatch();

  const onLogout = async () => {
    await handleLogout(dispatch);
    navigation.dispatch(
      CommonActions.reset({ index: 0, routes: [{ name: ScreenNameEnum.ChooseRole }] })
    );
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <StatusBarComponent backgroundColor={HEADER_BG} barStyle="light-content" />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backBtn}
          hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
        >
          <Image source={imageIndex.back} style={styles.backIcon} resizeMode="contain" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Settings</Text>
        <View style={styles.headerRight} />
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Profile card */}
        <View style={styles.profileCard}>
          <View style={styles.avatarWrap}>
            <Image source={imageIndex.userLogo} style={styles.avatarIcon} resizeMode="contain" />
          </View>
          <Text style={styles.profileName}>Account</Text>
          <Text style={styles.profileHint}>Manage your profile & preferences</Text>
        </View>

        {/* Menu card */}
        <Text style={styles.sectionLabel}>Preferences</Text>
        <View style={styles.menuCard}>
          {MENU_ITEMS.map((item, index) => (
            <TouchableOpacity
              key={item.key}
              style={[styles.menuRow, index < MENU_ITEMS.length - 1 && styles.menuRowBorder]}
              onPress={() => navigation.navigate(item.screen)}
              activeOpacity={0.7}
            >
              {/* <View style={styles.iconWrap}>
                <Image source={item.icon} style={styles.menuIcon} resizeMode="contain" />
              </View> */}
              <Text style={styles.menuLabel}>{item.label}</Text>
              <Image source={imageIndex.right} style={styles.arrowIcon} resizeMode="contain" />
            </TouchableOpacity>
          ))}
        </View>

        {/* Logout */}
        <View style={styles.logoutWrap}>
          <TouchableOpacity style={styles.logoutBtn} onPress={onLogout} activeOpacity={0.85}>
            <Image source={imageIndex.logout} style={styles.logoutIcon} resizeMode="contain" />
            <Text style={styles.logoutLabel}>Logout</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: HEADER_BG,
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomLeftRadius: 25,
    borderBottomRightRadius: 25,
    minHeight: 60,
  },
  backBtn: { padding: 4 },
  backIcon: { width: 44, height: 44,   },
  headerTitle: { fontSize: 18, fontWeight: '700', color: '#fff' },
  headerRight: { width: 40 },

  scroll: { flex: 1 },
  scrollContent: { padding: 16, paddingTop: 20, paddingBottom: 32 },

  profileCard: {
    backgroundColor: CARD_BG,
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 2,
  },
  avatarWrap: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: '#E0F2FE',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  avatarIcon: { width: 40, height: 40, tintColor: HEADER_BG },
  profileName: { fontSize: 17, fontWeight: '600', color: LABEL_TEXT, marginBottom: 4 },
  profileHint: { fontSize: 13, color: SECTION_TEXT },

  sectionLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: SECTION_TEXT,
    marginBottom: 10,
    paddingHorizontal: 4,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  menuCard: {
    backgroundColor: CARD_BG,
    borderRadius: 16,
    overflow: 'hidden',
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 2,
  },
  menuRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 16,
  },
  menuRowBorder: {
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#E2E8F0',
  },
  iconWrap: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: 'rgba(3, 80, 147, 0.08)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
  },
  menuIcon: { width: 22, height: 22, tintColor: HEADER_BG },
  menuLabel: { flex: 1, fontSize: 16, fontWeight: '500', color: LABEL_TEXT },
  arrowIcon: { width: 20, height: 20, tintColor: '#94A3B8' },

  logoutWrap: { marginTop: 8 },
  logoutBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderRadius: 16,
    backgroundColor: color.red,
    shadowColor: color.red,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 3,
  },
  logoutIcon: { width: 22, height: 22, marginRight: 10, tintColor: '#fff' },
  logoutLabel: { fontSize: 16, fontWeight: '600', color: '#fff' },
});

export default UserRoleSetting;
