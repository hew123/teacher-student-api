CREATE USER 'foo'@'%' IDENTIFIED BY 'test';
GRANT ALL ON *.* TO 'foo'@'%';
ALTER USER 'foo' IDENTIFIED WITH mysql_native_password BY 'test'; FLUSH PRIVILEGES;
CREATE DATABASE test
ALTER USER 'root'@'%' IDENTIFIED BY 'test';