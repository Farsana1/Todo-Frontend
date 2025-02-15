
import "bootstrap/dist/css/bootstrap.min.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash } from "@fortawesome/free-solid-svg-icons";
import { useEffect, useState } from "react";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import { addTodoApi, deleteTodoApi, getTodoApi, toggleTodoStatusApi } from "./services/allApi";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";


function App() {
  const [show, setShow] = useState(false);
  const [todos, setTodos] = useState([]);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const [formData, setFormData] = useState({
    title: "",
    Status: "Pending"
  });


  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    const { title } = formData;
    if (!title) {
      toast.warn("Please Fill to Add to-do");
      return;
    }

    try {
      const reqBody = { title, status: "Pending" };
      const result = await addTodoApi(reqBody);
      if (result.status == 200) {
        setTodos([...todos, result.data]);
        handleClose();
        toast.success("Successfully added")
      }
      if (result.status == 401) {
        toast.warn("Already existing note")
      }
    } catch (error) {
      console.error("Error adding todo:", error);
      toast.error("Something Went wrong")
    }
  };

  const handleToggle = async (id) => {
    try {
      const response = await toggleTodoStatusApi(id);
      console.log(response);
      if (response.status === 200) {
        setTodos((prevTodos) =>
          prevTodos.map((todo) =>
            todo._id === id ? { ...todo, Status: response.data.Status } : todo
          )
        );
      }
    } catch (error) {
      console.error("Error toggling status:", error);
    }
  };

  const handleDelete = async (id) => {

    console.log("Entered a handle Delete");

    try {
      const result = await deleteTodoApi(id)
      if (result.status == 200) {
        toast.success("Successfully Deleted")
        console.log(result);

        window.location.reload();
      }


    } catch (error) {
      console.log(error);
      toast.error("Something went wrong")

    }
  }

  useEffect(() => {
    const getAllTodos = async () => {
      try {
        const result = await getTodoApi();
        setTodos(result.data);
        console.log(result.data);

      } catch (error) {
        console.error("Error todos:", error);
      }
    };
    getAllTodos();
  }, []);

  return (
    <>
      <div className="container-fluid w-100">
        <div className="row">

          <h5 className="fw-bolder text-center mt-4"><i>Todo List</i></h5>

          <div>
            <div className="d-flex justify-content-end">
              <Button className="me-5" variant="success" onClick={handleShow}>
                Add New
              </Button>

            </div>

          </div>

          <Modal show={show} onHide={handleClose}>
            <Modal.Header closeButton>
              <Modal.Title className="text-center">Add New To</Modal.Title>
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
                  <tr key={index}>
                    <td className="text-center">{index + 1}</td>
                    <td className="text-center">{todo.title}</td>
                    <td className="text-center">
                      <div className="d-flex align-items-center justify-content-center">
                        <input
                          type="checkbox"
                          checked={todo.Status === "Completed"}
                          onChange={() => handleToggle(todo._id)}
                          className="form-check-input"
                          style={{ width: "20px", height: "20px", cursor: "pointer" }}
                        />
                        <label className="ms-2" style={{ minWidth: "80px", textAlign: "center" }}>
                          {todo.Status === "Completed" ? "Completed" : "Pending"}
                        </label>
                      </div>
                    </td>
                    <td className="text-center">
                      <FontAwesomeIcon
                        className="mt-1 text-danger cursor-pointer"
                        icon={faTrash}
                        onClick={() => handleDelete(todo._id)}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>



          </div>

        </div>
      </div>
      <ToastContainer position="top-center" autoClose={3000}
      />

    </>
  );
}

export default App;
