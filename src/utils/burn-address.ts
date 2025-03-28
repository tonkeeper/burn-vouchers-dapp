import {Address, BitString} from "@ton/core";

export const getNotcoinBurnAddress = (nftAddress: Address) => {
  const nftAddressBits = new BitString(Address.parse(nftAddress.toRawString()).hash, 0, 4);

  const burnAddressesArray = [
    "0:0F65AB9654F51C9B6854253F67DFAA71CE7121978EAB127D5BCC15CDD1163FCA",
    "0:12826D10BF78761F6985D16D3A8A43EA62AD9CB53DDDC973091FFB2F6C428A07",
    "0:2B9663FE4615481B6C801466723D97CCDE6D1871CC66A6FA118BAB204735A700",
    "0:3AA4BFACA58A99A750A4EA8DEBA58E390A5F9BBCB316FE3DEA7557A33A4516A4",
    "0:49FDE8588EE99029B5DF594B9ED4A1CA5DD4E6D46B98241D058F6493FC3C0E46",
    "0:519984A3C61F71959A54A849868C5E548EE908F6FFC29B69024EEE02A019F75E",
    "0:648AA9DC77B0054F9FF6DC7F91A00D95CA793E373ABF74BA1E31546D84053D44",
    "0:7F3B34C75DBCED0017B440782BE0FB4057C4FAE0B47A683BA75E0680A2284E77",
    "0:8BFB1E642E0EAD295346AF222D4EE8FAB46DC51F99A1504BB4C51A9073E91B12",
    "0:99876C89E3A45A407DC06268C403C48C3178BBECE7A29F8FB796FAA41EC78802",
    "0:A12A8E482B788DA941D418307D82DCE30A33133ED9AC16A7A4B8203631DADE54",
    "0:BA0CD081BF4EFA4C896244C7CEB76D11A5B4BBACD2837D2932DD6AC511AA45B7",
    "0:C4FD715939869EFEB97764CB20042B514A662197C078CB605910FEE888604386",
    "0:DD76AA4603678F5D0178EC0D8348BDC617A6732159A299F336775E9C7729B2DA",
    "0:EFD2134D01A9A1625B42877A5326BAB7A1107D456D998446244CFE9F863E41B5",
    "0:F698FEF380EEFE8A650986A62BCB78B4EDA27F491E770DAA2432EA5F000A1BB7"
  ];
  const burnAddressesBits = burnAddressesArray
    .map((address: string) => new BitString(Address.parse(address).hash, 0, 4));

  const index = burnAddressesBits.findIndex((item) => nftAddressBits.equals(item));

  return Address.parse(burnAddressesArray[index]);
};
