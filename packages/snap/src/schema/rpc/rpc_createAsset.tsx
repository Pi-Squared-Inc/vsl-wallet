import { VSLMethod } from "../vsl/schema";
import { SnapAddress, SnapAssetBalance, SnapAssetDecimals, SnapAssetId, SnapAssetName, SnapMethod, SnapSigned } from "./schema";
import { Address, Box, Heading, Row, Text } from "@metamask/snaps-sdk/jsx";
import { throwError } from "../../util";

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
  method: SnapMethod.createAsset,
  endpoint: VSLMethod.vsl_createAsset,
  signed: true,
  confirmation,
  params: SnapSigned({
    address       : SnapAddress,
    assetName     : SnapAssetName,
    assetSupply   : SnapAssetBalance,
    assetDecimals : SnapAssetDecimals,
  }),
  transform: (data: any) => ({
    account_id    : data.address,
    ticker_symbol : data.assetName,
    total_supply  : data.assetSupply,
    decimals      : data.assetDecimals,
  }),
  return: SnapAssetId
}