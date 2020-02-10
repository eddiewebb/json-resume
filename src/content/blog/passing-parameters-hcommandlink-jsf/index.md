---
title: 'Passing Parameters with h:commandLink in JSF'
date: Tue, 13 Jul 2010 19:47:57 +0000
draft: false
tags: [commandAction, java, JSF, MIsc.Tips]
---

I have been growing fond of JSF as of late, but was stumped by the simplest task. How do I associate some value with a link? If I was using PHP I would just append a query parameter and grab the value. But with JSF it's all done inside our xhtml files, so how do we set a value based on the link clicked? Just use

inside the commandAction. This stores any expression into the specified bean's property. See below for a full faces example. Each Player link will set the backing Bean's player object before calling the action.

pageTitle
appTitle
content

 Team Management
	
	
	Affinity Management Plus (Basketball)

	
	 #{team.teamName}  Player Summary
---------------------------------

		

		 *    
                          - 	
		  

	
	
		

 #{team.teamName} Game Summary
------------------------------

		
		 ### Played #{game.date} against #{game.team2.teamName}

				
				 ### Stats for 
                 	#{entry.key.name} 	
					

					    

					        

1
					        

					        

2
					        

					        

3
					        

					        

fouls	
					        

					        

steals
					        

					        

rebounds
					        

					        

minutes
					        

					    

					    

					        

#{entry.value.onePointers}
					        

					        

#{entry.value.twoPointers}
					        

					        

#{entry.value.threePointers}
					        

					        

#{entry.value.fouls}
					        

					        

#{entry.value.steals}
					        

					        

#{entry.value.rebounds}
					        

					        

#{entry.value.minutesPlayed} 

import java.util.Iterator;
import java.util.LinkedList;
import java.util.List;

import javax.faces.event.ActionEvent;
import javax.faces.model.SelectItem;

import com.libertymutual.amp.basketball.DAO.GameDAO;
import com.libertymutual.amp.basketball.DAO.PlayerDAO;
import com.libertymutual.amp.basketball.DAO.TeamDAO;

public class TeamProcessor {
	//Business MOdels (used for temporary associations and datastore)
	private Team team= new Team();
	private Player player=new Player();
	private Game game=new Game();
	private Statistic statistic = new Statistic();
	
	private CumulativeStatistic cumaltiveStat= new CumulativeStatistic();
	
	private Team team2= new Team();
	private List opponents = new LinkedList();
	private TeamDAO teamDAO = new TeamDAO();
	private PlayerDAO playerDAO = new PlayerDAO();
	private GameDAO gameDAO = new GameDAO();
	
	//authorization
	private List users= new LinkedList();
	private String tmpName="";
	private String tmpPass="";
	private boolean isAuthorized=false;
	

	//expose properties to jsf
	public Game getGame() {
		return game;
	}

	public void setGame(Game game) {
		this.game = game;
	}

	public Statistic getStatistic() {
		return statistic;
	}

	public void setStatistic(Statistic statistic) {
		this.statistic = statistic;
	}

	public List getUsers() {
		return users;
	}

	public void setUsers(List users) {
		this.users = users;
	}

	public String getTmpName() {
		return tmpName;
	}

	public void setTmpName(String tmpName) {
		this.tmpName = tmpName;
	}

	public String getTmpPass() {
		return tmpPass;
	}

	public void setTmpPass(String tmpPass) {
		this.tmpPass = tmpPass;
	}

	public Player getPlayer() {
		return player;
	}

	public void setPlayer(Player player) {
		this.player = player;
	}

	public  Team getTeam() {
		return team;
	}

	public void setTeam(Team team) {
		this.team = team;
	}

	public void setTeam2(Team team2) {
		this.team2 = team2;
	}

	public Team getTeam2() {
		return team2;
	}
	
	public List getOpponents() {
		return opponents;
	}

	public void setOpponents(List opponents) {
		this.opponents = opponents;
	}

	public TeamProcessor(){
		// set valid users
		User eddie = new User();
		eddie.setName("eddie");
		eddie.setPassword("1234");
		users.add(eddie);
		
		
		opponents = new LinkedList();
        for (Team team : teamDAO.list()) {
            opponents.add(new SelectItem(team,team.getTeamName()));
        }

	
	}
	
	/*
	 * 
	 * Action Methods
	 */

	public String processTeam(){
		if(!isAuthorized)return "invalid-login";
		String result= "success";
		return result ;
	}

	public String processPlayer(){
		System.out.println(">>> processPlayer");
		if(!isAuthorized)return "invalid-login";
		String result= "error";
		if( team.addPlayer(player)){
			result="success";
			playerDAO.addPlayer(player);
			System.out.println("Added: "+player.getName());
		}
		player=new Player();
		System.out.println("<<< processPlayer");
		
		return result;
	}

	public String processPlayerAndAddAnother(){	
		System.out.println(">>> processPlayerAndAddAnother");
		if(!isAuthorized)return "invalid-login";
		processPlayer() ;
		System.out.println("<<< processPlayerAndAddAnother");
		
		return null;
	}
	public String processPlayerDoner(){	
		return "success";
	}
	
	
	public String loginAction(){
		String result="invalid-login";
		for(User user : users){
			if(tmpName.equals(user.getName())
					&&
			tmpPass.equals(user.getPassword())){
				result = "success";
				isAuthorized=true;
			}
		}
		return result;
	}
	
	public String processGame(){
		System.out.println(">>> processGame");
		String result="error";
		game.setTeam1(this.team);
		game.setTeam2(team2);
		if(team.addGame(game)){
			gameDAO.addGame(game);
			result="success";
			game=new Game();
		}
		
		System.out.println("<<< processGame:"+result);
		
		return result;
	}
	
	public String processGameStats(){
		
		game.addGameStat(player, statistic);
		System.out.println(">>> processGameStats: " + game.getTeam2().getTeamName()+player.getName()+statistic.getFouls());
		player=new Player();
		statistic=new Statistic();
		game=new Game();
		return null;
		
	}
	
	public String finishGameStats(){
		processGameStats();
		return "success";
	}

	public String preparePlayerAction(){
		String result = "error";
		System.out.println("playerAction>>>");

		System.out.println("Player:"+player.toString());
		System.out.println("team:"+team.toString());
		for( Game game : team.getGames()){
			Statistic stat = game.getGameStatistic(player);
			if (stat != null){
				cumaltiveStat.addStatistic(stat);
			}
			result="success";
		}		
		System.out.println("CS:"+cumaltiveStat.getAverage(cumaltiveStat.getFouls()));
		System.out.println("playerAction<<<");
		return result;
	}
	
	public void preparePlayerListener(ActionEvent ae){
		System.out.println("playerListener>>>");
		for (Iterator iterator = ae.getComponent().getAttributes().entrySet().iterator(); iterator.hasNext();) {
			Object o = iterator.next();
			System.out.println(o.toString());
			
		}
		System.out.println("Player:"+player.toString());
		System.out.println("playerListener<<<");
	}

	public CumulativeStatistic getCumaltiveStat() {
		return cumaltiveStat;
	}

	public void setCumaltiveStat(CumulativeStatistic cumaltiveStat) {
		this.cumaltiveStat = cumaltiveStat;
	}
	

	
	
	
	
	
	
}
