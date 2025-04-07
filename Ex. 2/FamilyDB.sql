create database familyDB

go
use familyDB
go
CREATE TABLE persons
(
  Person_Id int NOT NULL PRIMARY KEY,
  Personal_Name varchar(255),
  Family_Name varchar(255),
  Gender varchar(10),
  Father_Id int FOREIGN KEY REFERENCES Persons(Person_Id),
  Mother_Id int FOREIGN KEY REFERENCES Persons(Person_Id),
  Spouse_Id int FOREIGN KEY REFERENCES Persons(Person_Id)
)
go
create table FamilyTree
(
  Person_Id int FOREIGN KEY REFERENCES Persons(Person_Id),
  Relative_Id int FOREIGN KEY REFERENCES Persons(Person_Id),
  Connection_Type varchar(20),
  PRIMARY KEY (Person_Id, Relative_Id, Connection_Type),
  CONSTRAINT Check_Connection_Type CHECK (Connection_Type IN ('אב', 'אם', 'אח', 'אחות', 'בן', 'בת', 'בן זוג', 'בת זוג'))
)
--insert
--Persons table
INSERT INTO Persons (Person_Id, Personal_Name, Family_Name, Gender, Father_Id, Mother_Id, Spouse_Id)
VALUES
  (1, 'אדם', 'ראשון', 'זכר', NULL, NULL, 2),
  (2, 'חוה', 'ראשונה', 'נקבה', NULL, NULL, 1),
  (3, 'קין', 'ראשון', 'זכר', 1, 2, NULL),
  (4, 'הבל', 'ראשון', 'זכר', 1, 2, NULL),
  (5, 'שת', 'ראשון', 'זכר', 1, 2, 6),
  (6, 'אשתו של שת', 'ראשונה', 'נקבה', null, null, 5),
  (7, 'אנוש', 'ראשון', 'זכר', 5, 6, 8),
  (8, 'אשתו של אנוש', 'ראשונה', 'נקבה', null, null, 7);


--FamilyTree
INSERT INTO FamilyTree (Person_Id, Relative_Id, Connection_Type)
VALUES
  (3, 1, 'אב'),
  (1, 3, 'בן'),
  (3, 2, 'אם'),
  (2, 3, 'בת'),
  (4, 1, 'אב'),
  (1, 4, 'בן'),
  (4, 2, 'אם'),
  (2, 4, 'בת'),
  (5, 1, 'אב'),
  (1, 5, 'בן'),
  (5, 2, 'אם'),
  (2, 5, 'בת'),
  (5, 6, 'בן זוג'),
  (6, 5, 'בת זוג'),
  (7, 5, 'אב'),
  (5, 7, 'בן'),
  (7, 6, 'אם'),
  (6, 7, 'בת'),
  (7, 8, 'בן זוג'),
  (8, 7, 'בת זוג');



    --ex.1
    /*This trigger is executed after a new person is inserted into the Persons table.
    It automatically creates corresponding relationship entries in the FamilyTree table for the new person's family members
    (father, mother, spouse).*/
    go
    CREATE TRIGGER AddPersonToFamilyTree
    ON Persons
    AFTER INSERT
    AS
    BEGIN

      DECLARE @PersonId INT;
      DECLARE @FatherId INT;
      DECLARE @MotherId INT;
      DECLARE @SpouseId INT;
      DECLARE @Gender VARCHAR(10);

      SELECT @PersonId = Person_Id, @FatherId = Father_Id, @MotherId = Mother_Id, @SpouseId = Spouse_Id, @Gender = Gender
      FROM inserted;

      
      IF @FatherId IS NOT NULL
      BEGIN
        INSERT INTO FamilyTree (Person_Id, Relative_Id, Connection_Type)
        VALUES (@PersonId, @FatherId, 'אב');

        INSERT INTO FamilyTree (Person_Id, Relative_Id, Connection_Type)
        VALUES (@FatherId, @PersonId,
            CASE
              WHEN @Gender = 'זכר' THEN 'בן'
              ELSE 'בת'
              END);
      END

      
      IF @MotherId IS NOT NULL
      BEGIN
        INSERT INTO FamilyTree (Person_Id, Relative_Id, Connection_Type)
        VALUES (@PersonId, @MotherId, 'אם');

        INSERT INTO FamilyTree (Person_Id, Relative_Id, Connection_Type)
        VALUES (@MotherId, @PersonId,
            CASE
              WHEN @Gender = 'זכר' THEN 'בן'
              ELSE 'בת'
              END);
      END

      
      IF @SpouseId IS NOT NULL
      BEGIN
        INSERT INTO FamilyTree (Person_Id, Relative_Id, Connection_Type)
        VALUES (@PersonId, @SpouseId,
            CASE
              WHEN (SELECT Gender FROM Persons WHERE Person_Id = @SpouseId) = 'זכר' THEN 'בן זוג'
              ELSE 'בת זוג'
              END);

        INSERT INTO FamilyTree (Person_Id, Relative_Id, Connection_Type)
        VALUES (@SpouseId, @PersonId,
            CASE
              WHEN @Gender = 'זכר' THEN 'בת זוג'
              ELSE 'בן זוג'
              END);
      END
    END;
    go

    --ex. 2

    /*This trigger is executed after an update on the Persons table,
    specifically when the Spouse_Id column is modified.
    It ensures that when a spouse is assigned, their record is created if it doesn't exist,
    and the relationship is established in the FamilyTree table.*/

    CREATE TRIGGER CompleteSpouseRelationship
    ON persons
    AFTER UPDATE, INSERT
    AS
    BEGIN

      
        IF UPDATE(Spouse_Id)
        BEGIN
            DECLARE @PersonId INT;
            DECLARE @SpouseId INT;

            SELECT @PersonId = Person_Id, @SpouseId = Spouse_Id
            FROM inserted;

            IF NOT EXISTS (SELECT 1 FROM Persons WHERE Person_Id = @SpouseId)
            BEGIN
                INSERT INTO Persons (Person_Id, Gender, Spouse_Id)
                VALUES (@SpouseId,
                    CASE
                        WHEN (SELECT Gender FROM Persons WHERE Person_Id = @PersonId) = 'זכר' THEN 'נקבה'
                        ELSE 'זכר'
                    END,
                    @PersonId);
            END;

            IF EXISTS (SELECT 1 FROM Persons WHERE Person_Id = @SpouseId)
            BEGIN
                UPDATE Persons
                SET Spouse_Id = @PersonId
                WHERE Person_Id = @SpouseId;
            END;

            IF NOT EXISTS (
                SELECT 1
                FROM FamilyTree
                WHERE Person_Id = @SpouseId AND Relative_Id = @PersonId
            )
            BEGIN
                INSERT INTO FamilyTree (Person_Id, Relative_Id, Connection_Type)
                SELECT
                    @SpouseId,
                    @PersonId,
                    CASE
                        WHEN (SELECT Gender FROM Persons WHERE Person_Id = @PersonId) = 'זכר' THEN 'בת-זוג'
                        ELSE 'בן-זוג'
                    END;
            END;

            IF NOT EXISTS (
                SELECT 1
                FROM FamilyTree
                WHERE Person_Id = @PersonId AND Relative_Id = @SpouseId
            )
            BEGIN
                INSERT INTO FamilyTree (Person_Id, Relative_Id, Connection_Type)
                SELECT
                    @PersonId,
                    @SpouseId,
                    CASE
                        WHEN (SELECT Gender FROM Persons WHERE Person_Id = @SpouseId) = 'זכר' THEN 'בן-זוג'
                        ELSE 'בת-זוג'
                    END;
            END;
        END;
    END;
    go
