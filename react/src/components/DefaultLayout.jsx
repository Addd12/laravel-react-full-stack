import { Link, Navigate, Outlet } from "react-router-dom";
import { useStateContext } from "../contexts/ContextProvider";
import { useEffect } from "react";
import axiosClient from "../../axios-client";

export default function DefaultLayout(){
    const {user, token, notification, setUser, setToken} = useStateContext()
    if(!token){
        return <Navigate to="/login" />
    }

    const onLogout = (ev) => {
        ev.preventDefault()

        axiosClient.post('/logout') //whenever the logout happens
        .then(() => { //then we do the following
            setUser({}) //set user to be an empty object
            setToken(null) //when the token is missing the user gets redirected to the login (should be defined as a const above)
        })
    }

    useEffect(() => {
        axiosClient.get('/user')
        //return the user info
        .then(({data}) => { //destructure the response and get the data from there
            setUser(data)
        })
    }, []) //without the square brackets it keeps sending requests

    return(
        <div id="defaultLayout">
            <aside>
                <Link to="/dashboard">Dashboard</Link>
                <Link to="/users">Users</Link>
            </aside>
            <div className="content">
                <header>
                    <div>
                        Header
                    </div>
                    <div>
                        {user.name}
                        <a className="btn-logout" href="#" onClick={onLogout}>Logout</a>
                    </div>
                </header>
                <main>
                    <Outlet />
                </main>
            </div>
            {notification &&
                <div className="notification">
                    {notification}
                </div>
            }
        </div>
    )
}