import { NextPage } from 'next';
import { useEffect, useState } from 'react';
import { useLocale } from '../utils/useLocale';
import { LANG } from '../utils/langType';
import Link from 'next/link';
import { useRouter } from 'next/router';


const Index: NextPage = () => {
  const router = useRouter();
  const { pathname, query, asPath, locale } = router;
  const {t} = useLocale();
  const [data, setData] = useState<any>(null);
  const [pokemonNum, setPokemonNum] = useState<number>(Math.floor(Math.random()*100));
  const [loading, setLoading] = useState<boolean>(false);
  const [inputVal, setInputVal] = useState<number | "">('')
  const [time, setTime] = useState<string>("");

  const getPokemon = () => {
    setLoading(true);
    const url = `https://pokeapi.co/api/v2/pokemon/${pokemonNum}`;
    fetch(url).then((res) => {
      res.json().then((response) => {
        setData(response);
      }).catch((err) => setPokemonNum(1));
    });
    setTimeout(() => {setLoading(false)},3000)
  }

  const handleSearch = () => {
    if (inputVal === "" || isNaN(inputVal)) { return }

    setPokemonNum(inputVal);
    setInputVal("");
    let limit = 60;
    let interval = setInterval(() => {
      limit--;
      const minute = (limit - (limit % 60)) / 60;
      const second = limit % 60;
      setTime(
        minute + " : " + `${second.toString().length < 2 ? "0" + second : second + ""}`
      );
    }, 1000)
    setTimeout(() => {
      clearInterval(interval);
      setTime("");
    },60000)
  }


  useEffect(() => {
    getPokemon();
  }, [pokemonNum])



  return (
    <div className="container">
      {time !== "" ? (
        <div className="error">
          {t[LANG.Timer]} <b>{time}</b>
        </div>
      ) : (
        <></>
      )}
      <div className="pokedex">
        <div className="artwork">
          <img
            alt="thumbnails"
            src={data?.sprites.other["official-artwork"].front_default || ""}
          />
        </div>
        <div className="info">
          <div>#{data?.order || ""}</div>
          <div>
            <b>{data?.name.toUpperCase() || ""}</b>
          </div>
          <div>
            <u>{t[LANG.Weight]}:</u> {data?.weight / 10 || ""} - <u>{t[LANG.Height]}:</u>{" "}
            {data?.height * 10 || ""}
          </div>
          <div>
            {" "}
            <u>{t[LANG.Ability]}:</u>&nbsp;
            {data?.abilities
              .map((item, index) => (index < 2 ? item.ability.name : ""))
              .join(" | ") || ""}
          </div>
          <div>
            {" "}
            <u>{t[LANG.Type]}:</u>&nbsp;
            {data?.types
              .map((item, index) => (index < 2 ? item.type.name : ""))
              .join(" | ") || ""}
          </div>
        </div>
        <div className="stats">
          <div className="stats_attack">
            <img alt="stats_attack" src="/attack2.png" />
          </div>
          <div className="stats_defense">
            <img alt="stats_attack" src="/defense2.png" />
          </div>
          <div className="stats_special_attack">
            <img alt="stats_attack" src="/attack_special2.png" />
          </div>
          <div className="stats_special_defense">
            <img alt="stats_attack" src="/defense_special2.png" />
          </div>
          <div className="stats_speed">
            <img alt="stats_attack" src="/speed2.png" />
          </div>
          <div className="stats_attack_spec">{data?.stats[1].base_stat}</div>
          <div className="stats_defense_spec">{data?.stats[2].base_stat}</div>
          <div className="stats_special_attack_spec">
            {data?.stats[3].base_stat}
          </div>
          <div className="stats_special_defense_spec">
            {data?.stats[4].base_stat}
          </div>
          <div className="stats_speed_spec">{data?.stats[5].base_stat}</div>
        </div>
        <div className="stats_hp">
          <div className="stats_hp_title">
            <img alt="stats_attack" src="/hp.png" />
          </div>
          <div className="stats_hp_spec">{data?.stats[0].base_stat}</div>
        </div>
        <div className="map">
          {loading ? (
            <div>Loading...</div>
          ) : (
            <div className="map_img">
              <img alt="compass" src="/compass.png" />
              <img alt="map" src="/map2.png" />
            </div>
          )}
        </div>
        <div className="switch_lang">
          <Link href={{ pathname, query }} as={asPath} locale={locale === 'ja' ? 'en' : 'ja'}>
            <a>{locale.toLocaleUpperCase()}</a>
          </Link>
        </div>
        <div className="search_input">
          <input
            value={inputVal}
            onChange={(e) => setInputVal(parseInt(e.target.value))}
            type="number"
            disabled={time !== ""}
          />
        </div>
        <button
          className="search_button"
          disabled={time !== ""}
          onClick={() => {
            handleSearch();
          }}
        >
          PokeDex!
        </button>
        <img alt="arrow" src="/arrow.png" className="arrow1" />
        <img alt="arrow" src="/arrow.png" className="arrow2" />
        <img alt="arrow" src="/arrow.png" className="arrow3" />
        <div className="instruction1">
          {t[LANG.SwitchGuide]}
        </div>
        <div className="instruction2">
          {t[LANG.InputGuide]}
        </div>
        <div className="instruction3">
          {t[LANG.SearchGuide]}
        </div>
        <div className="instruction4">
          {t[LANG.Notice]}
        </div>
      </div>
    </div>
  );
}

export default Index;