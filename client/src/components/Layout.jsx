import Navbar from "./layout/Navbar";

export default function Layout({ children }) {
  return (
    <div>
      <Navbar />
      <main style={{ padding: "0 20px 20px" }}>{children}</main>
    </div>
  );
}