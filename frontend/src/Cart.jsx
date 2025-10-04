const Cart = ({ user, cartItems, refreshCart }) => {
  const updateQuantity = (productId, quantityChange) => {
    const item = cartItems.find(item => item.product.id === productId);
    if (item && item.quantity + quantityChange < 0) return;

    fetch(`http://localhost:8080/cart/${user.id}/add`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ productId, quantity: quantityChange })
    })
      .then(res => res.json())
      .then(() => refreshCart())
      .catch(err => console.error(err));
  };

  if (!user) {
    return <p className="text-center mt-5">Trebuie să fii logat pentru a vedea coșul.</p>;
  }

  return (
    <div className="container mt-4">
      <h3>Coșul tău</h3>
      {cartItems.filter(item => item.quantity > 0).length === 0 ? (
        <p className="text-center">Coșul este gol.</p>
      ) : (
        <div className="list-group">
          {cartItems
            .filter(item => item.quantity > 0)
            .map(item => (
              <div className="list-group-item d-flex justify-content-between align-items-center" key={item.id}>
                <div>
                  <h5>{item.product.name}</h5>
                  <p>RON {item.product.price.toFixed(2)}</p>
                </div>
                <div className="d-flex align-items-center">
                  <button
                    className="btn btn-sm btn-outline-secondary me-2"
                    onClick={() => updateQuantity(item.product.id, -1)}
                    disabled={item.quantity <= 0}
                  >
                    -
                  </button>
                  <span>{item.quantity}</span>
                  <button
                    className="btn btn-sm btn-outline-secondary ms-2"
                    onClick={() => updateQuantity(item.product.id, 1)}
                  >
                    +
                  </button>
                  <span className="ms-3 text-success">
                    RON {(item.quantity * item.product.price).toFixed(2)}
                  </span>
                </div>
              </div>
            ))}
        </div>
      )}
    </div>
  );
};

export default Cart;