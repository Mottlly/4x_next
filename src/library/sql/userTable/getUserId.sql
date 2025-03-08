SELECT id, username, email, role 
FROM users 
WHERE id = $1
;