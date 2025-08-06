import logo from '../SW.svg';

function Login() {
  return (
    <div className="login-container">
      <div className="login-box">
        <img src={logo} alt="Swift Sale Logo" className="logo" />
                

        <form>
          <input type="text" placeholder="Usuário" required />
          <input type="password" placeholder="Senha" required />
          <button type="submit">Entrar</button>
        </form>
      </div>
    </div>
  );
}

export default Login;