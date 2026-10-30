import { useState, useMemo, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../constants/colors';
import { obtenerReservasDelDia, crearReserva } from '../services/reservas';

const DIAS_SEMANA = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];
const MESES = [
  'ene', 'feb', 'mar', 'abr', 'may', 'jun',
  'jul', 'ago', 'sep', 'oct', 'nov', 'dic',
];

const JORNADAS = [
  { nombre: 'Almuerzo', horas: ['12:30', '13:30'] },
  { nombre: 'Noche', horas: ['17:00', '18:00', '19:00', '20:00', '21:00', '22:00'] },
];

const generarFechas = (cantidad = 7) => {
  const hoy = new Date();
  return Array.from({ length: cantidad }, (_, i) => {
    const d = new Date(hoy);
    d.setDate(hoy.getDate() + i);
    const iso = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(
      d.getDate()
    ).padStart(2, '0')}`;
    return {
      iso,
      dia: DIAS_SEMANA[d.getDay()],
      numero: d.getDate(),
      mes: MESES[d.getMonth()],
    };
  });
};

export default function ReservarScreen() {
  const router = useRouter();
  const { mesa } = useLocalSearchParams();

  const fechas = useMemo(() => generarFechas(7), []);

  const [fecha, setFecha] = useState(fechas[0].iso);
  const [hora, setHora] = useState(null);
  const [personas, setPersonas] = useState(2);
  const [nombre, setNombre] = useState('');
  const [telefono, setTelefono] = useState('');
  const [notas, setNotas] = useState('');
  const [ocupadas, setOcupadas] = useState([]);
  const [guardando, setGuardando] = useState(false);

  const fechaElegida = fechas.find((f) => f.iso === fecha);

  useEffect(() => {
    let activo = true;
    obtenerReservasDelDia(mesa, fecha)
      .then((horas) => { if (activo) setOcupadas(horas); })
      .catch(() => { if (activo) setOcupadas([]); });
    return () => { activo = false; };
  }, [mesa, fecha]);

  const confirmar = async () => {
    if (!nombre.trim()) {
      Alert.alert('Falta tu nombre', 'Escribe tu nombre para registrar la reserva.');
      return;
    }
    if (!hora) {
      Alert.alert('Falta la hora', 'Selecciona un horario disponible.');
      return;
    }

    setGuardando(true);
    try {
      const [hh, mm] = hora.split(':').map(Number);
      const finMin = hh * 60 + mm + 60;
      const horaFin = `${String(Math.floor(finMin / 60)).padStart(2, '0')}:${String(
        finMin % 60
      ).padStart(2, '0')}`;

      await crearReserva({
        mesa_id: mesa,
        cliente_nombre: nombre.trim(),
        cliente_contacto: telefono.trim() || null,
        num_personas: personas,
        fecha: fechaElegida.iso,
        hora_inicio: hora,
        hora_fin: horaFin,
        notas: notas.trim() || null,
      });

      router.push({
        pathname: '/confirmacion',
        params: {
          mesa,
          fechaTexto: `${fechaElegida.dia} ${fechaElegida.numero} ${fechaElegida.mes}`,
          hora,
          personas,
          nombre: nombre.trim(),
          telefono: telefono.trim(),
        },
      });
    } catch (e) {
      Alert.alert('No se pudo reservar', e.message);
      obtenerReservasDelDia(mesa, fecha).then(setOcupadas).catch(() => {});
    } finally {
      setGuardando(false);
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color={colors.primario} />
        </TouchableOpacity>
        <Text style={styles.headerTitulo}>Reservar mesa</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        <Text style={styles.label}>Fecha</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.fila}>
          {fechas.map((f) => {
            const activo = fecha === f.iso;
            return (
              <TouchableOpacity
                key={f.iso}
                style={[styles.chip, activo && styles.chipActivo]}
                onPress={() => { setFecha(f.iso); setHora(null); }}
              >
                <Text style={[styles.chipTexto, activo && styles.chipTextoActivo]}>
                  {f.dia}
                </Text>
                <Text style={[styles.chipNumero, activo && styles.chipTextoActivo]}>
                  {f.numero}
                </Text>
                <Text style={[styles.chipMes, activo && styles.chipTextoActivo]}>
                  {f.mes}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>

        {JORNADAS.map((j) => (
          <View key={j.nombre}>
            <Text style={styles.label}>{j.nombre}</Text>
            <View style={styles.grid}>
              {j.horas.map((h) => {
                const activo = hora === h;
                const estaOcupada = ocupadas.includes(h);
                return (
                  <TouchableOpacity
                    key={h}
                    disabled={estaOcupada}
                    style={[
                      styles.horaChip,
                      estaOcupada && styles.horaOcupada,
                      activo && styles.chipActivo,
                    ]}
                    onPress={() => setHora(h)}
                  >
                    <Text
                      style={[
                        styles.chipTexto,
                        estaOcupada && styles.chipOcupadoTexto,
                        activo && styles.chipTextoActivo,
                      ]}
                    >
                      {h}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>
        ))}

        <Text style={styles.label}>Personas</Text>
        <View style={styles.contador}>
          <TouchableOpacity
            style={styles.contadorBoton}
            onPress={() => setPersonas((p) => Math.max(1, p - 1))}
          >
            <Ionicons name="remove" size={20} color={colors.primario} />
          </TouchableOpacity>
          <Text style={styles.contadorValor}>{personas}</Text>
          <TouchableOpacity
            style={styles.contadorBoton}
            onPress={() => setPersonas((p) => Math.min(10, p + 1))}
          >
            <Ionicons name="add" size={20} color={colors.primario} />
          </TouchableOpacity>
        </View>

        <Text style={styles.label}>Nombre completo</Text>
        <TextInput
          style={styles.inputLinea}
          placeholder="Tu nombre"
          placeholderTextColor={colors.textoSuave}
          value={nombre}
          onChangeText={setNombre}
        />

        <Text style={styles.label}>Teléfono (opcional)</Text>
        <TextInput
          style={styles.inputLinea}
          placeholder="300 000 0000"
          placeholderTextColor={colors.textoSuave}
          value={telefono}
          onChangeText={setTelefono}
          keyboardType="phone-pad"
        />

        <Text style={styles.label}>Notas (opcional)</Text>
        <TextInput
          style={styles.input}
          placeholder="Cumpleaños, alergias, etc."
          placeholderTextColor={colors.textoSuave}
          value={notas}
          onChangeText={setNotas}
          multiline
        />

        <View style={styles.resumen}>
          <Text style={styles.resumenTitulo}>Resumen</Text>
          <Text style={styles.resumenTexto}>
            Mesa {mesa} · {fechaElegida.dia} {fechaElegida.numero}{' '}
            {fechaElegida.mes} · {hora ?? 'sin hora'} · {personas}{' '}
            {personas === 1 ? 'persona' : 'personas'}
          </Text>
        </View>

        <TouchableOpacity
          style={[styles.boton, guardando && { opacity: 0.6 }]}
          onPress={confirmar}
          disabled={guardando}
        >
          <Text style={styles.botonTexto}>
            {guardando ? 'Guardando...' : 'Confirmar reserva'}
          </Text>
        </TouchableOpacity>

        <View style={{ height: 32 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.fondo, paddingHorizontal: 20 },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
  },
  headerTitulo: { fontSize: 18, fontWeight: '600', color: colors.primario },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.primario,
    marginTop: 20,
    marginBottom: 10,
  },
  fila: { flexDirection: 'row' },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  chip: {
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 10,
    backgroundColor: colors.fondoSuave,
    marginRight: 8,
    alignItems: 'center',
    minWidth: 56,
  },
  horaChip: {
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 10,
    backgroundColor: colors.fondoSuave,
  },
  horaOcupada: { backgroundColor: colors.ocupado, opacity: 0.6 },
  chipActivo: { backgroundColor: colors.primario },
  chipTexto: { fontSize: 13, color: colors.texto },
  chipNumero: { fontSize: 18, fontWeight: '700', color: colors.primario, marginVertical: 2 },
  chipMes: { fontSize: 11, color: colors.textoSuave },
  chipTextoActivo: { color: colors.fondo, fontWeight: '600' },
  chipOcupadoTexto: { color: colors.textoSuave, textDecorationLine: 'line-through' },
  contador: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 20,
    alignSelf: 'flex-start',
  },
  contadorBoton: {
    width: 40,
    height: 40,
    borderRadius: 10,
    backgroundColor: colors.fondoSuave,
    justifyContent: 'center',
    alignItems: 'center',
  },
  contadorValor: { fontSize: 20, fontWeight: '600', color: colors.primario },
  inputLinea: {
    backgroundColor: colors.fondoSuave,
    borderRadius: 10,
    padding: 14,
    color: colors.texto,
  },
  input: {
    backgroundColor: colors.fondoSuave,
    borderRadius: 10,
    padding: 14,
    minHeight: 80,
    textAlignVertical: 'top',
    color: colors.texto,
  },
  resumen: {
    marginTop: 24,
    padding: 16,
    borderRadius: 12,
    backgroundColor: colors.fondoSuave,
  },
  resumenTitulo: { fontSize: 13, color: colors.textoSuave, marginBottom: 4 },
  resumenTexto: { fontSize: 15, fontWeight: '600', color: colors.primario },
  boton: {
    marginTop: 20,
    backgroundColor: colors.primario,
    paddingVertical: 16,
    borderRadius: 14,
    alignItems: 'center',
  },
  botonTexto: { color: colors.fondo, fontSize: 16, fontWeight: '600' },
});
