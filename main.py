from os import name
import time
import logging
import uuid 
import hashlib
import sqlite3
from flask import *
#domain user 

#Domains
class StorageLogic:
    def guardar(cls, data_user):
        pass
    def cargar(cls, data_user):
        pass

class SQLite(StorageLogic):


    @classmethod
    def conexion(cls):
        return sqlite3.connect('test.db')
    @classmethod
    def initTable(cls):
        conn = cls.conexion()
        cursor = conn.cursor()

        cursor.execute(
                '''
                CREATE TABLE IF NOT EXISTS users(
                    id TEXT PRIMARY KEY,
                    name TEXT,
                    password TEXT UNIQUE,
                    mail TEXT UNIQUE
                    )
                '''
                )

        
        conn.commit()
        cursor.close()
        conn.close()
    
    @classmethod
    def guardar(cls, data_user):
         conn = cls.conexion()
         cursor = conn.cursor()

         cursor.execute("INSERT INTO users(id, name, password, mail) VALUES(?,?,?,?)", (data_user['id'], data_user['username'], data_user['password'], data_user['mail'] )) 

         conn.commit()
         cursor.close()
         conn.close()

    @classmethod
    def cargar(cls, data_user):
        conn = cls.conexion()
        cursor = conn.cursor()

        cursor.execute('''
            SELECT * FROM users WHERE (name=? OR mail=?) AND password=?
        ''',
        (data_user["username"],
         data_user["username"],
         data_user["password"])

         )

        verification = cursor.fetchone()
        cursor.close()
        conn.close()
        return bool(verification)

class StorageService:
    def __init__(self, storage:StorageLogic):
        self.storage =storage
    def save_data(self, user_data):
        return self.storage.guardar(user_data)
    def load_data(self, user_data):
        return self.storage.cargar(user_data)
    


#User logiv

class User:
    
    def registrar(self, name, password, mail):
        id = str(uuid.uuid4())
        pass_hashing = hashlib.sha512(password.encode('utf-8'))
        password = pass_hashing.hexdigest()

        data={
                "id":id,
                "username":name,
                "password":password,
                "mail":mail
                }
        db = SQLite()
        db.conexion()
        db.initTable()
        storageService = StorageService(db)
        storageService.save_data(data)

    def login(self, userloginName, password):
        pass_hashing = hashlib.sha512(password.encode('utf-8'))
        password = pass_hashing.hexdigest()
        data={
                "username":userloginName,
                "password":password
                }
        db = SQLite()
        db.conexion()
        db.initTable()
        storageService = StorageService(db)
        storageService.load_data(data)
        
        return db.cargar(data)



#Flask Logic
app= Flask(__name__)
app.secret_key = str(uuid.uuid4())

@app.route('/')
def home():
    return render_template("menu.html")

@app.route('/login', methods=["GET", "POST"])
def login():
    fake = None
    if request.method == "POST":
        name = request.form.get('user')
        password = request.form.get('pass')
        action = request.form.get('action')
    
        if action == "loginInto":
            user = User()
            verification =user.login(name, password)
            
            if verification == True:
                return redirect(url_for("game", name = name)) 
            else:
                fake = False
    return render_template("login.html", fake = fake)

@app.route('/register', methods=["GET", "POST"])
def register():
    if request.method == "POST":
        name = request.form.get('user')
        mail = request.form.get('mail')
        password = request.form.get('pass')
        action = request.form.get('action')
        if request.method == "POST":
            if action == "registerInto":
                user = User() 
                user.registrar(name, password, mail)
                return redirect(url_for("game", name = name))

    return render_template("register.html")


@app.route('/savepoints', methods=["POST"])
def save_score():
    data = request.json
    session['kills'] = data.get('killedZombies')
    session['coins'] = data.get('coins')

    return jsonify({"status":"sucees"})
@app.route('/points')
def points():

    kills = session.get('kills')
    coins = session.get('coins')



    return render_template("points.html", kills = kills, coins = coins)



@app.route('/game')
def game():
    name = request.args.get("name")
    return render_template("index.html", name = name)


if __name__ == "__main__":
   

    app.run(debug=True)
