require('dotenv').config();
const mysql = require('mysql2');

const pool = mysql
  .createPool({
    host: process.env.MYSQLHOST,
    user: process.env.MYSQLUSER,
    password: process.env.MYSQLPASSWORD,
    database: process.env.MYSQLDATABASE,
    timezone: '+00:00',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
    enableKeepAlive: true,
    keepAliveInitialDelay: 0,
  })
  .promise();

async function getUserFromEmail(emailAddress) {
  const [rows] = await pool.query(`SELECT * FROM users WHERE email = ?`, [emailAddress]);

  if (!rows[0]) {
    return null;
  }
  return rows[0];
}

async function createUser(emailAddress, passwordHash, firstName, lastName, admin) {
  try {
    response = await pool.query(
      `INSERT INTO users (email, password, first_name, last_name, admin) VALUES (?, ?, ?, ?, ?)`,
      [emailAddress, passwordHash, firstName, lastName, admin]
    );

    return response[0];
  } catch (error) {
    console.log(error);
    return false;
  }
}

async function addReservation(phone_number, datetime, guests, occasion, notes, table_id) {
  try {
    timestamp = new Date(datetime);

    response = await pool.query(
      `INSERT INTO reservation (phone_number, timestamp, guests, occasion, notes, table_id) VALUES (?, ?, ?, ?, ?, ?)`,
      [
        phone_number,
        timestamp.toISOString().slice(0, 19).replace('T', ' '),
        guests,
        occasion,
        notes,
        table_id,
      ]
    );

    return response[0];
  } catch (error) {
    console.log(error);
    return false;
  }
}

async function getTodayReservations() {
  try {
    response = await pool.query(
      `SELECT phone_number as phoneNumber, timestamp, guests as numGuests, occasion, notes
                                    FROM reservation
                                    WHERE timestamp >= DATE(CONVERT_TZ(NOW(), '+00:00', '+08:00'))
                                    AND timestamp < DATE(CONVERT_TZ(NOW() + INTERVAL 1 DAY, '+00:00', '+08:00'));        
                                    `,
      []
    );
    return response[0];
  } catch (error) {
    console.log(error);
    return false;
  }
}

async function getFilteredTableInfo(seats) {
  try {
    response = await pool.query(
      `SELECT table_id as tableID, table_count as tableCount, 0 as reservedCount 
                                    FROM reservation_tables
                                    WHERE max_seats >= ? and min_seats <= ? 
                                    ORDER BY 'max_seats' ASC
                                    `,
      [seats, seats]
    );

    const reformattedData = {};
    response[0].forEach(item => {
      reformattedData[item.tableID] = {
        tableID: item.tableID,
        tableCount: item.tableCount,
        reservedCount: item.reservedCount,
      };
    });

    return reformattedData;
  } catch (error) {
    console.log(error);
    return false;
  }
}

async function getReservedTables(date, seats) {
  try {
    response = await pool.query(
      `SELECT reservation.table_id AS tableID, COUNT(reservation.table_id) AS reservedCount, timestamp
                                    FROM reservation
                                    LEFT JOIN reservation_tables
                                    ON reservation.table_id = reservation_tables.table_id
                                    WHERE DATE(CONVERT_TZ(timestamp, '+00:00', '+08:00')) = DATE(CONVERT_TZ(?, '+00:00', '+08:00'))
                                    AND reservation.table_id IN (
                                        SELECT table_id
                                        FROM reservation_tables
                                        WHERE max_seats >= ? AND min_seats <= ?
                                    )
                                    GROUP BY reservation.table_id, timestamp, reservation_tables.max_seats;
                                    `,
      [date, seats, seats]
    );

    return response[0].reduce((acc, { tableID, reservedCount, timestamp }) => {
      timestamp = timestamp.toISOString();
      if (!acc[timestamp]) {
        acc[timestamp] = [];
      }
      acc[timestamp].push({ tableID, reservedCount });
      return acc;
    }, {});
  } catch (error) {
    console.log(error);
    return false;
  }
}

async function getReservationConfig() {
  try {
    response = await pool.query(
      `SELECT start_time as startTime, end_time as endTime, buffer
                                    FROM reservation_config
                                    `,
      []
    );

    return response[0][0];
  } catch (error) {
    console.log(error);
    return false;
  }
}

async function setReservationConfig(startTime, endTime, buffer) {
  try {
    response = await pool.query(`TRUNCATE TABLE reservation_config`, []);
    await pool.query(
      `INSERT INTO reservation_config (start_time, end_time, buffer)
                          VALUES (?, ?, ?)`,
      [
        startTime.toISOString().slice(0, 19).replace('T', ' '),
        endTime.toISOString().slice(0, 19).replace('T', ' '),
        buffer,
      ]
    );

    return true;
  } catch (error) {
    console.log(error);
    return false;
  }
}

async function getTableConfig() {
  try {
    response = await pool.query(
      `SELECT table_id as tableID, table_count as tableCount, max_seats as maxSeats, min_seats as minSeats
                                    FROM reservation_tables
                                    `,
      []
    );

    return response[0];
  } catch (error) {
    console.log(error);
    return false;
  }
}

async function setTableConfig(tables) {
  try {
    response = await pool.query(`TRUNCATE TABLE reservation_tables`, []);

    for (const table of tables) {
      if (table.tableCount && table.maxSeats && table.minSeats) {
        await pool.query(
          `INSERT INTO reservation_tables (table_count, max_seats, min_seats)
                                VALUES (?, ?, ?)`,
          [table.tableCount, table.maxSeats, table.minSeats]
        );
      }
    }

    return true;
  } catch (error) {
    console.log(error);
    return false;
  }
}

module.exports = {
  getUserFromEmail,
  createUser,
  addReservation,
  getTodayReservations,
  getFilteredTableInfo,
  getReservedTables,
  getReservationConfig,
  getTableConfig,
  setReservationConfig,
  setTableConfig,
};
