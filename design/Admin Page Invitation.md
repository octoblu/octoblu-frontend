# Admin Page Invitation Design

##Entities

	Invitation
	    Recipient : {
		email : [email]
		uuid : [UUID]
	    }
	from : UUID
	group : UUID //the UUID of the group that the recipient will be added to
	status : [ PENDING, ACCEPTED]
	sent : DateTime
	completed : DateTime
  

## Data Storage
Create a new collection from invitations this should be separate from the existing invitations.

## Backend Routes

*Find All Invitations
	
	/api/user/:id/:token/invitations GET
	response : Array of Invitations or Empty List

*Find All Invitations sent by the user	

	/api/user/:id/:token/invitations/sent


*Find all Invitations received by the user

	/api/user/:id/:token/invitations/received
 
 
*Send an Invitation
 
	/api/user/:id/:token/invitation PUT
	data :{ 
      recipient : {
	    email : [emailAddress]
	  }
	  group : {
	    uuid : [UUID]
	  }
	}
	
	response : {
     recipient : {
	   email : [email]
	   uuid:[UUID]
	 }
	 from : UUID
	 group: UUID
	 STATUS : [PENDING, COMPLETE ] 
	 sent : DateTime
	 completed : DateTime   
	}

*Delete an Invitation

	/api/user/:id/:token/invitations/:invitationId DEL
	Response : HTTP Response Status codes
	{
	  SUCCESS : [TRUE or FALSE]
	  MESSAGE : [Will be populated if SUCCESS is false. Will contain the error message
	}


*
