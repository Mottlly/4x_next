INSERT INTO boardstate (user_id, game_id, board_data)
VALUES ($1, $2, $3::jsonb)
RETURNING *
;