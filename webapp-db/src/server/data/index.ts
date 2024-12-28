/* 
This file is responsible for instantiating the repository so that 
the rest of the application can access data through the Repository 
interface without needing to know which implementation has been used.
*/
import { Repository } from "./repository";
//import { SqlRepository } from "./sql_repository"
// const repository: Repository = new SqlRepository()
import { OrmRepository } from "./orm_repository";
const repository: Repository = new OrmRepository();
export default repository;
