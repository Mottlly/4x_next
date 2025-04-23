UPDATE "boardstate"
SET "boardref" = $1
WHERE "id" = $2
RETURNING boardref;