import { render, screen } from '@testing-library/react';
import { SocketProvider } from '../../app/context/SocketProvider';

// Mock Socket.IO client
const mockSocket = {
  on: jest.fn(),
  off: jest.fn(),
  emit: jest.fn(),
  connect: jest.fn(),
  disconnect: jest.fn(),
  connected: true,
};

jest.mock('socket.io-client', () => ({
  io: jest.fn(() => mockSocket),
}));

describe('SocketProvider', () => {
  it('provides socket context to children', () => {
    const TestComponent = () => {
      return <div>Test Component</div>;
    };

    render(
      <SocketProvider>
        <TestComponent />
      </SocketProvider>
    );

    expect(screen.getByText('Test Component')).toBeInTheDocument();
  });

  it('initializes socket connection', () => {
    render(
      <SocketProvider>
        <div>Test</div>
      </SocketProvider>
    );

    expect(mockSocket.on).toHaveBeenCalledWith('connect', expect.any(Function));
    expect(mockSocket.on).toHaveBeenCalledWith('disconnect', expect.any(Function));
  });
});

