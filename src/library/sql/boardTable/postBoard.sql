INSERT INTO boardstate (user_id, boardref)
VALUES ($1, $2::jsonb)
RETURNING *
;
