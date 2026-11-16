# Konys Pizza — App Móvil de Reservas de Mesas

Aplicación móvil multiplataforma (Android e iOS) para digitalizar la gestión de reservas de mesas de **Konys Pizza**, pizzería ubicada en la Cra. 36 con calle 41 de Bucaramanga, Santander.

Actualmente las reservas se gestionan de forma manual por llamada, WhatsApp, Instagram o presencialmente, lo que genera dobles reservas, tiempos de espera prolongados y pérdida de clientes por falta de visibilidad de la disponibilidad. Esta app pone la reserva al alcance del celular del cliente y le da al administrador un panel para gestionar mesas, horarios y reservas.

## Tecnologías

| Tecnología | Uso |
| --- | --- |
| React Native | Interfaz móvil para Android e iOS |
| Expo (SDK 58) | Desarrollo, prueba y compilación |
| Expo Router | Navegación por pestañas y en pila |
| JavaScript (ES6+) | Lógica, hooks y llamadas a la API |
| Supabase | Base de datos PostgreSQL como servicio |
| AsyncStorage | Persistencia local de la sesión del administrador |
| GitHub | Control de versiones |

## Funcionalidades

**Módulo cliente**
- Visualización de mesas disponibles con zona y capacidad
- Selección de fecha y horario por jornada (almuerzo y noche)
- Horarios ocupados marcados visualmente
- Formulario de reserva con nombre, personas y contacto opcional
- Pantalla de confirmación como comprobante
- Carta digital filtrable por categorías

**Módulo administrador** (protegido con PIN)
- Gestión de mesas: activar o desactivar
- Gestión de horarios por día y jornada
- Consulta de reservas con filtros Hoy / Mañana / Todas

## Instalación y ejecución

```bash
# 1. Clonar el repositorio
git clone https://github.com/ynlopezcarcamo/konys-reservas-app.git
cd konys-reservas-app

# 2. Instalar dependencias
npm install

# 3. Crear el archivo .env a partir de la plantilla
cp .env.example .env
# y completar con las credenciales de Supabase

# 4. Ejecutar
npx expo start
Luego escanear el código QR con la app Expo Go en el celular, conectado a la misma red Wi-Fi del computador.

Variables de entorno
EXPO_PUBLIC_SUPABASE_URL=
EXPO_PUBLIC_SUPABASE_PUBLISHABLE_KEY=
Copiar
Se obtienen en Supabase → Settings → API. Solo se usa la clave publicable; nunca la service_role.

Estructura del proyecto
konys-reservas-app/
├── app/
│   ├── (tabs)/          # Inicio, Carta, Admin
│   ├── admin/           # Horarios y reservas del administrador
│   ├── _layout.js       # Stack raíz
│   ├── reservar.js
│   └── confirmacion.js
├── constants/           # Paleta de colores
├── docs/                # Documento de proyecto y mockups
├── lib/                 # Cliente de Supabase y sesión admin
├── services/            # Lógica de mesas, reservas, horarios y platos
└── README.md
Copiar
Modelo de datos
Cuatro tablas en Supabase: mesas, horarios, reservas y platos. Todas con Row Level Security activado.

Acceso al panel de administrador
Desde la pestaña Admin, con el PIN de acceso.

Enlaces
Repositorio: https://github.com/ynlopezcarcamo/konys-reservas-app
APK: https://expo.dev/accounts/ynatalialopc/projects/konys-reservas-app/builds/02471acc-054c-4e21-8d09-2106a82d1b7a
Video explicativo: https://youtu.be/JSya_V9C6kY
Limitaciones conocidas
No incluye autenticación de clientes ni pagos en línea (fuera del alcance del proyecto).
Las políticas de Row Level Security permiten escritura con la clave publicable, suficiente para el alcance académico pero no recomendable en producción.
El PIN del administrador está definido en el código, no en la base de datos.
Autora
Yineth Natalia López Cárcamo — Ingeniería de Sistemas, Uniciencia