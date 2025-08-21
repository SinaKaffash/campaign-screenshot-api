-- Create database (run this manually if needed)
-- CREATE DATABASE campaign_db;
-- USE campaign_db;

-- Users table
CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_email (email)
);

-- Campaigns table
CREATE TABLE IF NOT EXISTS campaigns (
    id INT AUTO_INCREMENT PRIMARY KEY,
    camp_num INT NOT NULL,
    camp_text TEXT NOT NULL,
    user_id INT NOT NULL,
    status ENUM('finding', "pending", 'processing', 'done') DEFAULT 'finding',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_user_id (user_id),
    INDEX idx_camp_num (camp_num),
    INDEX idx_created_at (created_at)
);

-- Campaign channels table
CREATE TABLE IF NOT EXISTS campaign_channels (
    id INT AUTO_INCREMENT PRIMARY KEY,
    campaign_id INT NOT NULL,
    channel_name VARCHAR(100) NOT NULL,
    post_link TEXT,
    camp_num INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (campaign_id) REFERENCES campaigns(id) ON DELETE CASCADE,
    INDEX idx_campaign_id (campaign_id),
    INDEX idx_channel_name (channel_name)
);