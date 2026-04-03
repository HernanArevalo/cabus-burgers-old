# Backend setup (Prisma + PostgreSQL)

1. Copiar variables de entorno:

```bash
cp .env.example .env
```

2. Configurar `DATABASE_URL`.

3. Instalar dependencias:

```bash
npm install
```

4. Generar cliente y migrar:

```bash
npm run prisma:generate
npm run prisma:migrate
```

5. Levantar la app:

```bash
npm run dev
```

## Endpoints

- `GET /api/health`
- `GET /api/products`
- `PATCH /api/products/:id/stock`
- `GET /api/orders`
- `POST /api/orders`
- `PATCH /api/orders/:id/status`
