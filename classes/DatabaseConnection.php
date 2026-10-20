<?php

	class DatabaseConnection {

		private static $instance = null;
		private $conn = null;

		private function __construct() {
			$this->conn = new PDO(sprintf('mysql:dbname=%s; host=%s; charset=utf8', DB_NAME, DB_HOST), DB_USER, DB_PASS);
		}

		public function lastInsertId() {
			return $this->conn->lastInsertId();
		}


		public function close() {
			$this->conn = null;
		}

		public function __destruct() {
			$this->close();
		}

		public static function getInstance() {
			if (self::$instance === null) {
				self::$instance = new self();
			}

			return self::$instance;
		}

		public function getConnection() {
			return $this->conn;
		}

	}
