<?php
namespace App\Controllers;

require_once __DIR__ . '/../Models/DbModel.php';
use App\Models\DbModel;

class DbController {
    private $model;

    public function __construct() {
        if (!isset($_SESSION['db_host'])) {
            http_response_code(401);
            header('Content-Type: application/json');
            echo json_encode(['error' => 'Not authenticated']);
            exit;
        }
        $this->model = new DbModel();
    }

    private function connect($dbname = null) {
        $conn = $this->model->connect(
            $_SESSION['db_host'],
            $_SESSION['db_user'],
            $_SESSION['db_pass'],
            $dbname
        );
        if (!$conn) {
            http_response_code(401);
            echo json_encode(['error' => 'Connection failed']);
            exit;
        }
    }

    public function list_dbs() {
        $this->connect();
        echo json_encode($this->model->getDatabases());
    }

    public function list_tables() {
        $db = $_GET['db'] ?? null;
        if (!$db) {
            echo json_encode(['error' => 'Database required']);
            return;
        }
        $this->connect($db);
        echo json_encode($this->model->getTables());
    }

    public function get_data() {
        $db = $_GET['db'] ?? null;
        $table = $_GET['table'] ?? null;
        if (!$db || !$table) {
             echo json_encode(['error' => 'DB and Table required']);
             return;
        }
        $this->connect($db);
        echo json_encode($this->model->getData($table));
    }

    public function query() {
        $db = $_GET['db'] ?? null;
        $input = json_decode(file_get_contents('php://input'), true);
        $sql = $input['sql'] ?? '';

        if (!$sql) {
            echo json_encode(['error' => 'SQL required']);
            return;
        }

        $this->connect($db);
        try {
            echo json_encode($this->model->query($sql));
        } catch (\Exception $e) {
            echo json_encode(['error' => $e->getMessage()]);
        }
    }
}
