<?php
//Các thông số đầu vào:
//File input các chủ đề cần search và crawl về trên website arXiv.org
$input_file = fopen("input_subject.txt", "r") or die("Unable to open input file!");
//Đường dẫn thư mục lưu trữ dữ liệu, nằm trong thư mục gốc
$output_dir = "output";
//Thời gian giãn cách giữa các request (giây)
$delay_time = 15;
////////////////////////////////////////////////////


if (!file_exists($output_dir)) {
    mkdir($output_dir, 0777, true);
}
chdir($output_dir);
while (!feof($input_file)) {
	$subject = fgets($input_file);
	$url = 'http://export.arxiv.org/api/query?search_query=all:'.$subject.'&start=0&max_results=100';
	$response = file_get_contents($url);
	$output_file = fopen($subject, "w") or die("Unable to create file \'".$subject."\' !");
	fwrite($output_file, $response);
	fclose($output_file);
	print_r($response);
	sleep($delay_time);
}
fclose($input_file);
?>