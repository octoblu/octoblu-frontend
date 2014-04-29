#Admin Page Invitation Design

##Entities

Invitation
  	Recipient : {
  		email : [email]
		uuid : [UUID]
  	}
  from : UUID
  group : UUID
  status : [ PENDING, ACCEPTED]
  sent : DateTime
  completed : DateTime
  

### Data Storage
Create a new collection from invitations this should be separate from the existing invitations.

### Backend Routes

/user/:id/:token/invitations GET
    response : [
	  Invitations or empty list
	
	]
 
/user/:id/:token/invitations PUT
   data :{
	   
      recipient : {
	    email : [emailAddress]
	  }
	  group : {
	    uuid : [UUID]
	  }
   }
   
   response : {
     Recipient {
	 
	 }
	 from : UUID
	 group: UUID
	 STATUS : [PENDING, COMPLETE ] 
	 sent : DateTime
	 completed : DateTime   
   }

 ##### GET /user/:id/:token/invitations/

 get the list of all the invitations sent and received by the user

 ##### DEL /user/:id/:token/invitations/:invitationId
 Remove the invitation

