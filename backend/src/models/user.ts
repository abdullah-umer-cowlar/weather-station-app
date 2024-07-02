import * as Sequelize from "sequelize";
import { DataTypes, Model, Optional } from "sequelize";

export interface UserAttributes {
  id: string;
  email: string;
  password: string;
}

export type UserPk = "id";
export type UserId = User[UserPk];
export type UserOptionalAttributes = "id";
export type UserCreationAttributes = Optional<
  UserAttributes,
  UserOptionalAttributes
>;

export class User
  extends Model<UserAttributes, UserCreationAttributes>
  implements UserAttributes
{
  id!: string;
  email!: string;
  password!: string;

  static initModel(sequelize: Sequelize.Sequelize): typeof User {
    return sequelize.define(
      "User",
      {
        id: {
          type: DataTypes.UUID,
          allowNull: false,
          defaultValue: DataTypes.UUIDV4,
          primaryKey: true,
        },
        email: {
          type: DataTypes.STRING(100),
          allowNull: false,
          unique: "users_email_key",
        },
        password: {
          type: DataTypes.STRING(100),
          allowNull: false,
        },
      },
      {
        defaultScope: {
          attributes: { exclude: ["password"] },
        },
        scopes: {
          withPassword: {},
        },
        tableName: "users",
        schema: "public",
        timestamps: false,
        indexes: [
          {
            name: "users_email_key",
            unique: true,
            fields: [{ name: "email" }],
          },
          {
            name: "users_pkey",
            unique: true,
            fields: [{ name: "id" }],
          },
        ],
      }
    ) as typeof User;
  }
}
