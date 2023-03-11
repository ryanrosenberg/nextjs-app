export function getAllPlayerIds() {
  const playerData = require("../data/sample-data.json");

  const sqlite3 = require("sqlite3").verbose();

  let db = new sqlite3.Database("stats.db", sqlite3.OPEN_READONLY, (err) => {
    if (err) {
      console.error(err.message);
    }
  });

  let sql = `select distinct slug from people limit 5`;

  db.all(sql, (err, rows) => {
    if (err) {
      throw err;
    } else{
      return(callback(rows[0]))
    }
  })
}
