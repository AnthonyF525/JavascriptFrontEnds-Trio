-- Monster Hunter Database Schema for SQLite

-- Drop tables if they exist (for clean restart)
DROP TABLE IF EXISTS monster_in_region;
DROP TABLE IF EXISTS region;

-- Create region table
CREATE TABLE region (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    region_name TEXT NOT NULL UNIQUE,
    climate TEXT NOT NULL,
    terrain TEXT NOT NULL
);

-- Create monster_in_region table
CREATE TABLE monster_in_region (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    region_id INTEGER NOT NULL,
    monster_name TEXT NOT NULL,
    element TEXT NOT NULL,
    monster_class TEXT NOT NULL,
    FOREIGN KEY (region_id) REFERENCES region(id)
);