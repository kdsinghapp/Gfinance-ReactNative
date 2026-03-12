import React, { useState, useEffect } from 'react';
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

export const DECLINE_REASONS = [
  { key: 'busy', label: 'Busy / Already on route' },
  { key: 'vehicle', label: 'Vehicle issue' },
  { key: 'distance', label: 'Distance zyada hai' },
  { key: 'time_window', label: 'Time window match nahi karta' },
  { key: 'other', label: 'Other' },
] as const;

export type DeclineReasonKey = (typeof DECLINE_REASONS)[number]['key'];

export interface DeclineReasonModalProps {
  visible: boolean;
  onClose: () => void;
  onSubmit: (reasonKey: DeclineReasonKey, reasonLabel: string) => void;
  taskId?: string;
}

const { width } = Dimensions.get('window');
const MODAL_WIDTH = Math.min(width * 0.9, 360);

const DeclineReasonModal: React.FC<DeclineReasonModalProps> = ({
  visible,
  onClose,
  onSubmit,
}) => {
  const [selectedKey, setSelectedKey] = useState<DeclineReasonKey | null>(null);

  useEffect(() => {
    if (visible) setSelectedKey(null);
  }, [visible]);

  const handleSubmit = () => {
    if (!selectedKey) return;
    const item = DECLINE_REASONS.find((r) => r.key === selectedKey);
    if (item) {
      onSubmit(selectedKey, item.label);
      onClose();
    }
  };

  return (
    <Modal visible={visible} transparent animationType="fade">
      <Pressable style={styles.overlay} onPress={onClose}>
        <Pressable style={styles.modalCard} onPress={(e) => e.stopPropagation()}>
          <View style={styles.headerRow}>
            <Text style={styles.title}>Select Decline Reason</Text>
            <TouchableOpacity
              onPress={onClose}
              hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
              style={styles.closeBtn}
            >
              <Text style={styles.closeIcon}>×</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.optionsList}>
            {DECLINE_REASONS.map((item) => {
              const isSelected = selectedKey === item.key;
              return (
                <TouchableOpacity
                  key={item.key}
                  style={styles.optionRow}
                  onPress={() => setSelectedKey(item.key)}
                  activeOpacity={0.7}
                >
                  <View style={[styles.radioOuter, isSelected && styles.radioOuterSelected]}>
                    {isSelected && <View style={styles.radioInner} />}
                  </View>
                  <Text style={styles.optionLabel}>{item.label}</Text>
                </TouchableOpacity>
              );
            })}
          </View>

          <TouchableOpacity
            style={[styles.submitBtn, !selectedKey && styles.submitBtnDisabled]}
            onPress={handleSubmit}
            disabled={!selectedKey}
            activeOpacity={0.85}
          >
            <Text style={styles.submitBtnText}>Submit Decline</Text>
          </TouchableOpacity>
        </Pressable>
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
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    color: '#0F172A',
    flex: 1,
  },
  closeBtn: {
    width: 32,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeIcon: {
    fontSize: 24,
    color: '#EF4444',
    fontWeight: '600',
    lineHeight: 28,
  },
  optionsList: {
    marginBottom: 24,
  },
  optionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingRight: 8,
  },
  radioOuter: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
    borderColor: '#94A3B8',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },
  radioOuterSelected: {
    borderColor: color.primary,
  },
  radioInner: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: color.primary,
  },
  optionLabel: {
    fontSize: 15,
    color: '#334155',
    flex: 1,
  },
  submitBtn: {
    backgroundColor: color.primary,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  submitBtnDisabled: {
    opacity: 0.6,
  },
  submitBtnText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
  },
});

export default DeclineReasonModal;
