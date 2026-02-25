<?php
namespace App\Controllers;

require_once __DIR__ . '/../Models/DbModel.php';
use App\Models\DbModel;

class AuthController {
    public function login() {
        $input = json_decode(file_get_contents('php://input'), true);
        $host = $input['host'] ?? 'localhost';
        $user = $input['user'] ?? 'root';
        $pass = $input['password'] ?? '';

        $model = new DbModel();
        if ($model->connect($host, $user, $pass)) {
            $_SESSION['db_host'] = $host;
            $_SESSION['db_user'] = $user;
            $_SESSION['db_pass'] = $pass;
            echo json_encode(['success' => true]);
        } else {
            http_response_code(401);
            $errorMsg = $model->getLastError() ?? 'Connection failed - vérifiez vos identifiants MySQL';
            echo json_encode(['error' => $errorMsg]);
        }
    }

    public function logout() {
        session_destroy();
        echo json_encode(['success' => true]);
    }

    public function check_auth() {
        if (isset($_SESSION['db_host'])) {
            echo json_encode(['authenticated' => true, 'user' => $_SESSION['db_user']]);
        } else {
            echo json_encode(['authenticated' => false]);
        }
    }
}
