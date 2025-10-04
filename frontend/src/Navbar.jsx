const Navbar = ({ 
  user, 
  onLogout, 
  cartItemCount, 
  onShowCart, 
  onShowCategoryForm, 
  onShowHome, 
  onShowProductForm,
  onShowLogin
}) => {
  const isAdmin = user?.role === "ADMIN";

  return (
    <nav className="navbar navbar-expand-lg fixed-top" style={{ backgroundColor: '#e3f2fd' }} data-bs-theme="light">
      <div className="container">
        <a 
          className="navbar-brand" 
          href="/" 
          onClick={(e) => { e.preventDefault(); onShowHome(); }}
        >
          Vinuri de calitate
        </a>

        <div className="navbar-nav">
          <button className="nav-link btn btn-link" onClick={onShowHome}>Home</button>

          {isAdmin && (
            <>
              <button className="nav-link btn btn-link" onClick={onShowCategoryForm}>Categorii</button>
              <button className="nav-link btn btn-link" onClick={onShowProductForm}>Adaugă Produs</button>
            </>
          )}
        </div>

        <div className="navbar-nav ms-auto d-flex align-items-center">
          {user ? (
              <>
                <span className="navbar-text me-3">Hello, {user.username}!</span>

                {!isAdmin && (
                  <button className="nav-link btn btn-link" onClick={onShowCart}>
                    Coșul tău <span className="badge bg-secondary">{cartItemCount}</span>
                  </button>
                )}

                <button className="btn btn-danger ms-2" onClick={onLogout}>Logout</button>
              </>
            ) : (
              <button className="nav-link btn btn-link" onClick={onShowLogin}>
                Autentificare / Înregistrare
              </button>
            )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
