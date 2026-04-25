const Trip = require('../models/Trip');
const Anthropic = require('@anthropic-ai/sdk');

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

const BUDGET_TIERS = {
  minimum: {
    label: 'Budget/Backpacker',
    accom: 'budget hostels, dharamshalas, or guesthouses',
    accomCost: 'Rs.300-800/night',
    meals: 'street food and local dhabas — breakfast Rs.50-100, lunch Rs.80-150, dinner Rs.100-200',
    activities: 'free or very low cost — ghats, temples, parks (Rs.0-100/activity)',
    dailyCost: 'Day total Rs.500-1200. Stay Rs.300-800, food Rs.200-400, activities Rs.0-200, transport Rs.50-150.',
  },
  medium: {
    label: 'Mid-range',
    accom: '3-star hotels or well-rated guesthouses',
    accomCost: 'Rs.1500-3500/night',
    meals: 'mid-range restaurants — breakfast Rs.200-350, lunch Rs.350-600, dinner Rs.500-1000',
    activities: 'paid attractions, guided tours — Rs.200-600/activity',
    dailyCost: 'Day total Rs.3000-6000. Stay Rs.1500-3500, food Rs.800-1500, activities Rs.500-1200, transport Rs.200-500.',
  },
  luxury: {
    label: 'Luxury',
    accom: '4-star hotels or heritage properties',
    accomCost: 'Rs.4000-9000/night',
    meals: 'upscale restaurants, rooftop dining — breakfast Rs.600-900, lunch Rs.1200-2000, dinner Rs.2000-3500',
    activities: 'premium guided tours, boat rides — Rs.800-2500/activity',
    dailyCost: 'Day total Rs.9000-18000. Stay Rs.4000-9000, food Rs.2500-5000, activities Rs.2000-5000, transport Rs.500-1500.',
  },
  ultra: {
    label: 'Ultra Luxury',
    accom: '5-star hotels or palace hotels',
    accomCost: 'Rs.10000+/night',
    meals: 'fine dining, private experiences — breakfast Rs.1500-2500, lunch Rs.3000-5000, dinner Rs.5000-12000',
    activities: 'exclusive private tours, VIP experiences — Rs.3000-10000/activity',
    dailyCost: 'Day total Rs.25000-60000. Stay Rs.10000+, food Rs.8000-20000, activities Rs.6000-20000, transport Rs.1000-3000.',
  },
};

const generateTrip = async (req, res, next) => {
  try {
    const {
      source, destination, travelMode, budget, days, people, preferences,
      accommodationType, mealPreference, pace, startDate, endDate, specialRequirements,
      travellerType, tripVibe, distanceRange, hasChildren, hasElderly, accessibilityNeeds
    } = req.body;

    if (!source || !destination || !travelMode || !days || !people) {
      return res.status(400).json({ success: false, message: 'Required: source, destination, travelMode, days, people' });
    }
    if (days < 1 || days > 30) return res.status(400).json({ success: false, message: 'Days must be between 1 and 30' });
    if (people < 1 || people > 20) return res.status(400).json({ success: false, message: 'People must be between 1 and 20' });

    const validTiers = ['minimum', 'medium', 'luxury', 'ultra'];
    const resolvedBudgetTier = validTiers.includes(budget) ? budget : 'medium';
    const tier = BUDGET_TIERS[resolvedBudgetTier];
    const actsPerDay = pace === 'relaxed' ? 3 : pace === 'packed' ? 6 : 4;

    const dates = [];
    for (let i = 0; i < Number(days); i++) {
      if (startDate) {
        const d = new Date(startDate);
        d.setDate(d.getDate() + i);
        dates.push(d.toISOString().split('T')[0]);
      } else {
        dates.push(`Day ${i + 1}`);
      }
    }

    const extras = [
      preferences?.length > 0 && `User interests: ${preferences.join(', ')} — prioritise these types of places`,
      mealPreference?.length > 0 && `Food preference: ${mealPreference.join(', ')} — suggest matching restaurants`,
      travellerType && `Traveller type: ${travellerType}`,
      tripVibe?.length > 0 && `Trip vibe: ${tripVibe.join(', ')}`,
      hasChildren && 'Travelling with children — include family-friendly & kid-safe activities',
      hasElderly && 'Travelling with elderly — avoid strenuous activities, prefer comfortable options',
      accessibilityNeeds && 'Wheelchair/mobility accessible venues required',
      distanceRange && `DISTANCE CONSTRAINT: ONLY suggest places within ${distanceRange} km of ${destination} city centre — do not suggest anything outside this range`,
      specialRequirements && `Special requirements: ${specialRequirements}`,
    ].filter(Boolean).join('. ');

    // ≤6 days = full detail, 7-10 = compact, >10 = ultra compact
    const isLongTrip = Number(days) > 6;
    const ultraCompact = Number(days) > 10;
    const actsLabel = pace === 'relaxed' ? 'exactly 3 activities/day (relaxed — morning, afternoon, evening)' :
                      pace === 'packed'  ? 'exactly 6 activities/day (packed — every 2 hours from morning to night)' :
                                          'exactly 4 activities/day (moderate — well spaced through the day)';

    const actSlot = `{"t":"","a":"","l":"","d":"","c":0}`;
    const daySlot = (date, i) => `{"day":${i+1},"date":"${date}","title":"","schedule":[${Array.from({length: actsPerDay}, () => actSlot).join(',')}],"food":[{"n":"","type":""},{"n":"","type":""}],"budget":{"stay":0,"food":0,"acts":0,"transport":0,"total":0},"tip":""}`;

    const prompt = `World travel planner. Output ONLY valid JSON. No markdown. No extra text.

Trip: ${source}→${destination}|${travelMode}|${days}days|${people}pax|${tier.label}
Stay:${tier.accom}(${tier.accomCost})|Food:${tier.meals}|Pace:${actsLabel}
BUDGET: ${tier.dailyCost}
${extras ? `USER INPUTS TO STRICTLY FOLLOW: ${extras}` : ''}

RULES:
- EXACTLY ${actsPerDay} activities per day — mandatory, count each day
- STRICTLY follow all user inputs — interests, vibe, traveller type, distance range
- ONLY suggest REAL, FAMOUS, WELL-KNOWN places that actually exist nearby ${destination}
- NEVER invent or hallucinate any place, hotel, or restaurant name
- ${distanceRange ? `DISTANCE CONSTRAINT: EVERY suggested place must be within ${distanceRange} km of ${destination} city centre` : `Cover the most famous must-visit attractions in ${destination}`}
- NO repeated places across ALL ${days} days. NO repeated food places across days.
- Hotels: only real verifiable hotels inside ${destination}
- Day 1: travel from ${source}+arrive+hotel area. Day ${days}: sightseeing+checkout+return to ${source}
- Geographic logic: cluster nearby places each day to minimise travel time
- Food: 2 real well-known eateries per day matching ${tier.label} price level
- ALL costs must match ${tier.label} tier: ${tier.dailyCost}
- Day 1 budget includes travel/arrival cost. Day ${days} includes return travel cost.
- Use correct local currency of ${destination} country
- ALL string values MAX 35 chars
- ${ultraCompact ? 'ULTRA COMPACT MODE: activity names only, no descriptions' : isLongTrip ? 'COMPACT MODE: names only, no descriptions' : 'DETAILED MODE: 1 short description per activity (what makes it special)'}

Fill every "" and 0 with real data:
{"summary":{"title":"","dest":"${destination}","days":"${days}","bestTime":"","overview":""},"travel":{"mode":"${travelMode}","from":"${source}","to":"${destination}","time":"","fare":0,"currency":"","tip":""},"hotels":[{"name":"real hotel in ${destination}","area":"","price":0,"rating":4.2,"tip":""},{"name":"real hotel in ${destination}","area":"","price":0,"rating":4.0,"tip":""},{"name":"real hotel in ${destination}","area":"","price":0,"rating":3.8,"tip":""}],"days":[${dates.map((d, i) => daySlot(d, i)).join(',')}],"budget":{"travel":0,"stay":0,"food":0,"acts":0,"misc":0,"total":0,"perDay":0,"perPerson":0},"tips":["",""],"packing":["","",""],"emergency":{"police":"","ambulance":""}}

IMPORTANT: days array EXACTLY ${days} entries. Each entry EXACTLY ${actsPerDay} schedule items.
t=time(HH:MM AM/PM), a=real famous place name, l=exact location, d=duration, c=cost. food n=real eatery name, type=restaurant/cafe/street`;

    const message = await client.messages.create({
      model: 'claude-haiku-4-5',
      max_tokens: 8192,
      system: 'Output ONLY valid JSON. No markdown. No explanation. Only suggest real, well-known, verifiable places. Never hallucinate. All strings under 35 chars.',
      messages: [{ role: 'user', content: prompt }],
    });

    const responseText = message.content[0].text;
    console.log('✅ Response length:', responseText.length, '| Last 50:', responseText.slice(-50));

    let cleaned = responseText.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
    const first = cleaned.indexOf('{');
    const last = cleaned.lastIndexOf('}');

    if (first === -1 || last === -1) {
      console.error('❌ No JSON:', responseText.substring(0, 200));
      return res.status(502).json({ success: false, message: 'AI returned an invalid response. Please try again.' });
    }
    cleaned = cleaned.substring(first, last + 1);

    let raw;
    try {
      raw = JSON.parse(cleaned);
      console.log('✅ Parsed. Days:', raw.days?.length);
    } catch (e) {
      console.error('❌ Parse error:', e.message, '\nLast 200:', cleaned.slice(-200));
      return res.status(502).json({ success: false, message: 'AI response was cut off. Please try again.' });
    }

    // Normalise compact format to standard itinerary format
    const itinerary = {
      tripSummary: {
        title: raw.summary?.title || `${destination} Trip`,
        destination: raw.summary?.dest || destination,
        duration: `${days} Days`,
        bestTimeToVisit: raw.summary?.bestTime || '',
        overview: raw.summary?.overview || '',
        highlights: raw.days?.slice(0, 3).map(d => d.schedule?.[0]?.a || '').filter(Boolean) || [],
      },
      travelInfo: {
        mode: travelMode, from: source, to: destination,
        estimatedTravelTime: raw.travel?.time || '',
        bookingTips: raw.travel?.tip || '',
        estimatedFare: { perPerson: raw.travel?.fare || 0, total: (raw.travel?.fare || 0) * Number(people), currency: raw.travel?.currency || '' },
      },
      accommodation: (raw.hotels || []).map(h => ({
        name: h.name, type: tier.accom, location: h.area,
        pricePerNight: h.price, rating: h.rating,
        amenities: ['WiFi'], bookingTip: h.tip || '',
      })),
      dailyItinerary: (raw.days || []).map(d => ({
        day: d.day, date: d.date, title: d.title || `Day ${d.day}`, theme: '',
        schedule: (d.schedule || []).map(s => ({
          time: s.t, activity: s.a, description: s.desc || '',
          location: s.l, duration: s.d, cost: s.c || 0, tips: s.tip || '', category: 'sightseeing',
        })),
        foodSuggestions: { places: (d.food || []).map(f => ({ name: f.n, cuisine: '', priceRange: tier.label, type: f.type || 'restaurant' })) },
        dayBudget: {
          accommodation: d.budget?.stay || 0, food: d.budget?.food || 0,
          activities: d.budget?.acts || 0, transport: d.budget?.transport || 0,
          miscellaneous: 0, dayTotal: d.budget?.total || 0, note: '',
        },
        dayTips: d.tip || '',
      })),
      budgetBreakdown: {
        travel: raw.budget?.travel || 0, accommodation: raw.budget?.stay || 0,
        food: raw.budget?.food || 0, activities: raw.budget?.acts || 0,
        shopping: 0, miscellaneous: raw.budget?.misc || 0,
        totalEstimated: raw.budget?.total || 0, perPerson: raw.budget?.perPerson || 0,
        perDay: raw.budget?.perDay || 0, savingsTips: raw.tips || [],
      },
      packingList: { essentials: raw.packing || [], clothing: [], documents: [], health: [] },
      importantTips: raw.tips || [],
      localPhrases: [],
      emergencyContacts: { police: raw.emergency?.police || '100', ambulance: raw.emergency?.ambulance || '108', touristHelpline: '1363' },
    };

    res.json({
      success: true, message: 'Itinerary generated!',
      itinerary, rawResponse: '',
      tripDetails: {
        source, destination, travelMode,
        budget: itinerary?.budgetBreakdown?.totalEstimated || 0,
        budgetTier: resolvedBudgetTier,
        days: Number(days), people: Number(people),
        preferences, accommodationType, mealPreference,
        pace, startDate, endDate, specialRequirements,
        travellerType, tripVibe, distanceRange,
        hasChildren, hasElderly, accessibilityNeeds
      },
    });

  } catch (error) {
    console.error('❌ Anthropic error:', error.status, error.message?.substring(0, 200));
    if (error.status === 401) return res.status(502).json({ success: false, message: 'Invalid Anthropic API key. Check ANTHROPIC_API_KEY in .env — should start with sk-ant-' });
    if (error.status === 429) return res.status(429).json({ success: false, message: 'Rate limit hit. Please wait a moment and try again.' });
    if (error.status === 529 || error.status === 503) return res.status(503).json({ success: false, message: 'Anthropic is temporarily overloaded. Please try again.' });
    next(error);
  }
};

const saveTrip = async (req, res, next) => {
  try {
    const { tripDetails, itinerary, rawResponse } = req.body;
    if (!tripDetails || !itinerary) return res.status(400).json({ success: false, message: 'Trip details and itinerary are required.' });
    const title = itinerary?.tripSummary?.title || `${tripDetails.destination} - ${tripDetails.days} Days Trip`;
    const trip = await Trip.create({ userId: req.user._id, title, tripDetails, itinerary, rawResponse: rawResponse || '' });
    res.status(201).json({ success: true, message: 'Trip saved!', trip });
  } catch (error) { next(error); }
};

const getTrips = async (req, res, next) => {
  try {
    const trips = await Trip.find({ userId: req.user._id }).sort({ createdAt: -1 }).select('-rawResponse');
    res.json({ success: true, count: trips.length, trips });
  } catch (error) { next(error); }
};

const getTripById = async (req, res, next) => {
  try {
    const trip = await Trip.findOne({ _id: req.params.id, userId: req.user._id });
    if (!trip) return res.status(404).json({ success: false, message: 'Trip not found.' });
    res.json({ success: true, trip });
  } catch (error) { next(error); }
};

const deleteTrip = async (req, res, next) => {
  try {
    const trip = await Trip.findOneAndDelete({ _id: req.params.id, userId: req.user._id });
    if (!trip) return res.status(404).json({ success: false, message: 'Trip not found.' });
    res.json({ success: true, message: 'Trip deleted.' });
  } catch (error) { next(error); }
};

const toggleFavorite = async (req, res, next) => {
  try {
    const trip = await Trip.findOne({ _id: req.params.id, userId: req.user._id });
    if (!trip) return res.status(404).json({ success: false, message: 'Trip not found.' });
    trip.isFavorite = !trip.isFavorite;
    await trip.save();
    res.json({ success: true, isFavorite: trip.isFavorite });
  } catch (error) { next(error); }
};

module.exports = { generateTrip, saveTrip, getTrips, getTripById, deleteTrip, toggleFavorite };