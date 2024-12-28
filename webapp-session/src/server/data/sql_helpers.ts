/* 
The insertPerson, insertCalculation and insertResult statements need to be executed within
a transaction to ensure consistency. The SQLite database engine supports transactions, but 
these are not exposed conveniently to Node.js and additional work is required to run SQL 
statements in a transaction.
*/

import { Database } from "sqlite3";

export class TransactionHelper {
  steps: [sql: string, params: any][] = []; // arrays de tuplas
  add(sql: string, params: any): TransactionHelper {
    this.steps.push([sql, params]);
    return this;
  }
  run(db: Database): Promise<number> {
    return new Promise((resolve, reject) => {
      let index = 0;
      let lastRow: number = NaN;
      const cb = (err: any, rowID?: number) => {
        if (err) {
          // The ROLLBACK command is sent if any of the statements fail
          // and SQLite abandons the changes made by earlier statements.
          db.run("ROLLBACK", () => reject());
        } else {
          lastRow = rowID ? rowID : lastRow;
          if (++index === this.steps.length) {
            // If all the statements execute successfully,
            // the COMMIT command is sent, and SQLite applies
            // the changes to the database.
            db.run("COMMIT", () => resolve(lastRow));
          } else {
            this.runStep(index, db, cb);
          }
        }
      };
      // When the run method is called, the BEGIN command is
      // sent to SQLite, and each of the SQL statements is run.
      db.run("BEGIN", () => this.runStep(0, db, cb));
    });
  }
  runStep(idx: number, db: Database, cb: (err: any, row: number) => void) {
    const [sql, params] = this.steps[idx];
    db.run(sql, params, function (err: any) {
      cb(err, this.lastID);
    });
  }
}
