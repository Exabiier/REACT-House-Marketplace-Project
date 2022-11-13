import React from 'react'

function SignIn() {

  const[ showPassword, setShowPassword] = useState(false)

  const [ formData, setFormData] = useState({
    email: "",
    password: "",
  })

  const {email, password} = formData;

const navigate = useNavigate();

const onChange = (e) => {
  
  setFormData((prevState) => ({
    ...prevState,
    [e.target.id]: e.target.value,
  }))
}

  return (
    <>
      <div className="pageContainer">
        <header>
          <p className="pageHeader">Welcome Back!</p>
          </header>

          <main>
            <form>

              <input type="email" className="emailInput" placeholder="Enter Email" id="email" value={email} onChange={onChange} />

              <div className="passwordInputDiv">

                <input type={showPassword ? "text" : "password"} className="passwordInput" placeholder="Password" id="password" value={password} onChange={onChange}/>

                <img src={visibilityIcon} alt="show password" className="showPassword" onClick={() => setShowPassword((prevState) => !prevState)}/>
                
              </div>

              <Link to="/forgot-password" className="forgotPasswordLink">
                Forget Password 
              </Link>

              <div className="signInBar">
                <p className="signInText">
                  Sign In
                </p>
                <button className="signInButton">
                  <ArrowRightIcon fill="#ffffffff" width="34px" height="34px" />

                </button>
              </div>
            </form>

            {/* Google OAuth */}

            <Link to="/sign-up" className="registerLink">Sign up Instead</Link>

          </main>
      </div>
    </>
    
  )
}

export default SignIn