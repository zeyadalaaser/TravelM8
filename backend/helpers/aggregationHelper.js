// only entityType is a required parameter
export function createRatingStage(entityType, includeRatings, minRating) {
  return [
    {
      $lookup: {
        from: "ratings",
        let: { currentEntityId: "$_id" },  // Pass the entity's _id as currentEntityId
        pipeline: [
          { $match: { $expr: { $eq: ["$entityId", "$$currentEntityId"] } } },  // Match only ratings for the current entity
          { $match: { entityType: entityType } },  // Match the entityType inside the lookup
          { $unset: ["entityId", "entityType"] }  // Remove entityId and entityType from each rating
        ],
        as: "ratings"
      }
    },
    {
      $addFields: {
        averageRating: { $avg: "$ratings.rating" },  // Calculate average rating
        totalRatings: { $size: "$ratings" }  // Count number of ratings
      }
    },
    ...(minRating ? [{ $match: { averageRating: { $gte: Number(minRating) } } }] : []),
    ...(includeRatings === "false" ? [{ $unset: "ratings" }] : [])
  ];
}

export function createPopulationStage(from, localField, as, unwind, sort = false) {
  if (sort)
    unwind = false;
  
  return [
    {
      $lookup: {
        from: from,
        localField: localField,
        foreignField: "_id",
        ...(sort && {
          let: { indexArray: `$${localField}` },
          pipeline: [
            { $addFields: { index: { $indexOfArray: ["$$indexArray", "$_id"] } } },
            { $sort: { index: 1 } }
          ]
        }),
        as: as,
      },
    },
    ...(unwind ? [{ $unwind: { path: `$${as}`, preserveNullAndEmptyArrays: true } }] : [])
  ];
}
