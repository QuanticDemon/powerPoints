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
    userText.innerText="You";
    userDot.appendChild(userText);
    userDot.classList.add("dot-user");
    document.body.appendChild(userDot);

    let enemies=0;
    let killedZombies=0;
    let coins=0;
    
    const enemyCreator = setInterval(() => {
            let i=0;
            

            enemies++;
            const enemyDot = document.createElement("div");
            enemyDot.classList.add("dot-enemy");
            

            document.body.appendChild(enemyDot);
            
            const textoId = document.createElement("p");
            
            textoId.innerText= "Zombie";
            enemyDot.appendChild(textoId);
            
            
            const direction = Math.floor(Math.random() *4) +1
            
            //movement logic
            const movement = setInterval(() => {
            i+=25
        
            switch (i) {
                case 25:
                    enemyDot.style.display = "block";
                    VectorMovement(enemyDot, mathMovement(1,10), direction);
                    break;
                case 50:
                    VectorMovement(enemyDot, mathMovement(10,30), direction);
                    break;
                case 75:
                    VectorMovement(enemyDot, mathMovement(31,45), direction); 
                    break;
                case 100:
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
                        
                        if (userDot.style.display == "none"){
                            const enemies = document.querySelectorAll(".dot-enemy");
                            enemies.forEach((enemies) => {
                                enemies.remove();
                            });
                            clearInterval(enemyCreator);
                            
                            
                            
                        }
                    
                    clearInterval(movement);
                    break;
                    }
                    
                    
                    break;
                }
                
            }, 1000);
            
        
            

    
        enemyDot.addEventListener("click", () => { 
            enemyDot.style.background="pink";
            coins+=2;
            killedZombies+=1;

            setTimeout(() => {
                enemyDot.style.display="none"
                if (enemies >= 10 && killedZombies >= 10){

                clearInterval(enemyCreator);
                
                console.log(`/points?kills=${killedZombies}&coins=${coins}`);
                window.location.href = `/points`, killedZombies, coins;
                
            }
                                
            }, 100);

            
            
        });
    
        }, 2000);;
        
}

