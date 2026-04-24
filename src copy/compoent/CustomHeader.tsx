import React from 'react';
import { View, TouchableOpacity, Image, StyleSheet, Text } from 'react-native';
import { useNavigation } from '@react-navigation/native';

import imageIndex from '../assets/imageIndex';

interface IconProps {
  type: 'svg' | 'png';
  icon: any;
  onPress: () => void;
  txtHeading: any
}

interface Props {
  label?: string;
  leftIcon?: any;
  leftType?: 'svg' | 'png';
  leftPress?: () => void;
  rightIcons?: IconProps[];
  rightComponent?: React.ReactNode;
}

const CustomHeader: React.FC<Props> = ({
  label = '',
  leftIcon,
  leftType = 'png',
  leftPress,
  rightIcons = [],
  rightComponent,
  txtHeading
}) => {
  const navigation = useNavigation();

  return (
    <View style={styles.header}>
      {/* Left Icon */}
      <View style={styles.sideContainer}>

        <TouchableOpacity
          onPress={leftPress ? leftPress : () => navigation.goBack()}
          style={styles.iconWrap}
        >
          <Image source={imageIndex.back} style={styles.icon} resizeMode="contain" />
        </TouchableOpacity>
      </View>
      {/* Title */}
      <View style={styles.centerContainer}>
        <Image source={imageIndex.appLogo1}
          style={{
            width: 130,
            height: 45,

          }}
          resizeMode='contain'
        />
      </View>

      {/* Right Icons or Custom Component */}
      <View style={styles.sideContainerRight}>
        {rightComponent ?? rightIcons.map((item, index) => (
          <TouchableOpacity key={index.toString()} onPress={item.onPress} style={styles.rightIconWrap}>
            {item.type === 'svg' ? <item.icon width={24} height={24} /> : <Image source={item.icon} style={styles.icon} resizeMode="contain" />}
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    height: 60,
    flexDirection: 'row',
    alignItems: 'center',

    paddingHorizontal: 5,
  },
  sideContainer: {
    width: 50,
    justifyContent: 'center',
  },
  sideContainerRight: {
    width: 50,
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  centerContainer: {
    flex: 1,
    alignItems: 'center',
  },
  iconWrap: {
    padding: 8,
  },
  rightIconWrap: {
    marginLeft: 12,
    padding: 8,
  },
  icon: {
    width: 45,
    height: 45,
  },
  txtHeading: {
    fontSize: 18,
    color: 'white',
    fontWeight: "500"
  },
});

export default CustomHeader;
