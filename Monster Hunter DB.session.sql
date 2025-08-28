-- Check what tables exist
SELECT name FROM sqlite_master WHERE type='table';

-- Check if your data.sql ran and loaded data
SELECT * FROM region;
SELECT * FROM monster_in_region;

SELECT COUNT(*) as total_regions FROM region;

SELECT COUNT(*) as total_monsters FROM monster_in_region;

SELECT * FROM region LIMIT 10;

SELECT region_id, monster_name, element, monster_class 
FROM monster_in_region 
LIMIT 10;

SELECT r.region_name, m.monster_name, m.element
FROM region r
JOIN monster_in_region m ON r.id = m.region_id
WHERE m.monster_class LIKE '%Elder Dragon%'
ORDER BY r.region_name;