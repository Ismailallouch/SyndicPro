commands:
docker compose build
docker compose run app npx prisma migrate dev --name init
docker compose exec db psql -U postgres -d syndicPro -f seeds/01_seed.sql
docker compose up -d


to turn that off:
docker compose down -v
