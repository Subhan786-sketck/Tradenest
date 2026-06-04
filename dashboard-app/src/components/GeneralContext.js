import React, { useState } from "react";
import BuyActionWindow from "./BuyActionWindow";
import SellActionWindow from "./SellActionWindow";

const GeneralContext = React.createContext({
  openBuyWindow: (uid) => {},
  closeBuyWindow: () => {},
  openSellWindow: (uid, holdingInfo) => {},
  closeSellWindow: () => {},
});

export const GeneralContextProvider = (props) => {
  const [isBuyWindowOpen, setIsBuyWindowOpen] = useState(false);
  const [isSellWindowOpen, setIsSellWindowOpen] = useState(false);
  const [selectedStockUID, setSelectedStockUID] = useState("");
  const [selectedHoldingInfo, setSelectedHoldingInfo] = useState({});

  // Buy Window Functions
  const handleOpenBuyWindow = (uid) => {
    console.log("🔵 Opening buy window for:", uid);
    setIsBuyWindowOpen(true);
    setSelectedStockUID(uid);
  };

  const handleCloseBuyWindow = () => {
    console.log("🔵 Closing buy window");
    setIsBuyWindowOpen(false);
    setSelectedStockUID("");
  };

  // Sell Window Functions
  const handleOpenSellWindow = (uid, holdingInfo = {}) => {
    console.log("🔴 Opening sell window for:", uid, holdingInfo);
    setIsSellWindowOpen(true);
    setSelectedStockUID(uid);
    setSelectedHoldingInfo(holdingInfo);
  };

  const handleCloseSellWindow = () => {
    console.log("🔴 Closing sell window");
    setIsSellWindowOpen(false);
    setSelectedStockUID("");
    setSelectedHoldingInfo({});
  };

  return (
    <GeneralContext.Provider
      value={{
        openBuyWindow: handleOpenBuyWindow,
        closeBuyWindow: handleCloseBuyWindow,
        openSellWindow: handleOpenSellWindow,
        closeSellWindow: handleCloseSellWindow,
      }}
    >
      {props.children}
      
      {/* Buy Window */}
      {isBuyWindowOpen && (
        <BuyActionWindow 
          uid={selectedStockUID} 
        />
      )}
      
      {/* Sell Window - IMPORTANT: This was missing! */}
      {isSellWindowOpen && (
        <SellActionWindow 
          uid={selectedStockUID} 
          holdingInfo={selectedHoldingInfo}
        />
      )}
    </GeneralContext.Provider>
  );
};

export default GeneralContext;