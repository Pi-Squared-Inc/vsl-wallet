import { VSLMethod } from "../vsl/schema";
import { ActionDeniedError, SnapAddress, SnapBalance, SnapMethod, SnapSigned, SnapTransactionHash } from "./schema";
import { Address, Box, Heading, Row, Text } from "@metamask/snaps-sdk/jsx";
import { throwError } from "../../util";

const confirmation = async (parsedData: any) => {
  const { sender, receiver, amount } = parsedData;
  const result = await snap.request({
    method: 'snap_dialog',
    params: {
      type: 'confirmation',
      content: (
        <Box>
          <Heading size="lg">Payment confirmation</Heading>
          <Row label="Sender Address: ">
            <Address address={sender} />
          </Row>
          <Row label="Receiver Address: ">
            <Address address={receiver} />
          </Row>
          <Row label="Amount: ">
            <Text>{amount}</Text>
          </Row>
        </Box>
      ),
    }
  });

  if (!result) {
    throwError(ActionDeniedError('Payment'));
  }
}

export const TransferBalanceSchema = {
  method: SnapMethod.transferBalance,
  endpoint: VSLMethod.vsl_pay,
  signed: true,
  confirmation,
  params: SnapSigned({
    sender   : SnapAddress,
    receiver : SnapAddress,
    amount   : SnapBalance,
  }),
  transform: (data: any) => ({
    from     : data.sender,
    to       : data.receiver,
    amount   : data.amount,
  }),
  return: SnapTransactionHash,
}