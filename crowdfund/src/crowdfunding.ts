import { BigInt } from "@graphprotocol/graph-ts"
import {
  CampaignCreated as CampaignCreatedEvent,
  Donated as DonatedEvent,
  Withdrawn as WithdrawnEvent,
  RefundClaimed as RefundClaimedEvent
} from "../generated/Crowdfunding/Crowdfunding"
import { Campaign, Donation } from "../generated/schema"

export function handleCampaignCreated(event: CampaignCreatedEvent): void {
  let campaign = new Campaign(event.params.id.toString())
  campaign.owner = event.params.owner
  campaign.title = event.params.title
  campaign.description = event.params.description
  campaign.category = event.params.category
  campaign.mediaUrls = event.params.mediaUrls
  campaign.target = event.params.target
  campaign.deadline = event.params.deadline
  campaign.amountCollectedUsd = BigInt.fromI32(0)
  campaign.ethRaised = BigInt.fromI32(0)
  campaign.withdrawn = false
  campaign.status = "Active"
  campaign.save()
}

export function handleDonated(event: DonatedEvent): void {
  let campaign = Campaign.load(event.params.id.toString())
  if (campaign) {
    campaign.amountCollectedUsd = campaign.amountCollectedUsd.plus(event.params.amountUsd)
    campaign.ethRaised = campaign.ethRaised.plus(event.params.amountEth)
    
    // Check if goal met
    if (campaign.amountCollectedUsd.ge(campaign.target)) {
        campaign.status = "Successful"
    }
    campaign.save()

    // Record the individual donation
    let donation = new Donation(event.transaction.hash.toHexString() + "-" + event.logIndex.toString())
    donation.campaign = campaign.id
    donation.donator = event.params.donator
    donation.amountEth = event.params.amountEth
    donation.amountUsd = event.params.amountUsd
    donation.timestamp = event.block.timestamp
    donation.blockNumber = event.block.number
    donation.save()
  }
}

export function handleWithdrawn(event: WithdrawnEvent): void {
  let campaign = Campaign.load(event.params.id.toString())
  if (campaign) {
    campaign.withdrawn = true
    campaign.status = "Successful"
    campaign.save()
  }
}

export function handleRefundClaimed(event: RefundClaimedEvent): void {
  let campaign = Campaign.load(event.params.id.toString())
  if (campaign) {
    // Subtract the refunded ETH from the total tracked
    campaign.ethRaised = campaign.ethRaised.minus(event.params.amountEth)
    // If refunds are happening, the campaign has failed
    campaign.status = "Failed"
    campaign.save()
  }
}