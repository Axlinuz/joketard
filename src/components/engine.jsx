import { useEffect, useState } from "react";
import Single from "./single";
import TwoPart from "./twopart";
import img from "../assets/button.png";
import searchIcon from "../assets/search-icon.png"

export default function Engine() {
    const [data, setData] = useState(null);
    const [errorMsg, setErrorMsg] = useState(null);
    const [loading, setLoading] = useState(false);
    const [url, setUrl] = useState("");
    const [input, setInput] = useState("");
    const [icon, setIcon] = useState(<img src={searchIcon} alt="loading" />);
    const [cat, setCat] = useState("Any");
    const [joke, setJoke] = useState(null);
    const [joke2, setJoke2] = useState(null);

    async function fetchData() {
        try {
            setIcon(<img src={img} alt="loading" />);
            setLoading(true);
            const res = await fetch(url);
            const rawData = await res.json();

            if (res.ok) {
                if (!rawData.error) {
                    setData(rawData);
                    setErrorMsg(null)
                    if (rawData.type === "single") {
                        setJoke(rawData.joke);
                        setJoke2(null);  
                    } else if (rawData.type === "twopart") {
                        setJoke(rawData.setup);
                        setJoke2(rawData.delivery);
                    }

                } else {
                    setErrorMsg(rawData.message);
                    console.log(rawData.message);
                }
            } else {
                setErrorMsg("Failed to fetch data.");
            }
        } catch (e) {
            setErrorMsg("An error occurred.");
            console.log(e);
        } finally {
            setLoading(false);
            setIcon(<img src={searchIcon} alt="loading" />);
        }
    }

    useEffect(() => {
        setUrl(`https://v2.jokeapi.dev/joke/${cat}?contains=${input}`);
    }, [input, cat]);

    const handleSubmit = (e) => {
        e.preventDefault();
        fetchData();
    };

    const handleCategoryChange = (e) => {
        setCat(e.target.value);
    };

    return (
        <>
            <form onSubmit={handleSubmit}>
            <div className="search"> <input 
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Search a joke containing..."
                />
                <button type="submit">{icon}</button>
            </div>
                  <div className="options">
                   <input type="radio" name="type" value="Any" onChange={handleCategoryChange} checked={cat === "Any"} />
                    <label>Any</label>
                    <input type="radio" name="type" value="Dark" onChange={handleCategoryChange} checked={cat === "Dark"} />
                    <label className="dark">Dark</label>
                   </div>
                
            </form>
                <div className="generate-random-container"><button onClick={fetchData} className="button-74">Generate Random </button></div>

            {
                loading ? (
                    <div className="loader-container">
                        <span class="loader"></span>
                    </div>
                ) : (
                    data && !errorMsg ? (
                        data.type === "single" ? (
                            <Single joke={joke} />
                        ) : data.type === "twopart" ? (
                            <TwoPart joke={joke} joke2={joke2} />
                        ) : null
                    ) : (
                        <p className="error">{errorMsg || null}</p> 
                    )
                )
            }
        </>
    );
}
