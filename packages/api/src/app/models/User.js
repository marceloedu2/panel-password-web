import Sequelize, { Model } from 'sequelize'
import bcrypt from 'bcryptjs'

class User extends Model {
  static init(connection) {
    super.init(
      {
        name: Sequelize.STRING,
        email: Sequelize.STRING,
        password: Sequelize.VIRTUAL,
        password_hash: Sequelize.STRING,
        provider: Sequelize.BOOLEAN,
      },
      {
        sequelize: connection,
      }
    )
    this.addHook('beforeSave', async user => {
      if (user.password) {
        user.password_hash = await bcrypt.hash(user.password, 8)
      }
    })
    return this
  }
  static associate(models) {
    this.hasMany(models.Code, { foreignKey: 'user_id', as: 'codes' })
  }
  checkPassword(password) {
    return bcrypt.compare(password, this.password_hash)
  }
}
export default User
