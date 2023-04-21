import React, { useCallback, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import appRoutes from "../../appRoutes";
import { useDispatch } from "react-redux";
import client from "../../api";
import { setUser } from "../../store/userSlice";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import {useEffect} from "react";

const Login = () => {
    useEffect(()=>{window.scrollTo(0,0)}, []);
    const [loginForm, setLoginForm] = useState({
        email: "",
        password: ""
    });
    const [showPassword, setShowPassword] = useState(false);
    const navigate = useNavigate();

    const handleChange = e => {
        const { name, value } = e.target
        setLoginForm({
            ...loginForm,
            [name]: value
        });
    };

    const dispatch = useDispatch();

    const onShowPasswordClick = useCallback(() => {
        setShowPassword(prev => !prev);
    }, []);

    const authUser = () => {
        const token = localStorage.getItem("TOKEN");
        if (token) {
            client.get("auth/auth", {
                headers: { Authorization: `Bearer ${token}` },
            }).then(res => {
                localStorage.setItem("TOKEN", res.data.token);
                dispatch(setUser(res.data.user));
            }).catch(e => {
                localStorage.clear("TOKEN");
                console.log(e);
            })
        }
    }

    const login = () => {
        const { email, password } = loginForm
        if (email && password) {
            client.post("auth/login", loginForm)
                .then(res => {
                    //alert(res.data.success)
                    //dispatch(setUser(res.data.user));
                    localStorage.setItem("TOKEN", res.data.token);
                    if (res.data.success) {
                        authUser();
                        navigate("/");
                    }
                    else {
                        alert("Login Error");

                    }

                }).catch(e => {
                    console.log(e);
                    alert("Login Error");
                })
        }
    }

    return (
        <div>
            <Navbar />
            <div className="h-screen flex bg-fon">
                <form className="m-auto w-auto border-1 border-black rounded-md bg-white bg-opacity-30 shadow-md shadow-gray-700 flex flex-col">
                    {/* {console.log(loginForm)} */}
                    <div className="text-3xl text-white bg-black py-2 px-4 font-bold bg-opacity-90">Login</div>

                    <div className="mt-5 mx-3">
                        <input
                            type="text"
                            className="outline-none text-xl placeholder-slate-600 rounded-sm mx-2 px-3 py-2 border-2 border-gray-400"
                            name="email"
                            value={loginForm.email}
                            onChange={handleChange}
                            placeholder="Enter your email"
                        />

                        <div className="flex mt-5">
                            <input
                                type={showPassword ? "text" : "password"}
                                className="outline-none text-xl placeholder-slate-600 rounded-sm mx-2 px-3 py-2 border-2 border-gray-400"
                                name="password"
                                value={loginForm.password}
                                onChange={handleChange}
                                placeholder="Enter your password"
                            />

                            <button className="text-2xl" type="button" onClick={onShowPasswordClick}>
                                {
                                    showPassword ? "✪" : "★"
                                }
                            </button>
                        </div>
                        <button type="button" className="w-full py-2 mt-5 shadow-sm shadow-black bg-[#FF7F50] focus:bg-[#FF7F50] hover:bg-[#FFA07A]" onClick={login}>Login</button>
                    </div>

                    <Link to={appRoutes.registration.path} replace className=" m-2 text-md text-white ">Register</Link>
                </form>
            </div>
            <Footer />
        </div>
    )
}

export default Login