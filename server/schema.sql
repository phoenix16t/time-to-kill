CREATE DATABASE timeToKill;

USE timeToKill;

/* TODO: remove this */
DROP TABLE businesses;

/* TODO: index the 'type' field */
CREATE TABLE businesses (
  id int(100) NOT NULL AUTO_INCREMENT,
  name varchar(50) NOT NULL,
  address varchar(50) NOT NULL,
  type varchar(50) NOT NULL,
  open varchar(10) NOT NULL,
  close varchar(10) NOT NULL,
  rating int,
  latitude double NOT NULL,
  longitude double NOT NULL,
  PRIMARY KEY (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

/* TODO: remove this test data */
INSERT INTO businesses (name, address, type, open, close, rating, latitude, longitude) values ('abc', '123 main st', 'bar', '11:00', '21:00', '5', 37.787833, -122.403624);
INSERT INTO businesses (name, address, type, open, close, rating, latitude, longitude) values ('def', '123 main st', 'bar', '11:00', '21:00', '5', 37.787833, -122.403624);