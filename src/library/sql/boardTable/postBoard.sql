INSERT INTO "boardstate" (user_id, game_id, boardref)
VALUES ($1, $2, $3::jsonb)
RETURNING *
;