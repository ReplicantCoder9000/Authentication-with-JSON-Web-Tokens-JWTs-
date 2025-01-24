import TicketCard from './TicketCard';
import { TicketData } from '../interfaces/TicketData';
import { ApiMessage } from '../interfaces/ApiMessage';

interface SwimlaneProps {
  title: string;
  tickets: TicketData[];
  deleteTicket: (ticketId: number) => Promise<ApiMessage>
}

const Swimlane = ({ title, tickets, deleteTicket }: SwimlaneProps) => {
  const getStatusStyle = (status: string) => {
    switch (status.toLowerCase()) {
      case 'todo':
        return {
          backgroundColor: 'rgba(229, 62, 62, 0.1)',
          borderColor: 'var(--color-error)'
        };
      case 'in progress':
        return {
          backgroundColor: 'rgba(100, 90, 255, 0.1)',
          borderColor: 'var(--color-accent)'
        };
      case 'done':
        return {
          backgroundColor: 'rgba(56, 161, 105, 0.1)',
          borderColor: 'var(--color-success)'
        };
      default:
        return {
          backgroundColor: 'var(--color-background)',
          borderColor: 'var(--color-border)'
        };
    }
  };

  const style = getStatusStyle(title);

  return (
    <div 
      className="swim-lane fade-in"
      style={{
        ...style,
        borderWidth: '1px',
        borderStyle: 'solid',
        borderRadius: '0.5rem'
      }}
    >
      <div className="swim-lane-header">
        <h2 className="swim-lane-title">
          {title}
          <span className="ticket-count">{tickets.length}</span>
        </h2>
      </div>
      <div className="swim-lane-content">
        {tickets.map(ticket => (
          <TicketCard 
            key={ticket.id}
            ticket={ticket}
            deleteTicket={deleteTicket}
          />
        ))}
        {tickets.length === 0 && (
          <div className="empty-state">
            No tickets in this column
          </div>
        )}
      </div>
    </div>
  );
};

export default Swimlane;
