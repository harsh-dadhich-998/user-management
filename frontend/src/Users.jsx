import { useEffect, useState } from "react";
import Spinner from "./Component/Spinner";

const Users = () => {
  const BASE_URL = import.meta.env.VITE_BACKEND_URL;
  console.log("copy", import.meta.env);
  console.log("Url", BASE_URL);

  const [users, setUsers] = useState([]);
  const [isUsers, setIsUsers] = useState(false);
  const [isModalOpen, setModalOpen] = useState(false);
  const [isLoading, setLoading] = useState(false);
  const [isUpdate, setIsUpdate] = useState(false);

  const [formData, setFormData] = useState({
    id: 0,
    name: "",
    email: "",
    gender: "",
  });

  let data = [];

  const openModal = () => setModalOpen(true);
  const closeModal = () => {
     setFormData({
      id: 0,
      name: "",
      email: "",
      gender: "",
    });
    setModalOpen(false);
  };
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    closeModal();
    setLoading(true);
    e.preventDefault();
    if (!isUpdate) {
      try {
        const response = await fetch(`${BASE_URL}/api/users`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json", // Important!
          },
          body: JSON.stringify(formData),
        });

        if (!response.ok) {
          throw new Error("Something went wrong!");
        }

        const data = await response.json();
        console.log("User created:", data);
      } catch (error) {
        console.error("Error:", error.message);
      }
      console.log("Form Submitted:", formData);
    } else {
      try {
        const response = await fetch(`${BASE_URL}/api/users/${formData.id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json", // Important!
          },
          body: JSON.stringify(formData),
        });

        if (!response.ok) {
          throw new Error("Something went wrong!");
        }

        const data = await response.json();
        console.log("User Updated", data);
      } catch (error) {
        console.error("Error:", error.message);
      }
    }
    setFormData({
      id: 0,
      name: "",
      email: "",
      gender: "",
    });
    setLoading(false);
    getAllusers();
  };

  useEffect(() => {
    setLoading(true);
    getAllusers();
    setLoading(false);
    // console.log(users.length);
    // console.log("FormData", formData);
  }, []);

  async function getUserById(id) {
    try {
      const response = await fetch(`${BASE_URL}/api/users/${id}`);
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const data = await response.json();
      console.log("updated", data);
      setFormData({
        id: data[0].id,
        name: data[0].name,
        email: data[0].email,
        gender: data[0].gender,
      });
      setIsUpdate(true);
      setModalOpen(true);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  }

  async function getAllusers() {
    try {
      const response = await fetch(`${BASE_URL}/api/users`);
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      data = await response.json();
      console.log(data);
      setUsers(data);
      setIsUsers(data.length > 0 ? true : false);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  }

  async function deleteUser(id) {
    console.log(id);
    setLoading(true);
    try {
      const response = await fetch(`${BASE_URL}/api/users/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Something went wrong!");
      }

      const data = await response.json();
      console.log("User DELETED:", data);
    } catch (error) {
      console.log("unable to delete user", error);
    }
    getAllusers();
    setLoading(false);
  }

  return (
    <div className="space-y-4 p-4">
      {isLoading && <Spinner />}
      <div className="flex justify-start">
        <button
          onClick={openModal}
          className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-100"
        >
          Create User
        </button>
      </div>
      {!isUsers && (
        <div className="flex items-center justify-center text-center text-gray-500 py-8">
          There are no users available
        </div>
      )}
      {isUsers && (
        <div className="overflow-x-auto">
          <table className="min-w-full table-auto border-collapse text-left text-sm md:text-base">
            <thead>
              <tr className="bg-gray-100">
                <th className="px-2 md:px-4 py-2 border-b text-gray-600">Name</th>
                <th className="px-2 md:px-4 py-2 border-b text-gray-600">Email</th>
                <th className="px-2 md:px-4 py-2 border-b text-gray-600">Gender</th>
                <th className="px-2 md:px-4 py-2 border-b text-gray-600">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user, index) => (
                <tr
                  key={user.id}
                  className={`${index % 2 === 0 ? "bg-white" : "bg-gray-50"}`}
                >
                  <td className="px-2 md:px-4 py-2 border-b">{user.name}</td>
                  <td className="px-2 md:px-4 py-2 border-b break-all">{user.email}</td>
                  <td className="px-2 md:px-4 py-2 border-b">{user.gender}</td>
                  <td className="px-2 md:px-4 py-2 border-b flex flex-col md:flex-row gap-2 md:gap-2">
                    {/* Update Button */}
                    <button
                      onClick={() => getUserById(user.id)}
                      className="px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 focus:outline-none focus:ring-4 focus:ring-yellow-800"
                    >
                      Update
                    </button>
                    {/* Delete Button */}
                    <button
                      onClick={() => deleteUser(user.id)}
                      className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-800"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-6 w-full max-w-md shadow-lg max-h-[90vh] overflow-auto">
            <h3 className="text-xl font-semibold mb-4">Create New User</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block mb-1 font-medium">Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block mb-1 font-medium">Email</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block mb-1 font-medium">Gender</label>
                <input
                  type="text"
                  name="gender"
                  value={formData.gender}
                  onChange={handleChange}
                  required
                  className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="flex flex-col sm:flex-row justify-end gap-2">
                <button
                  type="button"
                  onClick={closeModal}
                  className="bg-gray-300 text-gray-700 px-4 py-2 rounded hover:bg-gray-400"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                >
                  Submit
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Users;
