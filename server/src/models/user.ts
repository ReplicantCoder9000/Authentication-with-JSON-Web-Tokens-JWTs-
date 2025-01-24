import { DataTypes, Sequelize, Model, Optional } from 'sequelize';
import bcrypt from 'bcrypt';

interface UserAttributes {
  id: number;
  username: string;
  password: string;
}

interface UserCreationAttributes extends Optional<UserAttributes, 'id'> {}

export class User extends Model<UserAttributes, UserCreationAttributes> implements UserAttributes {
  public id!: number;
  public username!: string;
  public password!: string;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;

  // Compare password method
  public async comparePassword(candidatePassword: string): Promise<boolean> {
    console.log({ candidatePassword, hashedPassword: this.getDataValue('password') });
    return bcrypt.compare(candidatePassword, this.getDataValue('password'));
  }
}

export function UserFactory(sequelize: Sequelize): typeof User {
  User.init(
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      username: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    },
    {
      tableName: 'users',
      sequelize,
      hooks: {
        beforeCreate: async (user: User) => {
          const hashedPassword = await bcrypt.hash(user.getDataValue('password'), 10);
          user.setDataValue('password', hashedPassword);
        },
        beforeUpdate: async (user: User) => {
          if (user.changed('password')) {
            const hashedPassword = await bcrypt.hash(user.getDataValue('password'), 10);
            user.setDataValue('password', hashedPassword);
          }
        }
      }
    }
  );

  return User;
}
