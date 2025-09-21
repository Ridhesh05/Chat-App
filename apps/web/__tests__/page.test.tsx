import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Page from '../app/page';

// Mock the SocketProvider
jest.mock('../app/context/SocketProvider', () => ({
  useSocket: () => ({
    sendMessage: jest.fn(),
    joinRoom: jest.fn(),
    leaveRoom: jest.fn(),
    messages: [],
    connectedUsers: [],
    currentRoom: null,
    currentUsername: null,
    isConnected: true,
  }),
}));

describe('Chat Page', () => {
  it('renders join room form when not in room', () => {
    render(<Page />);
    
    expect(screen.getByText('Join Chat Room')).toBeInTheDocument();
    expect(screen.getByText('Enter your details to start chatting')).toBeInTheDocument();
    expect(screen.getByLabelText('Your Name')).toBeInTheDocument();
    expect(screen.getByLabelText('Room ID')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /join room/i })).toBeInTheDocument();
  });

  it('shows connection status', () => {
    render(<Page />);
    
    expect(screen.getByText('Connected')).toBeInTheDocument();
  });

  it('validates form inputs before joining room', async () => {
    const user = userEvent.setup();
    render(<Page />);
    
    const joinButton = screen.getByRole('button', { name: /join room/i });
    await user.click(joinButton);
    
    // Should show alert for empty fields
    expect(window.alert).toHaveBeenCalledWith('Please enter both username and room ID');
  });

  it('allows entering username and room ID', async () => {
    const user = userEvent.setup();
    render(<Page />);
    
    const usernameInput = screen.getByLabelText('Your Name');
    const roomIdInput = screen.getByLabelText('Room ID');
    
    await user.type(usernameInput, 'testuser');
    await user.type(roomIdInput, 'testroom');
    
    expect(usernameInput).toHaveValue('testuser');
    expect(roomIdInput).toHaveValue('testroom');
  });

  it('handles enter key press for joining room', async () => {
    const user = userEvent.setup();
    render(<Page />);
    
    const usernameInput = screen.getByLabelText('Your Name');
    const roomIdInput = screen.getByLabelText('Room ID');
    
    await user.type(usernameInput, 'testuser');
    await user.type(roomIdInput, 'testroom');
    await user.keyboard('{Enter}');
    
    // Should attempt to join room
    expect(window.alert).not.toHaveBeenCalled();
  });
});

