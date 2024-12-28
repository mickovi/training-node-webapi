/* 
  A repository is a layer of code that isolates the database from the rest 
  of the application, which makes it easier to change the way that data is 
  read and written without needing to change the code that uses that data.
*/

export interface Result {
  id: number,
  name: string,
  age: number,
  years: number,
  nextage: number
}

export interface Repository {
  saveResult(r: Result): Promise<number>
  getAllResults(limit: number): Promise<Result[]>
  getResultsByName(name: string, limit: number): Promise<Result[]>
}