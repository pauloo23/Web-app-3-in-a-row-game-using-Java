package Game;


public class Player {
	private String name; //nome do utilizador
	private String type; //se é aluno, professor, ou outro
	private String state;
	
	public Player(String name, String type) {
		this.name = name;
		this.type = type;
		this.state = "l";
	}
	
	public String getName () {
		return this.name;
	}

	public String getType() {
		return this.type;
	}
	
	public String GetState() {
		return this.state;
	}
	
	public void SetState(String nState) {
		this.state = nState;
	}
	
}
