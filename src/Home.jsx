import { useEffect, useState } from "react";
import axios from "axios";
import {
  Container,
  TextField,
  Button,
  List,
  ListItem,
  ListItemText,
  Checkbox,
  IconButton,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import "./Home.css";

const Home = () => {
  const [text, setText] = useState("");
  const [editText, setEditText] = useState("");
  const [todos, setTodos] = useState([]);
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    axios
      .get("http://localhost:3001/getTask")
      .then((response) => {
        setTodos(response.data);
      })
      .catch((err) => console.log(err));
  }, []);

  const handleAdd = () => {
    const newTodo = { todos: [text] };

    axios
      .post("http://localhost:3001/add", newTodo)
      .then((response) => {
        setTodos([...todos, response.data]);
        setText("");
      })
      .catch((err) => console.log(err));
  };

  const handleToggle = (_id) => {
    const updatedTodos = todos.map((todo) =>
      todo._id === _id ? { ...todo, completed: !todo.completed } : todo
    );

    axios
      .put(`http://localhost:3001/update/${_id}`, { todos: updatedTodos })
      .then(() => {
        setTodos(updatedTodos);
      })
      .catch((err) => console.log(err));
  };

  const handleDelete = (_id) => {
    axios
      .delete(`http://localhost:3001/delete/${_id}`)
      .then(() => {
        const updatedTodos = todos.filter((todo) => todo._id !== _id);
        setTodos(updatedTodos);
      })
      .catch((err) => console.log(err));
  };

  const handleUpdate = (_id, newText) => {
    const updatedTodo = { todos: [newText] }; // Nouvelle todo mise à jour

    axios
      .put(`http://localhost:3001/update/${_id}`, updatedTodo)
      .then((response) => {
        const updatedTodoFromServer = response.data;
        const updatedTodos = todos.map((todo) =>
          todo._id === _id ? updatedTodoFromServer : todo
        );
        setTodos(updatedTodos);
        setEditingId(null);
        setEditText(""); // Réinitialiser le champ après la sauvegarde
      })
      .catch((err) => console.log(err));
  };

  return (
    <Container maxWidth="sm">
      <h1 className="text-center mt-5">My Todo List</h1>
      <div className="d-flex">
        <TextField
          variant="outlined"
          placeholder="Add new task"
          value={text}
          onChange={(e) => setText(e.target.value)}
          fullWidth
        />
        <Button
          variant="contained"
          color="primary"
          onClick={handleAdd}
          startIcon={<AddIcon />}
        >
          Add
        </Button>
      </div>
      <List>
        {todos.map((todo) => (
          <ListItem key={todo._id} divider>
            <Checkbox
              checked={todo.completed}
              onChange={() => handleToggle(todo._id)}
            />
            {editingId === todo._id ? (
              <>
                <TextField
                  value={editText}
                  onChange={(e) => setEditText(e.target.value)}
                  fullWidth
                />
                <Button onClick={() => handleUpdate(todo._id, editText)}>
                  Save
                </Button>
              </>
            ) : (
              <>
                <ListItemText
                  primary={todo.todos[0]} // Afficher seulement la première tâche pour cet exemple
                  style={{
                    textDecoration: todo.completed ? "line-through" : "none",
                  }}
                />
                <IconButton
                  edge="end"
                  aria-label="edit"
                  onClick={() => {
                    setEditingId(todo._id);
                    setEditText(todo.todos[0]);
                  }}
                >
                  <EditIcon />
                </IconButton>
              </>
            )}
            <IconButton
              edge="end"
              aria-label="delete"
              onClick={() => handleDelete(todo._id)}
            >
              <DeleteIcon />
            </IconButton>
          </ListItem>
        ))}
      </List>
    </Container>
  );
};

export default Home;
