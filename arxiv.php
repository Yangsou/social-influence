<?php
//Các thông số đầu vào:
//File input các chủ đề cần search và crawl về trên website arXiv.org
$input_file = fopen("input_subject.txt", "r") or die("Unable to open input file!");
//Chủ đề cần tìm
//$subject_category = "Computer Science";
//Đường dẫn thư mục lưu trữ dữ liệu, nằm trong thư mục gốc
$output_dir = "output";
//Dấu phân cách thư mục
$slash = "\\";
//Số lượng tối đa các kết quả trả về
$max_results = 100;
//Thời gian giãn cách giữa các request (giây)
$delay_time = 5;
////////////////////////////////////////////////////


if (!file_exists($output_dir)) {
    mkdir($output_dir, 777, true);
}

while (!feof($input_file)) {
	$subject = trim(fgets($input_file));
	print_r($subject);
	//$url = 'http://export.arxiv.org/api/query?search_query=all:%22'.$subject.'%22+AND+cat:%22'.$subject_category.'%22&start=0&max_results=100&sortBy=lastUpdatedDate&sortOrder=descending';
	$url = 'http://export.arxiv.org/api/query?search_query=all:%22'.str_replace(' ', '+', $subject).'%22&start=0&max_results='.$max_results.'&sortBy=lastUpdatedDate&sortOrder=descending';
	$response = file_get_contents($url);
	print_r($response);
	print_r('<br>####################################################################################################<br>');
	$output_file = fopen(getcwd().$slash.$output_dir.$slash.str_replace(' ', '', ucwords($subject)).'.txt', "w") or die("Unable to create file for subject '".$subject."' !");
	fwrite($output_file, $response);
	fclose($output_file);
	sleep($delay_time);
}
fclose($input_file);
?>