import { DataTypes, Sequelize } from "sequelize";
import { Calculation, Person, ResultModel } from "./orm_models";
import { Result } from "./repository";

const primaryKey = {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
};

/* 
  - The init method accepts an object whose properties correspond to those defined by the class. 
  Each property is assigned a configuration object that tells Sequelize how to represent the 
  data in the database.
  - The sequelize property is a Sequelize object that will be created to manage the database.
*/

export const initializeModels = (sequelize: Sequelize) => {
  Person.init(
    {
      ...primaryKey,
      name: { type: DataTypes.STRING },
    },
    { sequelize }
  );
  Calculation.init(
    {
      ...primaryKey,
      age: { type: DataTypes.INTEGER },
      years: { type: DataTypes.INTEGER },
      nextage: { type: DataTypes.INTEGER },
    },
    { sequelize }
  );
  ResultModel.init(
    {
      ...primaryKey,
    },
    { sequelize }
  );
};

export const defineRelationships = () => {
  ResultModel.belongsTo(Person, { foreignKey: "personId" });
  ResultModel.belongsTo(Calculation, { foreignKey: "calculationId" });
};

export const addSeedData = async (sequelize: Sequelize) => {
  await sequelize.query(`
      INSERT INTO Calculations
          (id, age, years, nextage, createdAt, updatedAt) VALUES
              (1, 35, 5, 40, date(), date()),
              (2, 35, 10, 45, date(), date())`);
  await sequelize.query(`
      INSERT INTO People (id, name, createdAt, updatedAt) VALUES
          (1, 'Alice', date(), date()), (2, "Bob", date(), date())`);
  await sequelize.query(`
      INSERT INTO ResultModels
              (calculationId, personId, createdAt, updatedAt) VALUES
          (1, 1, date(), date()), (2, 2, date(), date()),
          (2, 1, date(), date());`);
};

/* 
  fromOrmModel converts data models to flat objects beacuse the ORM data model objects 
  do not conform to the requirements of the Result type used by the Repository interface.
*/
export const fromOrmModel = (model: ResultModel | null): Result => {
  return {
    id: model?.id || 0,
    name: model?.Person?.name || "",
    age: model?.Calculation?.age || 0,
    years: model?.Calculation?.years || 0,
    nextage: model?.Calculation?.nextage || 0,
  };
};
