package Interface;

import java.rmi.Remote;
import java.rmi.RemoteException;

public interface RMIInterface extends Remote {

	//Post Methods
	public String AddPlayer(String name, String type) throws RemoteException;
	public String RemovePlayer(String userId) throws RemoteException;
	public String AddGame(String player1, String player2) throws RemoteException;
	public String GetGame(String playerName) throws RemoteException;
	public String AcceptGame(String playerName) throws RemoteException;
	public String CancelGame(String playerName) throws RemoteException;
	public String GetPlayerStatus(String playerName) throws RemoteException;
	public String MakeMove(String player1, String player2, String play) throws RemoteException;

	//Get Methods
	public String GetAllPlayers() throws RemoteException;
	public String GetGameStatus(String player1, String player2) throws RemoteException;
}