import axios from "axios";
import { createRatingStage } from "../../helpers/aggregationHelper.js";
import Activity from "../../models/activityModel.js";

async function getExchangeRates(base = "USD") {
  const response = await axios.get(
    `https://api.exchangerate-api.com/v4/latest/${base}`
  );
  return response.data.rates;
}

// Function to handle filtering stages
function createFilterStage({
  minPrice,
  maxPrice,
  startDate,
  endDate,
  upcoming = true,
  categoryName,
  searchBy,
  search,
  currency,
  rates,
}) {
  const filters = {};

  if (search) {
    if (searchBy === "categoryName") {
      filters["categoryName"] = { $regex: search, $options: "i" };
    } else if (searchBy === "tag") {
      filters["tags.name"] = { $regex: search, $options: "i" };
    } else if (searchBy === "name") {
      filters["title"] = { $regex: search, $options: "i" };
    }
  }

  const now = new Date();
  const start = upcoming
    ? new Date(Math.max(now, new Date(startDate ?? 0)))
    : startDate
    ? new Date(startDate)
    : null;
  if (start) filters.date = { $gte: start };
  if (endDate) filters.date = { ...filters.date, $lte: new Date(endDate) };

  const conversionRate = rates[currency] || 1;
  if ((minPrice !== undefined || maxPrice !== undefined) && conversionRate) {
    const minConvertedPrice =
      minPrice !== undefined ? parseFloat(minPrice) / conversionRate : null;
    const maxConvertedPrice =
      maxPrice !== undefined ? parseFloat(maxPrice) / conversionRate : null;

    filters.price = {};
    if (minConvertedPrice !== null) filters.price.$gte = minConvertedPrice;
    if (maxConvertedPrice !== null) filters.price.$lte = maxConvertedPrice;
  }

  if (categoryName) {
    filters.categoryName = categoryName;
  }

  return filters;
}

// Function to handle sorting stages
function createSortStage(sortBy, order) {
  if (!sortBy || !order) return [];
  const sortOrder = order.toLowerCase() === "desc" ? -1 : 1;
  return [{ $sort: { [sortBy]: sortOrder } }];
}

// Function to add advertiser details
function createAdvertiserStage() {
  return [
    {
      $lookup: {
        from: "advertisers",
        localField: "advertiserId",
        foreignField: "_id",
        as: "advertiser",
      },
    },
    {
      $unwind: { path: "$advertiser", preserveNullAndEmptyArrays: true },
    },
  ];
}

// Function to add tag details
function createTagsStage() {
  return [
    {
      $lookup: {
        from: "tags",
        localField: "tags",
        foreignField: "_id",
        as: "tags",
      },
    },
  ];
}

// Main function to get activities with all stages
export async function getActivities({
  includeRatings,
  minPrice,
  maxPrice,
  startDate,
  endDate,
  upcoming,
  categoryName,
  searchBy,
  search,
  minRating,
  sortBy,
  order,
  currency,
}) {
  const rates = await getExchangeRates("USD");
  const filters = createFilterStage({
    minPrice,
    maxPrice,
    startDate,
    endDate,
    upcoming,
    categoryName,
    searchBy,
    search,
    currency,
    rates,
  });

  const sortStage = createSortStage(sortBy, order);
  const addRatingStage = createRatingStage(
    "Activity",
    includeRatings,
    minRating
  );
  const advertiserStage = createAdvertiserStage();
  const tagsStage = createTagsStage();

  const aggregationPipeline = [
    ...tagsStage,
    { $match: filters },
    ...addRatingStage,
    ...sortStage,
    ...advertiserStage,
  ];

  const activities = await Activity.aggregate(aggregationPipeline);
  return activities;
}
