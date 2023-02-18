-- TABLE DOANH NGHIEP
CREATE TABLE IF NOT EXISTS `concerns` (
  `concern_id` INTEGER NOT NULL AUTO_INCREMENT,
  `concern_name` VARCHAR(40) NOT NULL UNIQUE,
  `concern_desc` TEXT,
  PRIMARY KEY (`concern_id`)
) ENGINE = InnoDB;

-- TABLE KHACH SANG
CREATE TABLE IF NOT EXISTS `hotels` (
  `hotel_id` INTEGER NOT NULL AUTO_INCREMENT,
  `hotel_name` VARCHAR(50) UNIQUE NOT NULL,
  `hotel_desc` TEXT NOT NULL,
  `hotel_address` VARCHAR(50) NOT NULL,
  `hotel_title` VARCHAR(50),
  `hotel_image` VARCHAR(30) NOT NULL,
  `hotel_rating` INT CHECK(
    hotel_rating >= 0
    AND hotel_rating <= 5
  ),
  PRIMARY KEY (`hotel_id`)
) ENGINE = InnoDB;

-- TABLE DOANH NGHIEP VA KHACH HANG HOP TAC
CREATE TABLE IF NOT EXISTS `contracts` (
  `contract_id` INTEGER NOT NULL AUTO_INCREMENT,
  `concern_id` INTEGER NOT NULL,
  `hotel_id` INTEGER NOT NULL,
  `date_start` DATE,
  `date_end` DATE,
  `signature` BOOLEAN DEFAULT TRUE,
  FOREIGN KEY (hotel_id) REFERENCES hotels(hotel_id),
  FOREIGN KEY (concern_id) REFERENCES concerns(concern_id),
  PRIMARY KEY (`concern_id`, `hotel_id`, `contract_id`)
) ENGINE = InnoDB;

-- TABLE ANH CUA KHACH SAN
CREATE TABLE IF NOT EXISTS `hotel_images` (
  `h_image_id` INTEGER NOT NULL AUTO_INCREMENT,
  `hotel_id` INTEGER NOT NULL,
  `h_image_value` VARCHAR(30) NOT NULL,
  PRIMARY KEY (`h_image_id`),
  FOREIGN KEY (hotel_id) REFERENCES hotels(hotel_id)
) ENGINE = InnoDB;

-- TABLE KHACH HANG
CREATE TABLE IF NOT EXISTS `customers` (
  `customer_id` INTEGER NOT NULL AUTO_INCREMENT,
  `first_name` VARCHAR(20) NOT NULL,
  `last_name` VARCHAR(20) NOT NULL,
  `email` VARCHAR(30) UNIQUE NOT NULL,
  `username` VARCHAR(32) UNIQUE NOT NULL,
  `password` VARCHAR(32) NOT NULL,
  `phone` VARCHAR(10) UNIQUE NOT NULL,
  `identity_card` VARCHAR(15) UNIQUE NULL,
  -- CMND/CCCD
  `year_of_brith` VARCHAR(4) DEFAULT '',
  PRIMARY KEY (`customer_id`)
) ENGINE = InnoDB;

-- TABLE KHACH HANG DANG KY KHI DAT PHONG KHACH SAN
CREATE TABLE IF NOT EXISTS `registers` (
  `customer_id` INTEGER NOT NULL,
  `hotel_id` INTEGER NOT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (hotel_id) REFERENCES hotels(hotel_id),
  FOREIGN KEY (customer_id) REFERENCES customers(customer_id),
  PRIMARY KEY (`customer_id`, `hotel_id`)
) ENGINE = InnoDB;

-- TABLE NHAN VIEN
CREATE TABLE IF NOT EXISTS `employees` (
  `emp_id` INTEGER NOT NULL AUTO_INCREMENT,
  `emp_first_name` VARCHAR(20) NOT NULL,
  `emp_last_name` VARCHAR(20) NOT NULL,
  `emp_email` VARCHAR(30) UNIQUE NOT NULL,
  `emp_username` VARCHAR(32) UNIQUE NOT NULL,
  `emp_password` VARCHAR(32) NOT NULL,
  `emp_phone` VARCHAR(10) UNIQUE NOT NULL,
  `emp_identity_card` VARCHAR(15) UNIQUE NULL,
  `emp_year_of_brith` VARCHAR(4) DEFAULT '',
  `emp_address` VARCHAR(40) DEFAULT '',
  `hotel_id` INTEGER NOT NULL,
  FOREIGN KEY (hotel_id) REFERENCES hotels(hotel_id),
  PRIMARY KEY (`emp_id`)
) ENGINE = InnoDB;

-- TABLE TRANG THAI
CREATE TABLE IF NOT EXISTS `statuses` (
  `status_id` INTEGER NOT NULL AUTO_INCREMENT,
  `type` VARCHAR(6) NOT NULL,
  `desc` VARCHAR(50) NOT NULL,
  `key` VARCHAR(5) NOT NULL UNIQUE,
  `value` VARCHAR(20) NOT NULL UNIQUE,
  PRIMARY KEY (`status_id`)
) ENGINE = InnoDB;

-- TABLE HOA DON CUA KHACH HANG
CREATE TABLE IF NOT EXISTS `bills` (
  `bill_id` INTEGER NOT NULL AUTO_INCREMENT,
  `emp_id` INTEGER NOT NULL,
  `customer_id` INTEGER NOT NULL,
  `status_id` INTEGER NOT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (emp_id) REFERENCES employees(emp_id),
  FOREIGN KEY (customer_id) REFERENCES customers(customer_id),
  FOREIGN KEY (status_id) REFERENCES statuses(status_id),
  PRIMARY KEY (`bill_id`)
) ENGINE = InnoDB;

-- TABLE DICH VU CUA KHACH SAN
CREATE TABLE IF NOT EXISTS `services` (
  `service_id` INTEGER NOT NULL AUTO_INCREMENT,
  `service_name` VARCHAR(50) UNIQUE NOT NULL,
  `service_desc` VARCHAR(50) DEFAULT '',
  `service_price` INTEGER NOT NULL CHECK (service_price > 10),
  `hotel_id` INTEGER NOT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (hotel_id) REFERENCES hotels(hotel_id),
  PRIMARY KEY (`service_id`)
) ENGINE = InnoDB;

-- TABLE TANG
CREATE TABLE IF NOT EXISTS `floors` (
  `floor_id` INTEGER NOT NULL AUTO_INCREMENT,
  `floor_name` VARCHAR(50) UNIQUE NOT NULL,
  `floor_type` VARCHAR(5) NOT NULL,
  PRIMARY KEY (`floor_id`)
) ENGINE = InnoDB;

-- TABLE LOAI PHONG
CREATE TABLE IF NOT EXISTS `room_types` (
  `rt_id` INTEGER NOT NULL AUTO_INCREMENT,
  `rt_name` VARCHAR(50) NOT NULL,
  `rt_type` VARCHAR(6) UNIQUE NOT NULL,
  `rt_desc` VARCHAR(50) NOT NULL,
  PRIMARY KEY (`rt_id`)
) ENGINE = InnoDB;

-- TABLE ANH CUA PHONG
CREATE TABLE IF NOT EXISTS `room_images` (
  `r_image_id` INTEGER NOT NULL AUTO_INCREMENT,
  `r_image_value` VARCHAR(50) NOT NULL,
  `hotel_id` INTEGER NOT NULL,
  FOREIGN KEY (hotel_id) REFERENCES hotels(hotel_id),
  PRIMARY KEY (`r_image_id`)
) ENGINE = InnoDB;

-- TABLE LOAI THIET BI
CREATE TABLE IF NOT EXISTS `device_types` (
  `dt_id` INTEGER NOT NULL AUTO_INCREMENT,
  `dt_name` VARCHAR(50) NOT NULL,
  `dt_desc` VARCHAR(50) NOT NULL,
  PRIMARY KEY (`dt_id`)
) ENGINE = InnoDB;

-- TABLE PHONG
CREATE TABLE IF NOT EXISTS `rooms` (
  `room_id` INTEGER NOT NULL AUTO_INCREMENT,
  `floor_id` INTEGER NOT NULL,
  `rt_id` INTEGER NOT NULL,
  `status_id` INTEGER NOT NULL,
  `hotel_id` INTEGER NOT NULL,
  `room_name` VARCHAR(50) NOT NULL,
  `room_desc` TEXT DEFAULT "",
  `room_thumb` VARCHAR(50) NOT NULL,
  `avaiable` BOOLEAN DEFAULT TRUE,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (floor_id) REFERENCES floors(floor_id),
  FOREIGN KEY (rt_id) REFERENCES room_types(rt_id),
  FOREIGN KEY (status_id) REFERENCES statuses(status_id),
  FOREIGN KEY (hotel_id) REFERENCES hotels(hotel_id),
  PRIMARY KEY (`room_id`, `floor_id`)
) ENGINE = InnoDB;

-- TABLE THOI GIAN THOI DIEM THAY DOI GIA.
CREATE TABLE IF NOT EXISTS `times` (
  `time_id` INTEGER NOT NULL AUTO_INCREMENT,
  `date` DATE,
  `time_desc` VARCHAR(50) NULL DEFAULT '',
  PRIMARY KEY (`time_id`)
) ENGINE = InnoDB;

-- TABLE GIA PHONG.
CREATE TABLE IF NOT EXISTS `room_prices` (
  `floor_id` INTEGER NOT NULL,
  `room_id` INTEGER NOT NULL,
  `time_id` INTEGER NOT NULL,
  `price` INT CHECK(price > 10),
  FOREIGN KEY (floor_id) REFERENCES rooms(floor_id),
  FOREIGN KEY (room_id) REFERENCES rooms(room_id),
  FOREIGN KEY (time_id) REFERENCES times(time_id),
  PRIMARY KEY (`time_id`, `room_id`, `floor_id`)
) ENGINE = InnoDB;

-- TABLE TRANG BI THIET BI CHO PHONG.
CREATE TABLE IF NOT EXISTS `equipments` (
  `floor_id` INTEGER NOT NULL,
  `room_id` INTEGER NOT NULL,
  `dt_id` INTEGER NOT NULL,
  FOREIGN KEY (floor_id) REFERENCES rooms(floor_id),
  FOREIGN KEY (room_id) REFERENCES rooms(room_id),
  FOREIGN KEY (dt_id) REFERENCES device_types(dt_id),
  PRIMARY KEY (`dt_id`, `room_id`, `floor_id`)
) ENGINE = InnoDB;

-- TABLE CHI TIET HOA DON
CREATE TABLE IF NOT EXISTS `bill_details` (
  `bill_id` INTEGER NOT NULL,
  `floor_id` INTEGER NOT NULL,
  `room_id` INTEGER NOT NULL,
  `price` INTEGER CHECK(price > 10),
  FOREIGN KEY (bill_id) REFERENCES bills(bill_id),
  FOREIGN KEY (room_id) REFERENCES rooms(room_id),
  FOREIGN KEY (floor_id) REFERENCES rooms(floor_id),
  PRIMARY KEY (`bill_id`, `room_id`, `floor_id`)
) ENGINE = InnoDB;

-- TABLE SU DUNG DICH VU
CREATE TABLE IF NOT EXISTS `use_service` (
  `floor_id` INTEGER NOT NULL,
  `room_id` INTEGER NOT NULL,
  `bill_id` INTEGER NOT NULL,
  `service_id` INTEGER NOT NULL,
  FOREIGN KEY (floor_id) REFERENCES bill_details(floor_id),
  FOREIGN KEY (room_id) REFERENCES bill_details(room_id),
  FOREIGN KEY (bill_id) REFERENCES bill_details(bill_id),
  FOREIGN KEY (service_id) REFERENCES services(service_id),
  PRIMARY KEY (`bill_id`, `room_id`, `floor_id`, `service_id`)
) ENGINE = InnoDB;

-- TABLE TOKEN
CREATE TABLE IF NOT EXISTS `tokens` (
  `customer_id` INTEGER NOT NULL,
  `token` VARCHAR(255) NOT NULL,
  FOREIGN KEY (customer_id) REFERENCES customers(customer_id),
  PRIMARY KEY (`customer_id`)
) ENGINE = InnoDB;

-- TABLE SEESIONS
CREATE TABLE IF NOT EXISTS `seesions` (
  `customer_id` INTEGER NOT NULL,
  `refresh_token` VARCHAR(255) NOT NULL,
  FOREIGN KEY (customer_id) REFERENCES customers(customer_id),
  PRIMARY KEY (`customer_id`)
) ENGINE = InnoDB;