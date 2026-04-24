import React from 'react';
import {
  Modal,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  TouchableWithoutFeedback,
} from 'react-native';
import font from '../theme/font';

interface InfoModalProps {
  visible: boolean;
  onClose: () => void;
  title: string;
  description: string;
}

const InfoModal: React.FC<InfoModalProps> = ({ visible, onClose, title, description }) => {
  const renderContent = () => {
    if (!description) return null;

    const lines = description.split('\n');
    return lines.map((line, index) => {
      const trimmed = line.trim();
      if (!trimmed) return <View key={index} style={{ height: 8 }} />;

      // Header detection
      const isHeader =
        trimmed.startsWith('¿Qué es?') ||
        trimmed.startsWith('Lo importante:') ||
        trimmed.startsWith('Riesgo:');

      // Tip detection
      const isTip = trimmed.startsWith('👉');

      if (isHeader) {
        return (
          <Text key={index} style={styles.sectionHeader}>
            {trimmed}
          </Text>
        );
      }

      if (isTip) {
        return (
          <View key={index} style={styles.tipContainer}>
            <Text style={styles.tipText}>{trimmed}</Text>
          </View>
        );
      }

      return (

        <View style={{
          flexDirection: 'row',
          alignItems: 'flex-start',
          marginBottom: 10,
          paddingRight: 10,
        }}>
          <View style={{
            height: 6,
            width: 6,
            borderRadius: 3,
            backgroundColor: '#111',
            marginTop: 8,
            marginRight: 12,
          }} />
          <Text style={[styles.bodyText, { flex: 1 }]}>
            {trimmed}
          </Text>
        </View>

      );
    });
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={styles.overlay}>
          <TouchableWithoutFeedback>
            <View style={styles.content}>
              <View style={styles.header}>
                <Text style={styles.title}>{title}</Text>
              </View>

              <ScrollView
                showsVerticalScrollIndicator={false}
                style={styles.scrollArea}
                contentContainerStyle={{ paddingBottom: 10 }}
              >
                {renderContent()}
              </ScrollView>

              <TouchableOpacity style={styles.closeButton} onPress={onClose}>
                <Text style={styles.closeButtonText}>Entendido</Text>
              </TouchableOpacity>
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

export default InfoModal;

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  content: {
    width: '100%',
     backgroundColor: 'white',
    borderRadius: 32,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 20 },
    shadowOpacity: 0.15,
    shadowRadius: 30,
    elevation: 20,
  },
  header: {
    marginBottom: 20,
  },
  title: {
    fontSize: 22,
    color: '#111',
    fontFamily: font.PoppinsBold,
    marginBottom: 8,
  },
  titleDivider: {
    height: 3,
    width: 40,
    backgroundColor: 'black',
    borderRadius: 2,
  },
  scrollArea: {
    marginBottom: 24,
  },
  sectionHeader: {
    fontSize: 16,
    fontFamily: font.PoppinsBold,
    color: '#111',
    marginTop: 12,
    marginBottom: 6,
  },
  bodyText: {
    fontSize: 15,
    fontFamily: font.PoppinsRegular,
    color: '#444',
    lineHeight: 22,
    marginBottom: 4,
  },
  tipContainer: {
    backgroundColor: '#F3F4F6',
    borderRadius: 16,
    padding: 16,
    marginTop: 16,
    borderLeftWidth: 4,
    borderLeftColor: 'black',
  },
  tipText: {
    fontSize: 14,
    fontFamily: font.PoppinsMedium,
    color: '#111',
    lineHeight: 20,
  },
  closeButton: {
    backgroundColor: 'black',
    borderRadius: 18,
    height: 54,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  closeButtonText: {
    color: 'white',
    fontSize: 16,
    fontFamily: font.PoppinsBold,
  },
});
