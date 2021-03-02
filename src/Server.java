import java.rmi.Naming;
import java.rmi.RemoteException;
import java.rmi.server.UnicastRemoteObject;

import Interface.RMIInterface;
import Game.Game;
import Game.GameList;
import Game.Player;
import Game.PlayerList;

public class Server extends UnicastRemoteObject implements RMIInterface{
	private static final long serialVersionUID = 1L;
	private PlayerList playerList;
	private GameList gameList;

	protected Server() throws RemoteException {
		super();
		this.playerList = new PlayerList();
		this.gameList = new GameList();
	}
	
	public static void main(String[] args){
		try {
			Naming.rebind("//localhost/MyServer", new Server());            
            System.err.println("Server ready");
            
        } catch (Exception e) {
        	System.err.println("Server exception: " + e.toString());
          e.printStackTrace();
        }
	}


	//Post Methods
	@Override
	public String AddPlayer(String name, String type) throws RemoteException{
		return this.playerList.AddPlayer(name, type);
	}

	@Override
	public String RemovePlayer(String userId) throws RemoteException{
		return this.playerList.RemovePlayer(userId);
	}
	
	@Override
	public String AddGame(String player1, String player2) throws RemoteException{
		return this.gameList.AddGame(this.playerList.GetPlayerByName(player1), this.playerList.GetPlayerByName(player2));
	}
	
	@Override
	public String GetGame(String playerName) throws RemoteException{
		return this.gameList.GetGame(this.playerList.GetPlayerByName(playerName));
	}
	
	@Override
	public String AcceptGame(String playerName) throws RemoteException{
		return this.gameList.AcceptGame(this.playerList.GetPlayerByName(playerName));
	}
	
	@Override
	public String CancelGame(String playerName) throws RemoteException{
		return this.gameList.CancelGame(this.playerList.GetPlayerByName(playerName));
	}
	
	@Override
	public String GetPlayerStatus(String playerName) throws RemoteException{
		return this.playerList.GetPlayerStatus(playerName);
	}
	
	@Override
	public String MakeMove(String player1, String player2, String play) throws RemoteException{
		return this.gameList.MakeMove(player1, player2, play);
	}

	//Get Methods
	
	@Override
	public String GetAllPlayers() throws RemoteException{
		return this.playerList.GetAllPlayers();
	}
	
	@Override
	public String GetGameStatus(String player1, String player2) throws RemoteException{
		String ans = this.gameList.GetGameStatus(player1, player2);
		String[] parts = ans.split(" ");
		if(parts[0].equals("Tie")){
			this.playerList.RemovePlayer(this.playerList.GetPlayerIdByName(player1));
			this.playerList.RemovePlayer(this.playerList.GetPlayerIdByName(player2));
		}
		else if(parts.length == 2){
			if(parts[1].equals("wins")){
				this.playerList.RemovePlayer(this.playerList.GetPlayerIdByName(player1));
				this.playerList.RemovePlayer(this.playerList.GetPlayerIdByName(player2));
			}
		}
		return ans;
	}

}
