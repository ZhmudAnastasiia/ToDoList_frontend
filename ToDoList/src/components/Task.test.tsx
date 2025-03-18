import { render, screen, fireEvent } from '@testing-library/react';
import Task from './TaskComponent';
import '@testing-library/jest-dom';

const mockOnClick = jest.fn();
const mockUpdateTask = jest.fn();
const mockDeleteTask = jest.fn();

describe('Task Component', () => {
  const taskProps = {
    id: 1,
    name: 'Test Task',
    dueDate: '2025-03-17T12:00:00Z',
    status: 'ToDo',
    description: 'This is a test task description.',
    onClick: mockOnClick,
    updateTask: mockUpdateTask,
    deleteTask: mockDeleteTask,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders the task with correct name, date, and description', () => {
    render(<Task {...taskProps} />);

    const taskTitles = screen.getAllByText(/Test Task/i);
    expect(taskTitles[0]).toBeInTheDocument(); 
  
    const descriptions = screen.getAllByText(/This is a test task description/i);
    expect(descriptions[0]).toBeInTheDocument();
  
    expect(screen.getByText((content) => content.includes('17.03'))).toBeInTheDocument();
    expect(screen.getByText(/ToDo/i)).toBeInTheDocument();
  });
  

  it('applies correct CSS class based on task status', () => {
    const { container } = render(<Task {...taskProps} />);
    
    const taskElement = container.firstChild; 
    
    expect(taskElement).toHaveClass('task-todo');
  });

  it('calls onClick when status is clicked', () => {
    render(<Task {...taskProps} />);

    const statusElement = screen.getByText(/ToDo/i);
    fireEvent.click(statusElement);

    expect(mockOnClick).toHaveBeenCalledTimes(1);
  });

  it('calls updateTask when the edit button is clicked', () => {
    render(<Task {...taskProps} />);

    const editButton = screen.getByAltText('edit-pictogram');
    fireEvent.click(editButton);

    expect(mockUpdateTask).toHaveBeenCalledTimes(1);
  });

  it('calls deleteTask when the delete button is clicked', () => {
    render(<Task {...taskProps} />);

    const deleteButton = screen.getByAltText('rubbish-bin-pictogram');
    fireEvent.click(deleteButton);

    expect(mockDeleteTask).toHaveBeenCalledTimes(1);
  });
});