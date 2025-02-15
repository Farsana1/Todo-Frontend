import "bootstrap/dist/css/bootstrap.min.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash } from "@fortawesome/free-solid-svg-icons";
import { useEffect, useState } from "react";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function App() {
  const [show, setShow] = useState(false);
  const [todos, setTodos] = useState([]);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const [formData, setFormData] = useState({
    title: "",
    Status: "Pending",
  });

  useEffect(() => {
    const savedTodos = JSON.parse(localStorage.getItem("todos")) || [];
    setTodos(savedTodos);
  }, []);

  useEffect(() => {
    localStorage.setItem("todos", JSON.stringify(todos));
  }, [todos]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = () => {
    const { title } = formData;
    if (!title) {
      toast.warn("Please Fill to Add to-do");
      return;
    }

    const newTodo = {
      id: Date.now(),
      title,
      Status: "Pending",
    };

    setTodos([...todos, newTodo]);
    handleClose();
    toast.success("Successfully added");
  };

  const handleToggle = (id) => {
    setTodos((prevTodos) =>
      prevTodos.map((todo) =>
        todo.id === id ? { ...todo, Status: todo.Status === "Completed" ? "Pending" : "Completed" } : todo
      )
    );
  };

  const handleDelete = (id) => {
    setTodos(todos.filter((todo) => todo.id !== id));
    toast.success("Successfully Deleted");
  };

  return (
    <>
      <div className="container-fluid w-100">
        <div className="row">
          <h5 className="fw-bolder text-center mt-4">
            <i>Todo List</i>
          </h5>

          <div className="d-flex justify-content-end">
            <Button className="me-5" variant="success" onClick={handleShow}>
              Add New
            </Button>
          </div>

          <Modal show={show} onHide={handleClose}>
            <Modal.Header closeButton>
              <Modal.Title className="text-center">Add New To Do</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <form className="shadow">
                <div className="mb-2">
                  <input
                    className="form-control"
                    name="title"
                    onChange={handleChange}
                    type="text"
                    placeholder="Todo Note"
                  />
                </div>
              </form>
            </Modal.Body>
            <Modal.Footer>
              <Button onClick={handleSubmit} variant="success">
                Save
              </Button>
            </Modal.Footer>
          </Modal>

          <div className="container px-5 mt-5">
            <table className="table border rounded table-striped table-hover">
              <thead>
                <tr>
                  <th className="text-center">Sl.No</th>
                  <th className="text-center">Todo Note</th>
                  <th className="text-center">Status</th>
                  <th className="text-center">Actions</th>
                </tr>
              </thead>
              <tbody>
                {todos.map((todo, index) => (
                  <tr key={todo.id}>
                    <td className="text-center">{index + 1}</td>
                    <td className="text-center">{todo.title}</td>
                    <td className="text-center">
                      <div className="d-flex align-items-center justify-content-center">
                        <input
                          type="checkbox"
                          checked={todo.Status === "Completed"}
                          onChange={() => handleToggle(todo.id)}
                          className="form-check-input"
                          style={{ width: "20px", height: "20px", cursor: "pointer" }}
                        />
                        <label className="ms-2" style={{ minWidth: "80px", textAlign: "center" }}>
                          {todo.Status}
                        </label>
                      </div>
                    </td>
                    <td className="text-center">
                      <FontAwesomeIcon
                        className="mt-1 text-danger cursor-pointer"
                        icon={faTrash}
                        onClick={() => handleDelete(todo.id)}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      <ToastContainer position="top-center" autoClose={3000} />
    </>
  );
}

export default App;
