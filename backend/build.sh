#!/usr/bin/env bash
# Render build script for Django backend
set -o errexit

pip install -r requirements.txt

python manage.py collectstatic --no-input
python manage.py migrate

# Seed parts catalog if database is empty
python manage.py seed_parts || echo "Parts already seeded or seed_parts command not found"
