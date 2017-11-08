<?php
/**
 * This file provided by Facebook is for non-commercial testing and evaluation
 * purposes only. Facebook reserves all rights not expressly granted.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL
 * FACEBOOK BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN
 * ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION
 * WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */
$scriptInvokedFromCli =
    isset($_SERVER['argv'][0]) && $_SERVER['argv'][0] === 'index.php';

if($scriptInvokedFromCli) {
    $port = getenv('PORT');
    if (empty($port)) {
        $port = "3000";
    }

    echo 'starting server on port '. $port . PHP_EOL;
    exec('php -S localhost:'. $port . ' -t ./ index.php');
} else {
    return routeRequest();
}

function routeRequest()
{
    $uri = $_SERVER['REQUEST_URI'];
    // print_r( $_SERVER['REQUEST_METHOD'] );
    if ($uri == '/') {
        echo file_get_contents('./index.html');
      // } elseif (preg_match('/\/api\/save-data(\?.*)?/', $uri)) {
    } elseif ($uri == '/api/save-data') {
        print_r( $_SERVER['REQUEST_METHOD'] );
        if($_SERVER['REQUEST_METHOD'] === 'POST') {
            if( !file_exists('data.txt') ){
              touch('data.txt');
            }
            $data = file_get_contents('data.txt');
            // $text = "hello";
            $text = $_POST['text'];
            var_dump($_POST);
            $output_file = fopen("data.txt", "w") or die ("Unable to open output file");
            fwrite($output_file, $text);
            fclose($output_file);
        }
        // header('Cache-Control: no-cache');
        // header('Access-Control-Allow-Origin: *');
        $comments = json_encode("hello", JSON_PRETTY_PRINT);
        echo $comments;
    } else {
        return false;
    }
}
