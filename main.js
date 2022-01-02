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
    const options = { chain: "rinkeby", address: "" };
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
                    <td>${t.block_timestamp}</td>
                    <td>${t.from_address}</td>
                    <td>${(t.gas * t.gas_price) / 1e18.toFixed(5)} ETH</td>
                    <td>${(t.value / 1e18).toFixed(5)} ETH</td>
                </tr>
            `;

            theTrasactions.innerHTML += content;
        });
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