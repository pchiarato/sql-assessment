SELECT * FROM vehicles
JOIN users ON vehicles.ownerid = users.id
WHERE users.firstname LIKE $1;