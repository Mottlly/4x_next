      SELECT * FROM gameTable
      WHERE auth_id = $1
      ORDER BY created_at DESC
      LIMIT 1;