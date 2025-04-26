import s from './App.css';
import Header from "./components/Header/Header";
import CatalogCategory from "./components/CatalogCategory/CatalogCategory";
import Scene from "./components/Scene/Scene";
import Properties from "./components/Properties/Properties";

const App = () => {
  return (
    <div className={s.appWrapper}>
      <Header />
      <CatalogCategory />
      <Scene />
      <Properties />
    </div>
  );
}

export default App;
