import { useEffect, useState } from "react";
import "./assets/css/App.css";
import { FeaturedMovie } from "./components/FeaturedMovie";
import { Header } from "./components/Header";
import { MovieRow } from "./components/MovieRow";
import { Api } from "./services/Api";

function App() {
  const [movieList, setMovieList] = useState([]);
  const [featureData, setFeatureData] = useState(null);
  const [blackHeader, setBlackHeader] = useState(false);
  useEffect(() => {
    const loadAll = async () => {
      let data = await Api.getHomeList();
      setMovieList(data);
      //destaque
      let originais = data.filter((i) => i.slug === "originals");
      let randomChosen = Math.floor(
        Math.random() * (originais[0].items.results.length - 1)
      );
      let chosen = originais[0].items.results[randomChosen];
      let chosenInfo = await Api.getMovieInfo(chosen.id, "tv");
      console.log(chosenInfo);
      setFeatureData(chosenInfo);
    };
    loadAll();
  }, []);
  useEffect(() => {
    const scrollListener = () => {
      if (window.scrollY > 10) {
        setBlackHeader(true);
      } else {
        setBlackHeader(false);
      }
    };
    window.addEventListener("scroll", scrollListener);
    return () => {
      window.removeEventListener("scroll", scrollListener);
    };
  }, []);
  return (
    <div className="page">
      <Header black={blackHeader} />
      {featureData && <FeaturedMovie item={featureData} />}
      <section className="lists">
        {movieList.map((item, key) => (
          <MovieRow key={key} title={item.title} items={item.items} />
        ))}
      </section>
      <footer>
        Feito com{" "}
        <span role={"img"} aria-label="Coração">
          🥰
        </span>{" "}
        por Talita Araújo
        <br />
        Direitos de imagem para Netflix Dados oriundos do site Themoviedb.org
      </footer>
      {movieList.length <= 0 && (
        <div className="loading">
          <img
            src="https://c.tenor.com/DQyztbEmqnYAAAAC/netflix-loading.gif"
            alt="Loader Netflix"
          />
        </div>
      )}
    </div>
  );
}

export default App;

