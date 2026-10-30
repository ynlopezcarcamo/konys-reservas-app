import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../constants/colors';

export default function ConfirmacionScreen() {
  const router = useRouter();
  const { mesa, fechaTexto, hora, personas, nombre, telefono } = useLocalSearchParams();

  const volverAlInicio = () => {
    router.dismissAll();
    router.replace('/');
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView
        contentContainerStyle={styles.contenido}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.iconoExito}>
          <Ionicons name="checkmark" size={48} color={colors.fondo} />
        </View>

        <Text style={styles.titulo}>¡Reserva confirmada!</Text>
        <Text style={styles.subtitulo}>
          Te esperamos en Konys Pizza
        </Text>

        <View style={styles.tarjeta}>
          <Fila etiqueta="Nombre" valor={nombre} />
          <Fila etiqueta="Mesa" valor={mesa} />
          <Fila etiqueta="Fecha" valor={fechaTexto} />
          <Fila etiqueta="Hora" valor={hora} />
          <Fila
            etiqueta="Personas"
            valor={`${personas} ${Number(personas) === 1 ? 'persona' : 'personas'}`}
          />
          {telefono ? <Fila etiqueta="Teléfono" valor={telefono} /> : null}
        </View>

        <View style={styles.aviso}>
          <Ionicons name="information-circle-outline" size={18} color={colors.textoSuave} />
          <Text style={styles.avisoTexto}>
            Guarda esta pantalla como comprobante de tu reserva.
          </Text>
        </View>

        <TouchableOpacity style={styles.boton} onPress={volverAlInicio}>
          <Text style={styles.botonTexto}>Volver al inicio</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

function Fila({ etiqueta, valor }) {
  return (
    <View style={styles.fila}>
      <Text style={styles.filaEtiqueta}>{etiqueta}</Text>
      <Text style={styles.filaValor}>{valor}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.fondo },
  contenido: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 32,
  },
  iconoExito: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: colors.primario,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  titulo: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.primario,
    textAlign: 'center',
  },
  subtitulo: {
    fontSize: 15,
    color: colors.textoSuave,
    marginTop: 6,
    marginBottom: 24,
    textAlign: 'center',
  },
  tarjeta: {
    width: '100%',
    backgroundColor: colors.fondoSuave,
    borderRadius: 14,
    padding: 18,
    gap: 12,
  },
  fila: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  filaEtiqueta: { fontSize: 14, color: colors.textoSuave },
  filaValor: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.primario,
    flexShrink: 1,
    textAlign: 'right',
    marginLeft: 12,
  },
  aviso: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 20,
    paddingHorizontal: 4,
  },
  avisoTexto: { fontSize: 13, color: colors.textoSuave, flex: 1 },
  boton: {
    width: '100%',
    marginTop: 28,
    backgroundColor: colors.primario,
    paddingVertical: 16,
    borderRadius: 14,
    alignItems: 'center',
  },
  botonTexto: { color: colors.fondo, fontSize: 16, fontWeight: '600' },
});
