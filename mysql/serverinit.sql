ALTER USER 'root'@'localhost' IDENTIFIED WITH mysql_native_password BY 'Asdgasmei#22';
flush privileges;


DROP DATABASE IF EXISTS demo;
CREATE DATABASE demo;
use demo;
DROP TABLE IF EXISTS customerReview;
DROP TABLE IF EXISTS restaurant;


CREATE TABLE restaurant (
  `id` INT NOT NULL,
  `name` VARCHAR(45) NULL,
  `phone` VARCHAR(45) NULL,
  `address` VARCHAR(45) NULL,
  `type` VARCHAR(45) NULL,
  `rating` DECIMAL NULL,
  `ratingcount` INT NULL,
  PRIMARY KEY (`id`));
CREATE TABLE customerReview (
  `id` INT NOT NULL AUTO_INCREMENT,
  `customerName` VARCHAR(45) NULL,
  `title` VARCHAR(45) NULL,
  `rating` INT NULL,
  `comment` VARCHAR(255) NULL,
  `publishDate` VARCHAR(45) NULL,
  `lastUpdated` varchar(45) NULL,
  `restaurantId` INT NOT NULL,
  PRIMARY KEY (`id`),
  INDEX `restaurantId_idx` (`restaurantId` ASC) VISIBLE,
  CONSTRAINT `restaurantId`
    FOREIGN KEY (`restaurantId`)
    REFERENCES `demo`.`restaurant` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION);

INSERT INTO restaurant 
VALUES 
(0, "Gordon's Delight", "123-456-8888", "123 Way out there dr", "Casual", 0, 0),
(1, "Gordon's Trashcan", "123-456-8889", "123 Way out there but to the left dr", "Fine Dining", 0, 0),
(2, "Gordon's Zoo", "123-456-8880", "123 Way out there but to the right dr", "Zoo", 0, 0);

INSERT INTO customerReview 
VALUES (0, "Reaper", "Life before death", 5, "A really long wait", CURDATE(), CURDATE(), 1),
(0, "Reaper", "Life before death", 5, "A really long wait", CURDATE(), CURDATE(), 1),
(0, "Reaper", "Life before death", 5, "A really long wait", CURDATE(), CURDATE(), 1),
(0, "Reaper", "Life before death", 5, "A really long wait", CURDATE(), CURDATE(), 1),
(0, "Reaper", "Life before death", 5, "A really long wait", CURDATE(), CURDATE(), 1),
(0, "Reaper", "Life before death", 5, "A really long wait", CURDATE(), CURDATE(), 1),
(0, "Reaper", "Life before death", 5, "A really long wait", CURDATE(), CURDATE(), 1),
(0, "Reaper", "Life before death", 5, "A really long wait", CURDATE(), CURDATE(), 1),
(0, "Reaper", "Life before death", 5, "A really long wait", CURDATE(), CURDATE(), 1),
(0, "Reaper", "Life before death", 5, "A really long wait", CURDATE(), CURDATE(), 1),
(0, "Reaper", "Life before death", 5, "A really long wait", CURDATE(), CURDATE(), 1),
(0, "Reaper", "Life before death", 5, "A really long wait", CURDATE(), CURDATE(), 1),
(0, "Reaper", "Life before death", 5, "A really long wait", CURDATE(), CURDATE(), 1),
(0, "Reaper", "Life before death", 5, "A really long wait", CURDATE(), CURDATE(), 1),
(0, "Reaper", "Life before death", 5, "A really long wait", CURDATE(), CURDATE(), 1),
(0, "Reaper", "Life before death", 5, "A really long wait", CURDATE(), CURDATE(), 1),
(0, "Reaper", "Life before death", 5, "A really long wait", CURDATE(), CURDATE(), 1),
(0, "Reaper", "Life before death", 5, "A really long wait", CURDATE(), CURDATE(), 1),
(0, "Reaper", "Life before death", 5, "A really long wait", CURDATE(), CURDATE(), 1),
(0, "Reaper", "Life before death", 5, "A really long wait", CURDATE(), CURDATE(), 1);
COMMIT;