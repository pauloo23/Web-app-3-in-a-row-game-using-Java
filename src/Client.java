import java.net.ServerSocket;
import java.net.Socket;
import java.io.IOException;

public class Client {

	static int DEFAULT_PORT=8081;
	
    public static void main(String[] args) throws Exception {
    	int port;
    	if(args.length>0)
    		port=Integer.parseInt(args[0]);
    	else 
    		port = DEFAULT_PORT;
    	
    	ServerSocket server  = new ServerSocket(port);
        
        System.out.println("Listening for connection on port :" + port + " ....");
        //init server
        while (true) {
            Socket sck=null;
            try {
            	sck = server.accept();
            	//Thread
            	ClientHandler t = new ClientHandler(sck);
				t.start();
            }catch(IOException E){
            	System.out.println("Não foi possível criar socket Erro: " + E);
                server.close();
            	System.exit(1);
            
            }
        }
    }
}
