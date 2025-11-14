const { pool } = require('../config/database');

class User {
  static async create(userData) {
    const {
      firstName,
      lastName,
      middleName,
      birthDate,
      email,
      password,
      role = 'user'
    } = userData;

    const query = `
      INSERT INTO users (first_name, last_name, middle_name, birth_date, email, password, role)
      VALUES ($1, $2, $3, $4, $5, $6, $7)
      RETURNING *
    `;

    const values = [firstName, lastName, middleName, birthDate, email, password, role];
    const result = await pool.query(query, values);
    return result.rows[0];
  }

  static async findByEmail(email) {
    const query = 'SELECT * FROM users WHERE email = $1';
    const result = await pool.query(query, [email]);
    return result.rows[0] || null;
  }

  static async findById(id) {
    const query = 'SELECT * FROM users WHERE id = $1';
    const result = await pool.query(query, [id]);
    return result.rows[0] || null;
  }

  static async findAll() {
    const query = 'SELECT * FROM users ORDER BY created_at DESC';
    const result = await pool.query(query);
    return result.rows;
  }

  static async toggleStatus(id) {
    const query = `
      UPDATE users 
      SET is_active = NOT is_active, updated_at = CURRENT_TIMESTAMP 
      WHERE id = $1 
      RETURNING *
    `;
    const result = await pool.query(query, [id]);
    return result.rows[0];
  }

  static async update(id, updateData) {
    const allowedFields = ['first_name', 'last_name', 'middle_name', 'birth_date'];
    const fields = [];
    const values = [];
    let paramCount = 1;

    for (const [key, value] of Object.entries(updateData)) {
      const dbField = key === 'firstName' ? 'first_name' :
                     key === 'lastName' ? 'last_name' :
                     key === 'middleName' ? 'middle_name' :
                     key === 'birthDate' ? 'birth_date' : key;
      
      if (allowedFields.includes(dbField) && value !== undefined) {
        fields.push(`${dbField} = $${paramCount}`);
        values.push(value);
        paramCount++;
      }
    }

    if (fields.length === 0) {
      throw new Error('No valid fields to update');
    }

    fields.push('updated_at = $' + paramCount);
    values.push(new Date());
    values.push(id);

    const query = `UPDATE users SET ${fields.join(', ')} WHERE id = $${paramCount} RETURNING *`;
    const result = await pool.query(query, values);
    return result.rows[0];
  }
}

module.exports = User;