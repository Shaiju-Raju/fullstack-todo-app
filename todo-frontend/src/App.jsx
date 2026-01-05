import { useState,useEffect } from 'react';
import './App.css';
import CreateArea from './Components/CreateArea';
import ToDos from './Components/ToDos';


function App() {

  //Fetching data from API
  useEffect( () => {
    async function loadTodos() {
      const res = await fetch("http://localhost:3000/todos");
      const data = await res.json();
      setToDos(data);
    }
    loadTodos();
  },[])

  // Declaration of todos state
  const [toDos, setToDos] = useState([]);


//Adding item to Todos
   async function addItem(item) {
    if(item.trim() === "") return;

    const res = await fetch("http://localhost:3000/todos", {
      method: "POST",
      headers: {
        "content-type" : "application/json"
      },
      body: JSON.stringify({text: item})
    });

    const data = await res.json();
    setToDos(prevValue => [...prevValue, data]);
  }

//Delete an Item from Todos
 async function deleteItem(id) {
  const res = await fetch(`http://localhost:3000/todos/${id}`, {
    method: "DELETE"
  });

  setToDos(prevValue => prevValue.filter(todo => todo.id !== id));
  }


//Edit an Item from Todos
   async function editItem(id) {
    const newValue = prompt("Enter New Value")

    if(newValue === null || newValue.trim() === "") return;

    const res = await fetch(`http://localhost:3000/todos/${id}`, {
      method: "PUT",
      headers: {
        "content-type": "application/json"
      },
      body: JSON.stringify({text: newValue})
    });

    const updatedData = await res.json();
    setToDos(prevValue =>
      prevValue.map(todo =>
        todo.id === id ? updatedData : todo
      )
    )
  }



  return (
    <>
      <div className="container">
        <h2 className="todo-title">To Do List</h2>
        <CreateArea onAdd={addItem} />
        {toDos.map((toDoItem, index) => (
          <ToDos
            toDo={toDoItem.text}
            key={toDoItem.id}
            id={toDoItem.id}
            onDelete={deleteItem}
            onEdit={editItem}
          />
        ))}
      </div>
    </>
  );
}

export default App;
