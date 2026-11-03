import AsyncStorage from '@react-native-async-storage/async-storage';
import { supabase } from './supabase';

const CLAVE = 'konys_admin_sesion';

export async function iniciarSesion(pin) {
  const { data, error } = await supabase
    .from('usuarios')
    .select('*')
    .eq('pin', pin)
    .eq('activo', true)
    .maybeSingle();

  if (error) throw error;
  if (!data) return null;

  await AsyncStorage.setItem(CLAVE, JSON.stringify(data));
  return data;
}

export async function obtenerSesion() {
  const raw = await AsyncStorage.getItem(CLAVE);
  if (!raw) return null;
  try {
    const data = JSON.parse(raw);
    return data && typeof data === 'object' && data.rol ? data : null;
  } catch {
    await AsyncStorage.removeItem(CLAVE);
    return null;
  }
}

export async function cerrarSesion() {
  await AsyncStorage.removeItem(CLAVE);
}
