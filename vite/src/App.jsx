import { Contract, ethers, formatEther, parseEther } from "ethers";
import { useEffect, useState } from "react";
import abi from "./abi.json";

const App = () => {
  const [signer, setSigner] = useState();
  const [contract, setContract] = useState();
  const [totalSupply, setTotalSupply] = useState();
  const [name, setName] = useState();
  const [symbol, setSymbol] = useState();
  const [balanceOf, setBalanceOf] = useState();
  const [balanceOf2, setBalanceOf2] = useState();
  const [sendAddress, setSendAddress] = useState("");
  const [sendToken, setSendToken] = useState("");
  const [sendAddress2, setSendAddress2] = useState("");


  const onClickMetamask = async () => {
    try {
      if (!window.ethereum) return;

      const provider = new ethers.BrowserProvider(window.ethereum);

      setSigner(await provider.getSigner());
    } catch (error) {
      console.error(error);
    }
  };

  const onClickLogOut = () => {
    setSigner(null);
    setContract(null);
    setTotalSupply(null);
    setName(null);
    setBalanceOf(null);
    setSymbol(null);
  };

  const onClickTotalSupply = async () => {
    try {
      const response = await contract.totalSupply();
      setTotalSupply(response);

      const weiToEth = formatEther(response);
      console.log(weiToEth);

      const ethToWei = parseEther(weiToEth, "wei");
      console.log(ethToWei);

    } catch (error) {
      console.error(error);
    }
  };


  const onClickName = async () => { 
    try {

      const response = await contract.name();
      setName(response);

    } catch (error) {
      console.error(error);
    }
  };

  const onClickBalanceOf = async () => { 
    try {

      const response = await contract.balanceOf(signer.address);

      console.log(response);


      setBalanceOf(response);

    } catch (error) {
      console.error(error);
    }
  };

  

  const onClickSendToken = async () => {
    try {
      if(!sendAddress || !sendToken) return;
      const result = await contract.transfer(sendAddress, parseEther(sendToken, "wei"));
      console.log(result);
    } catch (error) {
      console.error(error);
    }
  };

  const onClickBalanceOf2 = async () => { 
    try {
      if(!balanceOf2) return;
      const response = await contract.balanceOf(sendAddress2);

      setBalanceOf2(response);

    } catch (error) {
      console.error(error);
    }
  };


  const getSymbol = async () => {
    try {
      const response = await contract.symbol();

      setSymbol(response);
    } catch (error) {
      console.error(error);
    }
  };



  useEffect(() => {
    if (!signer) return;
    
    setContract(
      new Contract("0x5ccf74011ecc5474d093400979ee3f70d02e8288", abi, signer)
    );
  }, [signer]);


  useEffect(() => {
    if (!contract) return;
    getSymbol();

  }, [contract]);



  return (
    <div className="bg-red-100 min-h-screen flex flex-col justify-start items-center py-16">
      {signer ? (
        <div className="flex gap-8">
          <div className="box-style">
            안녕하세요, {signer.address.substring(0, 7)}...
            {signer.address.substring(signer.address.length - 5)}님
          </div>
          <button
            className="button-style border-red-300 hover:border-red-400"
            onClick={onClickLogOut}
          >
            로그아웃
          </button>
        </div>
      ) : (
        <button className="button-style" onClick={onClickMetamask}>
          🦊 메타마스크 로그인
        </button>
      )}
      {contract && (
        <div className="mt-16 flex flex-col gap-8 bg-blue-100 grow max-w-md w-full">
          <h1 className="box-style">스마트 컨트랙트 연결을 완료했습니다.</h1>
          <div className="flex flex-col gap-8">

          <div className="flex w-full">
              <div className="box-style grow">
                {totalSupply
                  ? `총 발행량: ${formatEther(totalSupply)}ETH`
                  : "총 발행량 확인"}
              </div>
              <button
                className="button-style ml-4"
                onClick={onClickTotalSupply}
              >
                확인
              </button>
            </div>
          
          </div>

          <div className="flex w-full">
              <div className="box-style grow">
                {name
                  ? `토큰이름: ${name}`
                  : "토큰이름 확인"}
              </div>
              <button
                className="button-style ml-4"
                onClick={onClickName}
              >
                확인
              </button>
            </div>

            <div className="flex w-full">
              <div className="box-style grow">
                {balanceOf
                  ? `내 보유 토큰: ${formatEther(balanceOf)} ${symbol}`
                  : "보유토큰확인 확인"}
              </div>
              <button className="button-style ml-4" onClick={onClickBalanceOf}>확인</button>
            </div>
            <div className="flex w-full items-end">
              <div className="flex flex-col gap-2 grow">
              <div className="ml-1 text-lg font-bold">토큰 전송</div>
                <input className="input-style" type="text" placeholder="지갑 주소" value={sendAddress} onChange={(e) => setSendAddress(e.target.value)}/>
                <input className="input-style" type="text" placeholder={`${symbol} 을 입력하세요.`} value={sendToken} onChange={(e) => setSendToken(e.target.value)}/>
              </div>
              <button className="button-style ml-4" onClick={onClickSendToken}>확인</button>
            </div>


            <div className="flex w-full items-end">
              <div className="flex flex-col gap-2 grow">
              <div className="ml-1 text-lg font-bold">다른사람 조회</div>
                <input className="input-style" type="text" placeholder="지갑 주소" value={sendAddress2} onChange={(e) => setSendAddress2(e.target.value)}/>
                <div className="box-style grow">
                {balanceOf2
                  ? `보유 토큰: ${formatEther(balanceOf2)} ${symbol}`
                  : "보유토큰확인 확인"}
              </div>
              </div>
              <button className="button-style ml-4" onClick={onClickBalanceOf2}>확인</button>
            </div>


        </div>
      )}
    </div>
  );
};

export default App;