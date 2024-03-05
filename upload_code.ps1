cd src/backend
npx tsc
cd ../..
python scripts\create_lambda_packages.py src/backend/dist