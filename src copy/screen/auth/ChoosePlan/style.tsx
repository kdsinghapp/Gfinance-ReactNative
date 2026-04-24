import { StyleSheet, Dimensions } from 'react-native';

const { width } = Dimensions.get('window');

export const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },

  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingTop: 16,
    paddingBottom: 30,
  },

  container: {
    flex: 1,
    alignItems: 'center',
  },

  logoWrapper: {
    marginTop: 12,
    marginBottom: 28,
  },

  logo: {
    width: 140,
    height: 48,
  },

  title: {
    width: '100%',
    fontSize: 34,
    lineHeight: 42,
    fontWeight: '800',
    color: '#111111',
    textAlign: 'left',
    marginBottom: 12,
  },

  subtitle: {
    width: '100%',
    fontSize: 15,
    lineHeight: 22,
    color: '#666666',
    textAlign: 'left',
    marginBottom: 26,
  },

  heroImage: {
    width: width * 0.95,
    height: width * 0.65,
    marginBottom: 36,
  },

  buttonGroup: {
    width: '100%',
    gap: 14,
    marginTop: 'auto',
  },

  actionButton: {
    width: '100%',
    height: 58,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.08,
    flexDirection:"row",
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    
  },

  blackButton: {
    backgroundColor: '#000000',
  },

  purpleButton: {
    backgroundColor: '#6D28D9',
  },

  greenButton: {
    backgroundColor: '#22C55E',
  },

  blackButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },

  whiteButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
});