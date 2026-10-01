import os
import sys

# Add backend directory to sys.path
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from app.database import init_db, seed_db, get_db_path

def main():
    db_path = get_db_path()
    print(f"Initializing database at: {db_path}")

    # Remove existing db if re-seeding
    if os.path.exists(db_path):
        try:
            os.remove(db_path)
            print("Removed existing database.")
        except Exception as e:
            print(f"Notice: Could not remove old db ({e}), continuing with init...")

    init_db(db_path)
    print("Schema created successfully.")

    seed_db(db_path)
    print("Seed data inserted successfully.")
    print("Default accounts created:")
    print("  - Admin:   admin@clinic.com / Admin@123 (Role: ADMIN)")
    print("  - Doctor:  doctor.an@clinic.com / Doctor@123 (Role: DOCTOR)")
    print("  - Doctor:  doctor.mai@clinic.com / Doctor@123 (Role: DOCTOR)")
    print("  - Doctor:  doctor.cuong@clinic.com / Doctor@123 (Role: DOCTOR)")
    print("  - Patient: patient.hung@gmail.com / Patient@123 (Role: PATIENT)")
    print("  - Patient: patient.lan@gmail.com / Patient@123 (Role: PATIENT)")
    print("Database is ready!")

if __name__ == '__main__':
    main()
