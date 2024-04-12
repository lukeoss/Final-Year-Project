import os
import time
import django
from django.db.utils import OperationalError

django.setup()

max_retries = 5
wait_seconds = 5

def wait_for_db():
    db_conn = None
    retries = 0
    while db_conn is None:
        try:
            db_conn = django.db.connections['default']
            c = db_conn.cursor()
        except OperationalError:
            retries += 1
            if retries > max_retries:
                raise Exception("Database not available after multiple retries")
            print(f"Database not available, waiting {wait_seconds} seconds...")
            time.sleep(wait_seconds)

if __name__ == "__main__":
    wait_for_db()
    print("Database is available now.")


# I needed this when I was uploading django, react, and an instance of mysql into their own database
# I don't want to remove it... probably dont need it...