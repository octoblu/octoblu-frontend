#Admin Page Invitation Design

##Entities

Invitation
  	Recipient : {
  		email : [email]
		uuid : [UUID]
  	}
  from : UUID
  group : UUID
  status : [ PENDING, ACCEPTED, IGNORED]
  sent : DateTime
  completed : DateTime
  
  
### Backend Routes

/user/:id/invitations GET
    response : [
	  Invitations or empty list
	
	]
 
/user/:id/invitations PUT 
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

 ##### GET /user/:id/invitations/:invitationId

 get the list of all the invitations sent and received by the user

 ##### DEL /user/:id/invitations/:invitationId

