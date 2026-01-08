import React, { useEffect, useState } from "react";
import axios from "axios";

const Painting = () => {
  const [categories, setCategories] = useState([]);
  const [newName, setNewName] = useState("");
  const [editId, setEditId] = useState(null);
  const [editName, setEditName] = useState("");
  const API_URL = "http://localhost:5000/api/paint-categories";
  // Fetch all categories
  const fetchCategories = async () => {
    try {
      const res = await axios.get(API_URL);
      setCategories(res.data);
    } catch (err) {
      console.error(err);
    }
  };
  useEffect(() => {
    fetchCategories();
  }, []);

  // Add new category
  const handleAdd = async () => {
    if (!newName) return alert("Name is required");
    try {
      await axios.post(API_URL, { name: newName });
      setNewName("");
      fetchCategories();
    } catch (err) {
      console.error(err);
    }
  };
  // Delete category
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure?")) return;
    try {
      await axios.delete(`${API_URL}/${id}`);
      fetchCategories();
    } catch (err) {
      console.error(err);
    }
  };

  // Start editing
  const handleEdit = (category) => {
    setEditId(category.id);
    setEditName(category.name);
  };

  // Update category
  const handleUpdate = async () => {
    if (!editName) return alert("Name is required");
    try {
      await axios.put(`${API_URL}/${editId}`, { name: editName });
      setEditId(null);
      setEditName("");
      fetchCategories();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-5 border rounded shadow">
      <h2 className="text-xl font-bold mb-4">Paint Categories</h2>

      {/* Add new category */}
      <div className="flex mb-4 gap-2">
        <input
          type="text"
          placeholder="New category name"
          value={newName}
          onChange={(e) => setNewName(e.target.value)}
          className="flex-1 p-2 border rounded"
        />
        <button
          onClick={handleAdd}
          className="px-4 bg-blue-500 text-white rounded"
        >
          Add
        </button>
      </div>

      {/* Category list */}
      <ul>
        {categories.map((cat) => (
          <li
            key={cat.id}
            className="flex justify-between items-center mb-2 border-b pb-1"
          >
            {editId === cat.id ? (
              <>
                <input
                  type="text"
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  className="p-1 border rounded flex-1"
                />
                <button
                  onClick={handleUpdate}
                  className="ml-2 px-2 bg-green-500 text-white rounded"
                >
                  Save
                </button>
                <button
                  onClick={() => setEditId(null)}
                  className="ml-2 px-2 bg-gray-400 text-white rounded"
                >
                  Cancel
                </button>
              </>
            ) : (
              <>
                <span>{cat.name}</span>
                <div>
                  <button
                    onClick={() => handleEdit(cat)}
                    className="ml-2 px-2 bg-yellow-500 text-white rounded"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(cat.id)}
                    className="ml-2 px-2 bg-red-500 text-white rounded"
                  >
                    Delete
                  </button>
                </div>
              </>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};
export default Painting;
