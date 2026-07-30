/**
 * Delhi NCR Location Validator for VastraChakra
 * Allowed Regions: Delhi, New Delhi, Gurgaon / Gurugram, Noida / Greater Noida, Ghaziabad, Faridabad, Sonipat, Panipat
 * Allowed Pincodes: Starts with 11 (Delhi), 12 (Haryana/NCR), 20 (UP/NCR)
 */

const NCR_KEYWORDS = [
  'delhi', 'new delhi', 'gurgaon', 'gurugram', 'noida', 
  'greater noida', 'ghaziabad', 'faridabad', 'sonipat', 'panipat',
  'hauz khas', 'saket', 'connaught place', 'dwarka', 'okhla', 
  'rohini', 'janakpuri', 'cyber city', 'golf course road', 'sector', 'vasant kunj'
];

const DISALLOWED_KEYWORDS = [
  'bangalore', 'bengaluru', 'mumbai', 'kolkata', 'chennai', 
  'hyderabad', 'pune', 'ahmedabad', 'jaipur', 'chandigarh', 'lucknow'
];

export interface LocationValidationResult {
  isValid: boolean;
  message?: string;
}

export function validateDelhiNCRLocation(address: string, pincode?: string): LocationValidationResult {
  if (!address || address.trim().length === 0) {
    return {
      isValid: false,
      message: 'Please provide a valid delivery/pickup address.'
    };
  }

  const lowerAddress = address.toLowerCase();

  // Check explicit disallowed cities (e.g. Bangalore, Mumbai, etc.)
  for (const city of DISALLOWED_KEYWORDS) {
    if (lowerAddress.includes(city)) {
      return {
        isValid: false,
        message: `VastraChakra pilot service operates strictly within Delhi NCR. Location '${city.toUpperCase()}' is currently outside our service area.`
      };
    }
  }

  // Extract 6 digit Indian pincode from string if present or passed
  const pincodeMatch = pincode || lowerAddress.match(/\b[1-9][0-9]{5}\b/)?.[0];

  if (pincodeMatch) {
    const prefix = pincodeMatch.substring(0, 2);
    // Delhi (11xxxx), Haryana NCR (12xxxx), UP NCR (20xxxx)
    if (prefix !== '11' && prefix !== '12' && prefix !== '20') {
      return {
        isValid: false,
        message: `Pincode ${pincodeMatch} is outside Delhi NCR. VastraChakra service is restricted to Delhi NCR pincodes starting with 11, 12, or 20.`
      };
    }
  }

  // Keyword check
  const hasNCRKeyword = NCR_KEYWORDS.some(kw => lowerAddress.includes(kw));

  if (!hasNCRKeyword && !pincodeMatch) {
    return {
      isValid: false,
      message: 'Service area error: Please include a valid Delhi NCR location (e.g., Delhi, Gurgaon, Noida, Ghaziabad, Faridabad, Panipat) or a 6-digit Delhi NCR pincode.'
    };
  }

  return { isValid: true };
}
