import axios from "axios";
import { createRatingStage } from "../../helpers/aggregationHelper.js";
import Activity from "../../models/activityModel.js";

async function getExchangeRates(base) {
  const response = await axios.get(
    `https://api.exchangerate-api.com/v4/latest/${base}`
  );
  return response.data.rates;
}

function createFilterStage(
  price,
  startDate,
  endDate,
  upcoming = true,
  categoryName,
  searchBy,
  search,
  currency,
  rates
) {
  const filters = {};

  // Apply search filters if provided
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

  // Directly apply price filtering in selected currency
  if (price) {
    const [minBudget, maxBudget] = price.split("-").map(Number);
    const conversionRate = rates[currency];

    if (conversionRate) {
      const minConvertedPrice = minBudget / conversionRate;
      const maxConvertedPrice = maxBudget / conversionRate;

      filters.$or = [
        {
          $and: [
            { price: { $type: "number" } },
            { price: { $gte: minConvertedPrice, $lte: maxConvertedPrice } },
          ],
        },
        {
          $and: [
            { price: { $type: "array" } },
            {
              $expr: {
                $and: [
                  {
                    $gte: [{ $arrayElemAt: ["$price", 0] }, minConvertedPrice],
                  },
                  {
                    $lte: [{ $arrayElemAt: ["$price", 0] }, maxConvertedPrice],
                  },
                ],
              },
            },
          ],
        },
      ];
    }
  }

  if (categoryName) {
    filters.categoryName = categoryName;
  }

  return filters;
}

function createSortStage(sortBy, order) {
  const orderValue = order === "desc" ? -1 : 1;
  return sortBy ? [{ $sort: { [sortBy]: orderValue } }] : [];
}

function createTagsStage() {
  return [
    {
      $lookup: {
        from: "preferencetags",
        let: { tagIds: "$tags" },
        pipeline: [
          {
            $match: {
              $expr: { $in: ["$_id", "$$tagIds"] },
            },
          },
          {
            $addFields: {
              sort: {
                $indexOfArray: ["$$tagIds", "$_id"],
              },
            },
          },
          { $sort: { sort: 1 } },
          { $addFields: { sort: "$$REMOVE" } },
        ],
        as: "tags",
      },
    },
  ];
}

function createCategoryStage() {
  return [
    {
      $lookup: {
        from: "activitycategories",
        localField: "category",
        foreignField: "_id",
        as: "categoryDetails",
      },
    },
    {
      $addFields: {
        categoryName: { $arrayElemAt: ["$categoryDetails.name", 0] },
      },
    },
    {
      $unset: "categoryDetails",
    },
  ];
}

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
      $unwind: {
        path: "$advertiser",
        preserveNullAndEmptyArrays: true,
      },
    },
  ];
}

export async function getActivities({
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
  const rates = await getExchangeRates(currency);
  const categoryStage = createCategoryStage();
  const filters = createFilterStage(
    price,
    startDate,
    endDate,
    upcoming,
    categoryName,
    searchBy,
    search,
    currency,
    rates
  );
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
    ...categoryStage,
    { $match: filters },
    ...addRatingStage,
    ...sortStage,
    ...advertiserStage,
  ];

  let activities = await Activity.aggregate(aggregationPipeline);

  // Since prices are already in target currency, no conversion is needed here

  return activities;
}
