const contractAddress = "YOUR_SMART_CONTRACT_ADDRESS"; // เปลี่ยนเป็น Address ของ Smart Contract ที่ Deploy
const contractABI = [
    {
        "inputs": [],
        "name": "deposit",
        "outputs": [],
        "stateMutability": "payable",
        "type": "function"
    },
    {
        "inputs": [{"internalType": "uint256", "name": "amount", "type": "uint256"}],
        "name": "withdraw",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "checkBalance",
        "outputs": [{"internalType": "uint256", "name": "", "type": "uint256"}],
        "stateMutability": "view",
        "type": "function"
    }
];

let provider, signer, contract;

async function connectWallet() {
    if (window.ethereum) {
        provider = new ethers.providers.Web3Provider(window.ethereum);
        await provider.send("eth_requestAccounts", []);
        signer = provider.getSigner();
        contract = new ethers.Contract(contractAddress, contractABI, signer);

        document.getElementById("account").innerText = `บัญชี: ${await signer.getAddress()}`;
        updateBalance();
    } else {
        alert("กรุณาติดตั้ง Metamask");
    }
}

async function updateBalance() {
    if (contract) {
        let balance = await contract.checkBalance();
        document.getElementById("balance").innerText = ethers.utils.formatEther(balance);
    }
}

async function deposit() {
    let amount = document.getElementById("depositAmount").value;
    if (amount > 0) {
        let tx = await contract.deposit({ value: ethers.utils.parseEther(amount) });
        await tx.wait();
        updateBalance();
    }
}

async function withdraw() {
    let amount = document.getElementById("withdrawAmount").value;
    if (amount > 0) {
        let tx = await contract.withdraw(ethers.utils.parseEther(amount));
        await tx.wait();
        updateBalance();
    }
}
