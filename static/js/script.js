const startBtn = document.getElementById("start-btn");
const levelBtn = document.getElementById("level-btn")

startBtn.addEventListener("mouseenter", () => {levelBtn.style.display="block"});

levelBtn.addEventListener("click",() => {startGame()});


function mathMovement(min, max) {

    return Math.floor(Math.random() * (max-min) + min);
}

function VectorMovement(object,percent, direction){
  object.style.left = "";
  object.style.right = "";
  object.style.top = "";
  object.style.bottom = "";
  let op = direction;
  switch (op) {
    case 1:
      object.style.left= percent + "%";
      object.style.top=  percent + "%";
      break;
    case 2:
      object.style.left=percent+"%";
      object.style.top=(100- percent)+"%";
      break;
    case 3:
      object.style.left=(100-percent)+"%";
      object.style.top=percent+"%";
      break;
    case 4:
      object.style.left=(100-percent)+"%";
      object.style.top=(100-percent)+"%";
      break;

  }

}



function startGame() {
    const userDot = document.createElement("div");
    const userText = document.createElement("p");
    userText.innerText = "You";
    userDot.appendChild(userText);
    userDot.classList.add("dot-user");
    document.body.appendChild(userDot);

    let enemies = 0;
    let killedZombies = 0;
    let coins = 0;
    let gameEnded = false; // ← Para evitar múltiples llamadas

    // ← DEFINIR EndGame() PRIMERO (antes de cualquier llamada)
    function EndGame() {
        if (gameEnded) return; // ← Evitar llamadas duplicadas
        gameEnded = true;

        clearInterval(enemyCreator);

        // Limpiar todos los enemigos restantes
        const remainingEnemies = document.querySelectorAll(".dot-enemy");
        remainingEnemies.forEach(e => e.remove());

        console.log(`Enviando: kills=${killedZombies}, coins=${coins}`);

        fetch('/savepoints', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ killedZombies: killedZombies, coins: coins })
        }).then(() => {
            window.location.href = `/points`;
        }).catch(err => {
            console.error("Error enviando datos:", err);
            // Si falla, igual redirigir
            window.location.href = `/points`;
        });
    }

    const enemyCreator = setInterval(() => {
        let i = 0;
        enemies++;
        const enemyDot = document.createElement("div");
        enemyDot.classList.add("dot-enemy");
        document.body.appendChild(enemyDot);

        const textoId = document.createElement("p");
        textoId.innerText = "Zombie";
        enemyDot.appendChild(textoId);

        const direction = Math.floor(Math.random() * 4) + 1;

        const movement = setInterval(() => {
            i += 5;

            switch (i) {
                case 5:
                    enemyDot.style.display = "block";
                    VectorMovement(enemyDot, mathMovement(1, 5), direction);
                    break;
                case 10:
                    VectorMovement(enemyDot, mathMovement(6, 10), direction);
                    break;
                case 15:
                    VectorMovement(enemyDot, mathMovement(11, 15), direction);
                    break;
                case 20:
                    VectorMovement(enemyDot, mathMovement(16,20), direction);
                    break;
                case 25:
                    VectorMovement(enemyDot, mathMovement(21,25), direction); 
                    break;
                case 30:
                    VectorMovement(enemyDot, mathMovement(26,30), direction);       
                    break;
                case 35:
                    VectorMovement(enemyDot, mathMovement(31,35), direction);
                    break;
                case 40:
                    VectorMovement(enemyDot, mathMovement(36,40), direction);
                    break;
                case 45:
                    VectorMovement(enemyDot, mathMovement(41,49), direction);
                    break;
                case 50:
                    VectorMovement(enemyDot, 50, direction);       
                    const enemyPosition = enemyDot.getBoundingClientRect();
                    const userPosition = userDot.getBoundingClientRect();
                    if (
                        enemyPosition.left < userPosition.right &&
                        enemyPosition.right > userPosition.left &&
                        enemyPosition.top < userPosition.bottom &&
                        enemyPosition.bottom > userPosition.top
                    ) {
                        userDot.style.display = "none";
                        clearInterval(movement);
                        EndGame(); // ← LLAMAR EndGame() CUANDO EL JUGADOR MUERE
                        return;
                    }
                    break;
            }
        }, 500);

        // ← EL CLICK SUMA CADA VEZ QUE SE HACE
        enemyDot.addEventListener("click", () => {
            if (gameEnded) return; // ← No sumar si ya terminó el juego

            enemyDot.style.background = "pink";
            killedZombies += 1;  // ← SUMA 1 KILL
            coins += 2;          // ← SUMA 2 MONEDAS

            console.log(`Click: kills=${killedZombies}, coins=${coins}`); // ← DEBUG

            setTimeout(() => {
                enemyDot.style.display = "none";
                clearInterval(movement);

                // ← VERIFICAR CONDICIÓN DE VICTORIA
                if (enemies >= 5 && killedZombies >= 5 || gameEnded == true) {
                    EndGame()
                }
            }, 100);
        });

    }, 1000);
}
