<?php
$url = 'https://fcm.googleapis.com/fcm/send';
$YOUR_API_KEY = 'AAAAzGOI638:APA91bGgSAMM9tN_d79Ekvf9L4G4a5GiilUU-oMxS4aFzQg_BRwEBmmU4ypx4IrOBY7Oz6D7U4-0rmpxe3SPry5lTis2kwT2F7P49rdrYtlapM5y5YR1jg5drjyM8t1TFCjgILnqn-no'; 
$YOUR_TOKEN_ID = 'fDzPWBLSwi8:APA91bGdKi2r1axkmdVtXQzJ48IXRnSk9U3EfAeochEJYyx5UBMrsUiqVFP7dJGExbMe7O40sVPUn6-SMZPEz4dt6BmwxaQGdMaEV2C0Zo7mVxRRykbYQkN7XiOCbmzwX_PlH6yij4ND'; 

$request_body = array{
	'notification': {
        'title' => 'Заголовок новости', //.
        'body' => 'lead новости', //.
        'icon' => '', //картинка новости 192х192 пикселя
        'click_action' => 'https://glavkniga.ru', //url новости
	},
	'time_to_live': 60*60*24, //Время жизни
    'to' => $YOUR_TOKEN_ID
}

$fields = json_encode($request_body);

$request_headers = [
    'Content-Type: application/json',
    'Authorization: key=' . $YOUR_API_KEY,
];

$ch = curl_init();
curl_setopt($ch, CURLOPT_URL, $url);
curl_setopt($ch, CURLOPT_CUSTOMREQUEST, 'POST');
curl_setopt($ch, CURLOPT_HTTPHEADER, $request_headers);
curl_setopt($ch, CURLOPT_POSTFIELDS, $fields);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_FOLLOWLOCATION, true);
$response = curl_exec($ch);
curl_close($ch);

echo $response;
?>
