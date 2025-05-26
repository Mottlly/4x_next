SELECT
  "id",
  "boardref",
  "created_at",
  "updated_at"
FROM boardstate
WHERE id = $1;