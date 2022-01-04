console.log("hello");

// Connect to Moralis server
Moralis.initialize("ntozI14MGOaGCCPaTsw5ZzKyqzzO8wcpMzalWpLQ");
Moralis.serverURL = "https://9qnksoon7okz.usemoralis.com:2053/server";

let homepage = "http://127.0.0.1:5500/index.html";

// Check if the user is login
if(Moralis.User.current() == null && window.location.href != homepage){
    document.querySelector('body').style.display = 'none';
    window.location.href = "index.html";
}

login = async () => {
    await Moralis.Web3.authenticate().then(async function (user) {
        console.log(Moralis.User.current());

        // Set these data to Moralis database
        user.set("name", document.getElementById('user-username').value);
        user.set("email", document.getElementById('user-email').value);
        await user.save();

        window.location.href = "dashboard.html";
    })
}

logout = async () => {
    await Moralis.User.logOut();
    window.location.href = "index.html";
}

getTransactions = async () => {
    console.log('get transactions');

   // Get Rinkeby native balance for a given address
    const options = { chain: "rinkeby", address: "0xa7a82DD06901F29aB14AF63faF3358AD101724A8", limit: 50 };
    const transactions = await Moralis.Web3API.account.getTransactions(options);

    console.log(transactions);

    if(transactions.total > 0){
        let table = `
            <table class="table">
                <thead>
                    <tr>
                        <th scope="col">Transaction</th>
                        <th scope="col">Block Number</th>
                        <th scope="col">Age</th>
                        <th scope="col">Type</th>
                        <th scope="col">Fee</th>
                        <th scope="col">Value</th>
                    </tr>
                </thead>
                <tbody id="theTrasactions">
                </tbody>
            </table>
        `;

        // Inject this table inside the HTML of the dashboard
        document.querySelector("#tableOfTransactions").innerHTML = table;

        transactions.result.forEach(t => {
            let content = `
                <tr>
                    <td>
                        <a href="https://rinkeby.etherscan.io/tx/${t.hash}" target="_blank" rel="noopener noreferrer">
                            ${t.hash}
                        </a>
                    </td>
                    <td>
                        <a href="https://rinkeby.etherscan.io/block/${t.block_number}" target="_blank" rel="noopener noreferrer">
                            ${t.block_number}
                        </a>
                    </td>
                    <td>${millisecondsToTime(Date.parse(new Date()) - Date.parse(t.block_timestamp))}</td>
                    <td>${t.from_address == Moralis.User.current().get('ethAddress') ? 'Outgoing': 'Incoming'}</td>
                    <td>${(t.gas * t.gas_price) / 1e18.toFixed(5)} ETH</td>
                    <td>${(t.value / 1e18).toFixed(5)} ETH</td>
                </tr>
            `;

            theTrasactions.innerHTML += content;
        });
    }
}

getBalances = async () => {
    console.log('get balances');

    // Get native balance for a given address
    const ethBalance = await Moralis.Web3API.account.getNativeBalance();
    const ropstenBalance = await Moralis.Web3API.account.getNativeBalance({ chain: "ropsten"});
    const rinkebyBalance = await Moralis.Web3API.account.getNativeBalance({ chain: "rinkeby"});

    console.log((ethBalance.balance / 1e18).toFixed(5) + "ETH");
    console.log((ropstenBalance.balance / 1e18).toFixed(5) + "ETH");
    console.log((rinkebyBalance.balance / 1e18).toFixed(5) + "ETH");

    let content = document.querySelector('#userBalances').innerHTML = `
        <table class="table">
            <thead>
                <tr>
                    <th scope="col">Chain</th>
                    <th scope="col">Balance</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td>Ether</td>
                    <td>${(ethBalance.balance / 1e18).toFixed(5)} ETH</td>
                </tr>
                <tr>
                    <td>Ropsten</td>
                    <td>${(ropstenBalance.balance / 1e18).toFixed(5)} ETH</td>
                </tr>
                <tr>
                    <td>Rinkeby</td>
                    <td>${(rinkebyBalance.balance / 1e18).toFixed(5)} ETH</td>
                </tr>
            </tbody>
        </table>
    `;
}

getNFTs = async () => {
    console.log('get NFTs');

    let tableOfNFTs = document.querySelector('#tableOfNFTs');

    let nfts = await Moralis.Web3API.account.getNFTs({ chain: 'rinkeby'});
    console.log(nfts);

    if(nfts.result.length > 0){
        nfts.result.forEach(n => {
            const defaultImage = "https://images.unsplash.com/photo-1577173620446-2f6a70663000?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxzZWFyY2h8OHx8Ymxhbmt8ZW58MHx8MHx8&auto=format&fit=crop&w=500&q=60";
            let metadata = JSON.parse(n.metadata);
            let content = `
                <div class="card col-md-3">
                    <img src=${fixURL(metadata?.image_url) || defaultImage} class="card-img-top" alt="Item" height=300>
                    <div class="card-body">
                        <h5 class="card-title">${metadata?.name || "No Title"}</h5>
                        <p class="card-text">${metadata?.description || "No Description"}</p>
                    </div>
                </div>
            `;

            tableOfNFTs.innerHTML += content;
        })
    }
}

// Convert milliseconds to time
// Currenttime(ms) - Blocktime(ms) = TIME IN MILL
millisecondsToTime = (ms) => {
    let mintues = Math.floor(ms / (1000 * 60));
    let hours = Math.floor(ms / (1000 * 60 * 60));
    let days = Math.floor(ms / (1000 * 60 * 60 * 24));

    if(days < 1){
        if(hours < 1){
            if(mintues < 1){
                return `less than a minute ago`
            }
            // Return as mintues
            else return `${mintues} mintues(s) ago` 
        }
        // Return as hours
        else return `${hours} hours(s) ago`
    }
    // Return as days
    else return `${days} days(s) ago`
}

fixURL = (url) => {
    if(!url) return null;
    
    if(url.startsWith("ipfs")){
        return "https://ipfs.moralis.io:2053/ipfs/" + url.split("ipfs://").slice(-1);
    }
    else{
        return url + "?format=json";
    }
}

if(document.querySelector('#btn-login') != null){
    document.querySelector('#btn-login').onclick = login;
}

if(document.querySelector('#btn-logout') != null){
    document.querySelector('#btn-logout').onclick = logout;
}

if(document.querySelector('#get-transactions-link') != null){
    document.querySelector('#get-transactions-link').onclick = getTransactions;
}

if(document.querySelector('#get-balances-link') != null){
    document.querySelector('#get-balances-link').onclick = getBalances;
}

if(document.querySelector('#get-nfts-link') != null){
    document.querySelector('#get-nfts-link').onclick = getNFTs;
}