import { DataTypes, Model } from 'sequelize';
import bcrypt from 'bcrypt';
export class User extends Model {
    // Compare password method
    async comparePassword(candidatePassword) {
        return bcrypt.compare(candidatePassword, this.getDataValue('password'));
    }
}
export function UserFactory(sequelize) {
    User.init({
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
    }, {
        tableName: 'users',
        sequelize,
        hooks: {
            beforeCreate: async (user) => {
                const hashedPassword = await bcrypt.hash(user.getDataValue('password'), 10);
                user.setDataValue('password', hashedPassword);
            },
            beforeUpdate: async (user) => {
                if (user.changed('password')) {
                    const hashedPassword = await bcrypt.hash(user.getDataValue('password'), 10);
                    user.setDataValue('password', hashedPassword);
                }
            }
        }
    });
    return User;
}
