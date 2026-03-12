import React from 'react';
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Pressable,
  Image,
} from 'react-native';
import imageIndex from '../assets/imageIndex';
import { color } from '../constant';

const { width } = Dimensions.get('window');
const MODAL_WIDTH = Math.min(width * 0.88, 360);

export interface ArrivalConfirmationModalProps {
  visible: boolean;
  onClose: () => void;
  onConfirmArrival: () => void;
  onCallCustomer: () => void;
  customerName?: string;
}

const ArrivalConfirmationModal: React.FC<ArrivalConfirmationModalProps> = ({
  visible,
  onClose,
  onConfirmArrival,
  onCallCustomer,
  customerName = 'Michael Green',
}) => {
  return (
    <Modal visible={visible} transparent animationType="fade">
      <Pressable style={styles.overlay} onPress={onClose}>
        <Pressable style={styles.modalCard} onPress={(e) => e.stopPropagation()}>
          <View style={{
            justifyContent:"center",
            alignItems:"center" ,
            marginBottom:10
          }}>
          <Image source={imageIndex.Pin2} 
          
          style={{
            height:55,
            width:55
          }}
          resizeMode='contain'
          />
          </View>
          <Text style={styles.title}>Arrival Confirmation</Text>
          <Text style={{
            fontSize: 15,
            color: '#64748B',
            textAlign: 'center',

          }}>You have arrived at the delivery location</Text>


          <View style={{
            marginTop: 20,
            backgroundColor: "#FAFAFA",
            padding: 10,
            borderRadius: 10
          }}>


            <Text style={{
              fontSize: 15,
              color: '#6EC21B',
              marginBottom: 10
            }}>Customer</Text>
            <Text style={styles.subtitle}>Michael Chen</Text>
            <Text style={styles.subtitle}>456 Maple Avenue, Suite 200</Text>
            <Text style={{
              fontSize: 15,
              fontWeight: '600',
              color: '#035093',
              marginBottom: 24,
            }}>Arrived at: 12:03 PM</Text>
          </View>



<View style={styles.gpsContainer}>
  <Text style={styles.gpsText}>
    ⚠️ GPS is turned off. Please enable location to confirm arrival.
  </Text>

  <TouchableOpacity style={styles.gpsButton}>
    <Text style={styles.gpsButtonText}>Enable GPS</Text>
  </TouchableOpacity>
</View>



          <View style={styles.buttons}>
            <TouchableOpacity style={[styles.btnCall,{
              backgroundColor:"#035093"
            }]} onPress={onCallCustomer} activeOpacity={0.85}>
              <Text style={[styles.btnCallText,{
                color:"white"
              }]}>Proceed to Delivery</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.btnMarkArrived} onPress={onConfirmArrival} activeOpacity={0.85}>
              <Text style={styles.btnMarkArrivedText}>Cancel</Text>
            </TouchableOpacity>
          </View>
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
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: '#0F172A',
    textAlign: 'center',
    marginBottom: 12,
  },
  subtitle: {
    fontSize: 15,
    color: '#64748B',
    marginBottom: 4,
  },
  arrivedText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#22C55E',
    textAlign: 'center',
    marginBottom: 24,
  },
  buttons: {
    gap: 12,
  },
  btnCall: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: color.primary,
    gap: 8,
  },
  btnCallIcon: {
    width: 20,
    height: 20,
    tintColor: color.primary,
  },
  btnCallText: {
    fontSize: 16,
    fontWeight: '600',
    color: color.primary,
  },
  btnMarkArrived: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    borderRadius: 12,
    backgroundColor: '#D2D2D2',
  },
  btnMarkArrivedText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
  },
    gpsContainer: {
    marginTop: 20,
    backgroundColor: "#FFCE0045",
    padding: 14,
    borderRadius: 12,
     justifyContent: "space-between",
     marginBottom:10,

    // Shadow (iOS)
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,

    // Shadow (Android)
   },

  gpsText: {
     fontSize: 14,
    color: "black",
    marginRight: 10,
    marginBottom:5
   
  },

  gpsButton: {
    backgroundColor: "#FFCC00",
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    marginTop:10 ,
    marginBottom:6 ,
    height:40 ,
    justifyContent:"center"
  },

  gpsButtonText: {
    color: "black",
    fontSize: 14,
    fontWeight: "600",
     textAlign:"center"
  },

});

export default ArrivalConfirmationModal;
