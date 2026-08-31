CREATE DATABASE IF NOT EXISTS salon;
USE salon;

-- TABLES

CREATE TABLE IF NOT EXISTS clients (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    phone VARCHAR(20),
    email VARCHAR(100),
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS procedures (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(80) NOT NULL,
    description TEXT,
    default_duration INT COMMENT 'estimated duration in minutes',
    default_price DECIMAL(10,2),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS appointments (
    id INT AUTO_INCREMENT PRIMARY KEY,
    client_id INT NOT NULL,
    procedure_id INT NOT NULL,
    datetime DATETIME NOT NULL,
    estimated_duration INT COMMENT 'actual estimated duration for this appointment (minutes)',
    charged_price DECIMAL(10,2) COMMENT 'negotiated price for this service',
    status ENUM('scheduled','confirmed','done','canceled','missed','late') DEFAULT 'scheduled',
    payment_status ENUM('pending','paid') DEFAULT 'pending',
    notes TEXT COMMENT 'specific notes (e.g., client was late, etc.)',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (client_id) REFERENCES clients(id) ON DELETE CASCADE,
    FOREIGN KEY (procedure_id) REFERENCES procedures(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS general_history (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    action ENUM('created','updated','deleted') NOT NULL,
    client_name VARCHAR(100),
    procedure_name VARCHAR(80),
    appointment_datetime DATETIME,
    estimated_duration INT,
    charged_price DECIMAL(10,2),
    appointment_status ENUM('scheduled','confirmed','done','canceled','missed','late'),
    payment_status ENUM('pending','paid'),
    notes TEXT,
    recorded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS system_history (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    entity_type ENUM('client','procedure','appointment') NOT NULL,
    action ENUM('created','updated','deleted') NOT NULL,
    entity_name VARCHAR(255) NOT NULL,
    details TEXT,
    recorded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- prevent normal application users from editing or deleting history records.
DROP TRIGGER IF EXISTS general_history_no_update;
DROP TRIGGER IF EXISTS general_history_no_delete;
DROP TRIGGER IF EXISTS system_history_no_update;
DROP TRIGGER IF EXISTS system_history_no_delete;

-- prevent updates and deletes on history (append-only)
DELIMITER //

CREATE TRIGGER general_history_no_update
BEFORE UPDATE ON general_history
FOR EACH ROW
BEGIN
    SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'General history is append-only.';
END//

CREATE TRIGGER general_history_no_delete
BEFORE DELETE ON general_history
FOR EACH ROW
BEGIN
    SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'General history is append-only.';
END//

CREATE TRIGGER system_history_no_update
BEFORE UPDATE ON system_history
FOR EACH ROW
BEGIN
    SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'System history is append-only.';
END//

CREATE TRIGGER system_history_no_delete
BEFORE DELETE ON system_history
FOR EACH ROW
BEGIN
    SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'System history is append-only.';
END//

-- audit trigger: log appointment creation
CREATE TRIGGER appointments_history_after_insert
AFTER INSERT ON appointments
FOR EACH ROW
BEGIN
    INSERT INTO general_history (
        action, client_name, procedure_name, appointment_datetime,
        estimated_duration, charged_price, appointment_status,
        payment_status, notes
    )
    SELECT 'created', c.name, p.name, NEW.datetime, NEW.estimated_duration,
        NEW.charged_price, NEW.status, NEW.payment_status, NEW.notes
    FROM clients c
    JOIN procedures p ON p.id = NEW.procedure_id
    WHERE c.id = NEW.client_id;

    INSERT INTO system_history (entity_type, action, entity_name, details)
    SELECT 'appointment', 'created', CONCAT(c.name, ' - ', p.name),
        CONCAT('Status: ', NEW.status, '; Payment: ', NEW.payment_status)
    FROM clients c
    JOIN procedures p ON p.id = NEW.procedure_id
    WHERE c.id = NEW.client_id;
END//

-- audit trigger: log appointment updates
CREATE TRIGGER appointments_history_after_update
AFTER UPDATE ON appointments
FOR EACH ROW
BEGIN
    INSERT INTO general_history (
        action, client_name, procedure_name, appointment_datetime,
        estimated_duration, charged_price, appointment_status,
        payment_status, notes
    )
    SELECT 'updated', c.name, p.name, NEW.datetime, NEW.estimated_duration,
        NEW.charged_price, NEW.status, NEW.payment_status, NEW.notes
    FROM clients c
    JOIN procedures p ON p.id = NEW.procedure_id
    WHERE c.id = NEW.client_id;

    INSERT INTO system_history (entity_type, action, entity_name, details)
    SELECT 'appointment', 'updated', CONCAT(c.name, ' - ', p.name),
        CONCAT('Status: ', NEW.status, '; Payment: ', NEW.payment_status)
    FROM clients c
    JOIN procedures p ON p.id = NEW.procedure_id
    WHERE c.id = NEW.client_id;
END//

-- audit trigger: log appointment deletion
CREATE TRIGGER appointments_history_before_delete
BEFORE DELETE ON appointments
FOR EACH ROW
BEGIN
    INSERT INTO general_history (
        action, client_name, procedure_name, appointment_datetime,
        estimated_duration, charged_price, appointment_status,
        payment_status, notes
    )
    SELECT 'deleted', c.name, p.name, OLD.datetime, OLD.estimated_duration,
        OLD.charged_price, OLD.status, OLD.payment_status, OLD.notes
    FROM clients c
    JOIN procedures p ON p.id = OLD.procedure_id
    WHERE c.id = OLD.client_id;

    INSERT INTO system_history (entity_type, action, entity_name, details)
    SELECT 'appointment', 'deleted', CONCAT(c.name, ' - ', p.name),
        CONCAT('Status: ', OLD.status, '; Payment: ', OLD.payment_status)
    FROM clients c
    JOIN procedures p ON p.id = OLD.procedure_id
    WHERE c.id = OLD.client_id;
END//

-- audit triggers: log client crud operations
CREATE TRIGGER clients_history_after_insert
AFTER INSERT ON clients
FOR EACH ROW
BEGIN
    INSERT INTO system_history (entity_type, action, entity_name, details)
    VALUES ('client', 'created', NEW.name, 'Client record created.');
END//

CREATE TRIGGER clients_history_after_update
AFTER UPDATE ON clients
FOR EACH ROW
BEGIN
    INSERT INTO system_history (entity_type, action, entity_name, details)
    VALUES ('client', 'updated', NEW.name, 'Client record updated.');
END//

CREATE TRIGGER clients_history_after_delete
AFTER DELETE ON clients
FOR EACH ROW
BEGIN
    INSERT INTO system_history (entity_type, action, entity_name, details)
    VALUES ('client', 'deleted', OLD.name, 'Client record deleted.');
END//

-- audit triggers: log procedure crud operations
CREATE TRIGGER procedures_history_after_insert
AFTER INSERT ON procedures
FOR EACH ROW
BEGIN
    INSERT INTO system_history (entity_type, action, entity_name, details)
    VALUES ('procedure', 'created', NEW.name, 'Procedure record created.');
END//

CREATE TRIGGER procedures_history_after_update
AFTER UPDATE ON procedures
FOR EACH ROW
BEGIN
    INSERT INTO system_history (entity_type, action, entity_name, details)
    VALUES ('procedure', 'updated', NEW.name, 'Procedure record updated.');
END//

CREATE TRIGGER procedures_history_after_delete
AFTER DELETE ON procedures
FOR EACH ROW
BEGIN
    INSERT INTO system_history (entity_type, action, entity_name, details)
    VALUES ('procedure', 'deleted', OLD.name, 'Procedure record deleted.');
END//

DELIMITER ;

-- INSERT SAMPLE DATA

INSERT INTO clients (name, phone, email, notes) VALUES
('Ana Silva', '(11) 99999-1111', 'ana@email.com', 'Likes modern haircuts'),
('Carlos Souza', '(11) 99999-2222', 'carlos@email.com', 'Always 10 min late'),
('Mariana Oliveira', '(11) 99999-3333', 'mariana@email.com', 'Loyal client, colors every 2 months'),
('João Pereira', '(11) 99999-4444', 'joao@email.com', ''),
('Fernanda Lima', '(11) 99999-5555', 'fernanda@email.com', 'Already missed 2 times');

INSERT INTO procedures (name, description, default_duration, default_price) VALUES
('Women''s Cut', 'Scissor and/or clipper cut', 45, 70.00),
('Coloring', 'Dye or highlights', 90, 150.00),
('Blowout', 'Progressive blowout or styling', 30, 40.00),
('Men''s Cut', 'Basic men''s haircut', 30, 50.00),
('Hair Treatment', 'Hydration, nutrition or reconstruction', 60, 80.00);

INSERT INTO appointments (client_id, procedure_id, datetime, estimated_duration, charged_price, status, notes) VALUES
(1, 1, '2026-08-20 10:00:00', 45, 70.00, 'confirmed', ''),
(2, 2, '2026-08-20 14:00:00', 90, 140.00, 'scheduled', 'Client tends to be late'),
(3, 5, '2026-08-21 09:30:00', 60, 80.00, 'done', ''),
(1, 3, '2026-08-22 16:00:00', 30, 40.00, 'late', 'Arrived 15 min late'),
(4, 4, '2026-08-23 11:00:00', 30, 50.00, 'missed', 'Did not show up and did not cancel'),
(5, 2, '2026-08-24 15:00:00', 90, 160.00, 'canceled', 'Client rescheduled'),
(2, 1, '2026-08-25 09:00:00', 45, 65.00, 'done', ''),
(3, 3, '2026-08-26 13:30:00', 30, 40.00, 'scheduled', ''),
(5, 5, '2026-08-27 10:30:00', 60, 85.00, 'confirmed', ''),
(4, 4, '2026-08-28 17:00:00', 30, 50.00, 'scheduled', '');