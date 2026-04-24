import { View, TextInput, Image, Text, TouchableOpacity } from 'react-native';
import React, { useState } from 'react';
import { heightPercentageToDP as hp } from 'react-native-responsive-screen';
import imageIndex from '../assets/imageIndex';
import { color } from '../constant';

export default function TextInputField({ ...props }) {
  const [showPassword, setShowPassword] = useState(props.hide);
  const PasswordVisibility = () => {
    setShowPassword(!showPassword);
  };
  const [isFocused, setIsFocused] = useState<boolean>(false);
  const onChangeText = (value: string) => {
    if (props.onChangeText) {
      props.onChangeText(value);
    }
  };

  return (
    <View
      style={[
        {
          height: hp(7),
          justifyContent: 'center',
          marginVertical: 12,
        },
      ]}
    >
      <View
        style={[
          {
            flexDirection: 'row',
              height: 60,
            borderRadius: 15,
            paddingHorizontal: 5,
            alignItems: 'center',
            justifyContent: 'space-between',
            borderWidth: 0,
            marginTop: 5,
    backgroundColor: '#F7F8F8',
      paddingVertical: 16,
 
           

          },
          props.style,
        ]}>

        {props.firstLogo && (
          <View
            style={{
              marginLeft: 10,
              justifyContent: 'center',
              alignItems: 'center',
              width: '10%',
            }}>
            <Image
              source={props.img}
              style={[{ width: 22, height: 22, tintColor: color.primary }, props.imgStyle]}
              resizeMode="contain"
            />

          </View>
        )}

        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            width: props.showEye ? '70%' : '85%',
            marginLeft: props.firstLogo ? 0 : 15,
            height: 50,

          }}>
          <View style={{ width: '80%' }}>
            <TextInput
              placeholderTextColor={props.placeholderTextColor || "#ADA4A5"}
              style={[
                {
                  color: 'black',
                  fontWeight: '500',
                  fontSize: 14,
                  flex: 1,

                },
                props.textStyle,
              ]}
              onChangeText={onChangeText || props.onChangeText}
              value={props.text || props.value} // Directly using parent `email` state
              placeholder={props.placeholder|| "#B5B5B5"}
              secureTextEntry={showPassword}
              maxLength={props.maxLength}
              keyboardType={props.type || props.keyboardType}
              returnKeyType='done'
              autoFocus={false}
              // onFocus={() => setIsFocused(true) || props.onFocus}
              // onBlur={() => setIsFocused(false)}
              editable={props.editable}
            />
          </View>
        </View>
        {props.showEye && (
          <TouchableOpacity
            onPress={PasswordVisibility}
            style={{
              height: 42,
              width: 42,
              alignItems: 'center',
              justifyContent: 'center',
            }}>
            <Image
              source={!showPassword ? imageIndex.eye : imageIndex.eye}
              style={{ width: 24, height: 24,tintColor: color.primary}}
             />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}
