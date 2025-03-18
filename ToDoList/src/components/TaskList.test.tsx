import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import TaskList from './TaskList';

global.fetch = jest.fn().mockImplementation((url, options) => {
    if (url === 'http://localhost:5175/api/Task' && (!options || options.method === 'GET')) {
      return Promise.resolve({
        ok: true,
        status: 200,
        statusText: 'OK',
        headers: new Headers(),
        json: jest.fn().mockResolvedValue([
          {
            id: 1,
            name: 'Test Task',
            dueDate: '2023-12-31',
            status: 'ToDo',
            description: 'This is a test task',
          },
        ]),
        text: jest.fn().mockResolvedValue(''),
        redirected: false,
        type: 'default',
        url: 'http://localhost:5175/api/Task',
      });
    }

    if (url === 'http://localhost:5175/api/Task' && options?.method === 'POST') {
      return Promise.resolve({
        ok: true,
        status: 200,
        statusText: 'Created',
        headers: new Headers(),
        json: jest.fn().mockResolvedValue({ id: 2, name: 'New Task' }),
        text: jest.fn().mockResolvedValue(''),
        redirected: false,
        type: 'default',
        url: 'http://localhost:5175/api/Task',
      });
    }

    if (url === 'http://localhost:5175/api/Task' && options?.method === 'PUT') {
      return Promise.resolve({
        ok: true,
        status: 200,
        statusText: 'OK',
        headers: new Headers(),
        json: jest.fn().mockResolvedValue({}),
        text: jest.fn().mockResolvedValue(''),
        redirected: false,
        type: 'default',
        url: 'http://localhost:5175/api/Task',
      });
    }

    if (url === 'http://localhost:5175/api/Task' && options?.method === 'DELETE') {
      return Promise.resolve({
        ok: true,
        status: 200,
        statusText: 'OK',
        headers: new Headers(),
        json: jest.fn().mockResolvedValue({}),
        text: jest.fn().mockResolvedValue(''),
        redirected: false,
        type: 'default',
        url: 'http://localhost:5175/api/Task',
      });
    }
  
    return Promise.reject(new Error('Unknown API call'));
  });
  

describe('TaskList', () => {
  it('fetches and displays tasks', async () => {
    render(<TaskList />);

    await waitFor(() => screen.getByText('Test Task'));

    expect(screen.getByText('Test Task')).toBeInTheDocument();
  });

  it('handles status change', async () => {
    render(<TaskList />);

    await waitFor(() => screen.getByText('Test Task'));

    const task = screen.getByText('Test Task');

    await act(async () => {
      fireEvent.click(task);
    });

    await waitFor(() => expect(global.fetch).toHaveBeenCalledTimes(2));
  });

  
  
  it('opens the modal when the add button is clicked', async () => {
    render(<TaskList />);

    const addButton = screen.getByAltText('adding');
    fireEvent.click(addButton);

    await waitFor(() => screen.getByRole('dialog'));

    expect(screen.getByRole('heading', { level: 2, name: 'Add Task' })).toBeInTheDocument();
  });
  it('submits a new task successfully', async () => {
    render(<TaskList />);
  
    const addButton = screen.getByAltText('adding');
    fireEvent.click(addButton);
  
    await waitFor(() => screen.getByRole('dialog'));
  
    fireEvent.change(screen.getByLabelText(/Title:/i), { target: { value: 'New Task' } });
    fireEvent.change(screen.getByLabelText(/Time:/i), { target: { value: '2025-12-31T23:59' } });
    fireEvent.change(screen.getByLabelText(/Status:/i), { target: { value: 'ToDo' } });
    fireEvent.change(screen.getByLabelText(/Description:/i), { target: { value: 'Description of the new task' } });
  
    const submitButton = screen.getByRole('button', { name: 'Add Task' });
    fireEvent.click(submitButton);
  
    await waitFor(() => screen.getByText('New Task'));
    expect(screen.getByText('New Task')).toBeInTheDocument();
  });
  it('opens the modal with "Edit Task" when editing an existing task', async () => {
    render(<TaskList />);
  
    await waitFor(() => screen.getByText('Test Task'));
  
    const editButton = screen.getByAltText('edit-pictogram');
 
    fireEvent.click(editButton);

    await waitFor(() => screen.getByRole('dialog'));

    expect(screen.getByRole('heading', { level: 2, name: 'Edit Task' })).toBeInTheDocument();
  });
  it('deletes a task successfully', async () => {
    render(<TaskList />);
  
    await waitFor(() => screen.getByText('Test Task'));
  
    const deleteButton = screen.getByAltText('rubbish-bin-pictogram');

    fireEvent.click(deleteButton);

    await waitFor(() => expect(global.fetch).toHaveBeenCalledWith(
      expect.stringContaining('http://localhost:5175/api/Task'),
      expect.objectContaining({ method: 'DELETE' })
    ));
  });

});
