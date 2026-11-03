import { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  FlatList,
  Switch,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { useRouter, useFocusEffect } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../../constants/colors';
import { obtenerTodasLasMesas, cambiarEstadoMesa } from '../../services/reservas';
import { iniciarSesion, obtenerSesion, cerrarSesion } from '../../lib/admin';

export default function AdminScreen() {
  const router = useRouter();
  const [usuario, setUsuario] = useState(null);
  const [comprobando, setComprobando] = useState(true);
  const [pin, setPin] = useState('');
  const [mesas, setMesas] = useState([]);
  const [cargando, setCargando] = useState(false);

  useEffect(() => {
    obtenerSesion().then((u) => {
      setUsuario(u);
      setComprobando(false);
    });
  }, []);

  const cargarMesas = async () => {
    setCargando(true);
    try {
      setMesas(await obtenerTodasLasMesas());
    } catch (e) {
      Alert.alert('Error', 'No pudimos cargar las mesas.');
    } finally {
      setCargando(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      if (usuario && usuario.rol === 'admin') cargarMesas();
    }, [usuario])
  );

  const ingresar = async () => {
    try {
      const u = await iniciarSesion(pin);
      if (u) {
        setUsuario(u);
        setPin('');
      } else {
        Alert.alert('PIN incorrecto', 'Verifica el código e intenta de nuevo.');
        setPin('');
      }
    } catch (e) {
      Alert.alert('Error', 'No pudimos verificar el PIN.');
    }
  };

  const salir = async () => {
    await cerrarSesion();
    setUsuario(null);
    setMesas([]);
  };

  const alternarMesa = async (mesa) => {
    const nuevo = !mesa.activa;
    setMesas((prev) =>
      prev.map((m) => (m.id === mesa.id ? { ...m, activa: nuevo } : m))
    );
    try {
      await cambiarEstadoMesa(mesa.id, nuevo);
    } catch (e) {
      setMesas((prev) =>
        prev.map((m) => (m.id === mesa.id ? { ...m, activa: !nuevo } : m))
      );
      Alert.alert('Error', 'No se pudo cambiar el estado de la mesa.');
    }
  };

  if (comprobando) {
    return (
      <SafeAreaView style={styles.centro} edges={['top']}>
        <ActivityIndicator size="large" color={colors.primario} />
      </SafeAreaView>
    );
  }

  if (!usuario) {
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

          <TouchableOpacity style={styles.boton} onPress={ingresar} activeOpacity={0.85}>
            <Text style={styles.botonTexto}>Ingresar</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <View>
          <Text style={styles.titulo}>Admin · Mesas</Text>
          <Text style={styles.usuarioTexto}>
            {usuario?.nombre} · {usuario?.rol}
          </Text>
        </View>
        <TouchableOpacity onPress={salir} style={styles.salirBoton}>
          <Ionicons name="log-out-outline" size={22} color={colors.textoSuave} />
          <Text style={styles.salirTexto}>Salir</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.subnav}>
        {usuario?.rol === 'admin' && (
          <>
            <View style={[styles.subnavItem, styles.subnavActivo]}>
              <Text style={styles.subnavTextoActivo}>Mesas</Text>
            </View>
            <TouchableOpacity
              style={styles.subnavItem}
              onPress={() => router.push('/admin/horarios')}
            >
              <Text style={styles.subnavTexto}>Horarios</Text>
            </TouchableOpacity>
          </>
        )}
        <TouchableOpacity
          style={styles.subnavItem}
          onPress={() => router.push('/admin/reservas')}
        >
          <Text style={styles.subnavTexto}>Reservas</Text>
        </TouchableOpacity>
      </View>

      {usuario?.rol === 'mesero' ? (
        <View style={styles.centro}>
          <Ionicons name="calendar-outline" size={40} color={colors.textoSuave} />
          <Text style={styles.vacioTexto}>
            Como mesero, consulta las reservas del día.
          </Text>
          <TouchableOpacity
            style={[styles.boton, { marginTop: 16 }]}
            onPress={() => router.push('/admin/reservas')}
          >
            <Text style={styles.botonTexto}>Ver reservas</Text>
          </TouchableOpacity>
        </View>
      ) : cargando ? (
        <View style={styles.centro}>
          <ActivityIndicator size="large" color={colors.primario} />
        </View>
      ) : (
        <FlatList
          data={mesas}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.lista}
          renderItem={({ item }) => (
            <View style={styles.tarjeta}>
              <View style={styles.tarjetaInfo}>
                <Text style={styles.tarjetaNombre}>{item.nombre}</Text>
                <Text style={styles.tarjetaDetalle}>
                  {item.zona === 'terraza' ? 'Terraza' : 'Salón'} · {item.capacidad}{' '}
                  {item.capacidad === 1 ? 'persona' : 'personas'}
                </Text>
              </View>
              <Switch
                value={item.activa}
                onValueChange={() => alternarMesa(item)}
                trackColor={{ false: colors.ocupado, true: colors.acento }}
                thumbColor={colors.fondo}
              />
            </View>
          )}
          ListEmptyComponent={
            <View style={styles.vacio}>
              <Text style={styles.vacioTexto}>No hay mesas registradas.</Text>
            </View>
          }
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.fondo },
  centro: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
  },
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
  usuarioTexto: { fontSize: 12, color: colors.textoSuave, marginTop: 2 },
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
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 12,
  },
  salirBoton: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  salirTexto: { fontSize: 12, color: colors.textoSuave },
  subnav: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    gap: 8,
    marginBottom: 12,
  },
  subnavItem: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: colors.fondoSuave,
  },
  subnavActivo: { backgroundColor: colors.primario },
  subnavTexto: { fontSize: 13, color: colors.texto, fontWeight: '500' },
  subnavTextoActivo: { fontSize: 13, color: colors.fondo, fontWeight: '600' },
  lista: { paddingHorizontal: 20, paddingBottom: 32 },
  tarjeta: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.fondoSuave,
    borderRadius: 12,
    padding: 16,
    marginBottom: 10,
  },
  tarjetaInfo: { flex: 1 },
  tarjetaNombre: { fontSize: 15, fontWeight: '600', color: colors.primario },
  tarjetaDetalle: { fontSize: 13, color: colors.textoSuave, marginTop: 4 },
  vacio: { alignItems: 'center', paddingVertical: 40 },
  vacioTexto: { fontSize: 14, color: colors.textoSuave, textAlign: 'center', marginTop: 12 },
});
