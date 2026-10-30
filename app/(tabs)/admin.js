import { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../../constants/colors';

export default function AdminScreen() {
  const [pin, setPin] = useState('');

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.centro}>
        <View style={styles.icono}>
          <Ionicons name="lock-closed-outline" size={40} color={colors.acento} />
        </View>
        <Text style={styles.titulo}>Acceso de administrador</Text>
        <Text style={styles.subtitulo}>Ingresa tu PIN de 4 dígitos</Text>

        <TextInput
          style={styles.input}
          value={pin}
          onChangeText={setPin}
          keyboardType="number-pad"
          maxLength={4}
          secureTextEntry
          placeholder="••••"
          placeholderTextColor={colors.textoSuave}
        />

        <TouchableOpacity style={styles.boton} activeOpacity={0.85}>
          <Text style={styles.botonTexto}>Ingresar</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.fondo, paddingHorizontal: 24 },
  centro: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  icono: {
    width: 88,
    height: 88,
    borderRadius: 44,
    backgroundColor: colors.fondoSuave,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  titulo: { fontSize: 22, fontWeight: 'bold', color: colors.primario },
  subtitulo: { fontSize: 14, color: colors.textoSuave, marginTop: 6, marginBottom: 24 },
  input: {
    width: '100%',
    borderWidth: 1,
    borderColor: colors.ocupado,
    borderRadius: 12,
    paddingVertical: 14,
    textAlign: 'center',
    fontSize: 22,
    letterSpacing: 12,
    color: colors.primario,
    marginBottom: 16,
  },
  boton: {
    width: '100%',
    backgroundColor: colors.primario,
    paddingVertical: 16,
    borderRadius: 14,
    alignItems: 'center',
  },
  botonTexto: { color: colors.fondo, fontSize: 16, fontWeight: '600' },
});
