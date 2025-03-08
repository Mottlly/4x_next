SELECT id, username, email, role 
FROM users 
WHERE email = $1
;