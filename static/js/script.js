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
      object.style.left=percent + "%";
      object.style.top=percent + "%";
      break;
    case 2:
      object.style.left=percent+"%";
      object.style.bottom=percent+"%";
      break;
    case 3:
      object.style.right=percent+"%";
      object.style.top=percent+"%";
      break;
    case 4:
      object.style.right=percent+"%";
      object.style.bottom=percent+"%";
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
                    VectorMovement(enemyDot, mathMovement(11,27), direction);
                    break;
                case 75:
                    VectorMovement(enemyDot, mathMovement(27,35), direction); 
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
                        clearInterval(movement);
                        if (userDot.style.display == "None"){
                          clearInterval(enemyCreator);
                        }
                    break;
                    }
                    
                    
                    break;
                }
            }, 1500);

        
            

    
        enemyDot.addEventListener("click", () => { 
            enemyDot.style.background="pink", 
            setTimeout(() => {
                enemyDot.style.display="none"
              
            }, 100);
            enemyDot.style.display="none"
        });
    
        }, 2000);;
        
}



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


