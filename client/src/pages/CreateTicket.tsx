import { useState, useEffect, FormEvent, ChangeEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { createTicket } from '../api/ticketAPI';
import { TicketData } from '../interfaces/TicketData';
import Auth from '../utils/auth';

const CreateTicket = () => {
  const navigate = useNavigate();
  const [error, setError] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Get user profile
  const [userProfile, setUserProfile] = useState(() => {
    const profile = Auth.getProfile();
    console.log('Initial user profile:', profile); // Debug log
    return profile;
  });

  // Re-check user profile if token changes
  useEffect(() => {
    const checkAuth = () => {
      const profile = Auth.getProfile();
      console.log('Checking user profile:', profile); // Debug log
      setUserProfile(profile);
      
      if (!profile?.id) {
        console.log('No valid user profile, redirecting to login'); // Debug log
        navigate('/');
      }
    };

    checkAuth();
  }, [navigate]);

  const [newTicket, setNewTicket] = useState<TicketData>(() => ({
    id: null,
    name: '',
    description: '',
    status: 'Todo',
    assignedUserId: userProfile?.id ? Number(userProfile.id) : null,
    assignedUser: null
  }));

  // Update ticket's assignedUserId when userProfile changes
  useEffect(() => {
    if (userProfile?.id) {
      setNewTicket(prev => ({
        ...prev,
        assignedUserId: Number(userProfile.id)
      }));
    }
  }, [userProfile]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);

    try {
      const currentProfile = Auth.getProfile(); // Get fresh profile
      if (!currentProfile?.id) {
        throw new Error('No user ID available');
      }

      if (!newTicket.name?.trim()) {
        throw new Error('Ticket name is required');
      }

      if (!newTicket.description?.trim()) {
        throw new Error('Ticket description is required');
      }

      // Ensure assignedUserId is set correctly
      const ticketToSubmit: TicketData = {
        ...newTicket,
        assignedUserId: Number(currentProfile.id)
      };

      console.log('Submitting ticket:', ticketToSubmit); // Debug log
      await createTicket(ticketToSubmit);
      navigate('/board');
    } catch (err) {
      console.error('Submission error:', err); // Debug log
      if (err instanceof Error && err.message === 'No user ID available') {
        navigate('/');
      } else {
        setError(err instanceof Error ? err.message : 'Failed to create ticket');
      }
    } finally {
      setIsSubmitting(false);
    }
  }

  const handleTextAreaChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setError('');
    setNewTicket((prev) => ({ ...prev, [name]: value }));
  };

  const handleTextChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setError('');
    setNewTicket((prev) => ({ ...prev, [name]: value }));
  }

  if (!userProfile?.id) {
    return null;
  }

  return (
    <div className='container'>
      <form className='form' onSubmit={handleSubmit}>
        <h1>Create Ticket</h1>
        {error && (
          <div className="error-message" style={{ color: 'red', marginBottom: '1rem' }}>
            {error}
          </div>
        )}
        <label htmlFor='tName'>Ticket Name</label>
        <textarea 
          id='tName'
          name='name'
          value={newTicket.name || ''}
          onChange={handleTextAreaChange}
          required
        />
        <label htmlFor='tStatus'>Ticket Status</label>
        <select 
          name='status' 
          id='tStatus'
          value={newTicket.status || 'Todo'}
          onChange={handleTextChange}
          aria-label="Ticket Status"
          required
        >
          <option value='Todo'>Todo</option>
          <option value='In Progress'>In Progress</option>
          <option value='Done'>Done</option>
        </select>
        <label htmlFor='tDescription'>Ticket Description</label>
        <textarea 
          id='tDescription'
          name='description'
          value={newTicket.description || ''}
          onChange={handleTextAreaChange}
          required
        />
        <button 
          type='submit' 
          disabled={isSubmitting}
          style={{ opacity: isSubmitting ? 0.7 : 1 }}
        >
          {isSubmitting ? 'Creating...' : 'Submit Form'}
        </button>
      </form>
    </div>
  );
};

export default CreateTicket;
