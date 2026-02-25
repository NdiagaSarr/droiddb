<?php
namespace App\Models;

require_once __DIR__ . '/../Config/Database.php';
use App\Config\Database;

class DbModel {
    private $db;
    private $conn;

    public function __construct() {
        $this->db = new Database();
    }

    public function connect($host, $user, $pass, $dbname = null) {
        $this->conn = $this->db->connect($host, $user, $pass, $dbname);
        return $this->conn;
    }

    public function getDatabases() {
        $stmt = $this->conn->query("SHOW DATABASES");
        return $stmt->fetchAll(\PDO::FETCH_COLUMN);
    }

    public function getTables() {
        $stmt = $this->conn->query("SHOW TABLES");
        return $stmt->fetchAll(\PDO::FETCH_COLUMN);
    }

    public function getData($table) {
        // Basic sanitization
        $table = str_replace('`', '``', $table);
        $stmt = $this->conn->prepare("SELECT * FROM `$table` LIMIT 100");
        $stmt->execute();
        return $stmt->fetchAll(\PDO::FETCH_ASSOC);
    }

    public function query($sql) {
        $stmt = $this->conn->query($sql);
        return $stmt->fetchAll(\PDO::FETCH_ASSOC);
    }

    public function getLastError() {
        return $this->db->getLastError();
    }
}
