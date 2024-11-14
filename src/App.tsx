import { useCallback, useEffect, useMemo, useState } from "react";

import { useTonAddress, useTonConnectUI } from "@tonconnect/ui-react";
import { Address, beginCell, toNano } from "@ton/core";

import "./App.css";
import { isValidAddress } from "./utils/address";
import ta from "./tonapi.ts";
import { NftItem } from "@ton-api/client";
import { getNotcoinBurnAddress } from "./utils/burn-address.ts";
import logoUrl from "/logo.webp";
import { List } from "./components/List/List.tsx";
import { ButtonCell } from "./components/ButtonCell/ButtonCell.tsx";
import { Loader } from "./components/Loader/Loader.tsx";
import { showConfetti } from "./utils/confetti.ts";

function App() {
  const [nfts, setNfts] = useState<NftItem[]>([]);
  const [nftsLoading, setNftsLoading] = useState(true);
  const [burnCnt, setBurnCnt] = useState(1);

  const [tonConnectUI] = useTonConnectUI();
  const maxSupportedMessages = (tonConnectUI.wallet?.device.features as any)?.find((f: any) => f.name === "SendTransaction")?.maxMessages ?? 4;

  const connectedAddressString = useTonAddress();
  const connectedAddress = useMemo(() => {
    return isValidAddress(connectedAddressString)
      ? Address.parse(connectedAddressString)
      : null;
  }, [connectedAddressString]);

  useEffect(() => {
    setTimeout(() => {
      tonConnectUI.connectionRestored.then((connected) => {
        if (!connected) {
          tonConnectUI.openModal();
        }
      });
    }, 400);
  }, []);

  useEffect(() => {
    if (connectedAddress) {
      ta.accounts.getAccountNftItems(connectedAddress, { collection: Address.parse("EQDmkj65Ab_m0aZaW8IpKw4kYqIgITw_HRstYEkVQ6NIYCyW") }).then(nftItems => {
        setNfts(nftItems.nftItems);
        setNftsLoading(false);
      });
    }
  }, [connectedAddress]);

  const handleAddNftToBurn = useCallback(() => {
    setBurnCnt(cnt => cnt + 1);
  }, []);

  const handleRemoveNftToBurn = useCallback(() => {
    setBurnCnt(cnt => cnt - 1);
  }, []);

  const handleBurnNft = useCallback(() => {

    const nftItems = nfts.slice(0, burnCnt);

    const messages = nftItems.map(nftItem => {
      return {
        payload: beginCell()
          .storeUint(0x5fcc3d14, 32)
          .storeUint(0, 64)
          .storeAddress(getNotcoinBurnAddress(nftItem.address))
          .storeAddress(connectedAddress)
          .storeBit(false)
          .storeCoins(toNano('0.05'))
          .storeBit(false)
          .storeUint(0x5fec6642, 32)
          .storeUint(nftItem.index, 64)
          .endCell()
          .toBoc()
          .toString('base64'),
        amount: toNano('0.1').toString(),
        address: nftItem.address.toString(),
      };
    });

    tonConnectUI.sendTransaction({
      validUntil: Math.floor(Date.now() / 1000) + 300,
      messages: messages,
    }).then(() => {
      showConfetti();
      setNfts(nfts => nfts.filter(nft => !nftItems.includes(nft)));
      setBurnCnt(1);
    });

  }, [connectedAddress, nfts, burnCnt]);

  const totalValue = nfts
    .reduce(
      (acc, nft) =>
        acc + parseInt(nft.metadata?.attributes?.[0]?.value?.replace(',', '') ?? '0', 10),
      0,
    )
    .toLocaleString();

  if (nftsLoading) {
    return (
      <div className="placeholder">
        <Loader />
      </div>
    );
  }

  if (!nfts.length) {
    return (
      <div className="placeholder">
        <div className="body1 secondary">You have no NOT vouchers available for exchange.</div>
      </div>
    );
  }

  return (
    <>
      <div className={"padding-top"} />
      <img alt="NOT logo" className="not-logo" src={logoUrl} />
      <div className="desc-container mb32">
        <h2>Exchange your vouchers to NOT</h2>
        <div className="secondary body1">
          NOT will be available on your balance shortly after the exchange.
        </div>
      </div>
      <List>
        <List.Item title={"Number of vouchers"}>
          <ButtonCell onAdd={handleAddNftToBurn} onRemove={handleRemoveNftToBurn} value={burnCnt} minItems={1} maxItems={Math.min(nfts.length, maxSupportedMessages)} />
        </List.Item>
        <List.Item title={"Total amount"}>
          <div className="label1">{totalValue} NOT</div>
        </List.Item>
      </List>
      <div className="end-page">
        <button className="button primary" onClick={handleBurnNft}><div className="label1">Exchange to NOT</div></button>
      </div>
    </>
  );
}

export default App;
