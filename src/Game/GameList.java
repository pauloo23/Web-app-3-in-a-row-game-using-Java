package Game;

import java.util.Hashtable;
import java.util.UUID;

public class GameList {
	private Hashtable<String, Game> curGames;
	private String curAns;

	public GameList() {
		curGames = new Hashtable<String, Game>();
	}
	
	public String AddGame(Player player1, Player player2) {//consuante 2 jogadores, adiciona um jogo aos jogos existentes
		if(player2.GetState().equals("l")) {
			player1.SetState("ecc");
			Game g = new Game(player1, player2);
			String id = UUID.randomUUID().toString();
			this.curGames.put(id,g);
			return id;	
		}
		else {
			return "Null";
		}
	}
	
	public String GetGame(Player player) {//devolve o jogo que um jogador neste momento esta a jogar
		this.curAns = "Null";
		if(player!=null) {
			if(player.GetState().equals("l")) {
				curGames.forEach((k,v) ->{
					if(v.GetReceivingPlayer().equals(player.getName())) {
						this.curAns = v.GetAskingPlayer();
						player.SetState("rc");
					}
				});
			}	
		}
		
		return this.curAns;
	}
	
	public String CancelGame(Player player) { //cancela o pedido de jogo e remove o da lista de jogos
		this.curAns = "Null";
		if(player!=null) {
			curGames.forEach((k,v) ->{
				if(v.GetReceivingPlayer().equals(player.getName()) || v.GetAskingPlayer().equals(player.getName())) {
					this.curAns = v.GetAskingPlayer();
					v.GetFirstPlayer().SetState("n");
					v.GetSecondPlayer().SetState("n");
					this.curAns = v.GetFirstPlayer().getName();
					this.curGames.remove(k,v);
				}
			});	
		}
		
		return this.curAns;
	}
	
	public String AcceptGame(Player player) {//quando o jogador aceita jogar o jogo
		this.curAns = "Null";
		if(player!=null) {
			this.curGames.forEach((k,v) ->{
				if(v.GetReceivingPlayer().equals(player.getName())) {
					this.curAns = v.GetAskingPlayer();
					v.GetFirstPlayer().SetState("psj"); //atualizar estados para ficarem a pronto e jogar, e espera de jogada
					v.GetSecondPlayer().SetState("erj");
					this.curAns = v.GetFirstPlayer().getName();
				}
			});	
		}
		
		return this.curAns;
	}
	
	public String MakeMove(String Player1, String Player2, String play) {//fazer uma nova jogada no tabuleiro
		curGames.forEach((k,v) ->{
			if(Player1.equals(v.GetAskingPlayer()) && Player2.equals(v.GetReceivingPlayer())){
				v.MakeMove(play, 'x'); //aplicar a jogada
				v.GetFirstPlayer().SetState("erj"); //atualizar estados
				v.GetSecondPlayer().SetState("psj");
			}
			else if(Player2.equals(v.GetAskingPlayer()) && Player1.equals(v.GetReceivingPlayer())) {
				v.MakeMove(play, 'o'); //aplicar a jogada
				v.GetSecondPlayer().SetState("erj"); //atualizar estados
				v.GetFirstPlayer().SetState("psj");
			}
		});
		
		return "";
	}
	
	public String GetGameStatus(String Player1, String Player2) { //encontra o jogo a ser jogado atualmente e devolve o estado do mesmo
		this.curAns = "Null";
		
		curGames.forEach((k,v) ->{
			if((Player1.equals(v.GetAskingPlayer()) && Player2.equals(v.GetReceivingPlayer())) ||
			  (Player2.equals(v.GetAskingPlayer()) && Player1.equals(v.GetReceivingPlayer()))) {
				this.curAns = v.GetGameStatus();
			}
		});
		return this.curAns;
	}
}
