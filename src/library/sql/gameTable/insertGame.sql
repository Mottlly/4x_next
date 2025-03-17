INSERT INTO gametable (auth_id) 
VALUES ($1) RETURNING *
;