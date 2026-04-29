/**
 * Location data for cascading Country → State → City dropdowns.
 * Structure: { countryName: { stateName: [city1, city2, ...], ... }, ... }
 */
const LOCATION_DATA = {
    "India": {
        "Andhra Pradesh": ["Visakhapatnam", "Vijayawada", "Guntur", "Nellore", "Kurnool", "Tirupati", "Rajahmundry", "Kadapa", "Kakinada", "Anantapur"],
        "Arunachal Pradesh": ["Itanagar", "Naharlagun", "Tawang", "Ziro", "Pasighat", "Bomdila"],
        "Assam": ["Guwahati", "Silchar", "Dibrugarh", "Jorhat", "Nagaon", "Tinsukia", "Tezpur"],
        "Bihar": ["Patna", "Gaya", "Bhagalpur", "Muzaffarpur", "Purnia", "Darbhanga", "Arrah", "Begusarai"],
        "Chhattisgarh": ["Raipur", "Bhilai", "Bilaspur", "Korba", "Durg", "Rajnandgaon"],
        "Goa": ["Panaji", "Margao", "Vasco da Gama", "Mapusa", "Ponda"],
        "Gujarat": ["Ahmedabad", "Surat", "Vadodara", "Rajkot", "Bhavnagar", "Jamnagar", "Gandhinagar", "Junagadh", "Anand", "Morbi"],
        "Haryana": ["Gurugram", "Faridabad", "Panipat", "Ambala", "Karnal", "Hisar", "Rohtak", "Sonipat"],
        "Himachal Pradesh": ["Shimla", "Dharamshala", "Manali", "Kullu", "Mandi", "Solan", "Kangra"],
        "Jharkhand": ["Ranchi", "Jamshedpur", "Dhanbad", "Bokaro", "Hazaribagh", "Deoghar"],
        "Karnataka": ["Bengaluru", "Mysuru", "Mangaluru", "Hubli", "Belgaum", "Dharwad", "Shimoga", "Davangere", "Udupi"],
        "Kerala": ["Thiruvananthapuram", "Kochi", "Kozhikode", "Thrissur", "Kollam", "Kannur", "Palakkad", "Alappuzha"],
        "Madhya Pradesh": ["Bhopal", "Indore", "Jabalpur", "Gwalior", "Ujjain", "Sagar", "Rewa", "Satna"],
        "Maharashtra": ["Mumbai", "Pune", "Nagpur", "Thane", "Nashik", "Aurangabad", "Solapur", "Kolhapur", "Navi Mumbai", "Amravati"],
        "Manipur": ["Imphal", "Thoubal", "Bishnupur", "Churachandpur"],
        "Meghalaya": ["Shillong", "Tura", "Jowai", "Nongstoin"],
        "Mizoram": ["Aizawl", "Lunglei", "Champhai", "Serchhip"],
        "Nagaland": ["Kohima", "Dimapur", "Mokokchung", "Tuensang", "Wokha"],
        "Odisha": ["Bhubaneswar", "Cuttack", "Rourkela", "Berhampur", "Sambalpur", "Puri"],
        "Punjab": ["Chandigarh", "Ludhiana", "Amritsar", "Jalandhar", "Patiala", "Bathinda", "Mohali"],
        "Rajasthan": ["Jaipur", "Jodhpur", "Udaipur", "Kota", "Bikaner", "Ajmer", "Alwar", "Bharatpur"],
        "Sikkim": ["Gangtok", "Namchi", "Pelling", "Mangan"],
        "Tamil Nadu": ["Chennai", "Coimbatore", "Madurai", "Tiruchirappalli", "Salem", "Tirunelveli", "Erode", "Vellore", "Thoothukudi", "Dindigul"],
        "Telangana": ["Hyderabad", "Warangal", "Nizamabad", "Karimnagar", "Khammam", "Mahbubnagar"],
        "Tripura": ["Agartala", "Udaipur", "Dharmanagar", "Kailashahar"],
        "Uttar Pradesh": ["Lucknow", "Kanpur", "Agra", "Varanasi", "Noida", "Ghaziabad", "Meerut", "Allahabad", "Bareilly", "Aligarh"],
        "Uttarakhand": ["Dehradun", "Haridwar", "Rishikesh", "Nainital", "Haldwani", "Roorkee", "Mussoorie"],
        "West Bengal": ["Kolkata", "Howrah", "Durgapur", "Asansol", "Siliguri", "Kharagpur", "Darjeeling"],
        "Delhi": ["New Delhi", "North Delhi", "South Delhi", "East Delhi", "West Delhi", "Central Delhi"],
        "Jammu & Kashmir": ["Srinagar", "Jammu", "Anantnag", "Baramulla", "Udhampur"],
        "Ladakh": ["Leh", "Kargil"],
        "Puducherry": ["Puducherry", "Karaikal", "Mahe", "Yanam"],
        "Chandigarh": ["Chandigarh"],
        "Andaman & Nicobar Islands": ["Port Blair", "Car Nicobar"],
        "Dadra & Nagar Haveli and Daman & Diu": ["Silvassa", "Daman", "Diu"],
        "Lakshadweep": ["Kavaratti", "Agatti"]
    },
    "United States": {
        "California": ["Los Angeles", "San Francisco", "San Diego", "San Jose", "Sacramento", "Fresno", "Oakland"],
        "Texas": ["Houston", "Dallas", "Austin", "San Antonio", "Fort Worth", "El Paso", "Arlington"],
        "New York": ["New York City", "Buffalo", "Rochester", "Albany", "Syracuse", "Yonkers"],
        "Florida": ["Miami", "Orlando", "Tampa", "Jacksonville", "Fort Lauderdale", "St. Petersburg"],
        "Illinois": ["Chicago", "Aurora", "Naperville", "Rockford", "Joliet", "Springfield"],
        "Pennsylvania": ["Philadelphia", "Pittsburgh", "Allentown", "Erie", "Reading"],
        "Ohio": ["Columbus", "Cleveland", "Cincinnati", "Toledo", "Akron", "Dayton"],
        "Georgia": ["Atlanta", "Augusta", "Savannah", "Columbus", "Macon"],
        "North Carolina": ["Charlotte", "Raleigh", "Greensboro", "Durham", "Winston-Salem"],
        "Michigan": ["Detroit", "Grand Rapids", "Ann Arbor", "Lansing", "Flint"],
        "New Jersey": ["Newark", "Jersey City", "Paterson", "Elizabeth", "Trenton"],
        "Washington": ["Seattle", "Spokane", "Tacoma", "Vancouver", "Bellevue"],
        "Massachusetts": ["Boston", "Worcester", "Springfield", "Cambridge", "Lowell"],
        "Virginia": ["Virginia Beach", "Norfolk", "Richmond", "Chesapeake", "Arlington"],
        "Arizona": ["Phoenix", "Tucson", "Mesa", "Chandler", "Scottsdale"]
    },
    "United Kingdom": {
        "England": ["London", "Manchester", "Birmingham", "Leeds", "Liverpool", "Bristol", "Sheffield", "Newcastle"],
        "Scotland": ["Edinburgh", "Glasgow", "Aberdeen", "Dundee", "Inverness"],
        "Wales": ["Cardiff", "Swansea", "Newport", "Bangor", "Wrexham"],
        "Northern Ireland": ["Belfast", "Derry", "Lisburn", "Newry", "Bangor"]
    },
    "Canada": {
        "Ontario": ["Toronto", "Ottawa", "Mississauga", "Brampton", "Hamilton", "London", "Markham"],
        "Quebec": ["Montreal", "Quebec City", "Laval", "Gatineau", "Longueuil"],
        "British Columbia": ["Vancouver", "Victoria", "Surrey", "Burnaby", "Richmond"],
        "Alberta": ["Calgary", "Edmonton", "Red Deer", "Lethbridge", "Medicine Hat"],
        "Manitoba": ["Winnipeg", "Brandon", "Thompson", "Steinbach"],
        "Saskatchewan": ["Saskatoon", "Regina", "Prince Albert", "Moose Jaw"],
        "Nova Scotia": ["Halifax", "Dartmouth", "Sydney", "Truro"]
    },
    "Australia": {
        "New South Wales": ["Sydney", "Newcastle", "Wollongong", "Central Coast", "Coffs Harbour"],
        "Victoria": ["Melbourne", "Geelong", "Ballarat", "Bendigo", "Shepparton"],
        "Queensland": ["Brisbane", "Gold Coast", "Cairns", "Townsville", "Sunshine Coast"],
        "Western Australia": ["Perth", "Fremantle", "Bunbury", "Mandurah", "Geraldton"],
        "South Australia": ["Adelaide", "Mount Gambier", "Whyalla", "Port Augusta"],
        "Tasmania": ["Hobart", "Launceston", "Devonport", "Burnie"]
    },
    "United Arab Emirates": {
        "Abu Dhabi": ["Abu Dhabi City", "Al Ain", "Al Dhafra"],
        "Dubai": ["Dubai City", "Jebel Ali", "Hatta"],
        "Sharjah": ["Sharjah City", "Khor Fakkan", "Kalba"],
        "Ajman": ["Ajman City", "Masfout"],
        "Ras Al Khaimah": ["Ras Al Khaimah City", "Al Jazirah Al Hamra"],
        "Fujairah": ["Fujairah City", "Dibba Al Fujairah"],
        "Umm Al Quwain": ["Umm Al Quwain City"]
    },
    "Singapore": {
        "Central Region": ["Bukit Merah", "Bishan", "Toa Payoh", "Novena", "Queenstown"],
        "East Region": ["Tampines", "Bedok", "Pasir Ris", "Changi"],
        "North Region": ["Woodlands", "Yishun", "Sembawang", "Mandai"],
        "North-East Region": ["Sengkang", "Hougang", "Punggol", "Serangoon"],
        "West Region": ["Jurong East", "Jurong West", "Clementi", "Bukit Batok"]
    },
    "Malaysia": {
        "Selangor": ["Shah Alam", "Petaling Jaya", "Subang Jaya", "Klang", "Ampang"],
        "Johor": ["Johor Bahru", "Batu Pahat", "Muar", "Kluang"],
        "Penang": ["George Town", "Butterworth", "Bayan Lepas", "Bukit Mertajam"],
        "Kuala Lumpur": ["Kuala Lumpur City"],
        "Sabah": ["Kota Kinabalu", "Sandakan", "Tawau"],
        "Sarawak": ["Kuching", "Miri", "Sibu"]
    },
    "Saudi Arabia": {
        "Riyadh": ["Riyadh City", "Al Kharj", "Ad Dawadimi"],
        "Makkah": ["Makkah City", "Jeddah", "Taif"],
        "Eastern Province": ["Dammam", "Dhahran", "Al Khobar", "Jubail"],
        "Madinah": ["Madinah City", "Yanbu", "Badr"]
    }
};
