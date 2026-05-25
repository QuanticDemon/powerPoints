import time
import logging
from flask import *


class GameEvenHub:
    _game_event = {}

    @classmethod
    def sub_game_event(cls, type_event, callback):
        if type_event not in cls._game_event:
            cls._game_event[type_event] = []
        cls._game_event[type_event].append(callback)
    
    @classmethod
    def pub_game_event(cls, type_event, game_data_event):
        if type_event in cls._game_event:
            for game_event in cls._game_event[type_event]:
                game_event(game_data_event)


class GameEvents:
    def __init__(self, killstatus):
        self.killstatus = killstatus


    def killEnemy(self):
        if self.killstatus:
            print("Has matado a un jugador!")

            GameEvenHub.pub_game_event("ENEMIGO_ELIMINADO", {
                "kill_status":self.killstatus,
                
            })
            
            GameEvenHub.pub_game_event("MONEDA_RECODIGA", {
                "kill_status":self.killstatus,
                
            })


class AchievementTracker:
    _total_kills = 0
    _coins = 0
    @classmethod
    def achievement(cls, game_data_event):
        if game_data_event["kill_status"]:
            cls._total_kills +=1
            cls._coins += 2
            print(f"Kills:{cls._total_kills} | Coins:{cls._coins}")

            if cls._total_kills == 3:
                print(f"Felicidades! Has desbloqueado el logro 'Cazador'")
            if cls._coins == 100:
                print(f"Felicidades! Has desbloqueado el logro 'Rico'")


app= Flask(__name__)
@app.route('/')
def home():

    
    return render_template("index.html")


@app.route('/points?kills=${killedZombies}&coins=${coins}')
def points():

    kills = request.args.get("kills")
    coins = request.args.get("coins")


    return render_template("points.html", kills = kills, coins = coins)
if __name__ == "__main__":
    
    GameEvenHub.sub_game_event("ENEMIGO_ELIMINADO", AchievementTracker.achievement)
    GameEvenHub.sub_game_event("MONEDA_RECOGIDA", AchievementTracker.achievement)

    m1 = GameEvents(True)
    m1.killEnemy()

    app.run(debug=True)