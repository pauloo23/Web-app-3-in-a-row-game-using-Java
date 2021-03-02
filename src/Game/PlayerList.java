package Game;

import java.util.Hashtable;
import java.util.UUID;

public class PlayerList {
	//jogadores registados
	private Hashtable<String, Player> presentIPs;
	private String curAns;
	private Player retPlayer;
	
	public PlayerList() {
		presentIPs = new Hashtable<String, Player>();
	}
	
	public String AddPlayer(String name, String type) {
		Player p = new Player(name, type);
		curAns = UUID.randomUUID().toString();
		
		presentIPs.forEach((k,v) ->{
			if(name.equals(v.getName())) {
				curAns = "Null"; //verifica se ja existe um jogador registado com o mesmo nome
			}
		});
		
		if(curAns != "Null")
			presentIPs.put(curAns, p);
		
		return curAns;
	}
	
	public String RemovePlayer(String userId) {
		if(this.presentIPs.containsKey(userId)) {
			this.presentIPs.remove(userId); //se o jogador existir, remove o
			return "user removed";
		}
		
		return "user not found";
	}
	
	public String GetAllPlayers() {
		this.curAns = "";
		//constroi a lista com todos os utilizadores para ser apresentada no browser
		presentIPs.forEach((k,v) ->{
			this.curAns += v.getType() + ": " +  presentIPs.get(k).getName() + ",";
		});

		return this.curAns;
	}
	
	public Player GetPlayerByName(String name) {
		presentIPs.forEach((k,v) ->{
			if(name.equals(v.getName())){ //verifica se o nome é igual ao desejado, e se for retorna este jogador
				this.retPlayer = v;
			}
		});
		
		return this.retPlayer;
	}
	
	public String GetPlayerIdByName(String name) {
		presentIPs.forEach((k,v) ->{
			if(name.equals(v.getName())){ //verifica se o nome é igual ao desejado, e se for retorna este jogador
				this.curAns = k;
			}
		});
		
		return this.curAns;
	}
	
	public String GetPlayerStatus(String name) {//devolve o estado atual do jogador
		presentIPs.forEach((k,v) ->{
			if(name.equals(v.getName())){
				if(v.GetState().equals("n")) { //estado adicionado a lista de estados 'n', significa um jogador que negou um convite para jogar
					this.curAns = "Canceled";
					v.SetState("l");
				}
				else if(v.GetState().equals("psj")) {
					this.curAns = "psj";
				}
				else if(v.GetState().equals("erj")) {
					this.curAns = "erj";
				}
			}
		});
		
		return this.curAns;
	}
}
