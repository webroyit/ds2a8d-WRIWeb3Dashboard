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

if(document.querySelector('#btn-login') != null){
    document.querySelector('#btn-login').onclick = login;
}
if(document.querySelector('#btn-logout') != null){
    document.querySelector('#btn-logout').onclick = logout;
}