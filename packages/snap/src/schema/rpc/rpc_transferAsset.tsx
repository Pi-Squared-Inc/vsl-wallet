import { VSLMethod } from "../vsl/schema";
import { SnapAddress, SnapAssetBalance, SnapAssetId, SnapMethod, SnapSigned, SnapTransactionHash } from "./schema";
import { Address, Box, Heading, Row, Text } from "@metamask/snaps-sdk/jsx";
import { throwError } from "../../util";

const confirmation = async (parsedData: any) => {
  const { sender, receiver, assetId, amount } = parsedData;
  const truncatedId = `${assetId.slice(0, 6)}...${assetId.slice(-4)}`;

  const result = await snap.request({
    method: 'snap_dialog',
    params: {
      type: 'confirmation',
      content: (
        <Box>
          <Heading size="lg">Transfer Asset Confirmation</Heading>
          <Row label="Sender Address: ">
            <Address address={sender} />
          </Row>
          <Row label="Receiver Address: ">
            <Address address={receiver} />
          </Row>
          <Row label="Asset ID: ">
            <Text>{ truncatedId }</Text>
          </Row>
          <Row label="Amount: ">
            <Text>{amount}</Text>
          </Row>
        </Box>
      ),
    }
  });

  if (!result) {
    throwError('Asset transfer denied by user');
  }
}


export const TransferAssetSchema = {
  method: SnapMethod.transferAsset,
  endpoint: VSLMethod.vsl_transferAsset,
  signed: true,
  confirmation,
  params: SnapSigned({
    sender   : SnapAddress,
    receiver : SnapAddress,
    assetId  : SnapAssetId,
    amount   : SnapAssetBalance
  }),
  transform: (data: any) => ({
    from     : data.sender,
    to       : data.receiver,
    asset_id : data.assetId,
    amount   : data.amount,
  }),
  return: SnapTransactionHash
}