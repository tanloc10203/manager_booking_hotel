import { DBMysql } from "../../../database";

class StatusService {
  static create({ type, desc, key, value }) {
    return new Promise((resolve, reject) => {
      const q =
        "INSERT INTO statuses (`type`, `desc`, `key`, `value`) VALUES (?)";

      DBMysql.conn.query(q, [[type, desc, key, value]], (error, result) => {
        if (error) {
          reject(error);
        }

        resolve(result);
      });
    });
  }
}

export default StatusService;
