import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { registerUser } from "../api/auth";
import Layout from "../components/Layout";

export default function RegisterPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    email: "",
    username: "",
    first_name: "",
    last_name: "",
    password: "",
  });
  const [error, setError] = useState("");

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      await registerUser(form);
      navigate("/login");
    } catch (err) {
      setError(err?.response?.data?.detail || "Ошибка регистрации");
    }
  };

  return (
    <Layout>
      <div className="form-card" style={{ maxWidth: 420, margin: "0 auto" }}>
        <h1>Регистрация</h1>

        <form className="form-grid" onSubmit={handleSubmit}>
          <input name="email" type="email" placeholder="Email" value={form.email} onChange={handleChange} required />
          <input name="username" placeholder="Логин" value={form.username} onChange={handleChange} required />
          <input name="first_name" placeholder="Имя" value={form.first_name} onChange={handleChange} required />
          <input name="last_name" placeholder="Фамилия" value={form.last_name} onChange={handleChange} required />
          <input name="password" type="password" placeholder="Пароль" value={form.password} onChange={handleChange} required />

          {error && <p style={{ color: "crimson" }}>{error}</p>}

          <button type="submit">Создать аккаунт</button>
        </form>

        <p style={{ marginTop: 10 }}>
          Уже есть аккаунт? <a href="/login">Войти</a>
        </p>
      </div>
    </Layout>
  );
}
