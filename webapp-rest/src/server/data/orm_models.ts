/* 
  Sequelize will use each class to create a database table and each property 
  will be a column in that table. These classes also describe the data in the 
  database to the TypeScript compiler.

  The declare keyword tells the TypeScript compiler to behave as though the 
  properties have been defined but not to include those properties in the 
  compiled JavaScript.
*/

import {
  Model,
  CreationOptional,
  ForeignKey,
  InferAttributes,
  InferCreationAttributes,
} from "sequelize";

export class Person extends Model<
  InferAttributes<Person>,
  InferCreationAttributes<Person>
> {
  declare id?: CreationOptional<number>;
  declare name: string;
}

export class Calculation extends Model<
  InferAttributes<Calculation>,
  InferCreationAttributes<Calculation>
> {
  declare id?: CreationOptional<number>;
  declare age: number;
  declare years: number;
  declare nextage: number;
}

export class ResultModel extends Model<
  InferAttributes<ResultModel>,
  InferCreationAttributes<ResultModel>
> {
  declare id: CreationOptional<number>;
  declare personId: ForeignKey<Person["id"]>;
  declare calculationId: ForeignKey<Calculation["id"]>;
  declare Person?: InferAttributes<Person>;
  declare Calculation?: InferAttributes<Calculation>;
}
