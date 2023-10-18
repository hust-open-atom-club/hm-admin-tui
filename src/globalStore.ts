import React from "react";


type State<T> = [T, React.Dispatch<React.SetStateAction<T>>];

type GlobalStore = {
  help: State<string>;
}

export default React.createContext<GlobalStore | null>(null);

