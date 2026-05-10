import { newMockEvent } from "matchstick-as"
import { ethereum, BigInt, Address } from "@graphprotocol/graph-ts"
import {
  CampaignCreated,
  Donated,
  RefundClaimed,
  Withdrawn
} from "../generated/Crowdfunding/Crowdfunding"

export function createCampaignCreatedEvent(
  id: BigInt,
  owner: Address,
  title: string,
  target: BigInt
): CampaignCreated {
  let campaignCreatedEvent = changetype<CampaignCreated>(newMockEvent())

  campaignCreatedEvent.parameters = new Array()

  campaignCreatedEvent.parameters.push(
    new ethereum.EventParam("id", ethereum.Value.fromUnsignedBigInt(id))
  )
  campaignCreatedEvent.parameters.push(
    new ethereum.EventParam("owner", ethereum.Value.fromAddress(owner))
  )
  campaignCreatedEvent.parameters.push(
    new ethereum.EventParam("title", ethereum.Value.fromString(title))
  )
  campaignCreatedEvent.parameters.push(
    new ethereum.EventParam("target", ethereum.Value.fromUnsignedBigInt(target))
  )

  return campaignCreatedEvent
}

export function createDonatedEvent(
  id: BigInt,
  donator: Address,
  amountEth: BigInt,
  amountUsd: BigInt
): Donated {
  let donatedEvent = changetype<Donated>(newMockEvent())

  donatedEvent.parameters = new Array()

  donatedEvent.parameters.push(
    new ethereum.EventParam("id", ethereum.Value.fromUnsignedBigInt(id))
  )
  donatedEvent.parameters.push(
    new ethereum.EventParam("donator", ethereum.Value.fromAddress(donator))
  )
  donatedEvent.parameters.push(
    new ethereum.EventParam(
      "amountEth",
      ethereum.Value.fromUnsignedBigInt(amountEth)
    )
  )
  donatedEvent.parameters.push(
    new ethereum.EventParam(
      "amountUsd",
      ethereum.Value.fromUnsignedBigInt(amountUsd)
    )
  )

  return donatedEvent
}

export function createRefundClaimedEvent(
  id: BigInt,
  user: Address,
  amountEth: BigInt
): RefundClaimed {
  let refundClaimedEvent = changetype<RefundClaimed>(newMockEvent())

  refundClaimedEvent.parameters = new Array()

  refundClaimedEvent.parameters.push(
    new ethereum.EventParam("id", ethereum.Value.fromUnsignedBigInt(id))
  )
  refundClaimedEvent.parameters.push(
    new ethereum.EventParam("user", ethereum.Value.fromAddress(user))
  )
  refundClaimedEvent.parameters.push(
    new ethereum.EventParam(
      "amountEth",
      ethereum.Value.fromUnsignedBigInt(amountEth)
    )
  )

  return refundClaimedEvent
}

export function createWithdrawnEvent(id: BigInt, amountEth: BigInt): Withdrawn {
  let withdrawnEvent = changetype<Withdrawn>(newMockEvent())

  withdrawnEvent.parameters = new Array()

  withdrawnEvent.parameters.push(
    new ethereum.EventParam("id", ethereum.Value.fromUnsignedBigInt(id))
  )
  withdrawnEvent.parameters.push(
    new ethereum.EventParam(
      "amountEth",
      ethereum.Value.fromUnsignedBigInt(amountEth)
    )
  )

  return withdrawnEvent
}
