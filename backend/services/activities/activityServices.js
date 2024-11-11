import axios from "axios";
import { createPopulationStage, createRatingStage } from "../../helpers/aggregationHelper.js";
import Activity from "../../models/activityModel.js";
import mongoose from "mongoose";

async function getExchangeRates(base = "USD") {
  const response = await axios.get(
    `https://api.exchangerate-api.com/v4/latest/${base}`
  );
  return response.data.rates;
}

// Function to handle filtering stages
function createFilterStage({
  id,
  price,
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

  if (id)
    filters["_id"] = new mongoose.Types.ObjectId(`${id}`);

  if (search) {
    if (searchBy === 'categoryName') {
      filters['categoryName'] = { $regex: search, $options: 'i' };
    } else if (searchBy === 'tag') {
      filters['tags.name'] = { $regex: search, $options: 'i' }; // Match tag name case-insensitively
    } else if (searchBy === 'name') {
      filters['title'] = { $regex: search, $options: 'i' }; // Match activity name case-insensitively
    }
  }

  const now = new Date();
  const start = upcoming ? new Date(Math.max(now, new Date(startDate ?? 0))) :
    startDate ? new Date(startDate) : null;


  if (startDate && endDate)
    filters.date = { $gte: start };
  else if (startDate && !endDate)
    filters.date = start;

  if (endDate) filters.date = { ...filters.date, $lte: new Date(endDate) };

  const conversionRate = rates[currency] || 1;
  if (price) {
    const [minPrice, maxPrice] = price.split("-").map(Number);
    filters.price = {};
    filters.price.$gte = minPrice;
    filters.price.$lte = maxPrice;
  }

  if (categoryName) {
    filters["category.name"] = categoryName;
  }

  return filters;
}

// Function to handle sorting stages
function createSortStage(sortBy, order) {
  if (!sortBy || !order) return [];
  const sortOrder = order.toLowerCase() === "desc" ? -1 : 1;
  return [{ $sort: { [sortBy]: sortOrder } }];
}

// Main function to get activities with all stages
export async function getActivities({
  id,
  includeRatings,
  price,
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
    id,
    price,
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
  
  const advertiserStage = createPopulationStage("advertisers", "advertiserId", "advertiser", true);
  const tagsStage = createPopulationStage("preferencetags", "tags", "tags", false, true);
  const categoryStage = createPopulationStage("activitycategories", "category", "category", true);

  const aggregationPipeline = [
    ...tagsStage,
    ...categoryStage,
    { $match: filters },
    ...addRatingStage,
    ...sortStage,
    ...advertiserStage
  ];

  // Execute the aggregation pipeline
  const activities = await Activity.aggregate(aggregationPipeline);
  return activities;
}