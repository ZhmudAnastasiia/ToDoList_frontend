import './App.css';
import TaskList from './components/TaskList.js';

function App() {
  const tasks = [
    { id: 1, title: 'Task 1', time: '10.02 10:30', status: 'To Do', description: 'Lorem Ipsum is simply dummy text of the printing and typesetting industry.' },
    { id: 2, title: 'Task 2', time: '10.02 10:30', status: 'In Progress', description: 'Lorem Ipsum is simply dummy text of the printing and typesetting industry.' },
    { id: 3, title: 'Task 3', time: '10.02 10:30', status: 'To Do', description: 'Lorem Ipsum is simply dummy text of the printing and typesetting industry.' },
    { id: 4, title: 'Task 4', time: '10.02 10:30', status: 'Done', description: 'Lorem Ipsum is simply dummy text of the printing and typesetting industry.' }
  ];

  return (
    <div className='page'>
      <div className='header'>
        <img src="/main_logo.png" alt="Logo" className='main_logo'/>
        <p className='main_text'>ToDo List</p>
      </div>
      <div className="container">
        <div className="Task_window">
          <TaskList tasks={tasks} />
        </div>
      </div>
    </div>
  );
}

export default App;
