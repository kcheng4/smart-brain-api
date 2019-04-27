BEGIN TRANSACTION;

INSERT into users (name, email, entries, joined) values ('Carlos','carlos@gmail.com', 5, '2019-01-02');

INSERT into login (hash, email) values ('$2a$10$BnW5YZTZYw5CjPnYa0a1nOwUgJ3lnYyvuN79/BdDpsXt31Vn7Vpv.', 'carlos@gmail.com');

COMMIT;