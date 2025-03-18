import { useState, useEffect } from 'react';
import './TaskListStyle.css';
import Task from './TaskComponent';

export interface TaskProps {
  id: number;
  name: string;
  dueDate: string;
  status: string;
  description: string;
  onClick: () => void;
  updateTask: (updatedTask: TaskProps) => void; 
  deleteTask: () => void;
}

function TaskList() {
  const [tasks, setTasks] = useState<TaskProps[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [newTask, setNewTask] = useState<TaskProps>({
    id: 0,
    name: '',
    dueDate: '',
    status: '',
    description: '',
    onClick: () => {},
    updateTask: () => {},
    deleteTask: () => {},
  });
  const [errors, setErrors] = useState<{ [key: string]: string }>({}); 

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const response = await fetch('http://localhost:5175/api/Task');
        if (!response.ok) {
          throw new Error('Failed to fetch tasks');
        }
        const data = await response.json();
        setTasks(data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchTasks();
  }, []);

  const actualTasks = tasks.filter((task) => task.status !== 'Done');
  const completedTasks = tasks.filter((task) => task.status === 'Done');

  const handleStatusChange = async (id: number, currentStatus: string) => {
    const statusOrder = ['ToDo', 'InProgress', 'Done'];
    const nextStatus = statusOrder[(statusOrder.indexOf(currentStatus) + 1) % statusOrder.length];

    const taskToUpdate = tasks.find((task) => task.id === id);

    if (!taskToUpdate) {
      console.error('Task not found');
      return;
    }

    const updatedTask = {
      ...taskToUpdate,
      status: nextStatus,
    };

    try {
      const response = await fetch(`http://localhost:5175/api/Task/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedTask),
      });

      if (!response.ok) {
        throw new Error('Failed to update task status');
      }

      setTasks((prevState) =>
        prevState.map((task) =>
          task.id === id ? { ...task, status: nextStatus } : task
        )
      );
    } catch (error) {
      console.error('Error updating task status:', error);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setNewTask((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};

    if (!newTask.name) {
      newErrors.name = 'Name is required.';
    } else if (newTask.name.length < 2) {
      newErrors.name = 'Name cannot be less than 2 characters.';
    } else if (newTask.name.length > 60) {
      newErrors.name = 'Name cannot exceed 60 characters.';
    }

    if (newTask.description && newTask.description.length < 2) {
      newErrors.description = 'Description cannot be less than 2 characters.';
    } else if (newTask.description && newTask.description.length > 200) {
      newErrors.description = 'Description cannot exceed 200 characters.';
    }

    if (newTask.dueDate) {
      const dueDate = new Date(newTask.dueDate);
      if (dueDate < new Date()) {
        newErrors.dueDate = 'End date cannot be in the past.';
      }
    }

    const validStatuses = ['ToDo', 'InProgress', 'Done'];
    if (!newTask.status) {
      newErrors.status = 'Status is required.';
    } else if (!validStatuses.includes(newTask.status)) {
      newErrors.status = 'The task status must be one of the following: ToDo, InProgress, Done.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    const taskToSubmit = {
      name: newTask.name,
      description: newTask.description,
      dueDate: newTask.dueDate,
      status: newTask.status || 'ToDo', 
    };

    try {
      let response: Response;
      let data: TaskProps; 

      if (newTask.id === 0) {
        response = await fetch('http://localhost:5175/api/Task', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(taskToSubmit),
        });

        if (!response.ok) {
          throw new Error('Failed to add task');
        }

        data = await response.json() as TaskProps; 
        setTasks((prevState) => [...prevState, data]); 
      } else {
        response = await fetch(`http://localhost:5175/api/Task/${newTask.id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(taskToSubmit),
        });

        if (!response.ok) {
          throw new Error('Failed to update task');
        }

        data = await response.json() as TaskProps;
        setTasks((prevState) =>
          prevState.map((task) => (task.id === newTask.id ? data : task))
        );
      }

      setNewTask({
        id: 0,
        name: '',
        dueDate: '',
        status: '',
        description: '',
        onClick: () => {},
        updateTask: () => {},
        deleteTask: () => {},
      });
      setIsEditing(false);
    } catch (error) {
      console.error('Error submitting task:', error);
    }
  };

  const handleCloseModal = () => {
    setIsEditing(false);
    setNewTask({
      id: 0,
      name: '',
      dueDate: '',
      status: '',
      description: '',
      onClick: () => {},
      updateTask: () => {},
      deleteTask: () => {},
    });
  };

  const handleEditTask = (task: TaskProps) => {
    setNewTask(task);
    setIsEditing(true);
  };
  const handleDeleteTask = async (id: number) => {
    try {
      const response = await fetch(`http://localhost:5175/api/Task/${id}`, {
        method: 'DELETE',
      });
  
      if (!response.ok) {
        throw new Error('Failed to delete task');
      }
  
      console.log('Task deleted successfully');
      // Оновлення стану, щоб видалити задачу з локального стану
      setTasks((prevState) => {
        const newState = prevState.filter((task) => task.id !== id);
        console.log('Updated tasks:', newState); // Логування нового стану
        return newState;
      });
    } catch (error) {
      console.error('Error deleting task:', error);
    }
  };
  

  return (
    <div className="task-list-container">
      <div className="sticky-header">
        <h2 className="section-title">Actual</h2>
        <img
          src="/src/assets/plus_pictogram.png"
          alt="adding"
          onClick={() => setIsEditing(true)}
          className="clickable-image"
        />
      </div>
      <hr />
      <div className="task-section">
        {actualTasks.map((task) => (
          <Task
            key={task.id}
            {...task}
            onClick={() => handleStatusChange(task.id, task.status)}
            updateTask={handleEditTask}  
            deleteTask={() => handleDeleteTask(task.id)} 
          />
        ))}
      </div>
      <div className="sticky-header">
        <h2 className="section-title">Completed</h2>
      </div>
      <hr />
      <div className="task-section">
        {completedTasks.map((task) => (
          <Task
            key={task.id}
            {...task}
            onClick={() => handleStatusChange(task.id, task.status)}
            updateTask={handleEditTask} 
            deleteTask={() => handleDeleteTask(task.id)}
          />
        ))}
      </div>

      {isEditing && (
        <div className="modal-overlay" role = "dialog">
          <div className="modal-window">
            <h2>{newTask.id === 0 ? 'Add Task' : 'Edit Task'}</h2>
            <form onSubmit={handleFormSubmit}>
              <div>
  <label htmlFor="name">Title:</label>
  <input
    id="name"  // Додано id
    type="text"
    name="name"
    value={newTask.name}
    onChange={handleInputChange}
    required
  />
  {errors.name && <span className="error">{errors.name}</span>}
</div>

<div>
  <label htmlFor="dueDate">Time:</label>
  <input
    id="dueDate"  // Added the id here
    name="dueDate"
    type="datetime-local"
    value={newTask.dueDate}
    onChange={handleInputChange}
    required
  />
  {errors.dueDate && <span className="error">{errors.dueDate}</span>}
</div>

<div>
  <label htmlFor="status">Status:</label>
  <select
    id="status"  // Added the id here
    name="status"
    required
    value={newTask.status}
    onChange={handleInputChange}
  >
    <option value="">Select status</option>
    <option value="ToDo">To Do</option>
    <option value="InProgress">In Progress</option>
    <option value="Done">Done</option>
  </select>
  {errors.status && <span className="error">{errors.status}</span>}
</div>

              <div>
  <label htmlFor="description">Description:</label>
  <textarea
    id="description"  // Added the id here
    name="description"
    value={newTask.description}
    onChange={handleInputChange}
    required
  />
  {errors.description && <span className="error">{errors.description}</span>}
</div>

              <button type="submit">{newTask.id === 0 ? 'Add Task' : 'Update Task'}</button>
            </form>

            <button onClick={handleCloseModal}>Close</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default TaskList;
