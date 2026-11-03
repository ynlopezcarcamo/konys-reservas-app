import { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../../constants/colors';
import { obtenerPlatos } from '../../services/reservas';

const CATEGORIAS = [
  { clave: 'todas', etiqueta: 'Todas' },
  { clave: 'pizzas', etiqueta: 'Pizzas' },
  { clave: 'entradas', etiqueta: 'Entradas' },
  { clave: 'postres', etiqueta: 'Postres' },
  { clave: 'bebidas', etiqueta: 'Bebidas' },
];

const formatearPrecio = (valor) =>
  '$ ' + Number(valor).toLocaleString('es-CO');

export default function CartaScreen() {
  const [platos, setPlatos] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);
  const [categoria, setCategoria] = useState('todas');

useEffect(() => {
  obtenerPlatos()
    .then(setPlatos)
    .catch(() => setError('No pudimos cargar la carta. Revisa tu conexión.'))
    .finally(() => setCargando(false));
}, []);

  const filtrados =
    categoria === 'todas'
      ? platos
      : platos.filter((p) => p.categoria === categoria);

  if (cargando) {
    return (
      <SafeAreaView style={styles.centro} edges={['top']}>
        <ActivityIndicator size="large" color={colors.primario} />
        <Text style={styles.cargandoTexto}>Cargando la carta...</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <Text style={styles.titulo}>Carta</Text>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.chips}
        contentContainerStyle={styles.chipsContenido}
      >
        {CATEGORIAS.map((c) => {
          const activo = categoria === c.clave;
          return (
            <TouchableOpacity
              key={c.clave}
              style={[styles.chip, activo && styles.chipActivo]}
              onPress={() => setCategoria(c.clave)}
            >
              <Text style={[styles.chipTexto, activo && styles.chipTextoActivo]}>
                {c.etiqueta}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      <FlatList
        data={filtrados}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.lista}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.vacio}>
            <Ionicons name="pizza-outline" size={40} color={colors.textoSuave} />
            <Text style={styles.vacioTexto}>
              {error ?? 'No hay platos en esta categoría.'}
            </Text>
          </View>
        }
        renderItem={({ item }) => (
          <View style={styles.plato}>
            <View style={styles.platoInfo}>
              <Text style={styles.platoNombre}>{item.nombre}</Text>
              {item.descripcion ? (
                <Text style={styles.platoDescripcion}>{item.descripcion}</Text>
              ) : null}
            </View>
            <Text style={styles.platoPrecio}>{formatearPrecio(item.precio)}</Text>
          </View>
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
  titulo: {
    fontSize: 26,
    fontWeight: 'bold',
    color: colors.primario,
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 12,
  },
  chips: { flexGrow: 0, marginBottom: 8 },
  chipsContenido: { paddingHorizontal: 20, gap: 8 },
  chip: {
    paddingHorizontal: 16,
    paddingVertical: 9,
    borderRadius: 20,
    backgroundColor: colors.fondoSuave,
  },
  chipActivo: { backgroundColor: colors.primario },
  chipTexto: { fontSize: 13, color: colors.texto, fontWeight: '500' },
  chipTextoActivo: { color: colors.fondo, fontWeight: '600' },
  lista: { paddingHorizontal: 20, paddingBottom: 32, paddingTop: 8 },
  plato: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    backgroundColor: colors.fondoSuave,
    borderRadius: 12,
    padding: 16,
    marginBottom: 10,
    gap: 12,
  },
  platoInfo: { flex: 1 },
  platoNombre: { fontSize: 15, fontWeight: '600', color: colors.primario },
  platoDescripcion: {
    fontSize: 13,
    color: colors.textoSuave,
    marginTop: 4,
    lineHeight: 18,
  },
  platoPrecio: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.acento,
  },
  vacio: { alignItems: 'center', paddingVertical: 40, gap: 12 },
  vacioTexto: { fontSize: 14, color: colors.textoSuave, textAlign: 'center' },
});
