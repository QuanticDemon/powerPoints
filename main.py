from os import name
import time
import logging
import uuid 
from flask import *

#Domain
class StorageLogic:
    def guardar(self, user_data):
        pass

    def cargar(self):
        pass
    def actualizar(self):
        pass

class SQLite(StorageLogic):
    def guardar(self, user_data):
        return super().guardar(user_data)
    def cargar(self):
        return super().cargar()
    def actualizar(self):
        return super().actualizar()

class StorageService:
    def __init__(self, storage:StorageLogic):
        self.storage =storage
    def save_data(self, user_data):
        return self.storage.guardar(user_data)
    def load_data(self):
        return self.storage.cargar()
    def update_data(self):
        return self.storage.actualizar()










#Flask Logic
app= Flask(__name__)
app.secret_key = str(uuid.uuid4())

@app.route('/')
def home():
    return render_template("menu.html")

@app.route('/login', methods=["GET", "POST"])
def login():
    return render_template("login.html")

@app.route('/register', methods=["GET", "POST"])
def register():
    name = request.form.get('user')
    mail = request.form.get('mail')
    password = request.form.get('pass')
    action = request.form.get('action')
    if request.method == "POST":
        if action == "registerInto":
            pass


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
    return render_template("index.html")


if __name__ == "__main__":
   

    app.run(debug=True)
