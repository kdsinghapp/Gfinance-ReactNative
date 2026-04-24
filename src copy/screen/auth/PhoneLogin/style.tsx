
import { StyleSheet } from 'react-native';
import { hp, wp } from '../../../utils/Constant';
import { color } from '../../../constant';
  
const styles = StyleSheet.create({
   container: {
    flex: 1,
    backgroundColor: '#F7F9FC',
  },

  card: {
    // backgroundColor: '#FFF',
    marginTop: hp(5),
     borderRadius: 20,
    padding: 20,
    // shadowColor: '#000',
    // shadowOffset: { width: 0, height: 2 },
    // shadowOpacity: 0.15,
    // shadowRadius: 6,
    // elevation: 8,
  },

  logoText: {
    textAlign: 'center',
    fontSize: 22,
    fontWeight: '700',
    marginBottom: 15,
  },

  title: {
    fontSize: 20,
    fontWeight: '700',
    textAlign: 'center',
    color: '#000',
  },

  subTitle: {
    fontSize: 14,
    color: '#000000',
    textAlign: 'center',
    marginTop: 6,
    marginBottom: 20,
  },

  phoneRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  countryCode: {
    height: 50,
    paddingHorizontal: 14,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: color.primary,
    justifyContent: 'center',
    marginRight: 10,
  },

  codeText: {
    fontSize: 16,
    fontWeight: '600',
  },

  loginBtn: {
    marginTop: 25,
    borderRadius: 25,
  },

  errorText: {
    color: 'red',
    fontSize: 12,
    marginTop: 5,
  },

  signUpContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 25,
  },

  signUpText: {
    fontSize: 15,
    color: '#9DB2BF',
  },

  signUpLink: {
    fontSize: 15,
    fontWeight: '700',
    color: '#3D5AFE',
  },

});
export default styles;
