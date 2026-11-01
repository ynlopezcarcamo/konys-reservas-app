import AsyncStorage from '@react-native-async-storage/async-storage';

const CLAVE = 'konys_admin_sesion';
const PIN = '1234'; // cámbialo por el que quieras

export function verificarPin(ingresado) {
  return ingresado === PIN;
}

export async function guardarSesion() {
  await AsyncStorage.setItem(CLAVE, 'true');
}

export async function haySesion() {
  return (await AsyncStorage.getItem(CLAVE)) === 'true';
}

export async function cerrarSesion() {
  await AsyncStorage.removeItem(CLAVE);
}
