import React, { useState } from "react";
import { account } from "../appwrite";
import { useNavigate } from "react-router-dom";

function Signup() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();

    const handleSignup = async () => {
        try {

            await account.create(
                "unique()",
                email,
                password
            );

            alert("Account created successfully");

            navigate("/login");

        } catch (error) {
            console.log(error);
            alert(error.message);
        }
    };

    return (
        <div>

            <h2>Signup</h2>

            <input
                placeholder="Email"
                onChange={(e) => setEmail(e.target.value)}
            />

            <br /><br />

            <input
                type="password"
                placeholder="Password"
                onChange={(e) => setPassword(e.target.value)}
            />

            <br /><br />

            <button onClick={handleSignup}>
                Signup
            </button>

        </div>
    );
}

export default Signup;