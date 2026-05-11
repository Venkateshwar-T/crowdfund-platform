import { BigInt } from "@graphprotocol/graph-ts"
import {
  CampaignCreated as CampaignCreatedEvent,
  Donated as DonatedEvent,
  Withdrawn as WithdrawnEvent,
  RefundClaimed as RefundClaimedEvent
} from "../generated/Crowdfunding/Crowdfunding"
import { Campaign, Donation } from "../generated/schema"

/**
 * AssemblyScript-safe slugify function.
 * Converts "Hope Against Cancer - Fund" into "hope-against-cancer-fund"
 */
function createSlug(title: string): string {
  let lower = title.toLowerCase();
  let result = "";
  
  for (let i = 0; i < lower.length; i++) {
    let charCode = lower.charCodeAt(i);
    let char = lower.charAt(i);

    // Keep alphanumeric characters
    if (
      (charCode >= 97 && charCode <= 122) || // a-z
      (charCode >= 48 && charCode <= 57)     // 0-9
    ) {
      result += char;
    } 
    // Replace spaces, underscores, and existing hyphens with a single dash
    else if (char == " " || char == "-" || char == "_") {
      // Avoid double hyphens (e.g., " - " becomes one dash, not three)
      if (result.length > 0 && result.charAt(result.length - 1) != "-") {
        result += "-";
      }
    }
  }

  // Remove trailing dash if it exists
  if (result.length > 0 && result.charAt(result.length - 1) == "-") {
    result = result.substring(0, result.length - 1);
  }

  return result;
}

export function handleCampaignCreated(event: CampaignCreatedEvent): void {
  let campaign = new Campaign(event.params.id.toString())
  
  // Create slug and append ID to guarantee uniqueness
  let baseSlug = createSlug(event.params.title)
  campaign.slug = baseSlug + "-" + event.params.id.toString()
  
  campaign.owner = event.params.owner
  campaign.title = event.params.title
  campaign.description = event.params.description
  campaign.additionalNotes = event.params.additionalNotes
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
    
    if (campaign.amountCollectedUsd.ge(campaign.target)) {
        campaign.status = "Successful"
    }
    campaign.save()

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
    campaign.ethRaised = campaign.ethRaised.minus(event.params.amountEth)
    campaign.status = "Failed"
    campaign.save()
  }
}