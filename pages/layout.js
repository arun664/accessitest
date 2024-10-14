// components/Layout.js
const Layout = ({ children }) => {
    return (
      <div>
        <header>Header content here</header>
        <main>{children}</main>
        <footer>Footer content here</footer>
      </div>
    );
  };
  
  export default Layout;  