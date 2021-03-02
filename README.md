# Web-app-3-in-a-row-game-using-Java
#Java web app to play 3 in a row game 
#Explanation:
#register users:
#when a user logs in it is added to the list of users, if he fulfills the conditions for having a valid name (having a name with more than 3 characters, and not being a repeated name)
#when a user logs out it is removed from the server's user list
#if a user registers in the same session as another user, the previous user is removed from the user list because his session is terminated
#every second, the list of server users is consulted to see if it has changed and thus updating the list in the project's html
#send game requests:
#when submitting a game request, the user sends the request to the server that registers the new game
#every second, each session tries to check if there are pending game requests, and if it has warns the player in question so that he can verify or reject the request
#if the user who sent the invitation cancels the game, this leaves both the user and the invited user free, and therefore valid to accept or send new requests
#if the user who received the request cancels the game, both are the same, available for new orders
#if the ordering time runs out, the order is also canceled
#finally, if the invited user accepts the request the game is started, it changes if the html page for the game page and in the url of the page follow relevant #information: -> playerCurrent, playerOpponent, first player
#start Game:
#the first player is always the player who sent the request, he plays with the X's during the game
#the second player cannot make a move because the game is blocked for this
#as soon as the first player makes a move it is recorded on the server, and the status of the two players is updated
#when updating the status changes if the state of ready to submit a move, to wait for a move, and vice versa
#therefore, at this moment it is the second player who can submit a move and the first has the game blocked
#as soon as the game is won by one of the players, or all possible moves have been played, the game is over and the page is redirected to the home page
