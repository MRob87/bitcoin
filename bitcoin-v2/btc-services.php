<?php

$c = curl_init();
curl_setopt($c, CURLOPT_RETURNTRANSFER, 1);
curl_setopt($c, CURLOPT_HTTPHEADER, array('Accept: application/json', 'Content-Type: application/json'));
curl_setopt($c, CURLOPT_URL, 'https://btc-e.com/api/2/btc_usd/ticker');
	
$data = curl_exec($c);
curl_close($c);

echo $data;
?>
