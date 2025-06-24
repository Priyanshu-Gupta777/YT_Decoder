import React ,{useState, useEffect} from 'react';
import {useNavigate,Link} from 'react-router-dom'
import axios from 'axios';

function Signup() {

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      navigate('/dashboard');
    }
  }, []);
  
  const [Values, setValues] = useState({username:"",email:"",password:""});
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const change = (e) =>{
   const {id, value} = e.target;
   setValues({...Values, [id] : value});
  }

  const isValidEmail = (email) => {
    const allowedDomains = ['gmail.com', 'outlook.com', 'yahoo.com', 'hotmail.com', 'icloud.com', 'microsoft.com'];
    const emailParts = email.split('@');
    if (emailParts.length !== 2) return false;
    const domain = emailParts[1].toLowerCase();
    return allowedDomains.includes(domain);
  };
 
  const handleSubmit = async(e) =>{
    e.preventDefault();

    
    
    try
    {
       if(Values.username === "" || Values.email === "" || Values.password === "" ){
        
        alert("All fields are required");
       }
       
       if (!isValidEmail(Values.email)) {
        alert("Please enter a valid email from Gmail, Outlook, Yahoo, etc.");
        return;
      }
        
        setLoading(true);
        const resp = await axios.post('https://yt-backend-mlt6.onrender.com/api/sign/signup', Values);
        //console.log(resp.data);
        
        navigate('/login')
     
    }
    catch(error){
      alert(error.response?.data?.message || "SignUp Failed");
    }
    finally{
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900">
      <div className="bg-gradient-to-tl from-gray-900 to-zinc-300 p-8 rounded-lg shadow-md w-96">
        <h1 className="text-2xl font-bold mb-6 text-center">Sign Up</h1>
        <form className="space-y-4"  >
          <div>
            <label htmlFor="name" className="block text-md font-medium text-gray-700">
              UserName
            </label>
            <input
              type="text"
              id="username"
              value={Values.username}
              onChange={change}
              className="mt-1 block w-full px-3 py-2 bg-transparent border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-zinc-800 focus:border-zinc-800"
              
            />
          </div>
          <div>
            <label htmlFor="email" className="block text-md font-medium text-gray-700">
              Email
            </label>
            <input
              type="email"
              id="email"
              value={Values.email}
              onChange={change}
              className="mt-1 block w-full px-3 py-2 bg-transparent border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-zinc-800 focus:border-zinc-800"
              
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-md font-medium text-gray-700">
              Password
            </label>
            <input
              type="password"
              id="password"
              value={Values.password}
              onChange={change}
              className="mt-1 block w-full px-3 py-2 bg-transparent border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-zinc-800 focus:border-zinc-800"
              
            />
          </div>

          <button
            type="submit"
            onClick={handleSubmit}
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500" 
          >
            {loading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>&nbsp;
                  <span>Registering...</span>
                </>
              ) : (
                <>
                  <span>Signup</span>
                </>
              )}
          </button>
        </form>
        <div className="mt-4 text-center">
          <Link to="/login" className="font-semibold text-md text-white hover:text-sky-300">
            Already have an account? Log in
          </Link>
        </div>
      </div>
    </div>
  );
  }
  
  export default Signup;