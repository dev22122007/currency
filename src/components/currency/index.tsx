import './index.css';
import euro from "../../assests/euro.png";
import { useEffect, useState } from "react";
import { useRef } from "react";
import { qauntProps } from "../../type";
import data from "../../assests/flags.json";
import React, { FC } from "react";
import CountryFrom from "../currencyFrom";
import CountryTo from "../currencyTo";
import { CircularProgress } from "@mui/material";

type ConvertProps = {
    base: string;
    results: {
        AFN: number;
    };
    updated: string;
    ms: number;
};

type objProps = {
    setChanges: React.Dispatch<React.SetStateAction<boolean>>;
    setQuant1: React.Dispatch<React.SetStateAction<qauntProps>>;
    setQuant2: React.Dispatch<React.SetStateAction<qauntProps>>;
    setVal: React.Dispatch<React.SetStateAction<number>>;
};

const Currency: FC<objProps> = ({
    setQuant1,
    setQuant2,
    setChanges,
    setVal,
}) => {
    const [quantity, setQuantity] = useState<number>(
        localStorage.getItem("amount") ? Number(localStorage.getItem("amount")) : 0
    );
    const [exchange, setExchange] = useState<boolean>(false);
    const [convert, setConvert] = useState<ConvertProps[] | any>(null);
    const [country, setCountry] = useState<number>(0);
    const [decimalPart, setDecimal] = useState<string>("0.00");
    const [whole, setWhole] = useState<string>("");
    const countr = localStorage.getItem("currencyFrom")
        ? JSON.parse(localStorage.getItem("currencyFrom") as string).toString()
        : "EUR";
    const countr1 = localStorage.getItem("currencyTo")
        ? JSON.parse(localStorage.getItem("currencyTo") as string).toString()
        : "USD";

    const [valuesFrom, setValueFrom] = useState<string | undefined>(countr);
    const [valuesTo, setValueTo] = useState<string | undefined>(countr1);
    const amount = useRef<HTMLInputElement>(null);
    const [loader, setLoader] = useState(false);

    function validate(amount: number) {
        if (amount < 0) {
            alert("Son 0 dan katta bo'lishi shart!");
            return false;
        }
        return true;
    }

    // EVENTS
    function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        setLoader(true);

        const inputValue = Number(amount.current?.value);
        if (validate(inputValue)) {
            setTimeout(() => {
                setQuantity(inputValue);
                localStorage.setItem("amount", String(inputValue));
                setDecimal(decimalPart);
                setWhole(whole);
                setVal(inputValue);
                setLoader(false);
            }, 1000);
        }
    }

    function handleExchange() {
        exchange ? setExchange(false) : setExchange(true);
        exchange ? setChanges(false) : setChanges(true);
        localStorage.setItem("currencyTo", JSON.stringify(countr));
        localStorage.setItem("currencyFrom", JSON.stringify(countr1));
    }
    const currencyKeys = convert?.results && Object.keys(convert?.results);
    const currencyValues = convert?.results && Object.values(convert?.results);

    useEffect(() => {
        let ind = 0;
        !exchange
            ? (ind =
                currencyKeys && currencyKeys.findIndex((el: any) => el === valuesTo))
            : (ind =
                currencyKeys && currencyKeys.findIndex((el: any) => el === valuesTo));
        if (ind !== -1) {
            setCountry(ind);
        }
    }, [currencyKeys, valuesFrom, valuesTo]);

    const qiymat =
        currencyValues &&
        currencyValues.find((el: any, index: number) => el && index === country);

    const symbole1: qauntProps | undefined = data.find(
        (el) => el.currency?.code == valuesFrom
    );
    const symbole2: qauntProps | undefined = data.find(
        (el) => el.currency?.code == valuesTo
    );
    symbole1 && setQuant1(symbole1);
    symbole2 && setQuant2(symbole2);

    useEffect(() => {
        const son = !exchange
            ? Number(1 / qiymat) * quantity
            : Number(qiymat) * quantity;
        const qoldiq: number = son % 1;
        const decimalPart = qoldiq.toString().substring(4, 8);
        const whole = Math.trunc(son) + "." + qoldiq.toString().substring(2, 4);
        setDecimal(decimalPart);
        setWhole(whole);
        setVal(quantity);
    }, [quantity, exchange, qiymat]);

    useEffect(() => {
        fetch(
            `https://api.fastforex.io/fetch-all?from=${valuesFrom}&api_key=a58c7e9b7a-988376f8c5-sc54ik`
        )
            .then((res) => res.json())
            .then((data) => {
                setConvert(data);
            })
            .catch((err) => {
                console.log(err);
            });
    }, [valuesFrom]);

    return (
        <div className="hero__currency">
            <form onChange={handleSubmit} className="currency__exchange">
                <div className="currency__input currency__input--Amount">
                    <label htmlFor="Amount">
                        Amount {loader && <CircularProgress size="1.2rem" />}
                    </label>
                    <input
                        defaultValue={quantity === 0 ? "" : quantity}
                        ref={amount}
                        type="number"
                        placeholder={
                            !exchange
                                ? `${symbole1?.currency.symbol
                                    ? symbole1?.currency.symbol
                                    : symbole2?.currency.code
                                }`
                                : "$"
                        }
                    />
                </div>

                <div className="currency__input">
                    <label htmlFor="Amount">
                        <span>From</span>
                        {!exchange
                            ? data &&
                            data.map((el, index) => {
                                return (
                                    el.currency.code == valuesFrom && (
                                        <img
                                            key={index}
                                            width={32}
                                            src={el.flag ? el.flag : euro}
                                            alt="flag icon"
                                        />
                                    )
                                );
                            })
                            : data &&
                            data.map((el, index) => {
                                return (
                                    el.currency.code == valuesTo && (
                                        <img
                                            key={index}
                                            width={32}
                                            src={el.flag ? el.flag : euro}
                                            alt="flag icon"
                                        />
                                    )
                                );
                            })}
                    </label>
                    {!exchange ? (
                        <CountryFrom setValueFrom={setValueFrom} symbole1={symbole1} />
                    ) : (
                        <CountryTo setValueTo={setValueTo} symbole2={symbole2} />
                    )}
                </div>

                <div onClick={handleExchange} className="currency--exchange">
                    <i className="fa-solid fa-arrow-right-arrow-left"></i>
                </div>

                <div className="currency__input">
                    <label htmlFor="Amount">
                        <span>To</span>
                        {!exchange
                            ? data &&
                            data.map((el, index) => {
                                return (
                                    el.currency.code == valuesTo && (
                                        <img
                                            key={index}
                                            width={32}
                                            src={el.flag ? el.flag : euro}
                                            alt="flag icon"
                                        />
                                    )
                                );
                            })
                            : data &&
                            data.map((el, index) => {
                                return (
                                    el.currency.code == valuesFrom && (
                                        <img
                                            key={index}
                                            width={32}
                                            src={el.flag ? el.flag : euro}
                                            alt="flag icon"
                                        />
                                    )
                                );
                            })}
                    </label>
                    {!exchange ? (
                        <CountryTo setValueTo={setValueTo} symbole2={symbole2} />
                    ) : (
                        <CountryFrom setValueFrom={setValueFrom} symbole1={symbole1} />
                    )}
                </div>
            </form>

            <div className="currency__priceChange">
                <h5>
                    {`${quantity}`}.00{" "}
                    {!exchange
                        ? data &&
                        data.map(
                            (el) => valuesFrom == el.currency.code && el.currency.name
                        )
                        : data &&
                        data.map(
                            (el) => valuesTo == el.currency.code && el.currency.name
                        )}{" "}
                    =
                </h5>
                <h1>
                    {whole}
                    <span className="faded-digits">
                        {decimalPart ? decimalPart : "00"}
                    </span>{" "}
                    {exchange
                        ? data &&
                        data.map(
                            (el) => valuesFrom == el.currency.code && el.currency.name
                        )
                        : data &&
                        data.map(
                            (el) => valuesTo == el.currency.code && el.currency.name
                        )}
                </h1>
                {exchange ? (
                    <div>
                        <p>
                            1 {valuesTo} = {qiymat} {valuesFrom}
                        </p>
                        <p>
                            1 {valuesFrom} = {1 / qiymat} {valuesTo}
                        </p>
                    </div>
                ) : (
                    <div>
                        <p>
                            1 {valuesFrom} = {1 / qiymat} {valuesTo}
                        </p>
                        <p>
                            1 {valuesTo} = {qiymat} {valuesFrom}
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Currency;