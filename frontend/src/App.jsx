import './App.css';
import ProductList from './ProductsList';
import Login from './Login';
import Register from './Register'; 
import Navbar from './Navbar';
import Cart from './Cart';
import AddCategory from './AddCategory';
import AddProduct from './AddProduct';
import { useEffect, useState } from 'react';

function App() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [user, setUser] = useState(JSON.parse(localStorage.getItem("user")) || null);
  const [cartItems, setCartItems] = useState([]);
  const [showCart, setShowCart] = useState(false);
  const [showCategoryForm, setShowCategoryForm] = useState(false);
  const [showHome, setShowHome] = useState(true);
  const [showProductForm, setShowProductForm] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [showRegister, setShowRegister] = useState(false);

  const fetchProducts = () => {
    fetch('http://localhost:8080/api/products')
      .then(response => response.json())
      .then(data => setProducts(data))
      .catch(err => console.error(err));
  };

  const fetchCart = () => {
    if (user) {
      fetch(`http://localhost:8080/cart/${user.id}`)
        .then(res => res.json())
        .then(data => setCartItems(data))
        .catch(err => console.error(err));
    }
  };

  const fetchCategories = () => {
    fetch("http://localhost:8080/categories")
      .then(res => res.json())
      .then(data => setCategories(Array.isArray(data) ? data : []))
      .catch(err => {
        console.error(err);
        setCategories([]);
      });
  };

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, []);

  useEffect(() => {
    fetchCart();
  }, [user]);

  const handleLogout = () => {
    localStorage.removeItem("user");
    setUser(null);
    setCartItems([]);
    setShowHome(true);
  };

  const handleShowCart = () => {
    setShowCart(true);
    setShowCategoryForm(false);
    setShowHome(false);
    setShowProductForm(false);
  };

  const handleShowHome = () => {
    setShowHome(true);
    setShowCart(false);
    setShowCategoryForm(false);
    setShowProductForm(false);
    setShowLogin(false);
    setShowRegister(false);
  };

  const handleHideCart = () => {
    setShowCart(false);
    setShowHome(true);
  };

  const handleShowCategoryForm = () => {
    setShowCategoryForm(true);
    setShowCart(false);
    setShowHome(false);
    setShowProductForm(false);
  };

  const handleShowProductForm = () => {
    setShowProductForm(true);
    setShowCart(false);
    setShowCategoryForm(false);
    setShowHome(false);
  };

  const handleCategoryAdded = (newCategory) => {
    setCategories(prev => [...(prev || []), newCategory]);
    setShowCategoryForm(false);
    setShowHome(true);
  };

  const handleProductAdded = (newProduct) => {
    fetchProducts();
    setShowProductForm(false);
    setShowHome(true);
  };

  const cartItemCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <>
      <Navbar
        user={user}
        onLogout={handleLogout}
        onShowCart={handleShowCart}
        onShowCategoryForm={handleShowCategoryForm}
        onShowHome={handleShowHome}
        onShowProductForm={handleShowProductForm}
        onShowLogin={() => {
          setShowLogin(true);
          setShowRegister(false);
          setShowHome(false);
        }}
        cartItemCount={cartItemCount}
      />

      <div className="container mt-4">

        
        {showLogin && !user && (
          <Login
            onLogin={(u) => {
              setUser(u);
              setShowLogin(false);
              setShowHome(true);
            }}
            onShowRegister={() => {
              setShowRegister(true);
              setShowLogin(false);
            }}
          />
        )}

        
        {showRegister && !user && (
          <Register
            onRegister={(u) => {
              setUser(u);
              setShowRegister(false);
              setShowHome(true);
            }}
          />
        )}

        
        {!showLogin && !showRegister && (
          <>
            {showHome && (
              <ProductList
                products={products}
                user={user}
                refreshCart={fetchCart}
                refreshProducts={fetchProducts}
              />
            )}

            {user && showCart && (
              <Cart user={user} cartItems={cartItems} refreshCart={fetchCart} />
            )}

            {user && showCategoryForm && (
              <AddCategory onCategoryAdded={handleCategoryAdded} />
            )}

            {user && showProductForm && (
              <AddProduct
                categories={categories}
                onProductAdded={handleProductAdded}
              />
            )}

            {user && showCart && (
              <button className="btn btn-secondary mt-3" onClick={handleHideCart}>
                Înapoi la produse
              </button>
            )}
          </>
        )}
      </div>
    </>
  );
}

export default App;
