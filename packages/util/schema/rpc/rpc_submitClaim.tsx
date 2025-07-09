import { VSLMethod } from '../vsl/schema';
import { RPCAddress, RPCAddressArray, RPCClaim, PRCClaimType, RPCFee, RPCMethod, RPCProof, RPCQuorum, RPCSigned, RPCTransactionHash, RPCTimestamp } from './schema';
import { Address, Box, Heading, Row, Text } from "@metamask/snaps-sdk/jsx";
import { stringify, throwError } from '../../util/util';

const confirmation = async (parsedData: any) => {
  const {
    sender,
    receivers,
    claim,
    claimType,
    fee,
    proof,
    quorum,
    expires
  } = parsedData;

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
          {
            receivers.map((receiver: `0x${string}`, index: number) => (
              <Row label={`Receiver Address ${index + 1}: `}>
                <Address address={receiver} />
              </Row>
            ))
          }
          <Row label="Claim: ">
            <Text>{ claim.slice(0, 20) }</Text>
          </Row>
          <Row label="Claim Type: ">
            <Text>{ claimType.slice(0, 20) }</Text>
          </Row>
          <Row label="Fee: ">
            <Text>{ fee }</Text>
          </Row>
          <Row label="Proof: ">
            <Text>{ proof.slice(0, 20) }</Text>
          </Row>
          <Row label="Quorum: ">
            <Text>{ String(quorum) }</Text>
          </Row>
          <Row label="Expires: ">
            <Text>{ String(expires.seconds) } seconds, { String(expires.nanos) } nanos</Text>
          </Row>
        </Box>
      ),
    }
  });

  if (!result) {
    throwError('Asset transfer denied by user');
  }
}


export const SubmitClaimSchema = {
    method: RPCMethod.submitClaim,
    endpoint: VSLMethod.vsl_submitClaim,
    signed: true,
    confirmation,
    params: RPCSigned({
        sender     : RPCAddress,
        receivers  : RPCAddressArray,
        claim      : RPCClaim,
        claimType  : PRCClaimType,
        fee        : RPCFee,
        proof      : RPCProof,
        quorum     : RPCQuorum,
        expires    : RPCTimestamp,
    }),
    transform: (data: any) => ({
        from       : data.sender,
        to         : data.receivers,
        claim      : data.claim,
        claim_type : data.claimType,
        fee        : data.fee,
        proof      : data.proof,
        quorum     : data.quorum,
        expires    : data.expires,
    }),
    return: RPCTransactionHash,
}