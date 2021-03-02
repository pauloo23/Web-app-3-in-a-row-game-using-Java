//carrega mensagens assim que a pagina inicia e limpa a caixa de texto do input
document.addEventListener("DOMContentLoaded", function() {
  curPlayer = null
  vsPlayer = null
  TimerActive = false
  curState = "l"
  var timer = document.getElementById("timerPopup");
  document.getElementById('input').value = ""
  document.getElementById("timerPopup").style.display = "none";
  document.getElementById("confirmRequest").style.display = "none";
  document.getElementById("blanket").style.display = "none";
  getUsers();
});


var curPlayer
var vsPlayer
var curPlayerId
var TimerActive
var curState

function UpdateCurrentPlayer(){
	document.getElementById('CurUser').innerHTML = curPlayer;//apresentar o nome do jogador atual
}


var intervalID = setInterval(function(){
	getUsers(); //atualizar lista de jogadores
	}, 
1000);

var gameRequests = setInterval(function(){
	CheckGameRequests(); // atualizar pedidos de jogos recebidos
},
1000);

function ServerLogOut(){ //esta função atualiza o utilizador atual no servidor
	fetch("http://localhost:8081/logOut_field:" + curPlayerId, {method: "POST"})
	.then(function(response){
		return(response.text().then(function(text){
			curPlayer = null; //fazer o log out, ou seja, defenir que nao ha um utilizador ativo
		}));
	});
}

function getUsers(){
	httpGet("http://localhost:8081/getPlayers", function(request){
		var resp = decodeURI(request.responseText); //ir buscar todos os utilizadores
		var options = resp.split(","); //separar lista de utilizadores pelas virgulas
		var x = document.getElementById("userList") 
		if(x!=null){
			x = x.options.length;
		
			var selectedIndex =document.getElementById("userList").selectedIndex;
			if(selectedIndex != -1){ //guardar utilizador que estava selecionado
				var select =  document.getElementById("userList")[selectedIndex].text
			}
			
			for (var i = 0; i < x; i++) { //limpar lista de utilizadores atual para criar uma nova atualizada
				document.getElementById('userList').remove(0);
			}

			for (var i = 0; i < options.length; i++) { //criar nova lista de utilizadores, desta vez atualizada
				var option = document.createElement("option");
				option.text = options[i];
				document.getElementById('userList').add(option);

				if(select == options[i]){ //se esta opção estava selecionada antes de atualizar a lista, selecionar la de novo
					document.getElementById("userList").selectedIndex = i;
				}
			}
		}
	});
}


function logOut(){
	if(curPlayer == null){ //se nao houver um utilizador ativo
		Swal.fire({
			  icon: 'error',
			  title: 'Oops...',
			  text: 'Não existe um utilizador ativo"',
			  footer: ''
			})	 
	}
	else{
		curPlayer = null; //fazer o log out, ou seja, defenir que nao ha um utilizador ativo
		UpdateCurrentPlayer();
		Swal.fire({
			  title: 'Tem a certeza?',
			  text: "",
			  icon: 'warning',
			  showCancelButton: true,
			  confirmButtonColor: '#3085d6',
			  cancelButtonColor: '#d33',
			  confirmButtonText: 'Sim, sair!'
			}).then((result) => {
			  if (result.value) {
			    Swal.fire(
			      'Logout com sucesso!',
			      '',
			      'success'
			    )
			  }
			}) //caixa pop up		
		ServerLogOut(); //atualizar servidor
	}
}


function logIn(){
	if(curPlayer != null){ //se houver um utilizador ativo
		ServerLogOut();
	}

	var tmp = document.getElementById('input').value; //ler novo nome do utilizador

	if(tmp.length >= 3){
		curPlayer = document.getElementById('input').value; //fazer o log out, ou seja, defenir que nao ha um utilizador ativo
		UpdateCurrentPlayer(); //atualizar o utilizador
		document.getElementById('input').value = "";
		var type = document.getElementById('typeSelect').value; //tipo de utilizador
		fetch("http://localhost:8081/logIn_field:" + curPlayer + "_field:" + type, {method: "POST"}) //pedido post
		.then(function(response){
			return(response.text().then(function(text){ //resposta 
				if(text == "Null"){
					Swal.fire({
						  icon: 'error',
						  title: 'Oops...',
						  text: 'Utilizador já existe, por favor insira outro nome',
						  footer: ''
						})	
				}
				else{
					curPlayerId = text;
					Swal.fire(
							  'Bem-vindo!',
							  'Convida um jogador para iniciares uma partida!',
							  'success'
							)
				}
				
			}));
		});

	}
	else{
		Swal.fire({
			  icon: 'error',
			  title: 'Oops...',
			  text: 'Nome de utilizador inválido! Por favor insira um utilizador com 3 ou mais caracteres!',
			  footer: ''
			})
	}
}

function StartTimer(){ //esta função trata do contador de tempo para enviar um convite a outro jogador
	var countDownDate = Date.now();
	countDownDate = countDownDate + 60000; //60 000 -> 60 mil milisegundos -> 60 segundos -> 1 minuto

	var x = setInterval(function() {
  		var now = new Date().getTime();
		var distance = countDownDate - now;
  		var seconds = Math.floor((distance % (1000 * 60)) / 1000);

  		if(!TimerActive){ //quando se cancela o pedido o tempo ser limpo
  			clearInterval(x); 
  			document.getElementById("timerCount").innerHTML = "";
  		}
  		else{
	  		// Mostrar os segundos que faltam em segundos
			document.getElementById("timerCount").innerHTML =  seconds + "s ";
  		}

  // If the count down is finished, write some text
  	if (distance < 0) {
  		cancelRequest();
  		document.getElementById("timerCount").innerHTML = "";
  		clearInterval();
  	}
	}, 1000);
}


function sendGame(){//enviar um pedido de jogo
	var selectedIndex = document.getElementById('userList').selectedIndex;
	if(selectedIndex == -1){//para o caso de nao ter selecionado um adversario
		alert("Por favor selecione um jogador") 
	}
	else{
		var op = document.getElementById('userList').options[selectedIndex].text; //ir buscar nome do oponente
		var parts = op.split(' ');
		if(parts[1] == curPlayer){
			alert("Por favor selecione outro jogador")
		}
		else if(curPlayer == null){
			alert("Por favor faça Log In")
		}
		else{
			SendGameRequest(op); //apos verificar as restrições todas, envia o pedido
		}
	}
}

function cancelRequest(){
	cancelInvite();
}


function removeTimer(){
	document.getElementById("timerPopup").style.display = "none";
	document.getElementById("blanket").style.display = "none";
	document.getElementById("logOutBut").disabled = false;
	document.getElementById("input").disabled = false; 
	document.getElementById("typeSelect").disabled = false; 
	document.getElementById("logInBut").disabled = false; 
	document.getElementById("sendGameBut").disabled = false;
	TimerActive = false;
}



function SendGameRequest(text){//auxiliar da função de enviar pedido de jogo	
	var parts = text.split(" ");
	fetch("http://localhost:8081/gameRequest_field:" + curPlayer + "_field:" +  parts[1], {method: "POST"})
	.then(function(response){
		return(response.text().then(function(text){
			if(text == "Null"){
				alert("Utilizador não disponivel");
			}
			else{
				alert("Jogo Criado");
				document.getElementById("timerPopup").style.display = "block"; //mostrar a janela de espera de confirmação
				document.getElementById("blanket").style.display = "block";
				document.getElementById("logOutBut").disabled = true;
				document.getElementById("input").disabled = true; 
				document.getElementById("typeSelect").disabled = true; 
				document.getElementById("logInBut").disabled = true; 
				document.getElementById("sendGameBut").disabled = true; 
				TimerActive = true;
				vsPlayer = parts[1];
				StartTimer();
			}
		}));
	});

}


function CheckGameRequests(){ //verificar pedidos de jogos recebidos
	fetch("http://localhost:8081/checkGameRequest_field:" + curPlayer , {method: "POST"})
	.then(function(response){
		return(response.text().then(function(text){
			if(text == "Canceled"){
				document.getElementById("confirmRequest").style.display = "none";
				document.getElementById("blanket").style.display = "none";
				document.getElementById("logOutBut").disabled = false;
				document.getElementById("input").disabled = false; 
				document.getElementById("typeSelect").disabled = false; 
				document.getElementById("logInBut").disabled = false; 
				document.getElementById("sendGameBut").disabled = false; 
				document.getElementById("requestPlayer").innerHTML = "";
				alert("Game canceled");
			}
			if(text != "Null"){
				document.getElementById("confirmRequest").style.display = "block";
				document.getElementById("blanket").style.display = "block";
				document.getElementById("logOutBut").disabled = true;
				document.getElementById("input").disabled = true; 
				document.getElementById("typeSelect").disabled = true; 
				document.getElementById("logInBut").disabled = true; 
				document.getElementById("sendGameBut").disabled = true; 
				vsPlayer = text;
				document.getElementById("requestPlayer").innerHTML = vsPlayer;
			}
		}));
	});
}

function acceptInvite(){ //aceitar um pedido de jogo
	fetch("http://localhost:8081/acceptGameRequest_field:" + curPlayer , {method: "POST"})
	.then(function(response){
		return(response.text().then(function(text){
			if(text != "Null"){
				document.getElementById("confirmRequest").style.display = "none";
				document.getElementById("blanket").style.display = "none";
				document.getElementById("logOutBut").disabled = false;
				document.getElementById("input").disabled = false; 
				document.getElementById("typeSelect").disabled = false; 
				document.getElementById("logInBut").disabled = false; 
				document.getElementById("sendGameBut").disabled = false; 
				document.getElementById("requestPlayer").innerHTML = "";
				window.location.href = "game.html?s=" + curPlayer +"?s=" + vsPlayer +"?s=" + vsPlayer + "?s=erj";
			}
		}));
	});
}


function cancelInvite(){//cancelar um pedido de jogo
	fetch("http://localhost:8081/cancelGameRequest_field:" + curPlayer , {method: "POST"})
	.then(function(response){
		return(response.text().then(function(text){
			if(text != "Null"){
				document.getElementById("confirmRequest").style.display = "none";
				document.getElementById("blanket").style.display = "none";
				document.getElementById("logOutBut").disabled = false;
				document.getElementById("input").disabled = false; 
				document.getElementById("typeSelect").disabled = false; 
				document.getElementById("logInBut").disabled = false; 
				document.getElementById("sendGameBut").disabled = false; 
				document.getElementById("requestPlayer").innerHTML = "";
				alert("game canceled");
			}
		}));
	});
}



//###########################################################



var playerStatus = setInterval(function(){
	GetPlayerStatus(); //atualizar o estado do jogador
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



function GetPlayerStatus(){ //atualizar o estado do jogador
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
				window.location.href = "game.html?s=" + curPlayer +"?s=" + vsPlayer + "?s=" + curPlayer + "?s=psj";
			}
			else if(text == "erj" && curState != "erj"){
				window.location.href = "game.html?s=" + curPlayer +"?s=" + vsPlayer + "?s=" + vsPlayer + "?s=esj";	
			}

		}));
	});	
}
