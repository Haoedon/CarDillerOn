<?php
// save_order.php - обработчик для сохранения заказов в БД

// Включить отчёты об ошибках для отладки
error_reporting(E_ALL);
ini_set('display_errors', 0); // не показывать ошибки пользователю
ini_set('log_errors', 1);

// Установить заголовок для JSON ответа
header('Content-Type: application/json; charset=utf-8');

// Разрешить CORS для локальной разработки (если нужно)
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, GET, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

// Проверить метод запроса
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['error' => 'Метод не поддерживается']);
    exit;
}

// === НАСТРОЙКИ ПОДКЛЮЧЕНИЯ К БД ===
// Замените на данные вашего хостинга
$db_host = 'localhost';      // обычно localhost
$db_user = 'cs99084_cars';   // ваше имя пользователя БД
$db_pass = 'TwQXkV5Z';               // пароль БД (часто пуст на локальном сервере)
$db_name = 'cs99084_cars';   // название вашей БД - ИЗМЕНИТЕ!

// === СОЗДАНИЕ ПОДКЛЮЧЕНИЯ ===
$connection = new mysqli($db_host, $db_user, $db_pass, $db_name);

// Проверить подключение
if ($connection->connect_error) {
    http_response_code(500);
    echo json_encode(['error' => 'Ошибка подключения к БД: ' . $connection->connect_error]);
    exit;
}

// Установить кодировку UTF-8
$connection->set_charset('utf8mb4');

// === ПОЛУЧЕНИЕ И ВАЛИДАЦИЯ ДАННЫХ ===
$fio = $_POST['fio'] ?? '';
$email = $_POST['email'] ?? '';
$phone = $_POST['phone'] ?? '';
$cart_data = $_POST['cart_data'] ?? '{}';

// Базовая валидация
if (empty($fio) || empty($email) || empty($phone)) {
    http_response_code(400);
    echo json_encode(['error' => 'Все поля обязательны']);
    exit;
}

// Парсим JSON данные о машинах
$cart_json = json_decode($cart_data, true);
$cars_ids = isset($cart_json['cars']) ? $cart_json['cars'] : [];

if (empty($cars_ids)) {
    http_response_code(400);
    echo json_encode(['error' => 'Заказ должен содержать хотя бы одну машину']);
    exit;
}

// === РАСЧЁТ ОБЩЕЙ СТОИМОСТИ ===
// Для упрощения будем хранить просто JSON с ID
// Если нужна реальная цена - нужна отдельная таблица с машинами
$total_price = 0; // позже можно вычислить по реальным ценам из БД

// === СОХРАНЕНИЕ В БД ===
$cars_json = json_encode($cars_ids, JSON_UNESCAPED_UNICODE);

// Использовать prepared statement для безопасности
$stmt = $connection->prepare("
    INSERT INTO orders (fio, email, phone, cars_ids, total_price) 
    VALUES (?, ?, ?, ?, ?)
");

if (!$stmt) {
    http_response_code(500);
    echo json_encode(['error' => 'Ошибка подготовки запроса: ' . $connection->error]);
    exit;
}

$stmt->bind_param('ssssi', $fio, $email, $phone, $cars_json, $total_price);

if (!$stmt->execute()) {
    http_response_code(500);
    echo json_encode(['error' => 'Ошибка при сохранении заказа: ' . $stmt->error]);
    exit;
}

$order_id = $stmt->insert_id;
$stmt->close();
$connection->close();

// === УСПЕШНЫЙ ОТВЕТ ===
http_response_code(200);
echo json_encode([
    'success' => true,
    'message' => 'Заказ успешно сохранен',
    'order_id' => $order_id
]);
?>
