import { DataTypes, Model } from 'sequelize';
export class Ticket extends Model {
}
export function TicketFactory(sequelize) {
    Ticket.init({
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        status: {
            type: DataTypes.STRING,
            allowNull: false,
            defaultValue: 'Todo'
        },
        description: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        priority: {
            type: DataTypes.ENUM('low', 'medium', 'high'),
            allowNull: false,
            defaultValue: 'medium'
        },
        assignedUserId: {
            type: DataTypes.INTEGER,
            allowNull: true,
        },
    }, {
        tableName: 'tickets',
        sequelize,
        timestamps: true
    });
    return Ticket;
}
