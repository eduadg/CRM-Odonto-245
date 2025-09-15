import { Route, Routes, Navigate, Link } from 'react-router-dom'
import { useState } from 'react'
import './App.css'

function App() {
  return (
    <div className="app-container">
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<AuthLayout><LoginPage /></AuthLayout>} />
        <Route path="/register" element={<AuthLayout><RegisterPage /></AuthLayout>} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </div>
  )
}

function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="auth-layout">
      <div className="auth-card">
        <div className="brand">
          <div className="logo-circle">CR</div>
          <div className="brand-text">
            <h1>CRM Odonto</h1>
            <p>Gerencie sua clínica com eficiência</p>
          </div>
        </div>
        {children}
        <div className="auth-footer">
          <p>© {new Date().getFullYear()} CRM Odonto</p>
        </div>
      </div>
      <div className="auth-illustration">
        <div className="illustration-content">
          <h2>Atendimento moderno</h2>
          <p>Organize pacientes, consultas e finanças em um só lugar.</p>
        </div>
      </div>
    </div>
  )
}

function LoginPage() {
  const [form, setForm] = useState({ email: '', password: '', remember: false })
  const isValid = form.email.includes('@') && form.password.length >= 6
  return (
    <form className="auth-form" onSubmit={(e) => e.preventDefault()}>
      <h2>Entrar</h2>
      <div className="form-group">
        <label htmlFor="email">E-mail</label>
        <input id="email" type="email" placeholder="seu@email.com" required value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
      </div>
      <div className="form-group">
        <label htmlFor="password">Senha</label>
        <input id="password" type="password" placeholder="••••••••" required value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />
      </div>
      <div className="form-row">
        <label className="checkbox">
          <input type="checkbox" checked={form.remember} onChange={(e) => setForm({ ...form, remember: e.target.checked })} />
          <span>Lembrar-me</span>
        </label>
        <Link to="#" className="link">Esqueci minha senha</Link>
      </div>
      <button className="btn" type="submit" disabled={!isValid} aria-disabled={!isValid}>Entrar</button>
      <p className="hint">Não tem conta? <Link to="/register" className="link">Crie uma agora</Link></p>
    </form>
  )
}

function RegisterPage() {
  const [form, setForm] = useState({ name: '', phone: '', email: '', password: '', confirm: '' })
  const passwordMatch = form.password.length >= 8 && form.password === form.confirm
  const isValid = form.name.length >= 2 && form.email.includes('@') && passwordMatch
  return (
    <form className="auth-form" onSubmit={(e) => e.preventDefault()}>
      <h2>Criar conta</h2>
      <div className="form-row">
        <div className="form-group">
          <label htmlFor="name">Nome completo</label>
          <input id="name" type="text" placeholder="Seu nome" required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
        </div>
        <div className="form-group">
          <label htmlFor="phone">Telefone</label>
          <input id="phone" type="tel" placeholder="(00) 00000-0000" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
        </div>
      </div>
      <div className="form-group">
        <label htmlFor="email-r">E-mail</label>
        <input id="email-r" type="email" placeholder="voce@email.com" required value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
      </div>
      <div className="form-row">
        <div className="form-group">
          <label htmlFor="password-r">Senha</label>
          <input id="password-r" type="password" placeholder="Mínimo 8 caracteres" required value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />
        </div>
        <div className="form-group">
          <label htmlFor="confirm">Confirmar senha</label>
          <input id="confirm" type="password" placeholder="Repita a senha" required value={form.confirm} onChange={(e) => setForm({ ...form, confirm: e.target.value })} />
        </div>
      </div>
      <button className="btn" type="submit" disabled={!isValid} aria-disabled={!isValid}>Registrar</button>
      {!passwordMatch && (form.password || form.confirm) ? (
        <p className="hint">As senhas precisam ter 8+ caracteres e ser iguais.</p>
      ) : null}
      <p className="hint">Já tem conta? <Link to="/login" className="link">Faça login</Link></p>
    </form>
  )
}

function NotFound() {
  return (
    <div className="not-found">
      <h2>Página não encontrada</h2>
      <p>A rota acessada não existe.</p>
      <Link to="/login" className="btn">Ir para login</Link>
    </div>
  )
}

export default App
