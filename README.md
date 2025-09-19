Prueba Técnica – API Node/Sequelize + Angular Material 18 + MySQL / Docker

Resumen del proyecto y arquitectura

Este proyecto implementa un backend Node.js + Express con Sequelize ORM conectado a MySQL
y un frontend Angular 18 con Angular Material puro y ngx-echarts. CRUD completo para Users,
Customers, Products, Orders y OrderItems con autenticación vía JWT (access y refresh token) y
seeds automáticos para datos iniciales. Despliegue con Docker Compose: MySQL, backend y
frontend Angular servido por Nginx en el puerto 4200.

Prerrequisitos
• Docker y Docker Compose instalados.
• Git para clonar el repositorio.
• (Opcional) Node 20+ y npm 10+ para correr localmente sin Docker.

Configuración (.env)
En la raíz del backend, copiar .env.example a .env y ajustar variables DB_HOST,
DB_USER=admin, DB_PASS=jahinsurance\*, DB_NAME=jahinsurance, JWT_SECRET,
JWT_REFRESH_SECRET y expiraciones. El frontend usa environment.apiUrl='/api' para que
Nginx redireccione al backend.

Arranque rápido
1 Clonar el repositorio: git clone && cd
2 Opción A (Docker Compose): docker compose up --build → abrir http://localhost:4200
3 Opción B (script): chmod +x ./up.sh && ./up.sh (puede tardar mientras arrancan las imágenes)

Usuario de prueba inicial
Email: admin@local.test – Contraseña: jahinsurance\* – Rol: admin

Rutas principales y contratos de la API
• POST /api/v1/auth/login – Body { email, password } devuelve { token, refreshToken }
• POST /api/v1/auth/refresh – Body { refreshToken } devuelve nuevo { token }
• CRUD /api/v1/customers – clientes
• CRUD /api/v1/products – productos
• CRUD /api/v1/orders – pedidos
• CRUD /api/v1/order-items – líneas de pedido

Decisiones técnicas
• Sequelize ORM con migraciones y seeders automáticos, convención snake_case en BD
(underscored: true).
• JWT con access token y refresh token para reemitir sin pedir credenciales, bcrypt para hash de
contraseñas.
• CRUD completo en todas las tablas; KPIs del dashboard calculados en el cliente desde los
endpoints.
• Docker Compose: MySQL, backend y frontend Angular servido por Nginx; proxy interno /api →
backend.
• Angular Material puro para UI y ngx-echarts para gráficos; sin Bootstrap/Tailwind.
• Seeds para usuario admin, clientes, productos y pedidos iniciales.

Problemas conocidos y futuros trabajos
• Las agregaciones se calculan en el cliente; para grandes volúmenes sería recomendable
endpoints de reporte o vistas SQL.
• Mejorar la interfaz del dashboard con MatTable y MatPaginator para listados detallados.
• Manejo de errores más robusto en el frontend y logging centralizado en el backend.
• Implementar tests unitarios e integraciones automáticas para asegurar la calidad.
• Configurar healthchecks y métricas para cada contenedor en Docker Compose.
