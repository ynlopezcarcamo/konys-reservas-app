import { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import { useRouter, useFocusEffect } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../../constants/colors';
import { obtenerMesas } from '../../services/reservas';

export default function InicioScreen() {
  const router = useRouter();
  const [mesas, setMesas] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);
  const [refrescando, setRefrescando] = useState(false);

  const cargar = async () => {
    try {
      setError(null);
      const data = await obtenerMesas();
      setMesas(data);
    } catch (e) {
      setError('No pudimos cargar las mesas. Revisa tu conexión.');
    } finally {
      setCargando(false);
      setRefrescando(false);
    }
  };

  useEffect(() => {
    cargar();
  }, []);

  useFocusEffect(
    useCallback(() => {
      cargar();
    }, [])
  );

  const irAReservar = (mesaId) => {
    router.push({ pathname: '/reservar', params: { mesa: mesaId } });
  };

  if (cargando) {
    return (
      <SafeAreaView style={styles.centro} edges={['top']}>
        <ActivityIndicator size="large" color={colors.primario} />
        <Text style={styles.cargandoTexto}>Cargando mesas...</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <FlatList
        data={mesas}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.lista}
        refreshControl={
          <RefreshControl
            refreshing={refrescando}
            onRefresh={() => { setRefrescando(true); cargar(); }}
            tintColor={colors.primario}
          />
        }
        ListHeaderComponent={
          <View style={styles.hero}>
            <View style={styles.logoCircle}>
              <Ionicons name="pizza" size={48} color={colors.acento} />
            </View>
            <Text style={styles.titulo}>Konys Pizza</Text>
            <Text style={styles.subtitulo}>La pizza más icónica de la ciudad</Text>
            <View style={styles.horario}>
              <Ionicons name="time-outline" size={16} color={colors.textoSuave} />
              <Text style={styles.horarioTexto}>
                12:30 – 14:30 · 17:00 – 23:00
              </Text>
            </View>
            <Text style={styles.seccion}>Nuestras mesas</Text>
          </View>
        }
        ListEmptyComponent={
          <View style={styles.vacio}>
            <Ionicons name="restaurant-outline" size={40} color={colors.textoSuave} />
            <Text style={styles.vacioTexto}>
              {error ?? 'No hay mesas disponibles por ahora.'}
            </Text>
          </View>
        }
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.tarjeta}
            activeOpacity={0.85}
            onPress={() => irAReservar(item.id)}
          >
            <View style={styles.tarjetaInfo}>
              <Text style={styles.tarjetaNombre}>{item.nombre}</Text>
              <Text style={styles.tarjetaDetalle}>
                {item.zona === 'terraza' ? 'Terraza' : 'Salón'} · {item.capacidad}{' '}
                {item.capacidad === 1 ? 'persona' : 'personas'}
              </Text>
            </View>
            <View style={styles.tarjetaAccion}>
              <Text style={styles.tarjetaAccionTexto}>Reservar</Text>
              <Ionicons name="chevron-forward" size={18} color={colors.fondo} />
            </View>
          </TouchableOpacity>
        )}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.fondo },
  centro: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.fondo,
    gap: 12,
  },
  cargandoTexto: { fontSize: 14, color: colors.textoSuave },
  lista: { paddingHorizontal: 20, paddingBottom: 32 },
  hero: { alignItems: 'center', paddingTop: 24, paddingBottom: 8 },
  logoCircle: {
    width: 88,
    height: 88,
    borderRadius: 44,
    backgroundColor: colors.fondoSuave,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  titulo: {
    fontSize: 28,
    fontWeight: 'bold',
    color: colors.primario,
    letterSpacing: 0.5,
  },
  subtitulo: { fontSize: 14, color: colors.textoSuave, marginTop: 6 },
  horario: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 12,
  },
  horarioTexto: { fontSize: 13, color: colors.textoSuave },
  seccion: {
    alignSelf: 'flex-start',
    fontSize: 16,
    fontWeight: '600',
    color: colors.primario,
    marginTop: 28,
    marginBottom: 12,
  },
  tarjeta: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.fondoSuave,
    borderRadius: 14,
    padding: 16,
    marginBottom: 12,
  },
  tarjetaInfo: { flex: 1 },
  tarjetaNombre: { fontSize: 16, fontWeight: '600', color: colors.primario },
  tarjetaDetalle: { fontSize: 13, color: colors.textoSuave, marginTop: 4 },
  tarjetaAccion: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: colors.primario,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 10,
  },
  tarjetaAccionTexto: { color: colors.fondo, fontSize: 13, fontWeight: '600' },
  vacio: { alignItems: 'center', paddingVertical: 40, gap: 12 },
  vacioTexto: { fontSize: 14, color: colors.textoSuave, textAlign: 'center' },
});
