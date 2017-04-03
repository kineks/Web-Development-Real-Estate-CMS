<?php
session_start();
$default ="test";
$serverResponse = [];
$message="";


// Divs we will depending on the access rights.


function loginButton(){
  $divsToAppend = "<div id='btnLoggin' class='menuHolder link' data-go-to='wdw-login'><div class='fa-marginMenu fa fa-user fa-fw '></div><p>Login</p></div>";
  $position = "top";


  sendValues($divsToAppend, $position);

}

function createProperty(){
  $divsToAppend ="<div id='lbl-userAndProperties' class='menuHolder link'  data-go-to='wdw-properties'><div class='fa-marginMenu fa fa-list fa-fw'></div>  <p>Property List</p>  </div>  <div class='menuHolder link' data-go-to='wdw-users'><div class='fa-marginMenu fa fa-user fa-fw'></div> <p>User List</p></div>";
  $position = "top";

  sendValues($divsToAppend, $position);
}



function logoutButton(){
  $divsToAppend = "<div id='btnCreateProperty' class='menuHolder link' data-go-to='wdw-create-property'><div class='fa-marginMenu fa fa-home fa-fw '></div><p>Create Property</p>";
  $position = "bottom";


  sendValues($divsToAppend, $position);

}



if ( $_SESSION["accessrights"] == 3 ){
  // We asign a value to the message we're sending back and putting it into a JSON object
  // We set the message value equal to the divs we want to append
createProperty();
logoutButton();
echoFinal();
  }

else if( $_SESSION["accessrights"] == 2 ){
  createProperty();
    echoFinal();
  }
else {
  echo '{"divsToAppend":"'.$divsToAppend.'"}';
}







function sendValues($finalDivs, $position){


$message = json_decode('{}');
$message->divsToAppend = $finalDivs;
$message->position = $position;
global $serverResponse;
array_push($serverResponse, ($message));

};

function echoFinal(){
  global $serverResponse;
  echo json_encode($serverResponse);
}


//for($i=0 ; $i<count($serverResponse) ; $i++){



?>