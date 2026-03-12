import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: 'white',
  },

  scrollContent: {
    paddingHorizontal: 18,
    paddingTop: 10,
    paddingBottom: 24,
  },

  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 14,
  },

  backButton: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: '#000',
    alignItems: 'center',
    justifyContent: 'center',
  },

  backIcon: {
    color: '#fff',
    fontSize: 22,
    fontWeight: '700',
    marginTop: -2,
  },

  logo: {
    width: 110,
    height: 32,
  },

  headerRightSpace: {
    width: 34,
  },

  screenTitle: {
    textAlign: 'center',
    fontSize: 30,
    fontWeight: '800',
    color: '#111',
    marginBottom: 15,
    marginTop:20
  },

  card: {
    backgroundColor: '#FFF',
    borderRadius: 24,
    paddingHorizontal: 14,
    paddingVertical: 16,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
   },

  label: {
    fontSize: 13,
    fontWeight: '700',
    color: '#111',
    marginBottom: 8,
  },

  input: {
    height: 46,
    borderRadius: 10,
    backgroundColor: '#F1F1F1',
    paddingHorizontal: 14,
    fontSize: 13,
    color: '#111',
  },

  sectionSpacing: {
    marginTop: 16,
  },

  goalButton: {
    height: 50,
    borderRadius: 10,
    backgroundColor: '#F1F1F1',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 13,
  },

  goalButtonSelected: {
    backgroundColor: '#000',
  },

  goalButtonText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#111',
  },

  goalButtonTextSelected: {
    color: '#FFF',
  },

  riskRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 4,
    marginBottom: 18,
  },

  riskCard: {
    width: '31%',
    backgroundColor: '##FBFBFB',
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderColor: 'transparent',
  },

  riskCardSelected: {
    borderColor: '#000',
    backgroundColor: '#000',
        borderWidth: 1,

  },

  riskIcon: {
    width: 22,
    height: 22,
    marginBottom: 8,
  },

  riskText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#111',
    textAlign: 'center',
  },

  nextButton: {
    height: 46,
    borderRadius: 12,
    backgroundColor: '#D9D9D9',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 6,
  },

  nextButtonActive: {
    backgroundColor: '#000',
  },

  nextButtonText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#FFFFFF',
    opacity: 0.8,
  },

  nextButtonTextActive: {
    opacity: 1,
    color: '#FFFFFF',
  },
});