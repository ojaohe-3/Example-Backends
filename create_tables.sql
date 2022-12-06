CREATE TABLE Users (
id int NOT NULL UNIQUE PRIMARY KEY AUTO_INCREMENT,
first_name varchar(255) NOT NULL,
last_name varchar(255) NOT NULL,
email varchar(255) NOT NULL UNIQUE, 
password varchar(255) NOT NULL,
updated_at TIMESTAMP ,
last_login TIMESTAMP ,
created_at TIMESTAMP ,
admin BOOLEAN
);
CREATE TABLE Monitors (
    id int NOT NULL UNIQUE PRIMARY KEY AUTO_INCREMENT,
    timestamp BIGINT NOT NULL ,
    requests_total INT NOT NULL,
    error_requests INT NOT NULL,
    successfull_requests INT NOT NULL,
    message_rate FLOAT NOT NULL, 
    avg_response_time FLOAT NOT NULL, 
    std_response_time FLOAT NOT NULL,
    outgoing_requests FLOAT NOT NULL,
    outgoing_requests_rate FLOAT NOT NULL,
    database_writes INT NOT NULL,
    database_reads INT NOT NULL,
    database_write_rate FLOAT NOT NULL, 
    database_read_rate FLOAT NOT NULL
);


