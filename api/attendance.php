<?php
require_once 'config.php';

$method = $_SERVER['REQUEST_METHOD'];
$endpoint = $_GET['endpoint'] ?? '';

switch ($method . ':' . $endpoint) {
    case 'GET:list':
        handleGetAttendance();
        break;
    case 'POST:checkin':
        handleCheckIn();
        break;
    case 'POST:checkout':
        handleCheckOut();
        break;
    case 'GET:stats':
        handleGetStats();
        break;
    default:
        sendResponse(['error' => 'Endpoint not found'], 404);
}

function handleGetAttendance() {
    $user = getAuthenticatedUser();
    if (!$user) {
        sendResponse(['error' => 'Unauthorized'], 401);
    }
    
    global $pdo;
    $limit = $_GET['limit'] ?? 50;
    $offset = $_GET['offset'] ?? 0;
    
    if ($user['role'] === 'admin') {
        $stmt = $pdo->prepare("
            SELECT a.*, p.name as teacher_name, l.name as location_name, s.subject_name, s.class_name
            FROM attendance a
            JOIN profiles p ON a.teacher_id = p.user_id
            LEFT JOIN locations l ON a.location_id = l.id
            LEFT JOIN schedules s ON a.schedule_id = s.id
            ORDER BY a.check_in_time DESC
            LIMIT ? OFFSET ?
        ");
        $stmt->execute([$limit, $offset]);
    } else {
        $stmt = $pdo->prepare("
            SELECT a.*, l.name as location_name, s.subject_name, s.class_name
            FROM attendance a
            LEFT JOIN locations l ON a.location_id = l.id
            LEFT JOIN schedules s ON a.schedule_id = s.id
            WHERE a.teacher_id = ?
            ORDER BY a.check_in_time DESC
            LIMIT ? OFFSET ?
        ");
        $stmt->execute([$user['id'], $limit, $offset]);
    }
    
    $attendance = $stmt->fetchAll();
    sendResponse($attendance);
}

function handleCheckIn() {
    $user = getAuthenticatedUser();
    if (!$user || $user['role'] !== 'teacher') {
        sendResponse(['error' => 'Unauthorized'], 401);
    }
    
    $input = json_decode(file_get_contents('php://input'), true);
    $locationId = $input['location_id'] ?? null;
    $scheduleId = $input['schedule_id'] ?? null;
    $notes = $input['notes'] ?? '';
    
    global $pdo;
    
    try {
        // Check if already checked in today
        $stmt = $pdo->prepare("
            SELECT id FROM attendance 
            WHERE teacher_id = ? AND DATE(check_in_time) = CURDATE() AND check_out_time IS NULL
        ");
        $stmt->execute([$user['id']]);
        if ($stmt->fetch()) {
            sendResponse(['error' => 'Anda sudah check-in hari ini'], 400);
        }
        
        $stmt = $pdo->prepare("
            INSERT INTO attendance (teacher_id, location_id, schedule_id, check_in_time, notes, created_at, updated_at)
            VALUES (?, ?, ?, NOW(), ?, NOW(), NOW())
        ");
        $stmt->execute([$user['id'], $locationId, $scheduleId, $notes]);
        
        $attendanceId = $pdo->lastInsertId();
        
        sendResponse([
            'id' => $attendanceId,
            'message' => 'Check-in berhasil',
            'check_in_time' => date('Y-m-d H:i:s')
        ]);
        
    } catch (Exception $e) {
        sendResponse(['error' => 'Check-in gagal'], 500);
    }
}

function handleCheckOut() {
    $user = getAuthenticatedUser();
    if (!$user || $user['role'] !== 'teacher') {
        sendResponse(['error' => 'Unauthorized'], 401);
    }
    
    $input = json_decode(file_get_contents('php://input'), true);
    $attendanceId = $input['attendance_id'] ?? null;
    $notes = $input['notes'] ?? '';
    
    global $pdo;
    
    try {
        // Find today's attendance record
        if (!$attendanceId) {
            $stmt = $pdo->prepare("
                SELECT id FROM attendance 
                WHERE teacher_id = ? AND DATE(check_in_time) = CURDATE() AND check_out_time IS NULL
                ORDER BY check_in_time DESC LIMIT 1
            ");
            $stmt->execute([$user['id']]);
            $result = $stmt->fetch();
            $attendanceId = $result['id'] ?? null;
        }
        
        if (!$attendanceId) {
            sendResponse(['error' => 'Tidak ada check-in hari ini'], 400);
        }
        
        // Calculate working hours
        $stmt = $pdo->prepare("SELECT check_in_time FROM attendance WHERE id = ? AND teacher_id = ?");
        $stmt->execute([$attendanceId, $user['id']]);
        $attendance = $stmt->fetch();
        
        if (!$attendance) {
            sendResponse(['error' => 'Data attendance tidak ditemukan'], 404);
        }
        
        $checkInTime = new DateTime($attendance['check_in_time']);
        $checkOutTime = new DateTime();
        $workingHours = $checkOutTime->diff($checkInTime)->h + ($checkOutTime->diff($checkInTime)->i / 60);
        
        $stmt = $pdo->prepare("
            UPDATE attendance 
            SET check_out_time = NOW(), working_hours = ?, notes = CONCAT(IFNULL(notes, ''), '\n', ?), updated_at = NOW()
            WHERE id = ? AND teacher_id = ?
        ");
        $stmt->execute([round($workingHours, 2), $notes, $attendanceId, $user['id']]);
        
        sendResponse([
            'message' => 'Check-out berhasil',
            'check_out_time' => $checkOutTime->format('Y-m-d H:i:s'),
            'working_hours' => round($workingHours, 2)
        ]);
        
    } catch (Exception $e) {
        sendResponse(['error' => 'Check-out gagal'], 500);
    }
}

function handleGetStats() {
    $user = getAuthenticatedUser();
    if (!$user) {
        sendResponse(['error' => 'Unauthorized'], 401);
    }
    
    global $pdo;
    
    if ($user['role'] === 'admin') {
        // Admin stats
        $stmt = $pdo->prepare("
            SELECT 
                COUNT(*) as total_attendance,
                COUNT(DISTINCT teacher_id) as active_teachers,
                AVG(working_hours) as avg_working_hours,
                COUNT(CASE WHEN DATE(check_in_time) = CURDATE() THEN 1 END) as today_attendance
            FROM attendance
            WHERE check_in_time >= DATE_SUB(NOW(), INTERVAL 30 DAY)
        ");
        $stmt->execute();
        $stats = $stmt->fetch();
    } else {
        // Teacher stats
        $stmt = $pdo->prepare("
            SELECT 
                COUNT(*) as total_attendance,
                AVG(working_hours) as avg_working_hours,
                COUNT(CASE WHEN DATE(check_in_time) = CURDATE() THEN 1 END) as today_attendance,
                COUNT(CASE WHEN DATE(check_in_time) >= DATE_SUB(CURDATE(), INTERVAL 7 DAY) THEN 1 END) as week_attendance
            FROM attendance
            WHERE teacher_id = ? AND check_in_time >= DATE_SUB(NOW(), INTERVAL 30 DAY)
        ");
        $stmt->execute([$user['id']]);
        $stats = $stmt->fetch();
    }
    
    sendResponse($stats);
}
?>