DROP TABLE zip_codes;
DROP TABLE zip_radius;
DROP TABLE zip_venues;
DROP TABLE venues;

CREATE TABLE zip_codes (
  zip varchar(5) PRIMARY KEY,
  max_range integer NOT NULL
);

CREATE TABLE zip_radius (
  zip1 varchar(5) NOT NULL,
  zip2 varchar(5) NOT NULL,
  distance real NOT NULL,
  UNIQUE (zip1, zip2)
);

CREATE TABLE zip_venues (
  zip varchar(5) PRIMARY KEY,
  last_update timestamp NOT NULL DEFAULT current_date,
  type varchar(10) NOT NULL
);

CREATE TABLE venues (
  id varchar(50) PRIMARY KEY,
  last_update timestamp NOT NULL DEFAULT current_date,
  name varchar(50) NOT NULL,
  address varchar(50) NOT NULL,
  zip varchar(5) NOT NULL,
  type varchar(10) NOT NULL,
  rating real
);



INSERT INTO zip_codes(zip, max_range) VALUES
  ('90033', 10),
  ('90031', 10),
  ('07601', 10);

INSERT INTO zip_radius(zip1, zip2, distance) VALUES
  ('90033', '90031', 5.2423),
  ('07601', '90031', 5.2423);

INSERT INTO zip_venues(zip, type) VALUES
  ('90033', 'bar'),
  ('07601', 'bar');

INSERT INTO venues(id, name, address, zip, type, rating) VALUES
  ('ABC', 'ABC', '123 main st', '90034', 'bar', 4),
  ('XYZ', 'XYZ', '987 first st', '90035', 'bar', 4);
