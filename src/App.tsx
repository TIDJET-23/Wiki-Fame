import { useState } from "react";
import { Button, Input, CircularProgress } from "@mui/joy";
import SearchIcon from "@mui/icons-material/Search";
import "./App.css";

function App() {
  const [name, setName] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [description, setDescription] = useState("");
  const [normalized, setNormalized] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    setLoading(true);
    e.preventDefault();
    e.stopPropagation();
    setError(null);
    setNormalized("");
    setDescription("");
    setImageUrl("");
    if (name) {
      try {
        const res = await fetch("https://en.wikipedia.org/api/rest_v1/page/summary/" + name);
        if (res.ok && res.status === 200) {
          const json = await res.json();
          if (json.type === "standard") {
            setNormalized(json.titles.normalized);
            setDescription(json.description);
            setImageUrl(json.thumbnail.source);
          }
        } else {
          setLoading(false);
          setError("No results found.");
        }
      } catch (error) {
        setLoading(false);
        setError("Error fetching data.");
      }
    }
    setLoading(false);
  };


  return (
    <>
      <h1 className="header">Wiki Fame</h1>
      <div className="card">
          <form>
            <Input
              placeholder="search" size="lg"
              startDecorator={<SearchIcon />}
              endDecorator={<Button type="submit" onClick={handleSubmit}>Search</Button>}
              onChange={(e) => setName(e.target.value)}
            />
          </form>
      </div>

      {loading ? (
        <div className="loader">
            <CircularProgress color="success" size="lg" />
        </div>
      ) : (
        <div className="result">
          {error && <p>{error}</p>}
          {normalized && (
            <>
              <h2>{normalized}</h2>
              <img src={imageUrl} alt={description} />
              <p>{description}</p>
            </>
          )}
        </div>
      )}


    </>
  );
}

export default App;
