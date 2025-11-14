const bcrypt = require('bcryptjs');

class PasswordUtils {
  static async hash(password) {
    const saltRounds = 12;
    return await bcrypt.hash(password, saltRounds);
  }

  static async compare(password, hashedPassword) {
    return await bcrypt.compare(password, hashedPassword);
  }

  static validate(password) {
    if (password.length < 6) {
      throw new Error('Password must be at least 6 characters long');
    }
    return true;
  }
}

module.exports = PasswordUtils;