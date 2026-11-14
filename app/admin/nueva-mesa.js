import { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Switch,
  ScrollView,
  Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../../constants/colors';
import { crearMesa } from '../../services/reservas';

export default function NuevaMesaScreen() {
  const router = useRouter();
  const [nombre, setNombre] = useState('');
  const [zona, setZona] = useState('terraza');
  const [capacidad, setCapacidad] = useState(4);
  const [activa, setActiva] = useState(true);
  const [guardando, setGuardando] = useState(false);

  const guardar = async () => {
    if (!nombre.trim()) {
      Alert.alert('Falta el nombre', 'Escribe un nombre o número para la mesa.');
      return;
    }
    setGuardando(true);
    try {
      await crearMesa({
        nombre: nombre.trim(),
        zona,
        capacidad,
        activa,
      });
      router.back();
    } catch (e) {
      Alert.alert('Error', 'No se pudo guardar la mesa.');
    } finally {
      setGuardando(false);
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <Ionicons
          name="arrow-back"
          size={24}
          color={colors.primario}
          onPress={() => router.back()}
        />
        <Text style={styles.titulo}>Nueva mesa</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView contentContainerStyle={styles.form} showsVerticalScrollIndicator={false}>
        <Text style={styles.etiqueta}>Nombre de la mesa</Text>
        <TextInput
          style={styles.input}
          value={nombre}
          onChangeText={setNombre}
          placeholder="Ej: Mesa 6"
          placeholderTextColor={colors.textoSuave}
        />

        <Text style={styles.etiqueta}>Zona</Text>
        <View style={styles.zonas}>
          {['terraza', 'salon'].map((z) => {
            const activo = zona === z;
            return (
              <TouchableOpacity
                key={z}
                style={[styles.zona, activo && styles.zonaActiva]}
                onPress={() => setZona(z)}
              >
                <Text style={[styles.zonaTexto, activo && styles.zonaTextoActivo]}>
                  {z === 'terraza' ? 'Terraza' : 'Salón'}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        <Text style={styles.etiqueta}>Capacidad</Text>
        <View style={styles.contador}>
          <TouchableOpacity
            style={styles.contadorBoton}
            onPress={() => setCapacidad((c) => Math.max(1, c - 1))}
          >
            <Ionicons name="remove" size={20} color={colors.primario} />
          </TouchableOpacity>
          <Text style={styles.contadorValor}>{capacidad}</Text>
          <TouchableOpacity
            style={styles.contadorBoton}
            onPress={() => setCapacidad((c) => Math.min(20, c + 1))}
          >
            <Ionicons name="add" size={20} color={colors.primario} />
          </TouchableOpacity>
        </View>

        <View style={styles.filaSwitch}>
          <Text style={styles.etiqueta}>Mesa activa</Text>
          <Switch
            value={activa}
            onValueChange={setActiva}
            trackColor={{ false: colors.ocupado, true: colors.acento }}
            thumbColor={colors.fondo}
          />
        </View>

        <TouchableOpacity
          style={[styles.boton, guardando && styles.botonDeshabilitado]}
          onPress={guardar}
          disabled={guardando}
        >
          <Text style={styles.botonTexto}>
            {guardando ? 'Guardando...' : 'Guardar mesa'}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.botonSecundario} onPress={() => router.back()}>
          <Text style={styles.botonSecundarioTexto}>Cancelar</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.fondo },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  titulo: { fontSize: 18, fontWeight: '600', color: colors.primario },
  form: { paddingHorizontal: 20, paddingBottom: 32 },
  etiqueta: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.primario,
    marginBottom: 8,
    marginTop: 16,
  },
  input: {
    borderWidth: 1,
    borderColor: colors.ocupado,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 15,
    color: colors.primario,
  },
  zonas: { flexDirection: 'row', gap: 8 },
  zona: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 12,
    backgroundColor: colors.fondoSuave,
    alignItems: 'center',
  },
  zonaActiva: { backgroundColor: colors.primario },
  zonaTexto: { fontSize: 14, color: colors.texto, fontWeight: '500' },
  zonaTextoActivo: { color: colors.fondo, fontWeight: '600' },
  contador: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 20,
    alignSelf: 'flex-start',
  },
  contadorBoton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.fondoSuave,
    justifyContent: 'center',
    alignItems: 'center',
  },
  contadorValor: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.primario,
    minWidth: 32,
    textAlign: 'center',
  },
  filaSwitch: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 24,
  },
  boton: {
    backgroundColor: colors.primario,
    paddingVertical: 16,
    borderRadius: 14,
    alignItems: 'center',
    marginTop: 32,
  },
  botonDeshabilitado: { opacity: 0.6 },
  botonTexto: { color: colors.fondo, fontSize: 16, fontWeight: '600' },
  botonSecundario: { paddingVertical: 14, alignItems: 'center', marginTop: 4 },
  botonSecundarioTexto: { color: colors.textoSuave, fontSize: 15 },
});
