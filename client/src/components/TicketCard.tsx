import { Link } from 'react-router-dom';
import { MouseEventHandler } from 'react';
import { TicketData } from '../interfaces/TicketData';
import { ApiMessage } from '../interfaces/ApiMessage';

interface TicketCardProps {
  ticket: TicketData;
  deleteTicket: (ticketId: number) => Promise<ApiMessage>
}

const TicketCard = ({ ticket, deleteTicket }: TicketCardProps) => {
  const handleDelete: MouseEventHandler<HTMLButtonElement> = async (event) => {
    const ticketId = Number(event.currentTarget.value);
    if (!isNaN(ticketId)) {
      try {
        const data = await deleteTicket(ticketId);
        return data;
      } catch (error) {
        console.error('Failed to delete ticket:', error);
      }
    }
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'todo':
        return 'var(--color-error)';
      case 'in progress':
        return 'var(--color-accent)';
      case 'done':
        return 'var(--color-success)';
      default:
        return 'var(--color-border)';
    }
  };

  const getPriorityColor = () => {
    const priority = ticket.priority?.toLowerCase() || 'medium';
    switch (priority) {
      case 'high':
        return 'var(--color-error)';
      case 'medium':
        return 'var(--color-accent)';
      case 'low':
        return 'var(--color-success)';
      default:
        return 'var(--color-text-secondary)';
    }
  };

  return (
    <div className="ticket-card slide-in" data-priority={ticket.priority?.toLowerCase() || 'medium'}>
      <div className="ticket-header">
        <div className="ticket-header-left">
          <div className="ticket-title-group">
            <h3 className="ticket-title">{ticket.name}</h3>
            <div className="ticket-badges">
              <div 
                className="status-indicator"
                style={{ backgroundColor: getStatusColor(ticket.status || 'todo') }}
                title={ticket.status || 'Todo'}
              />
              <div 
                className="priority-badge"
                style={{ backgroundColor: getPriorityColor() }}
                title={`Priority: ${ticket.priority || 'Medium'}`}
              >
                {ticket.priority?.[0]?.toUpperCase() || 'M'}
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <p className="ticket-description">{ticket.description}</p>
      
      <div className="ticket-meta">
        <div className="ticket-meta-left">
          <span className="assigned-user">
            {ticket.assignedUser?.username || 'Unassigned'}
          </span>
          <span className="ticket-id">#{ticket.id}</span>
        </div>
        <div className="ticket-meta-right">
          <span className="ticket-date">
            {new Date(ticket.createdAt || '').toLocaleDateString()}
          </span>
        </div>
      </div>
      
      <div className="ticket-actions">
        <Link 
          to="/edit" 
          state={{ id: ticket.id }} 
          className="btn-secondary btn-sm"
        >
          Edit
        </Link>
        <button
          type="button"
          value={String(ticket.id)}
          onClick={handleDelete}
          className="btn-primary btn-sm"
        >
          Delete
        </button>
      </div>
    </div>
  );
};

export default TicketCard;
