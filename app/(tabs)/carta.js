import { View, Text, StyleSheet } from 'react-native';
import { colors } from '../../constants/colors';

export default function CartaScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>Carta</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.fondo,
  },
  titulo: {
    fontSize: 28,
    fontWeight: 'bold',
    color: colors.primario,
  },
});
