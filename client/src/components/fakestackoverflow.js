import React from "react";
import { useState } from "react";
import Header from "./header";
import Main from "./main";
import LoginPage from "./login/loginPage";
import { isLoggedIn } from "../services/userService";

export default function FakeStackOverflow() {
    const [search, setSearch] = useState("");
    const [mainTitle, setMainTitle] = useState("All Questions");
    const [islogin, setIslogin] = useState(false);
    const [username, setUsername] = useState("");
    const [toMyProfile, setToMyProfile] = useState(false);

    const setQuesitonPage = (search = "", title = "All Questions", toMyProfile = false) => {
        setSearch(search);
        setMainTitle(title);
        setToMyProfile(toMyProfile);
        if (toMyProfile) {
            setMainTitle(title + " , " + username);
        }
    };
    
    (async () => {
        const loginStatus = await isLoggedIn();
        // console.log(loginStatus.username);
        if (loginStatus && loginStatus.username) {
            setIslogin(true);
            setUsername(loginStatus.username);
        }  
    })();
    
    if (!islogin) {
        return <LoginPage />;
    }
    return (
        <>
            <Header search={search} setQuesitonPage={setQuesitonPage} />
            <Main
                title={mainTitle}
                search={search}
                setQuesitonPage={setQuesitonPage}
                toMyProfie={toMyProfile}
            />
        </>
    );
}
