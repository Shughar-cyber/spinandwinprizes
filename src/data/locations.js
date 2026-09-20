export const countries = [
  { code: 'US', name: 'United States', regionLabel: 'State' },
  { code: 'CA', name: 'Canada', regionLabel: 'Province / Territory' },
  { code: 'AU', name: 'Australia', regionLabel: 'State / Territory' },
  { code: 'GB', name: 'United Kingdom', regionLabel: 'Region' },
  { code: 'DE', name: 'Germany', regionLabel: 'Region' },
  { code: 'FR', name: 'France', regionLabel: 'Region' },
  { code: 'IN', name: 'India', regionLabel: 'State' },
  { code: 'NG', name: 'Nigeria', regionLabel: 'State' },
  { code: 'BR', name: 'Brazil', regionLabel: 'State' },
  { code: 'ZA', name: 'South Africa', regionLabel: 'Province' },
  { code: 'JP', name: 'Japan', regionLabel: 'Prefecture' },
  { code: 'OTHER', name: 'Other', regionLabel: 'Region' },
];

export const regionsByCountry = {
  US: ['Alabama', 'Alaska', 'Arizona', 'California', 'Colorado', 'Florida', 'Georgia', 'Illinois', 'New York', 'Texas', 'Washington'],
  CA: ['Alberta', 'British Columbia', 'Manitoba', 'New Brunswick', 'Newfoundland and Labrador', 'Nova Scotia', 'Ontario', 'Quebec', 'Saskatchewan', 'Yukon'],
  AU: ['Australian Capital Territory', 'New South Wales', 'Northern Territory', 'Queensland', 'South Australia', 'Tasmania', 'Victoria', 'Western Australia'],
  IN: ['Delhi', 'Gujarat', 'Karnataka', 'Maharashtra', 'Rajasthan', 'Tamil Nadu', 'Telangana', 'Uttar Pradesh', 'West Bengal'],
  NG: ['Abuja', 'Lagos', 'Kano', 'Oyo', 'Rivers', 'Kaduna', 'Enugu', 'Edo'],
  BR: ['Bahia', 'Distrito Federal', 'Minas Gerais', 'Parana', 'Rio de Janeiro', 'Sao Paulo'],
  ZA: ['Eastern Cape', 'Free State', 'Gauteng', 'KwaZulu-Natal', 'Limpopo', 'Western Cape'],
  JP: ['Hokkaido', 'Tokyo', 'Kanagawa', 'Osaka', 'Kyoto', 'Fukuoka'],
};
