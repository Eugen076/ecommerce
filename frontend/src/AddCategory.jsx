import React, { useEffect, useState } from "react";

const AddCategory = ({ onCategoryAdded }) => {
  const [name, setName] = useState("");
  const [categories, setCategories] = useState([]);
  const [editId, setEditId] = useState(null); 
  const [editName, setEditName] = useState(""); 

  const fetchCategories = () => {
    fetch("http://localhost:8080/categories")
      .then(res => {
        if (!res.ok) throw new Error("Eroare la încărcarea categoriilor");
        return res.json();
      })
      .then(data => {
        setCategories(Array.isArray(data) ? data : []);
      })
      .catch(err => console.error(err));
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim()) {
      alert("Numele categoriei nu poate fi gol.");
      return;
    }

    fetch("http://localhost:8080/categories", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name })
    })
      .then(res => {
        if (!res.ok) throw new Error("Eroare la adăugarea categoriei");
        return res.json();
      })
      .then(data => {
        onCategoryAdded(data);
        setName("");
        fetchCategories();
      })
      .catch(err => console.error(err));
  };

  const handleDelete = (id) => {
    if (!window.confirm("Sigur vrei să ștergi această categorie?")) return;

    fetch(`http://localhost:8080/categories/${id}`, {
      method: "DELETE"
    })
      .then(res => {
        if (!res.ok) throw new Error("Eroare la ștergerea categoriei");
        fetchCategories();
      })
      .catch(err => console.error(err));
  };

  const startEdit = (id, currentName) => {
    setEditId(id);
    setEditName(currentName);
  };

  const handleEditSubmit = (e) => {
    e.preventDefault();
    if (!editName.trim()) {
      alert("Numele categoriei nu poate fi gol.");
      return;
    }

    fetch(`http://localhost:8080/categories/${editId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: editName })
    })
      .then(res => {
        if (!res.ok) throw new Error("Eroare la actualizarea categoriei");
        return res.json();
      })
      .then(() => {
        setEditId(null);
        setEditName("");
        fetchCategories();
      })
      .catch(err => console.error(err));
  };

  return (
    <div className="container mt-4">
      <h3>Adaugă categorie nouă</h3>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label className="form-label">Nume categorie</label>
          <input
            type="text"
            className="form-control"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>
        <button type="submit" className="btn btn-success">
          Adaugă
        </button>
      </form>

      <h4 className="mt-4">Lista categorii</h4>
      <ul className="list-group">
        {categories.map(cat => (
          <li
            key={cat.id}
            className="list-group-item d-flex justify-content-between align-items-center"
          >
            {editId === cat.id ? (
              <form className="d-flex w-100" onSubmit={handleEditSubmit}>
                <input
                  type="text"
                  className="form-control me-2"
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                />
                <button type="submit" className="btn btn-primary btn-sm me-2">
                  Salvează
                </button>
                <button
                  type="button"
                  className="btn btn-secondary btn-sm"
                  onClick={() => setEditId(null)}
                >
                  Anulează
                </button>
              </form>
            ) : (
              <>
                {cat.name}
                <div>
                  <button
                    className="btn btn-sm btn-primary me-2"
                    onClick={() => startEdit(cat.id, cat.name)}
                  >
                    Editează
                  </button>
                  <button
                    className="btn btn-sm btn-danger"
                    onClick={() => handleDelete(cat.id)}
                  >
                    Șterge
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

export default AddCategory;
