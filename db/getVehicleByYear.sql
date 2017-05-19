SELECT vehicles.make,vehicles.model,vehicles.year, users.firstname, users.lastname FROM vehicles
JOIN users ON vehicles.ownerid = users.id
WHERE vehicles.year >= 2000 ORDER BY vehicles.year DESC