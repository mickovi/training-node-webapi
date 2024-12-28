/* 
  This file is responsible for instantiating the repository so that 
  the rest of the application can access data through the Repository 
  interface without needing to know which implementation has been used.
*/

import { ApiRepository } from "./repository";
import { OrmRepository } from "./orm_repository";
const repository: ApiRepository = new OrmRepository();
export default repository;
