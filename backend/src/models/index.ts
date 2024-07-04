import { sequelize } from "../config/postgresConn";
import { initModels } from "./init-models";

export const { User } = initModels(sequelize);
