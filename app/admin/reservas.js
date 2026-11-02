import { useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { useRouter, useFocusEffect } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../../constants/colors';
import { obtenerReservas } from '../../services/reservas';

const FILTROS = [
  { clave: 'hoy', etiqueta: 'Hoy' },
  { clave: 'manana', etiqueta: 'Mañana' },
  { clave: 'todas', etiqueta: 'Todas' },
];

const COLOR_ESTADO = {
  confirmada: colors.acento,
  cancelada: '#C0392B',
  completada: colors.textoSuave,
};

export default function ReservasAdminScreen() {
  const router = useRouter();
  const [filtro, setFiltro] = useState('hoy');
  const [reservas, setReservas] = useState([]);
  const [cargando, setCargando] = useState(true);

  const cargar = async () => {
    setCargando(true);
    try {
      setReservas(await obtenerReservas(filtro));
    } catch (e) {
      setReservas([]);
    } finally {
      setCargando(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      cargar();
    }, [filtro])
  );

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <Ionicons
          name="arrow-back"
          size={24}
          color={colors.primario}
          onPress={() => router.back()}
        />
        <Text style={styles.titulo}>Admin · Reservas</Text>
        <View style={{ width: 24 }} />
      </View>

      <View style={styles.filtros}>
        {FILTROS.map((f) => {
          const activo = filtro === f.clave;
          return (
            <TouchableOpacity
              key={f.clave}
              style={[styles.filtro, activo && styles.filtroActivo]}
              onPress={() => setFiltro(f.clave)}
            >
              <Text style={[styles.filtroTexto, activo && styles.filtroTextoActivo]}>
                {f.etiqueta}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      {cargando ? (
        <View style={styles.centro}>
          <ActivityIndicator size="large" color={colors.primario} />
        </View>
      ) : (
        <FlatList
          data={reservas}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.lista}
          ListEmptyComponent={
            <View style={styles.vacio}>
              <Ionicons name="calendar-outline" size={40} color={colors.textoSuave} />
              <Text style={styles.vacioTexto}>No hay reservas para este filtro.</Text>
            </View>
          }
          renderItem={({ item }) => (
            <View style={styles.tarjeta}>
              <View style={styles.tarjetaHeader}>
                <Text style={styles.cliente}>{item.cliente_nombre}</Text>
                <View
                  style={[
                    styles.estado,
                    { backgroundColor: COLOR_ESTADO[item.estado] ?? colors.textoSuave },
                  ]}
                >
                  <Text style={styles.estadoTexto}>{item.estado}</Text>
                </View>
              </View>
              <Text style={styles.detalle}>
                {item.mesas?.nombre ?? 'Mesa'} · {item.hora_inicio.slice(0, 5)} ·{' '}
                {item.num_personas} {item.num_personas === 1 ? 'persona' : 'personas'}
              </Text>
              <Text style={styles.fecha}>{item.fecha}</Text>
              {item.notas ? <Text style={styles.notas}>{item.notas}</Text> : null}
            </View>
          )}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.fondo },
  centro: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  titulo: { fontSize: 18, fontWeight: '600', color: colors.primario },
  filtros: { flexDirection: 'row', paddingHorizontal: 20, gap: 8, marginBottom: 12 },
  filtro: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: colors.fondoSuave,
  },
  filtroActivo: { backgroundColor: colors.primario },
  filtroTexto: { fontSize: 13, color: colors.texto, fontWeight: '500' },
  filtroTextoActivo: { color: colors.fondo, fontWeight: '600' },
  lista: { paddingHorizontal: 20, paddingBottom: 32 },
  tarjeta: {
    backgroundColor: colors.fondoSuave,
    borderRadius: 12,
    padding: 16,
    marginBottom: 10,
  },
  tarjetaHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  cliente: { fontSize: 15, fontWeight: '600', color: colors.primario, flex: 1 },
  estado: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 10 },
  estadoTexto: {
    fontSize: 11,
    color: '#FFFFFF',
    fontWeight: '600',
    textTransform: 'capitalize',
  },
  detalle: { fontSize: 13, color: colors.texto, marginTop: 2 },
  fecha: { fontSize: 12, color: colors.textoSuave, marginTop: 4 },
  notas: { fontSize: 12, color: colors.textoSuave, marginTop: 6, fontStyle: 'italic' },
  vacio: { alignItems: 'center', paddingVertical: 40, gap: 12 },
  vacioTexto: { fontSize: 14, color: colors.textoSuave },
});
