<?php
$input_file = fopen("input_subject.txt", "r") or die("Unable to open file!");
while (!feof($input_file)) {
	$url = 'http://export.arxiv.org/api/query?search_query=all:'.fgets($input_file).'&start=0&max_results=100';
	$response = file_get_contents($url);
	print_r($response);
}

?>