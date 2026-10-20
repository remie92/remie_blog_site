<?php require 'views/general_blocks/head.php'; ?>
<body>

<h1>Log into CMS</h1>

<form action="/login_endpoint" method="post" target="_self">
  <label for="name">Username:</label>
  <input type="text" id="name" name="name"><br><br>
  <label for="password">Password:</label>
  <input type="password" id="password" name="password"><br><br>
  <input type="submit" value="Log in">
</form>


</body>
</html>