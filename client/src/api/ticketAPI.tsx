import { TicketData } from '../interfaces/TicketData';
import { ApiMessage } from '../interfaces/ApiMessage';
import { API_BASE_URL, getCommonHeaders, handleResponse } from './config';

const retrieveTickets = async () => {
  try {
    const response = await fetch(
      `${API_BASE_URL}/rest/v1/tickets`,
      {
        headers: getCommonHeaders()
      }
    );
    return handleResponse(response);
  } catch (err) {
    console.log('Error from data retrieval: ', err);
    return [];
  }
};

const retrieveTicket = async (id: number | null): Promise<TicketData> => {
  try {
    const response = await fetch(
      `${API_BASE_URL}/rest/v1/tickets?id=eq.${id}`,
      {
        headers: getCommonHeaders()
      }
    );

    const data = await handleResponse(response);
    return data[0]; // Supabase returns an array, we want the first item
  } catch (err) {
    console.log('Error from data retrieval: ', err);
    return Promise.reject('Could not fetch singular ticket');
  }
}

const createTicket = async (body: TicketData) => {
  try {
    const response = await fetch(
      `${API_BASE_URL}/rest/v1/tickets`, {
        method: 'POST',
        headers: {
          ...getCommonHeaders(),
          'Prefer': 'return=representation'
        },
        body: JSON.stringify(body)
      }
    );

    return handleResponse(response);

  } catch (err) {
    console.log('Error from Ticket Creation: ', err);
    throw err; // Re-throw to handle in component
  }
}

const updateTicket = async (ticketId: number, body: TicketData): Promise<TicketData> => {
  try {
    const response = await fetch(
      `${API_BASE_URL}/rest/v1/tickets?id=eq.${ticketId}`, {
        method: 'PATCH',
        headers: {
          ...getCommonHeaders(),
          'Prefer': 'return=representation'
        },
        body: JSON.stringify(body)
      }
    );

    const data = await handleResponse(response);
    return data[0]; // Supabase returns an array, we want the first item
  } catch (err) {
    console.error('Update did not work', err);
    return Promise.reject('Update did not work');
  }
};

const deleteTicket = async (ticketId: number): Promise<ApiMessage> => {
  try {
    const response = await fetch(
      `${API_BASE_URL}/rest/v1/tickets?id=eq.${ticketId}`, {
        method: 'DELETE',
        headers: getCommonHeaders()
      }
    );

    await handleResponse(response);
    return { message: 'Ticket deleted successfully' };
  } catch (err) {
    console.error('Error in deleting ticket', err);
    return Promise.reject('Could not delete ticket');
  }
};

export { createTicket, deleteTicket, retrieveTickets, retrieveTicket, updateTicket};
