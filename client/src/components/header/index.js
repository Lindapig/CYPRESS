import "./index.css";
import { useState } from "react";
import { isLoggedIn, logout } from "../../services/userService";
// import { Link } from "react-router-dom";

const Header = ({ search, setQuesitonPage }) => {
    const [val, setVal] = useState(search);
    const [username, setUsername] = useState('');
    // const navigate = useNavigate();
    // check if user is logged in
    // if logged in, display welcome message
    // if not logged in, display login button
    // isLoggedIn().then((res) => {
    //     if (res) {
    //         document.getElementById("header").children[0].innerHTML = "Welcome, " + res.username;
    //     } else {
    //         // display a login button
    //         // if the botton is click, redirect to login page
    //         document.getElementById("header").children[0].innerHTML = "<button>Login</button>";
    //         document.getElementById("header").children[0].children[0].onclick = () => {
    //             // window.location.href = "/login";
    //             // navigate("/login");
                
    //         };            
    //     }
    // });


    // useEffect(() => {
    //     isLoggedIn().then((res) => {
    //         if (!res) {
    //             const loginButton = document.getElementById("loginButton");
    //             if (loginButton) {
    //                 // loginButton.onclick = () => navigate("/login");
    //                 loginButton.onclick = () => {
    //                     navigate("/loginPage");
                        
    //                 };
    //             }
    //         }
    //     });
    // }, [navigate]);

    (async () => {
        const loginStatus = await isLoggedIn();
        if (loginStatus && loginStatus.username) {
            setUsername(loginStatus.username);
        }  else {
            window.location.reload(); 
        }
    })();

    const handleLogout = async () => {
        await logout();
        window.location.reload();
    }

    return (
        <div id="header" className="header">
            <div>
            <div id = "welcome">Welcome, {username}</div>
            <button onClick={handleLogout}>logout</button>
            </div>
            <div className="title">Fake Stack Overflow</div>
            <input
                id="searchBar"
                placeholder="Search ..."
                type="text"
                value={val}
                onChange={(e) => {
                    setVal(e.target.value);
                }}
                onKeyDown={(e) => {
                    if (e.key === "Enter") {
                        e.preventDefault();
                        setQuesitonPage(e.target.value, "Search Results");
                    }
                }}
            />
        </div>
    );
};

export default Header;
