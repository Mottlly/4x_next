INSERT INTO gametable (user_id) 
VALUES ($1) RETURNING *
;
