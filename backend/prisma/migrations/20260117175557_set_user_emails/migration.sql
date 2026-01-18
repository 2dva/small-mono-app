UPDATE "User"
SET email = concat(nick, "@example.com")
WHERE email is NULL