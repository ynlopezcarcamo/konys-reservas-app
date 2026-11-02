import { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Switch,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../../constants/colors';
import { obtenerHorarios, actualizarHorario } from '../../services/reservas';

const ORDEN_DIAS = ['lunes', 'martes', 'miercoles', 'jueves', 'viernes', 'sabado', 'domingo'];
const NOMBRES = {
  lunes: 'Lunes', martes: 'Martes', miercoles: 'Miércoles', jueves: 'Jueves',
  viernes: 'Viernes', sabado: 'Sábado', domingo: 'Domingo',
};

export default function HorariosScreen() {
  const router = useRouter();
  const [horarios, setHorarios] = useState([]);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    obtenerHorarios()
      .then(setHorarios)
      .catch(() => Alert.alert('Error', 'No pudimos cargar los horarios.'))
      .finally(() => setCargando(false));
  }, []);

  const alternar = async (horario) => {
    const nuevo = !horario.activo;
    setHorarios((prev) =>
      prev.map((h) => (h.id === horario.id ? { ...h, activo: nuevo } : h))
    );
    try {
      await actualizarHorario(horario.id, { activo: nuevo });
    } catch (e) {
      setHorarios((prev) =>
        prev.map((h) => (h.id === horario.id ? { ...h, activo: !nuevo } : h))
      );
      Alert.alert('Error', 'No se pudo guardar el cambio.');
    }
  };

  const porDia = (dia) => horarios.filter((h) => h.dia_semana === dia);

  if (cargando) {
    return (
      <SafeAreaView style={styles.centro} edges={['top']}>
        <ActivityIndicator size="large" color={colors.primario} />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <Ionicons
          name="arrow-back"
          size={24}
          color={colors.primario}
          onPress={() => router.back()}
        />
        <Text style={styles.titulo}>Admin · Horarios</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView contentContainerStyle={styles.lista} showsVerticalScrollIndicator={false}>
        {ORDEN_DIAS.map((dia) => {
          const jornadas = porDia(dia);
          return (
            <View key={dia} style={styles.dia}>
              <Text style={styles.diaNombre}>{NOMBRES[dia]}</Text>
              {jornadas.length === 0 ? (
                <Text style={styles.sinJornada}>Sin jornadas definidas</Text>
              ) : (
                jornadas.map((j) => (
                  <View key={j.id} style={styles.jornada}>
                    <View style={styles.jornadaInfo}>
                      <Text style={styles.jornadaNombre}>
                        {j.jornada === 'almuerzo' ? 'Almuerzo' : 'Noche'}
                      </Text>
                      <Text style={styles.jornadaHoras}>
                        {j.hora_inicio.slice(0, 5)} – {j.hora_fin.slice(0, 5)} ·{' '}
                        {j.duracion_slot} min
                      </Text>
                    </View>
                    <Switch
                      value={j.activo}
                      onValueChange={() => alternar(j)}
                      trackColor={{ false: colors.ocupado, true: colors.acento }}
                      thumbColor={colors.fondo}
                    />
                  </View>
                ))
              )}
            </View>
          );
        })}
      </ScrollView>
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
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  titulo: { fontSize: 18, fontWeight: '600', color: colors.primario },
  lista: { paddingHorizontal: 20, paddingBottom: 32 },
  dia: { marginBottom: 20 },
  diaNombre: { fontSize: 16, fontWeight: '700', color: colors.primario, marginBottom: 8 },
  sinJornada: { fontSize: 13, color: colors.textoSuave, fontStyle: 'italic' },
  jornada: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.fondoSuave,
    borderRadius: 12,
    padding: 14,
    marginBottom: 8,
  },
  jornadaInfo: { flex: 1 },
  jornadaNombre: { fontSize: 14, fontWeight: '600', color: colors.primario },
  jornadaHoras: { fontSize: 13, color: colors.textoSuave, marginTop: 3 },
});
