<?php
namespace App\Core;

class Router {
    public function run() {
        // Handle API Requests
        if (isset($_GET['route'])) {
            $this->handleApiRequest($_GET['route']);
            return;
        }

        // Default: Serve the main view
        require_once __DIR__ . '/../../views/main.php';
    }

    private function handleApiRequest($route) {
        header('Content-Type: application/json');
        
        $parts = explode('/', $route);
        if (count($parts) < 2) {
            echo json_encode(['error' => 'Invalid route format']);
            exit;
        }

        $controllerName = ucfirst($parts[0]) . 'Controller';
        $methodName = $parts[1];

        $controllerClass = "App\\Controllers\\$controllerName";

        // Autoloading simulation or manual include (since we don't have composer autoloader yet)
        $controllerFile = __DIR__ . '/../Controllers/' . $controllerName . '.php';
        
        if (file_exists($controllerFile)) {
            require_once $controllerFile;
            if (class_exists($controllerClass)) {
                $controller = new $controllerClass();
                if (method_exists($controller, $methodName)) {
                    $controller->$methodName();
                    exit;
                }
            }
        }

        echo json_encode(['error' => 'Endpoint not found']);
        exit;
    }
}
