import os
import time
import logging
import uuid 
import hashlib
import sqlite3
from flask import *
#domain user 

#Domains
class StorageLogic:
    
    def guardar(self):
        pass
  
    def cargar(self):
        pass
    @staticmethod
    def create_achievement_history(instance, data_achievement):
        pass
    
    def actualizar_logros(self, kills, coins):
        pass

class SQLite(StorageLogic):
    def __init__(self, data_base, data_user):
        self.data_base = data_base
        self.data_user = data_user
    
   
    def conexion(self):
        return sqlite3.connect(self.data_base)
    
    def initTable(self):
        conn = self.conexion()
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
        cursor.execute(
            '''
            CREATE TABLE IF NOT EXISTS achievement(
                id_achievement TEXT PRIMARY KEY,
                killed_enemies INTEGER,
                coins INTEGER,
                user_id TEXT,
                FOREIGN KEY(user_id) REFERENCES users(id)
            )
            '''
        )
        
        conn.commit()
        cursor.close()
        conn.close()
    
    
    def guardar(self):
         conn = self.conexion()
         cursor = conn.cursor()

         cursor.execute("INSERT INTO users(id, name, password, mail) VALUES(?,?,?,?)", (self.data_user['id'], self.data_user['username'], self.data_user['password'], self.data_user['mail'] )) 

         conn.commit()
         cursor.close()
         conn.close()

  
    def cargar(self):
        conn = self.conexion()
        cursor = conn.cursor()

        cursor.execute('''
            SELECT * FROM users WHERE (name=? OR mail=?) AND password=?
        ''',
        (self.data_user["username"],
         self.data_user["username"],
         self.data_user["password"])

         )

        verification = cursor.fetchone()
        cursor.close()
        conn.close()
        return bool(verification)
    @staticmethod
    def create_achievement_history(instance, data_achievement):
        conn = instance.conexion()
        cursor = conn.cursor()
        id = str(uuid.uuid4())
        cursor.execute('''
        INSERT INTO achievement(id_achievement, killed_enemies, coins, user_id) VALUES(?,?,?,?)
        ''', (
            id,
            data_achievement['killedEnemies'],
            data_achievement['coins'],
            instance.data_user['id']
        ))

        conn.commit()
        cursor.close()
        conn.close()

    def actualizar_logros(self, kills, coins):
            conn = self.conexion()
            cursor = conn.cursor()
            
            # 1. Buscamos primero el ID del usuario basándonos en su nombre
            cursor.execute("SELECT id FROM users WHERE name = ?", (self.data_user["username"],))
            user_row = cursor.fetchone()
            
            if user_row:
                user_id = user_row[0]
                # 2. Actualizamos la tabla de logros para ese usuario específico
                cursor.execute('''
                    UPDATE achievement 
                    SET killed_enemies = killed_enemies + ?, coins = coins + ? 
                    WHERE user_id = ?
                ''', (kills, coins, user_id))
                conn.commit()
                
            cursor.close()
            conn.close()


class StorageService:
    def __init__(self, storage:StorageLogic):
        self.storage =storage
    def save_data(self):
        return self.storage.guardar()
    def load_data(self):
        return self.storage.cargar()
    @staticmethod
    def create_achievement(instance, data_achievement):
        return instance.storage.create_achievement_history(instance.storage, data_achievement)
  
    def update_achievements(self, kills, coins):
        return self.storage.actualizar_logros(kills, coins)

#User logiv

class User:
    @staticmethod
    def get_achievementData(killedEnemies, coins):
        achievement_data ={
            "killedEnemies":killedEnemies,
            "coins":coins
        }

        return achievement_data
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
        data_achievementInit = User.get_achievementData(killedEnemies=0, coins=0)
        db = SQLite("test.db",data)
       
        db.initTable()
        storageService = StorageService(db)
        storageService.save_data()
        storageService.create_achievement(storageService, data_achievementInit)


    

    def login(self, userloginName, password):
        pass_hashing = hashlib.sha512(password.encode('utf-8'))
        password = pass_hashing.hexdigest()
        data={
                "username":userloginName,
                "password":password
                }
        db = SQLite("test.db", data)
        
        db.initTable()
        storageService = StorageService(db)
        storageService.load_data()
        
        return db.cargar()





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
                session['username'] = name
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
            if action == "confirm-action":
                user = User() 
                user.registrar(name, password, mail)
                session['username'] =name
                return redirect(url_for("game", name = name))

    return render_template("register.html")


@app.route('/savepoints', methods=["POST"])
def save_score():
    data = request.json
    
    session['kills'] = data.get('killedZombies')
    session['coins'] = data.get('coins')
    
    User.get_achievementData(session['kills'], session['coins'])
    username = session.get('username')
    if username:
        db = SQLite("test.db", {"username":username})
        storageservice = StorageService(db)
        storageservice.update_achievements(session['kills'], session['coins'])
    return jsonify({"status":"sucees"})
@app.route('/points')
def points():
    username = session.get('username')

    if not username:
        return redirect(url_for('login'))

    conn = sqlite3.connect("test.db")

    cursor = conn.cursor()

    cursor.execute(
        '''
        SELECT achievement.killed_enemies, achievement.coins
        FROM achievement
        JOIN users ON achievement.user_id = users.id
        WHERE users.name = ?
        ''', (username,)
    )

    registro = cursor.fetchone()

    cursor.close()
    conn.close()

    if registro:
        kills = registro[0]
        coins = registro[1]

    else:
        kills = 0
        coins = 0




    return render_template("points.html", kills = kills, coins = coins)



@app.route('/game')
def game():
    name = request.args.get("name")
    return render_template("index.html", name = name)


if __name__ == "__main__":
    print(os.path.abspath("test.db"))

    app.run(debug=True)
