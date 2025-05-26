SELECT
  "id",
  "boardref",
  "created_at",
  "updated_at"
FROM boardstate
WHERE game_id = $1;