import s from './App.module.css';
import Header from "./components/Header/Header";
import Categories from "./components/Categories/Categories";
import Scene from "./components/Scene/Scene";
import Properties from "./components/Properties/Properties";

const App = () => {
  return (
    <div className={s.appWrapper}>
      <Header />
      <Categories />
      <Scene />
      <Properties />
    </div>
  );
}

export default App;
