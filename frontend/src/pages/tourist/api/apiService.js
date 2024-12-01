import axios from "axios";

const API_BASE_URL = "http://localhost:5001/api/";

const apiClient = axios.create({
  baseURL: API_BASE_URL,
});

export async function getActivities(query) {
  const searchParams = new URLSearchParams(query);
  searchParams.delete("type");
  return (await apiClient.get("activities?" + searchParams.toString())).data;
}



export async function getProducts(query) {
  const token = localStorage.getItem('token');

  const searchParams = new URLSearchParams(query);
  searchParams.delete("type");
  searchParams.set("inStockOnly", true);
  searchParams.set("showArchived", false);

  const response = await apiClient.get("products?" + searchParams.toString(), {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    }
  });

  return response.data.data;
}

export async function getMuseums(query) {
  const searchParams = new URLSearchParams(query);
  searchParams.delete('type');

  return (await apiClient.get('filterbyTags?' + searchParams.toString())).data;

}

export async function getItineraries(query) {
  const searchParams = new URLSearchParams(query);
  searchParams.delete('type');


  return (await apiClient.get('FilterItineraries?' + searchParams.toString())).data;

}

export async function fetchProfileInfo(token) {
  return (
    await apiClient.get("tourists/myProfile", {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    })
  ).data;
}

export async function getCategories() {
  return (await apiClient.get("activity-categories")).data.map((c) => c.name);
}

export async function getPreferenceTags() {
  return (await apiClient.get("preference-tags")).data.map((t) => t.name);
}

export async function getPlaceTags() {
  const response = (await apiClient.get("placetag")).data;
  const tags = response.map((t) => [t.type, t.historicalPeriod]).flat();
  return [...new Set(tags)];
}

export async function getMyComplaints(token) {
  return (
    await apiClient.get("complaints/myComplaints", {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    })
  ).data;
}

export async function createActivityBooking(activityId, price, paymentMethod, token) {
  // const token = localStorage.getItem('token');
  console.log(token);
  return (
    await apiClient.post(
      '/activity-bookings',
      { activityId, price, paymentMethod }, // Body payload goes here
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    )
  ).data
}

export async function getActivityBookings() {
  const token = localStorage.getItem('token');
  const response = await apiClient.get("/activity-bookings", {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });
  const data = await response.data
  return (
    data.allBookings
  );
}

export async function createItineraryBooking(itinerary, tourGuide, tourDate, price, paymentMethod, token) {
    return (
      await apiClient.post(
        "/itinerary-bookings",
        { itinerary, tourGuide, tourDate, price, paymentMethod }, // Body payload goes here
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      )
    )
  
}

export async function getItineraryBookings() {
  const token = localStorage.getItem('token');
  const response = await apiClient.get("/itinerary-bookings", {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });
  const data = await response.data
  return (
    data.allBookings
  );
}

export async function cancelActivityBooking(id) {
  const token = localStorage.getItem('token');

  if (!token) {
    return { message: 'No token provided' };
  }

  try {
    // Correct usage of PUT request: data should be sent as the second argument, headers as third
    const response = await apiClient.put(`/activity-bookings/${id}`, {}, {  // You can send an empty object {} if you don't need a body
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await response.data;
    return data;
  } catch (error) {
    console.error('Error in canceling activity booking:', error);
    return { message: error.response ? error.response.data.message : error.message };
  }
}

export async function cancelItineraryBooking(id) {
  const token = localStorage.getItem('token');

  if (!token) {
    return { message: 'No token provided' };
  }

  try {
    // Correct usage of PUT request: data should be sent as the second argument, headers as third
    const response = await apiClient.put(`/itinerary-bookings/${id}`, {}, {  // You can send an empty object {} if you don't need a body
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await response.data;
    return data;
  } catch (error) {
    console.error('Error in canceling itinerary booking:', error);
    return { message: error.response ? error.response.data.message : error.message };
  }
}


const flightsQuery = `query SearchReturnItinerariesQuery(\n  $search: SearchReturnInput\n  $filter: ItinerariesFilterInput\n  $options: ItinerariesOptionsInput\n  $conditions: Boolean!\n) {\n  returnItineraries(search: $search, filter: $filter, options: $options) {\n    __typename\n    ... on AppError {\n      error: message\n    }\n    ... on Itineraries {\n      server {\n        requestId\n        environment\n        packageVersion\n        serverToken\n      }\n      metadata {\n        eligibilityInformation {\n          baggageEligibilityInformation {\n            topFiveResultsBaggageEligibleForPrompt\n            numberOfBags\n          }\n          guaranteeAndRedirectsEligibilityInformation {\n            redirect {\n              anywhere\n              top10\n              isKiwiAvailable\n            }\n            guarantee {\n              anywhere\n              top10\n            }\n            combination {\n              anywhere\n              top10\n            }\n          }\n          topThreeResortingOccurred\n          carriersDeeplinkEligibility\n          responseContainsKayakItinerary\n          eligibleForVIRemoval\n        }\n        carriers {\n          code\n          id\n        }\n        ...AirlinesFilter_data\n        ...CountriesFilter_data\n        ...WeekDaysFilter_data\n        ...TravelTip_data\n        ...Sorting_data\n        ...useSortingModes_data\n        ...PriceAlert_data\n        itinerariesCount\n        hasMorePending\n        missingProviders {\n          code\n        }\n        searchFingerprint\n        statusPerProvider {\n          provider {\n            id\n          }\n          errorHappened\n          errorMessage\n        }\n        hasTier1MarketItineraries\n        isSortOrderSameAsDefault\n        sharedItinerary {\n          __typename\n          ...TripInfo\n          ... on ItineraryReturn {\n            ... on Itinerary {\n              __isItinerary: __typename\n              __typename\n              id\n              shareId\n              price {\n                amount\n                priceBeforeDiscount\n              }\n              priceEur {\n                amount\n              }\n              provider {\n                name\n                code\n                hasHighProbabilityOfPriceChange\n                contentProvider {\n                  code\n                }\n                id\n              }\n              bagsInfo {\n                includedCheckedBags\n                includedHandBags\n                hasNoBaggageSupported\n                hasNoCheckedBaggage\n                checkedBagTiers {\n                  tierPrice {\n                    amount\n                  }\n                  bags {\n                    weight {\n                      value\n                    }\n                  }\n                }\n                handBagTiers {\n                  tierPrice {\n                    amount\n                  }\n                  bags {\n                    weight {\n                      value\n                    }\n                  }\n                }\n                includedPersonalItem\n                personalItemTiers {\n                  tierPrice {\n                    amount\n                  }\n                  bags {\n                    weight {\n                      value\n                    }\n                    height {\n                      value\n                    }\n                    width {\n                      value\n                    }\n                    length {\n                      value\n                    }\n                  }\n                }\n              }\n              bookingOptions {\n                edges {\n                  node {\n                    token\n                    bookingUrl\n                    trackingPixel\n                    itineraryProvider {\n                      code\n                      name\n                      subprovider\n                      hasHighProbabilityOfPriceChange\n                      contentProvider {\n                        code\n                      }\n                      providerCategory\n                      id\n                    }\n                    price {\n                      amount\n                    }\n                    priceEur {\n                      amount\n                    }\n                  }\n                }\n              }\n              travelHack {\n                isTrueHiddenCity\n                isVirtualInterlining\n                isThrowawayTicket\n              }\n              priceLocks {\n                priceLocksCurr {\n                  default\n                  price {\n                    amount\n                    roundedFormattedValue\n                  }\n                }\n                priceLocksEur {\n                  default\n                  price {\n                    amount\n                    roundedFormattedValue\n                  }\n                }\n              }\n            }\n            legacyId\n            outbound {\n              id\n              sectorSegments {\n                guarantee\n                segment {\n                  id\n                  source {\n                    localTime\n                    utcTime\n                    station {\n                      id\n                      legacyId\n                      name\n                      code\n                      type\n                      gps {\n                        lat\n                        lng\n                      }\n                      city {\n                        legacyId\n                        name\n                        id\n                      }\n                      country {\n                        code\n                        id\n                      }\n                    }\n                  }\n                  destination {\n                    localTime\n                    utcTime\n                    station {\n                      id\n                      legacyId\n                      name\n                      code\n                      type\n                      gps {\n                        lat\n                        lng\n                      }\n                      city {\n                        legacyId\n                        name\n                        id\n                      }\n                      country {\n                        code\n                        id\n                      }\n                    }\n                  }\n                  duration\n                  type\n                  code\n                  carrier {\n                    id\n                    name\n                    code\n                  }\n                  operatingCarrier {\n                    id\n                    name\n                    code\n                  }\n                  cabinClass\n                  hiddenDestination {\n                    code\n                    name\n                    city {\n                      name\n                      id\n                    }\n                    country {\n                      name\n                      id\n                    }\n                    id\n                  }\n                  throwawayDestination {\n                    id\n                  }\n                }\n                layover {\n                  duration\n                  isBaggageRecheck\n                  isWalkingDistance\n                  transferDuration\n                  id\n                }\n              }\n              duration\n            }\n            inbound {\n              id\n              sectorSegments {\n                guarantee\n                segment {\n                  id\n                  source {\n                    localTime\n                    utcTime\n                    station {\n                      id\n                      legacyId\n                      name\n                      code\n                      type\n                      gps {\n                        lat\n                        lng\n                      }\n                      city {\n                        legacyId\n                        name\n                        id\n                      }\n                      country {\n                        code\n                        id\n                      }\n                    }\n                  }\n                  destination {\n                    localTime\n                    utcTime\n                    station {\n                      id\n                      legacyId\n                      name\n                      code\n                      type\n                      gps {\n                        lat\n                        lng\n                      }\n                      city {\n                        legacyId\n                        name\n                        id\n                      }\n                      country {\n                        code\n                        id\n                      }\n                    }\n                  }\n                  duration\n                  type\n                  code\n                  carrier {\n                    id\n                    name\n                    code\n                  }\n                  operatingCarrier {\n                    id\n                    name\n                    code\n                  }\n                  cabinClass\n                  hiddenDestination {\n                    code\n                    name\n                    city {\n                      name\n                      id\n                    }\n                    country {\n                      name\n                      id\n                    }\n                    id\n                  }\n                  throwawayDestination {\n                    id\n                  }\n                }\n                layover {\n                  duration\n                  isBaggageRecheck\n                  isWalkingDistance\n                  transferDuration\n                  id\n                }\n              }\n              duration\n            }\n            stopover {\n              nightsCount\n              arrival {\n                type\n                city {\n                  name\n                  id\n                }\n                id\n              }\n              departure {\n                type\n                city {\n                  name\n                  id\n                }\n                id\n              }\n              duration\n            }\n            lastAvailable {\n              seatsLeft\n            }\n            isRyanair\n            benefitsData {\n              automaticCheckinAvailable\n              instantChatSupportAvailable\n              disruptionProtectionAvailable\n              guaranteeAvailable\n              guaranteeFee {\n                roundedAmount\n              }\n              searchReferencePrice {\n                roundedFormattedValue\n              }\n            }\n            isAirBaggageBundleEligible\n          }\n          id\n        }\n        kayakEligibilityTest {\n          containsKayakWithNewRules\n          containsKayakWithCurrentRules\n          containsKayakAirlinesWithNewRules\n        }\n        extendedTrackingMetadata {\n          fullResponse {\n            allItineraries {\n              numberOfKiwiOnlyBookingOptionItineraries {\n                beforeMerging\n                afterMerging\n              }\n              numberOfKayakOnlyBookingOptionItineraries {\n                beforeMerging\n                afterMerging\n              }\n              numberOfDeeplinkOnlyBookingOptionItineraries {\n                beforeMerging\n                afterMerging\n              }\n              numberOfKiwiAndKayakBookingOptionItineraries {\n                beforeMerging\n                afterMerging\n              }\n              numberOfKiwiAndDeeplinkBookingOptionItineraries {\n                beforeMerging\n                afterMerging\n              }\n            }\n            filteredItineraries {\n              numberOfKiwiOnlyBookingOptionItineraries {\n                beforeMerging\n                afterMerging\n              }\n              numberOfKayakOnlyBookingOptionItineraries {\n                beforeMerging\n                afterMerging\n              }\n              numberOfDeeplinkOnlyBookingOptionItineraries {\n                beforeMerging\n                afterMerging\n              }\n              numberOfKiwiAndKayakBookingOptionItineraries {\n                beforeMerging\n                afterMerging\n              }\n              numberOfKiwiAndDeeplinkBookingOptionItineraries {\n                beforeMerging\n                afterMerging\n              }\n            }\n            airlineBreakdown {\n              carriers {\n                code\n                id\n              }\n              allItineraries {\n                numberOfKiwiOnlyBookingOptionItineraries {\n                  beforeMerging\n                  afterMerging\n                }\n                numberOfKayakOnlyBookingOptionItineraries {\n                  beforeMerging\n                  afterMerging\n                }\n                numberOfDeeplinkOnlyBookingOptionItineraries {\n                  beforeMerging\n                  afterMerging\n                }\n                numberOfKiwiAndKayakBookingOptionItineraries {\n                  beforeMerging\n                  afterMerging\n                }\n                numberOfKiwiAndDeeplinkBookingOptionItineraries {\n                  beforeMerging\n                  afterMerging\n                }\n              }\n              filteredItineraries {\n                numberOfKiwiOnlyBookingOptionItineraries {\n                  beforeMerging\n                  afterMerging\n                }\n                numberOfKayakOnlyBookingOptionItineraries {\n                  beforeMerging\n                  afterMerging\n                }\n                numberOfDeeplinkOnlyBookingOptionItineraries {\n                  beforeMerging\n                  afterMerging\n                }\n                numberOfKiwiAndKayakBookingOptionItineraries {\n                  beforeMerging\n                  afterMerging\n                }\n                numberOfKiwiAndDeeplinkBookingOptionItineraries {\n                  beforeMerging\n                  afterMerging\n                }\n              }\n            }\n          }\n          topTenInResponse {\n            allItineraries {\n              numberOfKiwiOnlyBookingOptionItineraries {\n                beforeMerging\n                afterMerging\n              }\n              numberOfKayakOnlyBookingOptionItineraries {\n                beforeMerging\n                afterMerging\n              }\n              numberOfDeeplinkOnlyBookingOptionItineraries {\n                beforeMerging\n                afterMerging\n              }\n              numberOfKiwiAndKayakBookingOptionItineraries {\n                beforeMerging\n                afterMerging\n              }\n              numberOfKiwiAndDeeplinkBookingOptionItineraries {\n                beforeMerging\n                afterMerging\n              }\n            }\n            filteredItineraries {\n              numberOfKiwiOnlyBookingOptionItineraries {\n                beforeMerging\n                afterMerging\n              }\n              numberOfKayakOnlyBookingOptionItineraries {\n                beforeMerging\n                afterMerging\n              }\n              numberOfDeeplinkOnlyBookingOptionItineraries {\n                beforeMerging\n                afterMerging\n              }\n              numberOfKiwiAndKayakBookingOptionItineraries {\n                beforeMerging\n                afterMerging\n              }\n              numberOfKiwiAndDeeplinkBookingOptionItineraries {\n                beforeMerging\n                afterMerging\n              }\n            }\n            airlineBreakdown {\n              carriers {\n                name\n                code\n                id\n              }\n              allItineraries {\n                numberOfKiwiOnlyBookingOptionItineraries {\n                  beforeMerging\n                  afterMerging\n                }\n                numberOfKayakOnlyBookingOptionItineraries {\n                  beforeMerging\n                  afterMerging\n                }\n                numberOfDeeplinkOnlyBookingOptionItineraries {\n                  beforeMerging\n                  afterMerging\n                }\n                numberOfKiwiAndKayakBookingOptionItineraries {\n                  beforeMerging\n                  afterMerging\n                }\n                numberOfKiwiAndDeeplinkBookingOptionItineraries {\n                  beforeMerging\n                  afterMerging\n                }\n              }\n              filteredItineraries {\n                numberOfKiwiOnlyBookingOptionItineraries {\n                  beforeMerging\n                  afterMerging\n                }\n                numberOfKayakOnlyBookingOptionItineraries {\n                  beforeMerging\n                  afterMerging\n                }\n                numberOfDeeplinkOnlyBookingOptionItineraries {\n                  beforeMerging\n                  afterMerging\n                }\n                numberOfKiwiAndKayakBookingOptionItineraries {\n                  beforeMerging\n                  afterMerging\n                }\n                numberOfKiwiAndDeeplinkBookingOptionItineraries {\n                  beforeMerging\n                  afterMerging\n                }\n              }\n            }\n          }\n        }\n        sortEligibilityInformation {\n          beelineDistance\n          sortOrderingPositionalComparison {\n            position\n            changeOccurred\n          }\n        }\n      }\n      itineraries {\n        __typename\n        ...TripInfo\n        ...ItineraryDebug @include(if: $conditions)\n        ... on ItineraryReturn {\n          ... on Itinerary {\n            __isItinerary: __typename\n            __typename\n            id\n            shareId\n            price {\n              amount\n              priceBeforeDiscount\n            }\n            priceEur {\n              amount\n            }\n            provider {\n              name\n              code\n              hasHighProbabilityOfPriceChange\n              contentProvider {\n                code\n              }\n              id\n            }\n            bagsInfo {\n              includedCheckedBags\n              includedHandBags\n              hasNoBaggageSupported\n              hasNoCheckedBaggage\n              checkedBagTiers {\n                tierPrice {\n                  amount\n                }\n                bags {\n                  weight {\n                    value\n                  }\n                }\n              }\n              handBagTiers {\n                tierPrice {\n                  amount\n                }\n                bags {\n                  weight {\n                    value\n                  }\n                }\n              }\n              includedPersonalItem\n              personalItemTiers {\n                tierPrice {\n                  amount\n                }\n                bags {\n                  weight {\n                    value\n                  }\n                  height {\n                    value\n                  }\n                  width {\n                    value\n                  }\n                  length {\n                    value\n                  }\n                }\n              }\n            }\n            bookingOptions {\n              edges {\n                node {\n                  token\n                  bookingUrl\n                  trackingPixel\n                  itineraryProvider {\n                    code\n                    name\n                    subprovider\n                    hasHighProbabilityOfPriceChange\n                    contentProvider {\n                      code\n                    }\n                    providerCategory\n                    id\n                  }\n                  price {\n                    amount\n                  }\n                  priceEur {\n                    amount\n                  }\n                }\n              }\n            }\n            travelHack {\n              isTrueHiddenCity\n              isVirtualInterlining\n              isThrowawayTicket\n            }\n            priceLocks {\n              priceLocksCurr {\n                default\n                price {\n                  amount\n                  roundedFormattedValue\n                }\n              }\n              priceLocksEur {\n                default\n                price {\n                  amount\n                  roundedFormattedValue\n                }\n              }\n            }\n          }\n          legacyId\n          outbound {\n            id\n            sectorSegments {\n              guarantee\n              segment {\n                id\n                source {\n                  localTime\n                  utcTime\n                  station {\n                    id\n                    legacyId\n                    name\n                    code\n                    type\n                    gps {\n                      lat\n                      lng\n                    }\n                    city {\n                      legacyId\n                      name\n                      id\n                    }\n                    country {\n                      code\n                      id\n                    }\n                  }\n                }\n                destination {\n                  localTime\n                  utcTime\n                  station {\n                    id\n                    legacyId\n                    name\n                    code\n                    type\n                    gps {\n                      lat\n                      lng\n                    }\n                    city {\n                      legacyId\n                      name\n                      id\n                    }\n                    country {\n                      code\n                      id\n                    }\n                  }\n                }\n                duration\n                type\n                code\n                carrier {\n                  id\n                  name\n                  code\n                }\n                operatingCarrier {\n                  id\n                  name\n                  code\n                }\n                cabinClass\n                hiddenDestination {\n                  code\n                  name\n                  city {\n                    name\n                    id\n                  }\n                  country {\n                    name\n                    id\n                  }\n                  id\n                }\n                throwawayDestination {\n                  id\n                }\n              }\n              layover {\n                duration\n                isBaggageRecheck\n                isWalkingDistance\n                transferDuration\n                id\n              }\n            }\n            duration\n          }\n          inbound {\n            id\n            sectorSegments {\n              guarantee\n              segment {\n                id\n                source {\n                  localTime\n                  utcTime\n                  station {\n                    id\n                    legacyId\n                    name\n                    code\n                    type\n                    gps {\n                      lat\n                      lng\n                    }\n                    city {\n                      legacyId\n                      name\n                      id\n                    }\n                    country {\n                      code\n                      id\n                    }\n                  }\n                }\n                destination {\n                  localTime\n                  utcTime\n                  station {\n                    id\n                    legacyId\n                    name\n                    code\n                    type\n                    gps {\n                      lat\n                      lng\n                    }\n                    city {\n                      legacyId\n                      name\n                      id\n                    }\n                    country {\n                      code\n                      id\n                    }\n                  }\n                }\n                duration\n                type\n                code\n                carrier {\n                  id\n                  name\n                  code\n                }\n                operatingCarrier {\n                  id\n                  name\n                  code\n                }\n                cabinClass\n                hiddenDestination {\n                  code\n                  name\n                  city {\n                    name\n                    id\n                  }\n                  country {\n                    name\n                    id\n                  }\n                  id\n                }\n                throwawayDestination {\n                  id\n                }\n              }\n              layover {\n                duration\n                isBaggageRecheck\n                isWalkingDistance\n                transferDuration\n                id\n              }\n            }\n            duration\n          }\n          stopover {\n            nightsCount\n            arrival {\n              type\n              city {\n                name\n                id\n              }\n              id\n            }\n            departure {\n              type\n              city {\n                name\n                id\n              }\n              id\n            }\n            duration\n          }\n          lastAvailable {\n            seatsLeft\n          }\n          isRyanair\n          benefitsData {\n            automaticCheckinAvailable\n            instantChatSupportAvailable\n            disruptionProtectionAvailable\n            guaranteeAvailable\n            guaranteeFee {\n              roundedAmount\n            }\n            searchReferencePrice {\n              roundedFormattedValue\n            }\n          }\n          isAirBaggageBundleEligible\n        }\n        id\n      }\n    }\n  }\n}\n\nfragment AirlinesFilter_data on ItinerariesMetadata {\n  carriers {\n    id\n    code\n    name\n  }\n}\n\nfragment CountriesFilter_data on ItinerariesMetadata {\n  stopoverCountries {\n    code\n    name\n    id\n  }\n}\n\nfragment ItineraryDebug on Itinerary {\n  __isItinerary: __typename\n  itineraryDebugData {\n    debug\n  }\n}\n\nfragment PrebookingStation on Station {\n  code\n  type\n  city {\n    name\n    id\n  }\n}\n\nfragment PriceAlert_data on ItinerariesMetadata {\n  priceAlertExists\n  existingPriceAlert {\n    id\n  }\n  searchFingerprint\n  hasMorePending\n  priceAlertsTopResults {\n    best {\n      price {\n        amount\n      }\n    }\n    cheapest {\n      price {\n        amount\n      }\n    }\n    fastest {\n      price {\n        amount\n      }\n    }\n    sourceTakeoffAsc {\n      price {\n        amount\n      }\n    }\n    destinationLandingAsc {\n      price {\n        amount\n      }\n    }\n  }\n}\n\nfragment Sorting_data on ItinerariesMetadata {\n  topResults {\n    best {\n      __typename\n      duration\n      price {\n        amount\n      }\n      id\n    }\n    cheapest {\n      __typename\n      duration\n      price {\n        amount\n      }\n      id\n    }\n    fastest {\n      __typename\n      duration\n      price {\n        amount\n      }\n      id\n    }\n    sourceTakeoffAsc {\n      __typename\n      duration\n      price {\n        amount\n      }\n      id\n    }\n    destinationLandingAsc {\n      __typename\n      duration\n      price {\n        amount\n      }\n      id\n    }\n  }\n}\n\nfragment TravelTip_data on ItinerariesMetadata {\n  travelTips {\n    __typename\n    ... on TravelTipRadiusMoney {\n      radius\n      params {\n        name\n        value\n      }\n      savingMoney: saving {\n        amount\n        currency {\n          id\n          code\n          name\n        }\n        formattedValue\n      }\n      location {\n        __typename\n        id\n        legacyId\n        name\n        slug\n      }\n    }\n    ... on TravelTipRadiusTime {\n      radius\n      params {\n        name\n        value\n      }\n      saving\n      location {\n        __typename\n        id\n        legacyId\n        name\n        slug\n      }\n    }\n    ... on TravelTipRadiusSome {\n      radius\n      params {\n        name\n        value\n      }\n      location {\n        __typename\n        id\n        legacyId\n        name\n        slug\n      }\n    }\n    ... on TravelTipDateMoney {\n      dates {\n        start\n        end\n      }\n      params {\n        name\n        value\n      }\n      savingMoney: saving {\n        amount\n        currency {\n          id\n          code\n          name\n        }\n        formattedValue\n      }\n    }\n    ... on TravelTipDateTime {\n      dates {\n        start\n        end\n      }\n      params {\n        name\n        value\n      }\n      saving\n    }\n    ... on TravelTipDateSome {\n      dates {\n        start\n        end\n      }\n      params {\n        name\n        value\n      }\n    }\n    ... on TravelTipExtend {\n      destination {\n        __typename\n        id\n        name\n        slug\n      }\n      locations {\n        __typename\n        id\n        name\n        slug\n      }\n      price {\n        amount\n        currency {\n          id\n          code\n          name\n        }\n        formattedValue\n      }\n    }\n  }\n}\n\nfragment TripInfo on Itinerary {\n  __isItinerary: __typename\n  ... on ItineraryOneWay {\n    sector {\n      sectorSegments {\n        segment {\n          source {\n            station {\n              ...PrebookingStation\n              id\n            }\n            localTime\n          }\n          destination {\n            station {\n              ...PrebookingStation\n              id\n            }\n          }\n          id\n        }\n      }\n      id\n    }\n  }\n  ... on ItineraryReturn {\n    outbound {\n      sectorSegments {\n        segment {\n          source {\n            station {\n              ...PrebookingStation\n              id\n            }\n            localTime\n          }\n          destination {\n            station {\n              ...PrebookingStation\n              id\n            }\n          }\n          id\n        }\n      }\n      id\n    }\n    inbound {\n      sectorSegments {\n        segment {\n          destination {\n            station {\n              ...PrebookingStation\n              id\n            }\n            localTime\n          }\n          id\n        }\n      }\n      id\n    }\n  }\n  ... on ItineraryMulticity {\n    sectors {\n      sectorSegments {\n        segment {\n          source {\n            station {\n              ...PrebookingStation\n              id\n            }\n            localTime\n          }\n          destination {\n            station {\n              ...PrebookingStation\n              id\n            }\n            localTime\n          }\n          id\n        }\n      }\n      id\n    }\n  }\n}\n\nfragment WeekDaysFilter_data on ItinerariesMetadata {\n  inboundDays\n  outboundDays\n}\n\nfragment useSortingModes_data on ItinerariesMetadata {\n  topResults {\n    best {\n      __typename\n      duration\n      price {\n        amount\n      }\n      id\n    }\n    cheapest {\n      __typename\n      duration\n      price {\n        amount\n      }\n      id\n    }\n    fastest {\n      __typename\n      duration\n      price {\n        amount\n      }\n      id\n    }\n    sourceTakeoffAsc {\n      __typename\n      duration\n      price {\n        amount\n      }\n      id\n    }\n    destinationLandingAsc {\n      __typename\n      duration\n      price {\n        amount\n      }\n      id\n    }\n  }\n}\n`;

const variables = `{"search":{"itinerary":{"source":{"ids":["City:"]},"destination":{"ids":["City:"]},"outboundDepartureDate":{"start":"","end":""},"inboundDepartureDate":{"start":"","end":""}},"passengers":{"adults":1,"children":0,"infants":0,"adultsHoldBags":[0],"adultsHandBags":[0],"childrenHoldBags":[],"childrenHandBags":[]},"cabinClass":{"cabinClass":"ECONOMY","applyMixedClasses":false}},"filter":{"allowReturnFromDifferentCity":true,"allowChangeInboundDestination":true,"allowChangeInboundSource":true,"allowDifferentStationConnection":true,"enableSelfTransfer":true,"enableThrowAwayTicketing":true,"enableTrueHiddenCity":true,"transportTypes":["FLIGHT"],"contentProviders":["KIWI","FRESH","KAYAK"],"flightsApiLimit":25,"limit":30},"options":{"sortBy":"QUALITY","mergePriceDiffRule":"INCREASED","currency":"usd","apiUrl":null,"locale":"en","market":"eg","partner":"skypicker","partnerMarket":"xx","affilID":"skypicker","storeSearch":false,"searchStrategy":"REDUCED","abTestInput":{"newMarketDefinitionABTest":"ENABLE","kayakWithoutBags":"DISABLE","carriersDeeplinkResultsEnable":true,"carriersDeeplinkOnSEMEnable":true},"sortVersion":7,"applySortingChanges":false},"conditions":false}`;

export async function getFlights(query) // source, dest, departureDate, arrivalDate
{
  const searchParams = new URLSearchParams(query);
  if (!searchParams.has("from") || !searchParams.has("to"))
    return [];

  const source = searchParams.get("from")?.split('--')[1];
  const dest = searchParams.get("to")?.split('--')[1];
  const departureDate = searchParams.get("departure");
  const arrivalDate = searchParams.get("return");
  const price = searchParams.get("price");
  const sortBy = searchParams.get("sortBy");


  const createDepartureDates = (date) => ({
    start: `${date}T00:00:00`,
    end: `${date}T23:59:59`
  });


  const body = {};
  body["query"] = flightsQuery;

  const variablesJson = JSON.parse(variables);
  const flightDetails = variablesJson["search"]["itinerary"];

  if (departureDate)
    flightDetails["outboundDepartureDate"] = createDepartureDates(departureDate);

  if (arrivalDate)
    flightDetails["inboundDepartureDate"] = createDepartureDates(arrivalDate);

  if (price)
    variablesJson["filter"]["price"] = { start: Number(price.split('-')[0]), end: Number(price.split('-')[1]) };

  if (sortBy)
    variablesJson["options"]["sortBy"] = sortBy.toUpperCase();

  flightDetails["source"]["ids"] = ["City:" + source];
  flightDetails["destination"]["ids"] = ["City:" + dest];

  body["variables"] = variablesJson;

  try {
    const response = await axios.post("https://api.skypicker.com/umbrella/v2/graphql?featureName=SearchReturnItinerariesQuery", body);

    if ("itineraries" in response["data"]["data"]["returnItineraries"])
      return response["data"]["data"]["returnItineraries"]["itineraries"];

    return [];
  }
  catch {
    return [];
  }
}

export async function getToken() {
  await apiClient.get("getHotelsToken");
}

const hotelsBody = `{"mapParams":{"estimateBoundingBox":true},"filterParams":{},"sortParams":{"sortMode":"rank_a"},"userSearchParams":{"searchLocation":{"locationType":"place","locationQuery":"2800"},"adults":"4","checkin":"2024-11-09","checkout":"2024-11-16","rooms":"3","childAges":[0]},"priceMode":"nightly-base","pageNumber":1,"metadata":{"impressionCount":1}}`;

export async function getHotels(query) {
  const searchParams = new URLSearchParams(query);
  if (!searchParams.has("checkin") || !searchParams.has("checkout") || !searchParams.has("where"))
    return [];

  const location = searchParams.get("where")?.split('--')[1].split(':');
  const checkin = searchParams.get("checkin");
  const checkout = searchParams.get("checkout");

  const price = searchParams.get("price");
  const sort = searchParams.get("order");

  const requestBody = JSON.parse(hotelsBody);

  requestBody.userSearchParams.checkin = checkin;
  requestBody.userSearchParams.checkout = checkout;

  requestBody.userSearchParams.searchLocation.locationType = location[0];
  requestBody.userSearchParams.searchLocation.locationQuery = location[1];

  if (price)
    requestBody.filterParams["fs=price"] = price;

  if (sort)
    requestBody.sortParams.sortMode = sort;

  try {
    const response = await apiClient.post("getHotels?currency=USD", requestBody);
    return response["data"];
  }
  catch (error) {
    console.error('Error fetching data:', error.message);
    return [];
  }
}

export async function submitComplaint(complaintData, token) {

  return (await apiClient.post('complaints', complaintData, {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`
    }
  })).data;
}

export async function changePassword(passwordData, token) {
  return (
    await apiClient.post("tourists/changepassword", passwordData, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    })
  ).data;
}


export const getCompletedToursByTourist = async (touristId) => {
  const response = await fetch(
    `${API_BASE_URL}bookings/completed/${touristId}`
  ); // Correctly formatted URL
  if (!response.ok) {
    throw new Error("Failed to fetch completed tours");
  }
  return await response.json();
};

export async function updateProfile(updatedData, token) {
  console.log(token);
  console.log(updatedData);
  return (
    await apiClient.put("tourists/updateMyProfile", updatedData, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    })
  ).data;
}

export async function getWishlist(token) {
  return (
    await apiClient.get("tourists/wishlist", {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    })
  ).data;
}

export async function addToWishlist(productId, token) {
  return (
    await apiClient.post("tourists/wishlist", { productId }, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    })
  ).data;
}

export async function removeFromWishlist(productId, token) {
  return (
    await apiClient.delete("tourists/wishlist", {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      data: { productId }
    })
  ).data;
}