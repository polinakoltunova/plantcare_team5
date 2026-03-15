import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { registerUser } from "../api/auth";

export default function RegisterPage() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    email: "",
    username: "",
    first_name: "",
    last_name: "",
    password: ""
  });

  const [error, setError] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      await registerUser(form);
      navigate("/login");
    } catch (err) {
      setError("Ошибка регистрации");
    }
  };

  return (
    <div className="auth-container">
      <h2>Регистрация</h2>

      <form onSubmit={handleSubmit}>
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={form.email}
          onChange={handleChange}
          required
        />

        <input
          type="text"
          name="username"
          placeholder="Логин"
          value={form.username}
          onChange={handleChange}
          required
        />

        <input
          type="text"
          name="first_name"
          placeholder="Имя"
          value={form.first_name}
          onChange={handleChange}
          required
        />

        <input
          type="text"
          name="last_name"
          placeholder="Фамилия"
          value={form.last_name}
          onChange={handleChange}
          required
        />

        <input
          type="password"
          name="password"
          placeholder="Пароль"
          value={form.password}
          onChange={handleChange}
          required
        />

        {error && <p className="error">{error}</p>}

        <button type="submit">Создать аккаунт</button>
      </form>
    </div>
  );
}
