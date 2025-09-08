import ngrok from "ngrok"
( async  function ( )  { 
    await ngrok.authtoken("32Pa80lmOvyUCyIDRGzuXZD3um1_67AFDvFsCbpnFBnb7bz1S")
  const  url  =  await  ngrok . connect (3000) ; 
  console.log(url)
  } ) ( ) ;