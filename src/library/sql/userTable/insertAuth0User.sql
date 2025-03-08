INSERT INTO users (auth_id) 
VALUES ($1) RETURNING *
;