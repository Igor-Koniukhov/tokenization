import React, {useCallback, useEffect, useState} from "react";
import useEth from "../contexts/EthContext/useEth";
import MyTokenSale from "../contracts/MyTokenSale.json";


function Demo() {
    const {state} = useEth();
    console.log(state.Token, state.TokenSale, state.KYC)
    let networkID = 0;
    const [stateNetworkID, setStateNetworkID] = useState(0);
    const [stateAddressToBuy, setStateAddressToBuy] = useState(0);
    const [stateUserTokens, setStateUserTokens] = useState(0);
    const [inputState, setInputState] = useState('')
    let isTokenSaleSetup = state.TokenSale !== undefined && state.TokenSale !== null;

    if (isTokenSaleSetup) {
        networkID = state.TokenSale.networkID;
    }
    const isNetworkIDSetup = isTokenSaleSetup && networkID !== 0;
    const getNetworkId = useCallback(
        async () => {
            if (isNetworkIDSetup) {
                await setStateNetworkID(networkID)
            }
        },
        [isNetworkIDSetup, networkID]
    );
    const getAddressToBy = useCallback(
        async () => {
            if (isTokenSaleSetup && stateNetworkID !== 0) {
                await setStateAddressToBuy(MyTokenSale.networks[stateNetworkID].address)
            }

        }, [isTokenSaleSetup, stateNetworkID]
    )
    useEffect(() => {
        if (isNetworkIDSetup) {
            getNetworkId()
        }
    }, [getNetworkId, networkID, isNetworkIDSetup])

    useEffect(() => {
        getAddressToBy()
    }, [getAddressToBy]);

    const handleInputChange = (event) => {
        setInputState(event.target.value)
    }
    const handleKycWhitelisting = async () => {
        await state.KYC.contract.methods.setKycCompleted(inputState).send({from: state.Token.accounts[0], gas: 326003},)
        setInputState('')
        alert("KYC for " + inputState + " is complited")
    }

    const updateUserTokens = async () => {

            let userTokens = await state.Token.contract.methods.balanceOf(state.Token.accounts[0]).call();
            setStateUserTokens(userTokens)

    }


    const handleBuyTokens = async () => {
        await state.TokenSale.contract.methods.buyTokens(state.Token.accounts[0]).send({
            from: state.Token.accounts[0],
            value: state.Token.web3.utils.toWei("1", "wei"),
            gas: 326003
        });
    }


    useEffect(() => {
        const listenToTokenTransfer =  async () => {
            if (isTokenSaleSetup && state.Token.contract.events !== undefined) {
               await  state.Token.contract.events.Transfer({to: state.Token.accounts[0]}).on("data", updateUserTokens);
            }
        }
        listenToTokenTransfer()
    });


    return (
        <div className="demo">
            <h1>Demo</h1>
            <div className="contract-container">
                Address to allow: <input type="text" value={inputState} name="kycAddress" onChange={handleInputChange}/>
                <button onClick={handleKycWhitelisting}>Add to Whitelist</button>
            </div>

            <h1> Buy Tokens</h1>
            {isTokenSaleSetup &&
                <p>If you want to buy tokens, send Wei to this address: {stateAddressToBuy}  </p>
            }

            <p>You currently have: {stateUserTokens} CAPPU Tokens</p>
            <button type="button" onClick={handleBuyTokens}>Buy more tokens</button>
            <button type="button" onClick={updateUserTokens}>Update users tokens</button>

        </div>
    );
}

export default Demo;
