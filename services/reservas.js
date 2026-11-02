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
