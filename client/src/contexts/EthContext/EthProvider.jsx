import React, {useCallback, useEffect, useReducer} from "react";
import Web3 from "web3";
import EthContext from "./EthContext";
import {KycState, MyTokenSaleState, MyTokenState, reducer} from "./state";
import MyToken from "../../contracts/MyToken.json";
import MyTokenSale from "../../contracts/MyTokenSale.json";
import KycContract from "../../contracts/KycContract.json";


function EthProvider({children}) {
    const [Token, dispTokenState] = useReducer(reducer, MyTokenState);
    const [TokenSale, dispTokenStateSale] = useReducer(reducer, MyTokenSaleState);
    const [KYC, dispKycState] = useReducer(reducer, KycState);

    const init = useCallback(
        async (artifact) => {
            if (artifact) {
                const web3 = new Web3(Web3.givenProvider || "ws://localhost:8545");
                const accounts = await web3.eth.requestAccounts();
                const networkID = await web3.eth.net.getId();
                const {abi} = artifact;
                let address, contract;
                try {
                    address = artifact.networks[networkID].address;
                    contract = new web3.eth.Contract(abi, address);
                } catch (err) {
                    console.error(err);
                }

                return {artifact, web3, accounts, networkID, contract};
            }
        },
        [],
    );


    const initAllContracts = useCallback(
        (MyToken, MyTokenSale, KycContract) => {
            init(MyToken).then((mytoken) => {
                dispTokenState({
                    type: "MY_TOKEN",
                    data: mytoken
                })
            })

            init(MyTokenSale).then((mytokensale) => {
                dispTokenStateSale({
                    type: "MY_TOKEN_SALE",
                    data: mytokensale
                })

            })

            init(KycContract).then((kyc) => {
                dispKycState({
                    type: "KYC",
                    data: kyc
                })

            })

        },
        [init],
    );


    useEffect(() => {
        const tryInit = async () => {
            try {
                initAllContracts(MyToken, MyTokenSale, KycContract)
            } catch (err) {
                console.error(err);
            }
        };

        tryInit();
    }, [initAllContracts]);

    useEffect(() => {
        const events = ["chainChanged", "accountsChanged"];
        const handleChange = () => {
            initAllContracts(Token, TokenSale, KYC);
        };

        events.forEach(e => window.ethereum.on(e, handleChange));
        return () => {
            events.forEach(e => window.ethereum.removeListener(e, handleChange));
        };
    }, [Token, TokenSale, KYC, initAllContracts]);

    return (
        <EthContext.Provider value={{
            state: {
                Token,
                TokenSale,
                KYC,
            },
            dispatch: {
                dispKycState,
                dispTokenStateSale,
                dispTokenState
            }

        }}>
            {children}
        </EthContext.Provider>
    );
}

export default EthProvider;
