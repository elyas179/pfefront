function User(props){

if(props.isLoggedIn){
return <h2> bienvenue {props.username}</h2>

}
else{
return <h2> svp logged in yaaaw</h2>

}

}export default User