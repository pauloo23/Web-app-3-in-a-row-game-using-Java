//carrega mensagens assim que a pagina inicia e limpa a caixa de texto do input
document.addEventListener("DOMContentLoaded", function() {
  curPlayer = null
  vsPlayer = null
  var parts = window.location.search.split("?s="); //vai ler ao URL da pagina o jogador1 e jogador2
	curPlayer = parts[1];
	vsPlayer = parts[2];
  document.getElementById("curPlayerName").innerHTML = curPlayer;
  curState = parts[4];
  if(curState == "erj"){
    disableGrid();
  }
	document.getElementById("CurUsers").innerHTML = curPlayer + " vs " + vsPlayer;

});

var curPlayer
var vsPlayer
var curState

var checkGameStates = setInterval(function(){
  GetGameStatus();
},
1000);

function makePlay(text){ //registar uma jogada no servidor
  fetch("http://localhost:8081/makeMove_field:" + curPlayer + "_field:" + vsPlayer + "_field:" + text , {method: "POST"})
  .then(function(response){
    return(response.text().then(function(text){
    }));
  }); 
}


function GetGameStatus(){ //atualizar o tabuleiro de jogo e verifica se o jogo ja terminou ou nao
    httpGet("http://localhost:8081/getGameStatus_field:" + curPlayer + "_field:" + vsPlayer, function(request){
    var resp = decodeURI(request.responseText);
    var parts = resp.split(' ');

    if(parts.length == 10){
      if(parts[0] == '.')
        document.getElementById('A1').innerHTML = '';
      else if(parts[0] == 'x')
        document.getElementById('A1').innerHTML = '<i class="fas fa-times playIcon">';
      else if(parts[0] == 'o')
        document.getElementById('A1').innerHTML = '<i class="far fa-circle playIcon"></i>';

      if(parts[1] == '.')
        document.getElementById('A2').innerHTML = '';
      else if(parts[1] == 'x')
        document.getElementById('A2').innerHTML = '<i class="fas fa-times playIcon">';
      else if(parts[1] == 'o')
        document.getElementById('A2').innerHTML = '<i class="far fa-circle playIcon"></i>';

      if(parts[2] == '.')
        document.getElementById('A3').innerHTML = '';
      else if(parts[2] == 'x')
        document.getElementById('A3').innerHTML = '<i class="fas fa-times playIcon">';
      else if(parts[2] == 'o')
        document.getElementById('A3').innerHTML = '<i class="far fa-circle playIcon"></i>';

      if(parts[3] == '.')
        document.getElementById('B1').innerHTML = '';
      else if(parts[3] == 'x')
        document.getElementById('B1').innerHTML = '<i class="fas fa-times playIcon">';
      else if(parts[3] == 'o')
        document.getElementById('B1').innerHTML = '<i class="far fa-circle playIcon"></i>';

      if(parts[4] == '.')
        document.getElementById('B2').innerHTML = '';
      else if(parts[4] == 'x')
        document.getElementById('B2').innerHTML = '<i class="fas fa-times playIcon">';
      else if(parts[4] == 'o')
        document.getElementById('B2').innerHTML = '<i class="far fa-circle playIcon"></i>';

      if(parts[5] == '.')
        document.getElementById('B3').innerHTML = '';
      else if(parts[5] == 'x')
        document.getElementById('B3').innerHTML = '<i class="fas fa-times playIcon">';
      else if(parts[5] == 'o')
        document.getElementById('B3').innerHTML = '<i class="far fa-circle playIcon"></i>';

      if(parts[6] == '.')
        document.getElementById('C1').innerHTML = '';
      else if(parts[6] == 'x')
        document.getElementById('C1').innerHTML = '<i class="fas fa-times playIcon">';
      else if(parts[6] == 'o')
        document.getElementById('C1').innerHTML = '<i class="far fa-circle playIcon"></i>';

      if(parts[7] == '.')
        document.getElementById('C2').innerHTML = '';
      else if(parts[7] == 'x')
        document.getElementById('C2').innerHTML = '<i class="fas fa-times playIcon">';
      else if(parts[7] == 'o')
        document.getElementById('C2').innerHTML = '<i class="far fa-circle playIcon"></i>';

      if(parts[8] == '.')
        document.getElementById('C3').innerHTML = '';
      else if(parts[8] == 'x')
        document.getElementById('C3').innerHTML = '<i class="fas fa-times playIcon">';
      else if(parts[8] == 'o')
        document.getElementById('C3').innerHTML = '<i class="far fa-circle playIcon"></i>';
    }
    else{//no caso de nao receber 10 items, nao recebeu o estado do jogo, entao o jogo foi terminado
      document.getElementById('A1').style.display ="none"; //esconde todas as celulas de jogo da pagina
      document.getElementById('A2').style.display ="none";
      document.getElementById('A3').style.display ="none";
      document.getElementById('B1').style.display ="none";
      document.getElementById('B2').style.display ="none";
      document.getElementById('B3').style.display ="none";
      document.getElementById('C1').style.display ="none";
      document.getElementById('C2').style.display ="none";
      document.getElementById('C3').style.display ="none";

      if(parts[0] == 'Tie'){ //verifica se aconteceu um empate
        alert("Empate");
        window.location.href = "index.html"
      }
      else if(parts[0] == '1'){ //jogador1 ganhou
        var parts = window.location.search.split("?s=");
        alert("O jogador: " + parts[3] + " ganhou!");
        window.location.href = "index.html"
      }
      else{
        var parts = window.location.search.split("?s=");
        if(parts[1] == parts[3]){  //jogador2 ganhou
          alert("O jogador: " + parts[2] + " ganhou!");   
          window.location.href = "index.html"
        }
        else{ //jogador 2 ganhou
          alert("O jogador: " + parts[1] + " ganhou!");
          window.location.href = "index.html"
        }
      }
    }
  });
}




function disableGrid(){ //sesativar a grelha porque nao é a vez do jogador atual de jogar
  document.getElementById("A1").disabled = true;
  document.getElementById("A2").disabled = true;
  document.getElementById("A3").disabled = true;
  document.getElementById("B1").disabled = true;
  document.getElementById("B2").disabled = true;
  document.getElementById("B3").disabled = true;
  document.getElementById("C1").disabled = true;
  document.getElementById("C2").disabled = true;
  document.getElementById("C3").disabled = true;
}



//##############################################################



var playerStatus = setInterval(function(){
  GetPlayerStatus();
},
1000);




//fazer um get ao servidor
function httpGet(url, callback){
  const request = new XMLHttpRequest();
  request.open('get', url, true);
  request.onload = function(){
    callback(request);
  };

  request.send();
}



function GetPlayerStatus(){
  fetch("http://localhost:8081/getPlayerStatus_field:" + curPlayer , {method: "POST"})
  .then(function(response){
    return(response.text().then(function(text){
      if(text == "Canceled"){
        document.getElementById("confirmRequest").style.display = "none";
        document.getElementById("timerPopup").style.display = "none";
        document.getElementById("blanket").style.display = "none";
        document.getElementById("logOutBut").disabled = false;
        document.getElementById("input").disabled = false; 
        document.getElementById("typeSelect").disabled = false; 
        document.getElementById("logInBut").disabled = false; 
        document.getElementById("sendGameBut").disabled = false; 
        document.getElementById("requestPlayer").innerHTML = "";
        alert("Game canceled");
      }
      else if(text == "psj" && curState != "psj"){
        var parts = window.location.search.split("?s=");
        window.location.href = "game.html?s=" + curPlayer +"?s=" + vsPlayer + "?s=" + parts[3] + "?s=psj";
      }
      else if(text == "erj" && curState != "erj"){
        var parts = window.location.search.split("?s=");
        window.location.href = "game.html?s=" + curPlayer +"?s=" + vsPlayer + "?s=" + parts[3] +"?s=erj"; 
      }

    }));
  }); 
}
