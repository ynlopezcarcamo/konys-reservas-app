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

export async function obtenerPlatos() {
  const { data, error } = await supabase
    .from('platos')
    .select('*')
    .eq('disponible', true)
    .order('categoria')
    .order('nombre');
  if (error) throw error;
  return data;
}

export async function obtenerTodasLasMesas() {
  const { data, error } = await supabase
    .from('mesas')
    .select('*')
    .order('nombre');
  if (error) throw error;
  return data;
}

export async function cambiarEstadoMesa(mesaId, activa) {
  const { error } = await supabase
    .from('mesas')
    .update({ activa })
    .eq('id', mesaId);
  if (error) throw error;
}

export async function obtenerHorarios() {
  const { data, error } = await supabase
    .from('horarios')
    .select('*')
    .order('dia_semana')
    .order('jornada');
  if (error) throw error;
  return data;
}

export async function actualizarHorario(id, cambios) {
  const { error } = await supabase
    .from('horarios')
    .update(cambios)
    .eq('id', id);
  if (error) throw error;
}

export async function obtenerReservas(filtro = 'todas') {
  let query = supabase
    .from('reservas')
    .select('*, mesas(nombre, zona)')
    .order('fecha', { ascending: false })
    .order('hora_inicio');

  const hoy = new Date();
  const fmt = (d) =>
    `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;

  if (filtro === 'hoy') query = query.eq('fecha', fmt(hoy));
  if (filtro === 'manana') {
    const m = new Date(hoy);
    m.setDate(hoy.getDate() + 1);
    query = query.eq('fecha', fmt(m));
  }

  const { data, error } = await query;
  if (error) throw error;
  return data;
}
