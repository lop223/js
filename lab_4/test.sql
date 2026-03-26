SELECT 
    t.id,
    t.amount,
    t.type,
    u.name
FROM transactions t
JOIN users u ON t.user_id = u.user_id;