INSERT INTO gametable (auth_id, created_at) 
VALUES ($1, NOW()) RETURNING *
;
