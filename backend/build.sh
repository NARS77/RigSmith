#!/usr/bin/env bash
# Render build script for Django backend
set -o errexit

pip install -r requirements.txt

python manage.py collectstatic --no-input
python manage.py migrate

# Seed parts catalog if database is empty
python manage.py seed_parts || echo "Parts already seeded or seed_parts command not found"

# Create a default superuser if it does not exist
python manage.py shell -c "from django.contrib.auth import get_user_model; User = get_user_model(); User.objects.filter(username='admin').exists() or User.objects.create_superuser('admin', 'admin@example.com', 'RigsmithAdmin123!')"

