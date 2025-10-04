import { useState } from "react";

const AddProduct = ({ categories, onProductAdded }) => {
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [description, setDescription] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [categoryId, setCategoryId] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!name || !price || !description || !categoryId) {
      alert("Toate câmpurile sunt obligatorii!");
      return;
    }

    fetch("http://localhost:8080/api/products", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name,
        price: parseFloat(price),
        description,
        imageUrl,
        category: { id: parseInt(categoryId) }
      })
    })
      .then(res => res.json())
      .then(product => {
        onProductAdded(product);
        setName("");
        setPrice("");
        setDescription("");
        setImageUrl("");
        setCategoryId("");
      })
      .catch(err => console.error(err));
  };

  return (
    <div className="container mt-4">
      <h2>Adaugă Produs</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-2">
          <label>Nume:</label>
          <input
            type="text"
            className="form-control"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>

        <div className="mb-2">
          <label>Preț:</label>
          <input
            type="number"
            step="0.01"
            className="form-control"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
          />
        </div>

        <div className="mb-2">
          <label>Descriere:</label>
          <textarea
            className="form-control"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>

        <div className="mb-2">
          <label>URL imagine:</label>
          <input
            type="text"
            className="form-control"
            value={imageUrl}
            onChange={(e) => setImageUrl(e.target.value)}
          />
        </div>

        <div className="mb-2">
          <label>Categorie:</label>
          <select
            className="form-select"
            value={categoryId}
            onChange={(e) => setCategoryId(e.target.value)}
          >
            <option value="">Selectează categorie</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </select>
        </div>

        <button type="submit" className="btn btn-primary">
          Adaugă Produs
        </button>
      </form>
    </div>
  );
};

export default AddProduct;
