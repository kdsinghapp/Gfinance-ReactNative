import React from 'react';
import {
  Modal,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  TouchableWithoutFeedback,
  Dimensions,
} from 'react-native';
import font from '../theme/font';
import Icon from 'react-native-vector-icons/MaterialIcons';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

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
    let currentSection: 'none' | 'que_es' | 'lo_importante' | 'riesgo' = 'none';

    return lines.map((line, index) => {
      const trimmed = line.trim();
      if (!trimmed) return <View key={index} style={{ height: 12 }} />;

      // Section Header Detection
      if (trimmed.startsWith('¿Qué es?')) {
        currentSection = 'que_es';
        return <Text key={index} style={styles.sectionHeader}>{trimmed}</Text>;
      }
      if (trimmed.startsWith('Lo importante:')) {
        currentSection = 'lo_importante';
        return <Text key={index} style={styles.sectionHeader}>{trimmed}</Text>;
      }
      if (trimmed.startsWith('Riesgo:')) {
        currentSection = 'riesgo';
        return <Text key={index} style={[styles.sectionHeader, { color: '#E53935' }]}>{trimmed}</Text>;
      }

      // Tip Detection
      if (trimmed.startsWith('👉')) {
        return (
          <View key={index} style={styles.tipContainer}>
            <Text style={styles.tipText}>{trimmed}</Text>
          </View>
        );
      }

      // Content Rendering based on section
      if (currentSection === 'lo_importante') {
        return (
          <View key={index} style={styles.bulletRow}>
            <View style={styles.bulletPoint} />
            <Text style={styles.bodyText}>{trimmed}</Text>
          </View>
        );
      }

      // Default paragraph rendering
      return (
        <Text key={index} style={styles.bodyText}>
          {trimmed}
        </Text>
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
      <View style={styles.overlay}>
        {/* Backdrop for closing */}
        <TouchableOpacity
          style={styles.backdrop}
          activeOpacity={1}
          onPress={onClose}
        />

        {/* Modal Content */}
        <View style={styles.content}>
          {/* Header */}
          <View style={styles.modalHeader}>
            <View style={styles.headerTitleContainer}>
              <Text style={styles.title} numberOfLines={2}>{title}</Text>
              {/* <View style={styles.titleUnderline} /> */}
            </View>
            <TouchableOpacity
              onPress={onClose}
              style={styles.closeIconButton}
              activeOpacity={0.7}
            >
              <Icon name="close" size={24} color="#111" />
            </TouchableOpacity>
          </View>

          {/* Body */}
          <View style={styles.scrollContainer}>
            <ScrollView
              showsVerticalScrollIndicator={false}
              style={styles.scrollArea}
              contentContainerStyle={styles.scrollContent}
            >
              {renderContent()}
            </ScrollView>
          </View>

          {/* Footer */}
          <TouchableOpacity
            style={styles.closeButton}
            onPress={onClose}
            activeOpacity={0.8}
          >
            <Text style={styles.closeButtonText}>Entendido</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

export default InfoModal;

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
  },
  content: {
    width: '100%',
    maxHeight: SCREEN_HEIGHT * 0.8,
    backgroundColor: '#FFFFFF',
    borderRadius: 32,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 10,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  headerTitleContainer: {
    flex: 1,
    marginRight: 10,
  },
  title: {
    fontSize: 24,
    color: '#111',
    fontFamily: font.PoppinsBold,
    lineHeight: 30,
  },
  titleUnderline: {
    height: 4,
    width: 40,
    backgroundColor: '#111',
    marginTop: 8,
    borderRadius: 2,
  },
  closeIconButton: {
    padding: 8,
    backgroundColor: '#F5F5F5',
    borderRadius: 12,
  },
  scrollContainer: {
    flexShrink: 1, // Crucial for ScrollView inside a maxHeight container
    marginBottom: 20,
  },
  scrollArea: {
    flexGrow: 0,
  },
  scrollContent: {
    paddingBottom: 8,
  },
  sectionHeader: {
    fontSize: 18,
    fontFamily: font.PoppinsBold,
    color: '#111',
    marginTop: 12,
    marginBottom: 8,
  },
  bodyText: {
    fontSize: 16,
    fontFamily: font.PoppinsRegular,
    color: '#444',
    lineHeight: 24,
    marginBottom: 4,
  },
  bulletRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 10,
    paddingLeft: 4,
  },
  bulletPoint: {
    height: 6,
    width: 6,
    borderRadius: 3,
    backgroundColor: '#111',
    marginTop: 10,
    marginRight: 12,
  },
  tipContainer: {
    backgroundColor: '#F0F7FF',
    borderRadius: 20,
    padding: 20,
    marginTop: 16,
    borderLeftWidth: 5,
    borderLeftColor: '#007AFF',
  },
  tipText: {
    fontSize: 15,
    fontFamily: font.PoppinsMedium,
    color: '#0055B3',
    lineHeight: 22,
  },
  closeButton: {
    backgroundColor: '#111',
    borderRadius: 20,
    height: 56,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  closeButtonText: {
    color: '#FFFFFF',
    fontSize: 17,
    fontFamily: font.PoppinsBold,
  },
});

