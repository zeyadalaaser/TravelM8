import { createRatingStage } from "../../helpers/aggregationHelper.js";
import Activity from "../../models/activityModel.js";

function createFilterStage(price, startDate, endDate, upcoming = true, categoryName, searchBy, search) {
    const filters = {};

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

    // if upcoming, choose start date as maximum between current date and startDate (if provided)
    // otherwise if startDate only, then filter by startDate

    const start = upcoming ? new Date(Math.max(now, new Date(startDate ?? 0))) :
        startDate ? new Date(startDate) : null;

    if (start) filters.date = { $gte: start }; // Filter by startDate or current date for upcoming

    if (endDate) filters.date = { ...filters.date, $lte: new Date(endDate) };

    if (price) {
        const [minBudget, maxBudget] = price.split('-').map(Number);

        filters.$or = [
            {
                $and: [
                    { price: { $type: "number" } },
                    { price: { $gte: minBudget, $lte: maxBudget } }
                ]
            },
            {
                $and: [
                    { price: { $type: "array" } },
                    {
                        $expr: {
                            $and: [
                                { $gte: [{ $arrayElemAt: ["$price", 0] }, minBudget] },
                                { $lte: [{ $arrayElemAt: ["$price", 0] }, maxBudget] }
                            ]
                        }
                    }
                ]
            }
        ];
    }

    if (categoryName) {
        filters.categoryName = categoryName;
    }

    return filters;
}

function createSortStage(sortBy, order) {
    const orderValue = order === "desc" ? -1 : 1; // Determine sort order
    return sortBy ? [{ $sort: { [sortBy]: orderValue } }] : []; // Return sort stage as an object
}

function createTagsStage() {
    return [
        {
            $lookup: {
                from: "preferencetags",
                let: { "tagIds": "$tags" },
                pipeline: [
                    {
                        $match: {
                            $expr: { $in: ["$_id", "$$tagIds"] }
                        }
                    },
                    {
                        $addFields: {
                            sort: {
                                $indexOfArray: ["$$tagIds", "$_id"]
                            }
                        }
                    },
                    { $sort: { sort: 1 } },
                    { $addFields: { sort: "$$REMOVE" } }
                ],
                as: "tags"
            }
        }
    ];
}

function createCategoryStage() {
    return [
        {
            $lookup: {
                from: "activitycategories",  // Collection to join (e.g., categories)
                localField: "category",  // Field in activities (category ID)
                foreignField: "_id",  // Field in categories collection (ID of category)
                as: "categoryDetails"  // Field to store the populated category details
            }
        },
        {
            $addFields: {
                categoryName: { $arrayElemAt: ["$categoryDetails.name", 0] },  // Directly add category name from categoryDetails
            }
        },
        {
            $unset: "categoryDetails"  // Remove the categoryDetails object if it's no longer needed
        }
    ];
}

function createAdvertiserStage() {
    return [
        {
            $lookup: {
                from: "advertisers",       // The collection to join with
                localField: "advertiserId", // Field in the activity collection
                foreignField: "_id",        // Field in the advertiser collection
                as: "advertiser"            // Name of the field to store the result
            }
        },
        {
            $unwind: {
                path: "$advertiser",
                preserveNullAndEmptyArrays: true
            }
        },
    ];
}

export async function getActivities({ includeRatings, price, startDate, endDate, upcoming, categoryName, searchBy, search, minRating, sortBy, order }) {
    const categoryStage = createCategoryStage();
    const filters = createFilterStage(price, startDate, endDate, upcoming, categoryName, searchBy, search);
    const sortStage = createSortStage(sortBy, order);
    const addRatingStage = createRatingStage('Activity', includeRatings, minRating);
    const advertiserStage = createAdvertiserStage();
    const tagsStage = createTagsStage();

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