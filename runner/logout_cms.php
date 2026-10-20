<?php

unset($_SESSION['logged_in']);
unset($_SESSION['username']);
unset($_SESSION['permission']);

header('Location: /cms');
die;