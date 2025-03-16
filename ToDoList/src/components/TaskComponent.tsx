import './TaskStyle.css';
import { TaskProps } from './TaskList';

const Task = ({ id, name, dueDate, status, description, onClick, updateTask, deleteTask }: TaskProps) => {
  const formattedDate = new Date(dueDate).toLocaleString('uk-UA', {
    day: '2-digit',
    month: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  }).replace(',', '');

  let taskClass = '';
  switch (status) {
    case 'ToDo':
      taskClass = 'task-todo';
      break;
    case 'InProgress':
      taskClass = 'task-in-progress';
      break;
    case 'Done':
      taskClass = 'task-done';
      break;
    default:
      taskClass = '';
  }

  return (
    <div className={`task_body ${taskClass}`}>
      <div>
          <h2 className="title">{name}</h2>
        <div className="TaskHeader">
        <p className="time">{formattedDate}</p>
          <p className="status" onClick={onClick}>
            {status}
          </p>
          </div>
        <p className="discription">{description}</p>
      </div>
      <div className="edit-buttons">
        <img
          src="/src/assets/edit-pictogram.png"
          alt="edit-pictogram"
          onClick={() => updateTask({ id, name, dueDate, status, description, onClick: () => {}, updateTask: () => {}, deleteTask: () => {} })}
        />
        <img src="/src/assets/rubbish-bin-pictogram.png" alt="rubbish-bin-pictogram" onClick={deleteTask} />
      </div>
    </div>
  );
};

export default Task;
