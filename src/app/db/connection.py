import psycopg2 
def connectionPostgres():
    connection = None
    try:
        connection = psycopg2.connect(
            host="localhost", 
            database="qqi", 
            user="postgres",
            password="123456",
            port="5432"
        )
        return connection
    except (Exception, psycopg2.DatabaseError) as error:
        print(f"Error connecting to the database: {error}")
        return None