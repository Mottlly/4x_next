UPDATE "boardstate"
SET "boardref" = $1,
    "updated_at" = now()
WHERE "id" = $2
RETURNING boardref;