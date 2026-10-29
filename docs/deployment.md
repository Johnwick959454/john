# Production Deployment & Recovery Procedures

## Environment Variables (.env)
```ini
PORT=3001
DATABASE_URL="postgresql://postgres:covenant_password@localhost:5432/covenant_shield?schema=public"
JWT_SECRET="production-super-secret-key"
JWT_EXPIRES_IN="24h"
NODE_ENV="production"
```

## Production Docker Build & Startup
1. **Start PostgreSQL Database Container**:
   ```bash
   docker-compose up -d
   ```
2. **Apply Automated Prisma Database Migrations**:
   ```bash
   cd apps/api && npx prisma db push
   ```
3. **Seed Initial Super Admin Account**:
   ```bash
   npm run seed --workspace=@covenant-shield/api
   ```
4. **Build Production Bundles**:
   ```bash
   npm run build --workspaces
   ```

## Database Backup & Automated Recovery
1. **Automated Daily Backup**:
   ```bash
   pg_dump -U postgres -h localhost covenant_shield > covenant_shield_backup_$(date +%F).sql
   ```
2. **Automated Restoration Procedure**:
   ```bash
   dropdb -U postgres -h localhost covenant_shield
   createdb -U postgres -h localhost covenant_shield
   psql -U postgres -h localhost covenant_shield < covenant_shield_backup_YYYY-MM-DD.sql
   ```
