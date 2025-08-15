<?php
require_once 'config.php';

$method = $_SERVER['REQUEST_METHOD'];
$endpoint = $_GET['endpoint'] ?? '';

switch ($method . ':' . $endpoint) {
    case 'POST:login':
        handleLogin();
        break;
    case 'POST:register':
        handleRegister();
        break;
    case 'POST:logout':
        handleLogout();
        break;
    case 'GET:me':
        handleGetUser();
        break;
    case 'GET:':
        // Test endpoint untuk memastikan API berjalan
        sendResponse([
            'message' => 'API Auth berhasil berjalan',
            'endpoints' => [
                'POST /api/auth.php?endpoint=login',
                'POST /api/auth.php?endpoint=register', 
                'POST /api/auth.php?endpoint=logout',
                'GET /api/auth.php?endpoint=me'
            ]
        ]);
        break;
    default:
        sendResponse(['error' => 'Endpoint not found'], 404);
}

function handleLogin() {
    $input = json_decode(file_get_contents('php://input'), true);
    $email = $input['email'] ?? '';
    $password = $input['password'] ?? '';
    
    if (!$email || !$password) {
        sendResponse(['error' => 'Email dan password harus diisi'], 400);
    }
    
    global $pdo;
    $stmt = $pdo->prepare("SELECT p.*, a.password_hash FROM profiles p 
                          JOIN auth_users a ON p.user_id = a.id 
                          WHERE p.email = ?");
    $stmt->execute([$email]);
    $user = $stmt->fetch();
    
    if (!$user || !password_verify($password, $user['password_hash'])) {
        sendResponse(['error' => 'Email atau password salah'], 401);
    }
    
    session_start();
    $_SESSION['user'] = [
        'id' => $user['user_id'],
        'email' => $user['email'],
        'name' => $user['name'],
        'role' => $user['role']
    ];
    
    sendResponse([
        'user' => $_SESSION['user'],
        'session' => ['access_token' => session_id()]
    ]);
}

function handleRegister() {
    $input = json_decode(file_get_contents('php://input'), true);
    $email = $input['email'] ?? '';
    $password = $input['password'] ?? '';
    $name = $input['name'] ?? '';
    $role = $input['role'] ?? 'teacher';
    
    if (!$email || !$password || !$name) {
        sendResponse(['error' => 'Semua field harus diisi'], 400);
    }
    
    global $pdo;
    
    // Check if email already exists
    $stmt = $pdo->prepare("SELECT id FROM profiles WHERE email = ?");
    $stmt->execute([$email]);
    if ($stmt->fetch()) {
        sendResponse(['error' => 'Email sudah terdaftar'], 400);
    }
    
    try {
        $pdo->beginTransaction();
        
        // Generate user ID
        $userId = bin2hex(random_bytes(16));
        $passwordHash = password_hash($password, PASSWORD_DEFAULT);
        
        // Insert into auth_users
        $stmt = $pdo->prepare("INSERT INTO auth_users (id, email, password_hash, created_at, updated_at) 
                              VALUES (?, ?, ?, NOW(), NOW())");
        $stmt->execute([$userId, $email, $passwordHash]);
        
        // Insert into profiles
        $stmt = $pdo->prepare("INSERT INTO profiles (user_id, name, email, role, created_at, updated_at) 
                              VALUES (?, ?, ?, ?, NOW(), NOW())");
        $stmt->execute([$userId, $name, $email, $role]);
        
        $pdo->commit();
        
        session_start();
        $_SESSION['user'] = [
            'id' => $userId,
            'email' => $email,
            'name' => $name,
            'role' => $role
        ];
        
        sendResponse([
            'user' => $_SESSION['user'],
            'session' => ['access_token' => session_id()]
        ]);
        
    } catch (Exception $e) {
        $pdo->rollback();
        sendResponse(['error' => 'Registrasi gagal'], 500);
    }
}

function handleLogout() {
    session_start();
    session_destroy();
    sendResponse(['message' => 'Logout berhasil']);
}

function handleGetUser() {
    session_start();
    if (!isset($_SESSION['user'])) {
        sendResponse(['error' => 'Unauthorized'], 401);
    }
    
    sendResponse(['user' => $_SESSION['user']]);
}
?>