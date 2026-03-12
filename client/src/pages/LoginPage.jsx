import { useState } from "react";
import { login } from "../api/auth";
function LoginPage() {
  const [form, setForm] = useState({ username: "", password: "" });
  const [result, setResult] = useState("");
  const handleChange = (e) => {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };
  const submit = async (e) => {
    e.preventDefault();
    try {
      const response = await login(form);
      localStorage.setItem("token", response.data.access_token);
      setResult("Вход выполнен");
    } catch (error) {
      setResult("Ошибка входа");
    }
  };
  return (
    <div>
      <h1>Вход</h1>
      <form onSubmit={submit} style={{ display: "grid", gap: "10px", maxWidth: "400px" }}>
        <input name="username" placeholder="Логин" value={form.username} onChange={handleChange} />
        <input name="password" type="password" placeholder="Пароль" value={form.password} onChange={handleChange} />
        <button type="submit">Войти</button>
      </form>
      {result && <p>{result}</p>}
    </div>
  );
}
export default LoginPage;
