import { useState } from "react";
import "./App.css";
import Currency from "./components/currency";
import { qauntProps } from "./type";

function App() {
  const [quant1, setQuant1] = useState<qauntProps>(Object);
  const [quant2, setQuant2] = useState<qauntProps>(Object);
  const [changes, setChanges] = useState<boolean>(false);
  const [val, setVal] = useState<number>(0);

  return (
    <>
      <div className="hero__title">
        {!changes ? (
          <h1>
            {val} {quant1.currency?.code} to {quant2.currency?.code} -
            Convert {quant1.currency?.name} to {quant2.currency?.name}
          </h1>
        ) : (
          <h1>
            {val} {quant2.currency?.code} to {quant1.currency?.code} -
            Convert {quant2.currency?.name} to {quant1.currency?.name}
          </h1>
        )}
        <p>Xe Currency Converter</p>
      </div>

      <Currency
        setQuant1={setQuant1}
        setQuant2={setQuant2}
        setChanges={setChanges}
        setVal={setVal}
      />
    </>
  );
}

export default App;