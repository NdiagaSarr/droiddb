<?php
namespace App\Config;

class Database {
    private $conn;
    private $lastError;

    public function connect($host, $user, $password, $dbname = null) {
        $this->conn = null;
        $this->lastError = null;

        try {
            $dsn = "mysql:host=" . $host;
            if ($dbname) {
                $dsn .= ";dbname=" . $dbname;
            }
            
            $this->conn = new \PDO($dsn, $user, $password);
            $this->conn->setAttribute(\PDO::ATTR_ERRMODE, \PDO::ERRMODE_EXCEPTION);
            $this->conn->setAttribute(\PDO::ATTR_DEFAULT_FETCH_MODE, \PDO::FETCH_ASSOC);
            // Fix for special characters
            $this->conn->exec("set names utf8mb4");
            
            return $this->conn;
        } catch (\PDOException $e) {
            $this->lastError = $e->getMessage();
            error_log("MySQL Connection Error: " . $e->getMessage());
            return null;
        }
    }

    public function getLastError() {
        return $this->lastError;
    }
}
