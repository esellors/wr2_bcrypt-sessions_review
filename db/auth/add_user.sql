insert into review_user(username, hash)
values (${username}, ${hash})
returning *;