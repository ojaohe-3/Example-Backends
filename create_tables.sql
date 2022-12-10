
CREATE TABLE Users (
id SERIAL PRIMARY KEY,
first_name varchar(255) NOT NULL,
last_name varchar(255) NOT NULL,
email varchar(255) NOT NULL UNIQUE, 
password varchar(255) NOT NULL,
updated_at TIMESTAMP ,
last_login TIMESTAMP ,
created_at TIMESTAMP ,
admin BOOLEAN
);



