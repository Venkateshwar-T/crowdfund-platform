import {
  CampaignCreated as CampaignCreatedEvent,
  Donated as DonatedEvent,
  RefundClaimed as RefundClaimedEvent,
  Withdrawn as WithdrawnEvent
} from "../generated/Crowdfunding/Crowdfunding"
import {
  CampaignCreated,
  Donated,
  RefundClaimed,
  Withdrawn
} from "../generated/schema"

export function handleCampaignCreated(event: CampaignCreatedEvent): void {
  let entity = new CampaignCreated(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.internal_id = event.params.id
  entity.owner = event.params.owner
  entity.title = event.params.title
  entity.target = event.params.target

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleDonated(event: DonatedEvent): void {
  let entity = new Donated(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.internal_id = event.params.id
  entity.donator = event.params.donator
  entity.amountEth = event.params.amountEth
  entity.amountUsd = event.params.amountUsd

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleRefundClaimed(event: RefundClaimedEvent): void {
  let entity = new RefundClaimed(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.internal_id = event.params.id
  entity.user = event.params.user
  entity.amountEth = event.params.amountEth

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleWithdrawn(event: WithdrawnEvent): void {
  let entity = new Withdrawn(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.internal_id = event.params.id
  entity.amountEth = event.params.amountEth

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}
