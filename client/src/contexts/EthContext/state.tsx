enum actions {MyToken = "MY_TOKEN", MyTokenSale = "MY_TOKEN_SALE", Kyc = "KYC"}


export type ContractState = {
    artifact: {};
    web3: {};
    accounts: [];
    networkID: number;
    contract: {};
}

let MyTokenState!: ContractState | null;
let MyTokenSaleState!: ContractState | null;
let KycState!: ContractState | null;

export type State = {
    MyTokenState: ContractState | null;
    MyTokenSaleState: ContractState | null;
    KycState: ContractState | null;
}
let initialState: State = {
    MyTokenState: {artifact: {}, web3: {}, accounts: [], networkID: 0, contract: {}},
    MyTokenSaleState: {artifact: {}, web3: {}, accounts: [], networkID: 0, contract: {}},
    KycState: {artifact: {}, web3: {}, accounts: [], networkID: 0, contract: {}}
};


const reducer = (state: ContractState, action: { type: string; data: {}; }) => {
    let {type, data} = action;
    switch (type) {
        case  actions.MyToken:
            return {...state, ...data};
        case  actions.MyTokenSale:
            return {...state, ...data};
        case  actions.Kyc:
            return {...state, ...data};
        default:
            throw new Error("Undefined reducer action type");
    }
};

export {
    initialState,
    MyTokenState,
    MyTokenSaleState,
    KycState,
    reducer
};
