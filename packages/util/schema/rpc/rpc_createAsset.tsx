import { VSLMethod } from "../vsl/schema";
import { RPCAddress, RPCAssetBalance, RPCAssetDecimals, RPCAssetId, RPCAssetName, RPCMethod, RPCSigned } from "./schema";
import { Address, Box, Heading, Row, Text } from "@metamask/snaps-sdk/jsx";
import { throwError } from "../../util/util";

const confirmation = async (parsedData: any) => {
  const { address, assetName, assetSupply } = parsedData;
  const result = await snap.request({
    method: 'snap_dialog',
    params: {
      type: 'confirmation',
      content: (<Box>
        <Heading size="lg">Create Asset Confirmation</Heading>
        <Row label="Address: ">
          <Address address={address} />
        </Row>
        <Row label="Asset Name: ">
          <Text>{assetName}</Text>
        </Row>
        <Row label="Asset Supply: ">
          <Text>{assetSupply}</Text>
        </Row>
      </Box>),
    }
  });

  if (!result) {
    throwError('Asset transfer denied by user');
  }
}

export const CreateAssetSchema = {
  method: RPCMethod.createAsset,
  endpoint: VSLMethod.vsl_createAsset,
  signed: true,
  confirmation,
  params: RPCSigned({
    address       : RPCAddress,
    assetName     : RPCAssetName,
    assetSupply   : RPCAssetBalance,
    assetDecimals : RPCAssetDecimals,
  }),
  transform: (data: any) => ({
    account_id    : data.address,
    ticker_symbol : data.assetName,
    total_supply  : data.assetSupply,
    decimals      : data.assetDecimals,
  }),
  return: RPCAssetId
}