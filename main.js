console.log("hello");

// Connect to Moralis server
Moralis.initialize("ntozI14MGOaGCCPaTsw5ZzKyqzzO8wcpMzalWpLQ");
Moralis.serverURL = "https://9qnksoon7okz.usemoralis.com:2053/server";

login = async () => {
    await Moralis.Web3.authenticate().then(async function (user) {
        console.log(Moralis.User.current());

        // Set these data to Moralis database
        user.set("name", document.getElementById('user-username').value);
        user.set("email", document.getElementById('user-email').value);
        await user.save();
    })
}

document.querySelector('#btn-login').onclick = login;