console.log("hello");

// Connect to Moralis server
Moralis.initialize("ntozI14MGOaGCCPaTsw5ZzKyqzzO8wcpMzalWpLQ");
Moralis.serverURL = "https://9qnksoon7okz.usemoralis.com:2053/server";

login = async () => {
    await Moralis.Web3.authenticate().then(function (user) {
        console.log('logged in');
        console.log(Moralis.User.current());
    })
}

document.querySelector('#btn-login').onclick = login;