import { useState } from "react";
import { login } from "../api/auth";
import Layout from "../components/Layout";

export default function LoginPage() {
  const [form, setForm] = useState({ username: "", password: "" });
  const [result, setResult] = useState("");

  const handleChange = (e) =>
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const submit = async (e) => {
    e.preventDefault();
    try {
      const data = await login(form);
      localStorage.setItem("token", data.access_token);
      setResult("Вход выполнен");
    } catch {
      setResult("Ошибка входа");
    }
  };

  return (
    <Layout>
      <div className="form-card" style={{ maxWidth: 420, margin: "0 auto" }}>
        <h1>Вход</h1>

        <form className="form-grid" onSubmit={submit}>
          <input name="username" placeholder="Логин" value={form.username} onChange={handleChange} />
          <input name="password" type="password" placeholder="Пароль" value={form.password} onChange={handleChange} />
          <button type="submit">Войти</button>
        </form>

        {result && <p>{result}</p>}
      </div>
    </Layout>
  );
}
