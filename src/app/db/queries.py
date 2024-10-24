from app.db.connection import connectionPostgres
def question():
    connection = connectionPostgres()
    if connection is not None:
        try:
            cur = connection.cursor()
            query = 'SELECT * FROM questions' 
            cur.execute(query)
            results = cur.fetchall()
            cur.close()
            #print(results)
            return results 
        except (Exception, connection.DatabaseError) as error:
            print(error)
            return []
        finally:
            connection.close()
#question()