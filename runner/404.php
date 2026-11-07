<?php
http_response_code(404);
echo "<h1>'" . getCurrentUri() . "' does not exist!</h1>";