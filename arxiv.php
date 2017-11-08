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
$max_results = 200;
//Thời gian giãn cách giữa các request (giây)
$delay_time = 5;
////////////////////////////////////////////////////


if (!file_exists($output_dir)) {
    mkdir($output_dir, 0777, true);
}

while (!feof($input_file)) {
	$subject = trim(fgets($input_file));
	print_r($subject);
  if($subject != ''){
    //$url = 'http://export.arxiv.org/api/query?search_query=all:%22'.$subject.'%22+AND+cat:%22'.$subject_category.'%22&start=0&max_results=100&sortBy=lastUpdatedDate&sortOrder=descending';
  	$url = 'http://export.arxiv.org/api/query?search_query=all:%22'.str_replace(' ', '+', $subject).'%22&start=0&max_results='.$max_results.'&sortBy=lastUpdatedDate&sortOrder=descending';
  	$response = file_get_contents($url);
  	print_r($response);
  	print_r('<br>####################################################################################################<br>');
    // $file_name = str_replace(' ', '', $subject) . '.txt';
    $file_name = 'xmlInput.txt';
    print_r($file_name);
    if(!file_exists('result/' . $file_name) ){
      touch('result/' . $file_name);
    }

  	$output_file = fopen("result/" . $file_name, "a") or die("Unable to create file for subject '".$subject."' !");

  	fwrite($output_file, $response);
  	fclose($output_file);
  	sleep($delay_time);
  }
}
fclose($input_file);
?>
