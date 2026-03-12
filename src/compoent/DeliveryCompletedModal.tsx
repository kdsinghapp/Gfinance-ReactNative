import React from 'react';
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Pressable,
} from 'react-native';
import { color } from '../constant';

const { width } = Dimensions.get('window');
const MODAL_WIDTH = Math.min(width * 0.9, 380);

export interface DeliveryCompletedModalProps {
  visible: boolean;
  onContinueNewDay: () => void;
  onViewAllOrder: () => void;
  orderId?: string;
  driverName?: string;
  dateTime?: string;
}

const DeliveryCompletedModal: React.FC<DeliveryCompletedModalProps> = ({
  visible,
  onContinueNewDay,
  onViewAllOrder,
  orderId = '#SR9G07R',
  driverName = 'Rahul Verma',
  dateTime = '13 Feb 2025, 12:30 PM',
}) => {
  return (
    <Modal visible={visible} transparent animationType="fade">
      <Pressable style={styles.overlay}>
        <View style={styles.modalCard}>
          <View style={styles.checkWrap}>
            <Text style={styles.checkMark}>✓</Text>
          </View>
          <Text style={styles.title}>Delivery Completed!</Text>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Driver</Text>
            <Text style={styles.infoValue}>{driverName}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Order ID</Text>
            <Text style={styles.infoValue}>{orderId}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Date & Time</Text>
            <Text style={styles.infoValue}>{dateTime}</Text>
          </View>
          <View style={[styles.infoRow, styles.infoRowLast]}>
            <Text style={styles.infoLabel}>Payment</Text>
            <Text style={styles.infoValue}>Completed</Text>
          </View>
          <View style={styles.buttons}>
            <TouchableOpacity style={styles.btnPrimary} onPress={onContinueNewDay} activeOpacity={0.85}>
              <Text style={styles.btnPrimaryText}>Continue New Day</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.btnSecondary} onPress={onViewAllOrder} activeOpacity={0.85}>
              <Text style={styles.btnSecondaryText}>View All Order</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Pressable>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalCard: {
    width: MODAL_WIDTH,
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 28,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
  },
  checkWrap: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: 'rgba(34, 197, 94, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  checkMark: {
    fontSize: 40,
    fontWeight: '800',
    color: '#22C55E',
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    color: '#0F172A',
    marginBottom: 20,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  infoRowLast: {
    borderBottomWidth: 0,
  },
  infoLabel: {
    fontSize: 14,
    color: '#64748B',
  },
  infoValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#0F172A',
  },
  buttons: {
    width: '100%',
    marginTop: 24,
    gap: 12,
  },
  btnPrimary: {
    backgroundColor: color.primary,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
  },
  btnPrimaryText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  btnSecondary: {
    paddingVertical: 14,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#E2E8F0',
    alignItems: 'center',
  },
  btnSecondaryText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#64748B',
  },
});

export default DeliveryCompletedModal;
