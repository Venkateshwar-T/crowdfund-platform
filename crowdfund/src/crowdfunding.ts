
import { BigInt, crypto, Bytes } from "@graphprotocol/graph-ts"
import {
  Crowdfunding,
  CampaignCreated as CampaignCreatedEvent,
  Donated as DonatedEvent,
  RefundClaimed as RefundClaimedEvent,
  Withdrawn as WithdrawnEvent
} from "../generated/Crowdfunding/Crowdfunding"
import { Campaign, Donation } from "../generated/schema"

export function handleCampaignCreated(event: CampaignCreatedEvent): void {
  let campaign = new Campaign(event.params.id.toString())
  
  let contract = Crowdfunding.bind(event.address)
  let campaignInfo = contract.campaigns(event.params.id)
  
  campaign.owner = event.params.owner
  campaign.title = event.params.title
  campaign.description = campaignInfo.getDescription()
  campaign.category = campaignInfo.getCategory()
  campaign.target = event.params.target
  campaign.deadline = campaignInfo.getDeadline()
  campaign.amountCollectedUsd = BigInt.fromI32(0)
  campaign.ethRaised = BigInt.fromI32(0)
  campaign.withdrawn = false
  campaign.status = "Active"
  
  // Note: mediaUrls can be fetched via contract call if needed, 
  // but better to have it in the event for production. 
  // For this Subgraph we'll try to fetch it from the struct if the ABI supports it.
  // In the provided ABI, it is part of getCampaigns return, but not the campaigns(id) mapping return.
  
  campaign.save()
}

export function handleDonated(event: DonatedEvent): void {
  let campaign = Campaign.load(event.params.id.toString())
  if (campaign) {
    campaign.amountCollectedUsd = campaign.amountCollectedUsd.plus(event.params.amountUsd)
    campaign.ethRaised = campaign.ethRaised.plus(event.params.amountEth)
    
    // Check if target reached
    if (campaign.amountCollectedUsd.ge(campaign.target)) {
        campaign.status = "Successful"
    }
    
    campaign.save()

    // Record individual donation
    let donationId = event.transaction.hash.concatI32(event.logIndex.toI32()).toHexString()
    let donation = new Donation(donationId)
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
    campaign.ethRaised = campaign.ethRaised.minus(event.params.amountEth)
    campaign.status = "Failed"
    campaign.save()
  }
}
