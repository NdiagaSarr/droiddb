<?php
// Test MySQL Connection
$host = 'localhost';
$user = 'root';

// Try different passwords
$passwords = ['', 'root', 'password', 'mysql'];

echo "=== TEST DE CONNEXION MYSQL ===\n\n";

foreach ($passwords as $pass) {
    try {
        $pdo = new PDO("mysql:host=$host", $user, $pass);
        echo "✅ SUCCESS with password: " . ($pass === '' ? '(empty)' : "'$pass'") . "\n";
        
        // List databases
        $stmt = $pdo->query("SHOW DATABASES");
        $dbs = $stmt->fetchAll(PDO::FETCH_COLUMN);
        echo "   Databases found: " . count($dbs) . "\n";
        echo "   List: " . implode(', ', array_slice($dbs, 0, 5)) . "...\n\n";
        break;
    } catch (PDOException $e) {
        echo "❌ FAILED with password: " . ($pass === '' ? '(empty)' : "'$pass'") . "\n";
        echo "   Error: " . $e->getMessage() . "\n\n";
    }
}
?>
