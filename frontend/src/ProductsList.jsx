import { useEffect, useState } from "react";

const ProductList = ({ products, user, refreshProducts, refreshCart }) => {
  const [quantities, setQuantities] = useState({});
  const [editId, setEditId] = useState(null);
  const [editForm, setEditForm] = useState({
    name: "",
    price: "",
    description: "",
    imageUrl: "",
    categoryId: ""
  });
  const [categories, setCategories] = useState([]);
  const [loadingId, setLoadingId] = useState(null);

  useEffect(() => {
    fetch("http://localhost:8080/categories")
      .then(res => res.ok ? res.json() : Promise.reject(`Status ${res.status}`))
      .then(data => setCategories(Array.isArray(data) ? data : []))
      .catch(err => {
        console.error("Nu s-au putut încărca categoriile:", err);
        setCategories([]);
      });
  }, []);

  const addToCart = (productId) => {
    if (!user) { alert("Trebuie să fii logat"); return; }
    const quantity = quantities[productId] || 1;
    setLoadingId(productId);
    fetch(`http://localhost:8080/cart/${user.id}/add`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ productId, quantity })
    })
      .then(async res => {
        setLoadingId(null);
        if (!res.ok) {
          const text = await res.text();
          throw new Error(`AddToCart failed ${res.status}: ${text}`);
        }
        return res.json();
      })
      .then(() => {
        alert(`Produs adăugat în coș (${quantity})`);
        if (typeof refreshCart === "function") refreshCart();
      })
      .catch(err => {
        console.error(err);
        alert("A apărut o eroare la adăugarea în coș. Vezi consola.");
      });
  };

  const handleQuantityChange = (productId, value) => {
    setQuantities(prev => ({ ...prev, [productId]: parseInt(value || 0) || 0 }));
  };

  const handleDelete = (id) => {
    if (!window.confirm("Sigur vrei să ștergi acest produs?")) return;

    setLoadingId(id);

    fetch(`http://localhost:8080/api/products/${id}`, {
      method: "DELETE"
    })
      .then(async res => {
        setLoadingId(null);

        if (!res.ok) {
          const errorText = await res.text();
          throw new Error(errorText || `Eroare la DELETE ${res.status}`);
        }

        return res.text();
      })
      .then(() => {
        alert("Produs șters cu succes!");
        if (typeof refreshProducts === "function") refreshProducts();
      })
      .catch(err => {
        console.error("Eroare la ștergerea produsului:", err);
        alert("Nu am putut șterge produsul. Verifică consola pentru detalii.");
      });
  };

  const startEdit = (product) => {
    setEditId(product.id);
    setEditForm({
      name: product.name ?? "",
      price: product.price ?? "",
      description: product.description ?? "",
      imageUrl: product.imageUrl ?? "",
      categoryId: product.category?.id ?? ""
    });
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditForm(prev => ({ ...prev, [name]: value }));
  };

  const handleEditSubmit = (id) => {
    if (!editForm.name || editForm.price === "" || !editForm.categoryId) {
      alert("Completează nume, preț și categorie.");
      return;
    }
    setLoadingId(id);
    const payload = {
      name: editForm.name,
      price: parseFloat(editForm.price),
      description: editForm.description,
      imageUrl: editForm.imageUrl || null,
      category: { id: parseInt(editForm.categoryId) }
    };

    fetch(`http://localhost:8080/api/products/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    })
      .then(async res => {
        setLoadingId(null);
        const text = await res.text();
        if (!res.ok) {
          throw new Error(`PUT ${res.status}: ${text}`);
        }
        try { return JSON.parse(text); } catch { return text; }
      })
      .then(() => {
        alert("Produs actualizat!");
        setEditId(null);
        if (typeof refreshProducts === "function") refreshProducts();
      })
      .catch(err => {
        console.error("Eroare la actualizarea produsului:", err);
        alert("Eroare la actualizarea produsului. Vezi consola pentru detalii.");
      });
  };

  return (
    <div className="row mt-5"> 
      {products.map(product => (
        <div className="col-lg-4 col-md-6 col-sm-12 mb-4" key={product.id}>
          <div className="card h-100">
            <img
              src={product.imageUrl || "https://placehold.co/600x400"}
              className="card-img-top"
              alt={product.name}
            />
            <div className="card-body">
              {editId === product.id ? (
                <>
                  <input name="name" className="form-control mb-2" value={editForm.name} onChange={handleEditChange} />
                  <input name="price" type="number" step="0.01" className="form-control mb-2" value={editForm.price} onChange={handleEditChange} />
                  <textarea name="description" className="form-control mb-2" value={editForm.description} onChange={handleEditChange} />
                  <input name="imageUrl" className="form-control mb-2" value={editForm.imageUrl} onChange={handleEditChange} />
                  <select name="categoryId" className="form-select mb-2" value={editForm.categoryId} onChange={handleEditChange}>
                    <option value="">-- Selectează categorie --</option>
                    {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                  </select>

                  <button className="btn btn-primary btn-sm me-2" onClick={() => handleEditSubmit(product.id)} disabled={loadingId === product.id}>
                    {loadingId === product.id ? "Salvez..." : "Salvează"}
                  </button>
                  <button className="btn btn-secondary btn-sm" onClick={() => setEditId(null)} disabled={loadingId === product.id}>Anulează</button>
                </>
              ) : (
                <>
                  <h5 className="card-title">{product.name}</h5>
                  <p className="card-text">{product.description}</p>
                  <p className="card-text"><strong>RON {product.price}</strong></p>

                  <div className="d-flex align-items-center mb-2">
                    <input type="number" min="1" value={quantities[product.id] || 1} onChange={(e) => handleQuantityChange(product.id, e.target.value)} className="form-control me-2" style={{ width: "60px" }} />
                    <button className="btn btn-primary" onClick={() => addToCart(product.id)} disabled={loadingId === product.id}>
                      {loadingId === product.id ? "..." : "Add to Cart"}
                    </button>
                  </div>

                  {user?.role === "ADMIN" && (
                    <>
                      <button className="btn btn-primary btn-sm me-2" onClick={() => startEdit(product)} disabled={loadingId === product.id}>Editează</button>
                      <button className="btn btn-danger btn-sm" onClick={() => handleDelete(product.id)} disabled={loadingId === product.id}>Șterge</button>
                    </>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ProductList;
