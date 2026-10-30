import { supabase } from '../lib/supabase';

export async function obtenerMesas() {
  const { data, error } = await supabase
    .from('mesas')
    .select('*')
    .eq('activa', true)
    .order('nombre');
  if (error) throw error;
  return data;
}

export async function obtenerReservasDelDia(mesaId, fecha) {
  const { data, error } = await supabase
    .from('reservas')
    .select('hora_inicio')
    .eq('mesa_id', mesaId)
    .eq('fecha', fecha)
    .eq('estado', 'confirmada');
  if (error) throw error;
  return data.map((r) => r.hora_inicio.slice(0, 5));
}

export async function crearReserva(reserva) {
  // Verificación doble contra condiciones de carrera (sección 12.2 del documento)
  const ocupadas = await obtenerReservasDelDia(reserva.mesa_id, reserva.fecha);
  if (ocupadas.includes(reserva.hora_inicio)) {
    throw new Error('Ese horario acaba de ocuparse. Elige otro.');
  }

  const { data, error } = await supabase
    .from('reservas')
    .insert(reserva)
    .select()
    .single();
  if (error) throw error;
  return data;
}
