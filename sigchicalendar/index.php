<?php
error_reporting(E_ALL);
ini_set('display_errors', 'On');
if(isset($_GET["t"]) && $_GET["t"]=="json"){
	header('Content-type: application/json');
}else if(isset($_GET["t"]) && $_GET["t"]=="ics"){
	header('Content-type: text/calendar; charset=utf-8');
	header('Content-Disposition: inline; filename=calendar.ics');
	include 'ICS.php';

	$ical = "BEGIN:VCALENDAR\r\nVERSION:2.0\r\nPRODID:-//Mirko Gelsomini//NONSGML Event Calendar//EN\r\nURL:http://mirko.gelsomini.info/sigchicalendar/\r\nNAME:SIGCHI Conferences and Deadlines\r\nX-WR-CALNAME:SIGCHI Conferences and Deadlines\r\nDESCRIPTION:SIGCHI Conferences and Deadlines\r\nX-WR-CALDESC:SIGCHI Conferences and Deadlines\r\nTIMEZONE-ID:Europe/London\r\nX-WR-TIMEZONE:Europe/London\r\nREFRESH-INTERVAL;VALUE=DURATION:PT12H\r\nX-PUBLISHED-TTL:PT24H\r\nCOLOR:21:135:189\r\nCALSCALE:GREGORIAN\r\nMETHOD:PUBLISH";
}else{
	include 'ICS.php';

	$ical = "BEGIN:VCALENDAR\r\nVERSION:2.0\r\nPRODID:-//Mirko Gelsomini//NONSGML Event Calendar//EN\r\nURL:http://mirko.gelsomini.info/sigchicalendar/\r\nNAME:SIGCHI Conferences and Deadlines\r\nX-WR-CALNAME:SIGCHI Conferences and Deadlines\r\nDESCRIPTION:SIGCHI Conferences and Deadlines\r\nX-WR-CALDESC:SIGCHI Conferences and Deadlines\r\nTIMEZONE-ID:Europe/London\r\nX-WR-TIMEZONE:Europe/London\r\nREFRESH-INTERVAL;VALUE=DURATION:PT12H\r\nX-PUBLISHED-TTL:PT24H\r\nCOLOR:21:135:189\r\nCALSCALE:GREGORIAN\r\nMETHOD:PUBLISH";
}

$ch = curl_init();

curl_setopt($ch, CURLOPT_URL, "https://api-production.sigchi.org/api/calendar/event");
curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
curl_setopt($ch, CURLOPT_CUSTOMREQUEST, "GET");

curl_setopt($ch, CURLOPT_ENCODING, 'gzip, deflate');

$headers = array();
$headers[] = "Pragma: no-cache";
$headers[] = "Cookie: _ga=GA1.2.1356444172.1534403989; _gid=GA1.2.972729212.1534761732";
$headers[] = "Origin: https://ui-production.sigchi.org";
$headers[] = "Accept-Encoding: gzip, deflate, br";
$headers[] = "Accept-Language: it-IT,it;q=0.9,en-US;q=0.8,en;q=0.7";
$headers[] = "Authorization: Basic d2ViLWNsaWVudDolZlVZXiN6bSE3MkhReDYzdDU=";
$headers[] = "Accept: application/json, text/plain, */*";
$headers[] = "Cache-Control: no-cache";
$headers[] = "Authority: api-production.sigchi.org";
$headers[] = "User-Agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/68.0.3440.106 Safari/537.36";
$headers[] = "Referer: https://ui-production.sigchi.org/";
curl_setopt($ch, CURLOPT_HTTPHEADER, $headers);

$result = curl_exec($ch);
if (curl_errno($ch)) {
    echo 'Error:' . curl_error($ch);
}
curl_close ($ch);

if(isset($_GET["t"]) && $_GET["t"]=="json"){	
	echo $result;
}else{
	$contents=json_decode($result,true);
	if (is_array($contents) || is_object($contents))
	{
		foreach ($contents as $item) {
			
			if($item['name'] == "Conference") 
			{
				$summary="[CONF.] ".$item['activityName'];
				$dateend=convertdate($item['endDate'],0);
			}
			else 
			{
				$summary="[DEADLINE] ".$item['activityName'].": ".$item['name'];
				$dateend=convertdate($item['endDate'],1); //add one more day to transform it in a full day event
			}
			
			if(isset($item['location'])) 
			{
				$location=$item['location'];
			}
			else 
			{
				$location="";
			}
			
			if(isset($item['url'])) 
			{
				$url=$item['url'];
			}
			else 
			{
				$url="";
			}
			$desc = $item['activityName'].' - '.$item['name']." - More info: ".$url;
			$datestart=convertdate($item['startDate'],0);
			
			$icsitem = new ICS(array(
			  'location' => $location,
			  'description' => $desc,
			  'dtstart' => $datestart,
			  'dtend' => $dateend,
			  'summary' => $summary,
			  'url' => $url,
			  'sequence' => "1",
			  'uid' => $item['id']
			));
			$ical.="\r\n".$icsitem->to_string();
		}
		$ical.="\r\nEND:VCALENDAR";
		
		echo $ical;
	}else{
		echo "error";
	}
}

function convertdate($date,$type){
	$d=explode("/",$date);
	$timestamp = $d[2].$d[0].$d[1];
	$dt = new DateTime($timestamp);
	$dt->add(new DateInterval('P'.$type.'D'));
	//$newdate=$dt->format("Ymd\THis\Z");
	$newdate=";VALUE=DATE:".$dt->format("Ymd");
	return $newdate;
}

?>