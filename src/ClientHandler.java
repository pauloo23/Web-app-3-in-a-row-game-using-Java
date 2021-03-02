import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.net.Socket;
import java.util.StringTokenizer;
import java.net.MalformedURLException;
import java.rmi.Naming;
import java.rmi.NotBoundException;
import java.rmi.RemoteException;


import Interface.RMIInterface;

public class ClientHandler extends Thread {
	
	Socket ligacao;
	BufferedReader in;
	private static RMIInterface look_up;
	
	public ClientHandler(Socket ligacao) throws IOException, MalformedURLException, RemoteException, NotBoundException  {
		this.ligacao = ligacao;
		look_up = (RMIInterface) Naming.lookup("//localhost/MyServer");
		try{	
			this.in = new BufferedReader (new InputStreamReader(ligacao.getInputStream()));
		} 
		catch (IOException e) {
			System.out.println("Erro na execucao do servidor: " + e);
			System.exit(1);
		}
	}
	
	public void run() {                
		try {
			System.out.println("Aceitou ligacao de cliente no endereco " + ligacao.getInetAddress() + " na porta " + ligacao.getPort());
			
			String httpResponse="";
			String msg = in.readLine();
			System.out.println("Request=" + msg);
			
			StringTokenizer tokens = new StringTokenizer(msg);
			String metodo = tokens.nextToken();
			
			if (metodo.equals("GET")) {
				try{
				//executa um get e faz as operações necessarias
				String ansGet = AnswerGet(tokens.nextToken());
				//consuante falhe ou nao, envia uma mensagem para o browser
				if(ansGet.equals("Failed"))
					httpResponse = FailAnswer();
				else
					httpResponse = SucessAnswer(ansGet);

				ligacao.getOutputStream().write(httpResponse.getBytes("UTF-8"));
				}
				catch(Exception e){
					System.out.println("Erro.");
				}
			}
			else if(metodo.equals("POST")) {
				try{
					//executa um post e faz as operaçoes necessarias
					String ansPost = AnswerPost(tokens.nextToken());
					//consuante falhe ou nao, envia uma mensagem para o browser
					if(ansPost.equals("Failed"))
						httpResponse = FailAnswer();
					else
						httpResponse = SucessAnswer(ansPost);

					ligacao.getOutputStream().write(httpResponse.getBytes("UTF-8"));
				}
				catch(Exception e){
					System.out.println("Erro.");
				}
			}
			else 
				System.out.println("201;method not found");
				
			in.close();
			ligacao.close();
		} catch (IOException e) {
			System.out.println("Erro na execucao do servidor: " + e);
			System.exit(1);
		}
	}
	
	
	private String AnswerPost(String token) throws MalformedURLException, RemoteException, NotBoundException {
			//divide o pedido pelos caracters "_field", ate um maximo de 5 partes
			String[] stringParts = token.split("_field:",5);
			if(stringParts[0].equals("/logIn")) //registar um utilizador
				return this.look_up.AddPlayer(stringParts[1], stringParts[2]);
			else if (stringParts[0].equals("/logOut")) //adicionar uma mensagem
				return this.look_up.RemovePlayer(stringParts[1]);
			else if(stringParts[0].equals("/gameRequest"))
				return this.look_up.AddGame(stringParts[1], stringParts[2]);
			else if(stringParts[0].equals("/checkGameRequest"))
				return this.look_up.GetGame(stringParts[1]);
			else if(stringParts[0].equals("/acceptGameRequest"))
				return this.look_up.AcceptGame(stringParts[1]);
			else if(stringParts[0].equals("/cancelGameRequest"))
				return this.look_up.CancelGame(stringParts[1]);
			else if(stringParts[0].equals("/getPlayerStatus"))
				return this.look_up.GetPlayerStatus(stringParts[1]);
			else if(stringParts[0].equals("/makeMove"))
				return this.look_up.MakeMove(stringParts[1], stringParts[2], stringParts[3]);
			else
				return "Failed";
	}
	
	private String AnswerGet(String token) throws MalformedURLException, RemoteException, NotBoundException {
		String[] stringParts = token.split("_field:",5);
		if(stringParts[0].equals("/getPlayers")) //consulta todos os utilizadores
			return this.look_up.GetAllPlayers();
		else if(stringParts[0].equals("/getGameStatus"))
			return this.look_up.GetGameStatus(stringParts[1], stringParts[2]);
		else
			return "Failed";
	}
	
	private String SucessAnswer(String ans) {
		//mensagem de sucesso
		String response ="HTTP/1.1 200 OK\r\n";
		response += "Content-Length: " + ans.length() + "\r\n";
		response += "Content-type: text/html";
		response += "\r\nAccess-Control-Allow-Origin: *\r\n\r\n";
		response += ans;
		
		return response;
	}
	
	private String FailAnswer() {
		//mensagem em caso de falha
		String response ="HTTP/1.1 400 ERROR\r\n";
		response += "Content-type: application/json \\r\\n";
		response += "Access-Control-Allow-Origin: *\\r\\n\\r\\n";
		
		return response;
	}
}