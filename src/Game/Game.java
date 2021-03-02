package Game;

public class Game {
	private Player player1;
	private Player player2;
	private char[][] map;
	
	public Game(Player player1, Player player2) { //cria um novo jogo
		this.player1 = player1;
		this.player2 = player2;
		this.map = new char[3][3];
		
		//cria um novo mapa de jogo com o caracter . para significar espaço vazio
		for(int i=0; i!=3; i++)
			for(int j=0; j!=3; j++)
				this.map[i][j] = '.';
	}
	
	public String GetAskingPlayer() { //retorna o nome do primeiro jogador
		return this.player1.getName();
	}
	
	public Player GetFirstPlayer() { //retorna o primeiro jogador
		return this.player1;
	}
	
	public String GetReceivingPlayer() {//retorna o nome do segundo jogador
		return this.player2.getName();
	}
	
	public Player GetSecondPlayer() { //retorna o segundo jogador
		return this.player2;
	}
	
	public void MakeMove(String place, char n) { //executa uma jogada
		int i = 0;
		int j = 0;
		
		//verifica qual a linha de jogo
		if(place.charAt(0)=='A') {
			i=0;
		}
		else if(place.charAt(0)=='B') {
			i=1;
		}
		else if(place.charAt(0)=='C') {
			i=2;
		}
		//coluna de jogo
		j = Character.getNumericValue(place.charAt(1)) -1;
		
		this.map[i][j]=n; //faz a jogada
	}
	
	public String GetGameStatus() {
		String ans = "";
		
		for(int i = 0; i!=3; i++)//verifica se o jogador venceu numa coluna
			if(this.map[i][0] == this.map[i][1] && this.map[i][1] == this.map[i][2] && this.map[i][0]!='.')
				if(this.map[i][0] == 'x')
					return "1 wins";
				else
					return "2 wins";
		
		for(int i = 0; i!=3; i++) //verifica se o jogador venceu numa linha
			if(this.map[0][i] == this.map[1][i] && this.map[1][i] == this.map[2][i] && this.map[0][i]!='.')
				if(this.map[0][i] == 'x')
					return "1 wins";
				else
					return "2 wins";
		
		//verifica uma diagonal
		if(this.map[0][0] == this.map[1][1] && this.map[1][1] == this.map[2][2] && this.map[0][0]!='.')
			if(this.map[0][0] =='x')
				return "1 wins";
			else
				return "2 wins";
		//verifica diagonal inversa
		if(this.map[0][2] == this.map[1][1] && this.map[1][1] == this.map[2][0]  && this.map[0][2]!='.')
			if(this.map[0][2] =='x')
				return "1 wins";
			else
				return "2 wins";
		
		boolean tie = true;
		//verificar se o já nao existem jogadas possiveis, portanto o jogo acabou empatado
		for(int i = 0; i!=3; i++)
			for(int j=0;j!=3;j++)
				if(this.map[i][j] == '.') {
					tie = false;
				}
		
		if(tie == true)
			return "Tie";
		
		//se nenhuma das condições anteriores se verificar, o jogo ainda esta a decorrer, entao devolve o estado atual do jogo
		for(int i = 0; i!=3; i++)
			for(int j=0;j!=3;j++)
				ans += this.map[i][j] + " ";
		
		return ans;
	}
	
}
