const startBtn = document.getElementById("start-btn");
const levelBtn = document.getElementById("level-btn")

startBtn.addEventListener("mouseenter", () => {levelBtn.style.display="block"});

levelBtn.addEventListener("click",() => {startGame()});


function mathMovement(min, max) {

    return Math.floor(Math.random() * (max-min) + min);
}


function startGame() {
    
    const userDot = document.createElement("div");
    const userText = document.createElement("p");
    userText.innerText="You";
    userDot.appendChild(userText);
    userDot.classList.add("dot-user");
    document.body.appendChild(userDot);

    let enemies=0;
    const enemyCreator = setInterval(() => {
            let i=0;
            if (enemies >= 10){
                clearInterval(enemyCreator);
                return;
            }

            enemies++;
            const enemyDot = document.createElement("div");
            enemyDot.classList.add("dot-enemy");


            document.body.appendChild(enemyDot);
            const textoId = document.createElement("p");
            
            textoId.innerText= "Zombie";
            enemyDot.appendChild(textoId);
            
            enemyDot.style.display = "block";       
            //movement logic
            const movement = setInterval(() => {
            i+=25
            switch (i) {
                case 25:
                    
                    enemyDot.style.left = mathMovement(0, 10) + "%";
                    enemyDot.style.top = mathMovement(0, 10) + "%";
                    break;
                case 50:
                    enemyDot.style.left = mathMovement(11, 25)  + "%";
                    enemyDot.style.top = mathMovement(11, 25)  + "%";
                    break;
                case 75:
                    enemyDot.style.left = mathMovement(27, 35)  + "%";
                    enemyDot.style.top = mathMovement(27, 35)  + "%";
                    break;
                case 100:
                    enemyDot.style.left = mathMovement(36, 50) +"%";
                    enemyDot.style.top = mathMovement(36, 50) +"%";
                    // Importante: detenemos el intervalo para que no siga contando para siempre
                    if (enemyDot.left == "50%" && enemyDot.top == "50%") {
                        userDot.style.display = "none";
                        clearInterval(movement); 
                    }
                    
                    
                    break;
                }
            }, 1500);

        
            

    
        enemyDot.addEventListener("click", () => { 
            enemyDot.style.background="pink", 
            setTimeout(() => {
                enemyDot.style.display="none"
            }, 500);
            
        });
    
        }, 2000);;
        
}


