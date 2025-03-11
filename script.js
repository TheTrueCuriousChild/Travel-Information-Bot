// Global variables
let waitingForTravelDates = false;
let waitingForBudget = false;
let waitingForActivities = false;
let waitingForTravelers = false;
let chatContext = {
    destination: "",
    budget: "",
    travelDates: "",
    travelers: "",
    activities: "",
    currentStep: ""
};

// Sample city data with weather and attractions
const cityData = {
    "new york": {
        weather: { spring: "10-18°C", summer: "24-30°C", fall: "10-20°C", winter: "-2-5°C" },
        attractions: ["Central Park", "Statue of Liberty", "Times Square", "Metropolitan Museum"],
        bestTime: "Spring (April-June) or Fall (September-October)",
        foodSpecialties: ["NY Pizza", "Bagels", "Cheesecake"],
        localTips: "Use the subway for transportation; it's faster than taxis during rush hour."
    },
    "paris": {
        weather: { spring: "10-18°C", summer: "20-25°C", fall: "8-16°C", winter: "3-8°C" },
        attractions: ["Eiffel Tower", "Louvre Museum", "Notre Dame", "Arc de Triomphe"],
        bestTime: "Spring (April-June) or Fall (September-October)",
        foodSpecialties: ["Croissants", "Baguettes", "Macarons", "Cheese"],
        localTips: "Many museums are free on the first Sunday of each month."
    },
    "tokyo": {
        weather: { spring: "10-20°C", summer: "25-32°C", fall: "10-20°C", winter: "2-10°C" },
        attractions: ["Tokyo Tower", "Shibuya Crossing", "Senso-ji Temple", "Akihabara"],
        bestTime: "Spring (March-May) for cherry blossoms or Fall (September-November)",
        foodSpecialties: ["Sushi", "Ramen", "Tempura", "Takoyaki"],
        localTips: "Get a Suica or Pasmo card for easy transport around the city."
    },
    "london": {
        weather: { spring: "7-15°C", summer: "15-23°C", fall: "8-15°C", winter: "2-8°C" },
        attractions: ["Big Ben", "Buckingham Palace", "London Eye", "British Museum"],
        bestTime: "May to September for the best weather",
        foodSpecialties: ["Fish & Chips", "Full English Breakfast", "Sunday Roast"],
        localTips: "Many museums and galleries are free to enter."
    },
    "dubai": {
        weather: { spring: "22-36°C", summer: "30-45°C", fall: "25-38°C", winter: "15-25°C" },
        attractions: ["Burj Khalifa", "Palm Jumeirah", "Dubai Mall", "Desert Safari"],
        bestTime: "Winter (November - February)",
        foodSpecialties: ["Shawarma", "Al Machboos", "Knafeh"],
        localTips: "Visit the Global Village if you're there between November and April."
    },
    "rome": {
        weather: { spring: "12-21°C", summer: "21-30°C", fall: "13-23°C", winter: "4-12°C" },
        attractions: ["Colosseum", "Vatican City", "Trevi Fountain", "Roman Forum"],
        bestTime: "April to June or September to October",
        foodSpecialties: ["Pasta Carbonara", "Pizza", "Gelato", "Suppli"],
        localTips: "Carry a water bottle; you can refill it at the many fountains throughout the city."
    },
    "bangkok": {
        weather: { spring: "28-35°C", summer: "27-34°C", fall: "25-33°C", winter: "23-32°C" },
        attractions: ["Grand Palace", "Wat Arun", "Chatuchak Market", "Khao San Road"],
        bestTime: "November to February (cool season)",
        foodSpecialties: ["Pad Thai", "Tom Yum Goong", "Mango Sticky Rice"],
        localTips: "Use the BTS Skytrain to avoid traffic jams."
    },
    "sydney": {
        weather: { spring: "15-22°C", summer: "20-26°C", fall: "15-22°C", winter: "8-17°C" },
        attractions: ["Sydney Opera House", "Harbour Bridge", "Bondi Beach", "Royal Botanic Garden"],
        bestTime: "September to November or March to May",
        foodSpecialties: ["Barramundi", "Meat Pies", "Tim Tams", "Vegemite"],
        localTips: "Get an Opal card for public transportation around the city."
    }
};

// Currency conversion rates (against USD)
const currencyRates = {
    "USD": 1,
    "EUR": 0.85,
    "GBP": 0.75,
    "JPY": 110.5,
    "AUD": 1.35,
    "CAD": 1.25,
    "INR": 73.5,
    "CNY": 6.45
};

// Sample hotel recommendations
const hotelRecommendations = {
    "new york": [
        { name: "The Plaza Hotel", type: "Luxury", priceRange: "$$$" },
        { name: "Pod 51 Hotel", type: "Budget", priceRange: "$" },
        { name: "The Standard High Line", type: "Boutique", priceRange: "$$" }
    ],
    "paris": [
        { name: "Hôtel Plaza Athénée", type: "Luxury", priceRange: "$$$" },
        { name: "Ibis Paris Tour Eiffel", type: "Budget", priceRange: "$" },
        { name: "Hôtel Fabric", type: "Boutique", priceRange: "$$" }
    ],
    "tokyo": [
        { name: "Park Hyatt Tokyo", type: "Luxury", priceRange: "$$$" },
        { name: "Wise Owl Hostels", type: "Budget", priceRange: "$" },
        { name: "Hotel Koe Tokyo", type: "Boutique", priceRange: "$$" }
    ]
};

// Initialize the application
document.addEventListener("DOMContentLoaded", function () {
    initializeThemeToggle();
    setupEventListeners();
    displayWelcomeMessage();
    
    // History restoration if available
    restoreChatHistory();
});

// Theme toggle functionality
function initializeThemeToggle() {
    const themeToggle = document.getElementById("theme-toggle");

    if (localStorage.getItem("dark-mode") === "enabled") {
        document.body.classList.add("dark-mode");
        themeToggle.textContent = "☀️";
    }

    themeToggle.addEventListener("click", () => {
        document.body.classList.toggle("dark-mode");

        if (document.body.classList.contains("dark-mode")) {
            localStorage.setItem("dark-mode", "enabled");
            themeToggle.textContent = "☀️";
        } else {
            localStorage.setItem("dark-mode", "disabled");
            themeToggle.textContent = "🌙";
        }
    });
}

// Set up event listeners
function setupEventListeners() {
    document.getElementById("userInput").addEventListener("keypress", function (event) {
        if (event.key === "Enter") {
            event.preventDefault();
            sendMessage();
        }
    });
    
    // Add clear chat button functionality
    document.getElementById("clear-chat").addEventListener("click", function() {
        clearChat();
    });
    
    // Voice input functionality
    document.getElementById("voice-input").addEventListener("click", function() {
        startVoiceRecognition();
    });
}

// Display welcome message
function displayWelcomeMessage() {
    setTimeout(() => {
        addBotMessage(`Hi there! 👋 I'm your AI Travel Assistant. I can help you plan trips, suggest destinations, and more! Here are some things you can ask me:
        <ul>
            <li>Plan a trip to [destination]</li>
            <li>What's the weather like in [city]?</li>
            <li>Recommend hotels in [city]</li>
            <li>What currency is used in [country]?</li>
            <li>Best time to visit [destination]</li>
            <li>Convert [amount] USD to [currency]</li>
        </ul>
        How can I help you today?`);
    }, 300);
}

// Send a user message
function sendMessage() {
    const userInput = document.getElementById("userInput").value.trim();
    if (!userInput) return;

    addUserMessage(userInput);
    processUserInput(userInput);
    document.getElementById("userInput").value = "";
    
    // Save chat history
    saveChatHistory();
}

// Process user input based on context
function processUserInput(userInput) {
    const lowerInput = userInput.toLowerCase();
    
    // Handle help command
    if (lowerInput === "help" || lowerInput === "/help") {
        showHelpCommands();
        return;
    }
    
    // Handle clear command
    if (lowerInput === "clear" || lowerInput === "/clear") {
        clearChat();
        return;
    }
    
    // Handle waiting states
    if (waitingForTravelDates) {
        handleTravelDates(userInput);
        return;
    }
    
    if (waitingForBudget) {
        handleBudgetInput(userInput);
        return;
    }
    
    if (waitingForActivities) {
        handleActivitiesInput(userInput);
        return;
    }
    
    if (waitingForTravelers) {
        handleTravelersInput(userInput);
        return;
    }
    
    // Handle various intents
    if (detectTravelPlan(userInput)) {
        processTravelPlan(userInput);
    } else if (detectWeatherQuery(userInput)) {
        processWeatherQuery(userInput);
    } else if (detectHotelQuery(userInput)) {
        processHotelQuery(userInput);
    } else if (detectCurrencyQuery(userInput)) {
        processCurrencyQuery(userInput);
    } else if (detectCurrencyConversion(userInput)) {
        processCurrencyConversion(userInput);
    } else if (detectBestTimeQuery(userInput)) {
        processBestTimeQuery(userInput);
    } else if (detectThingsToDoQuery(userInput)) {
        processThingsToDoQuery(userInput);
    } else {
        // Default response using AI-like responses
        simulateAIResponse(userInput);
    }
}

// Intent detection functions
function detectTravelPlan(userMessage) {
    return /\b(travel|trip|vacation|visit|plan a trip|going to)\b/i.test(userMessage);
}

function detectWeatherQuery(userMessage) {
    return /\b(weather|temperature|climate)\b.*\b(in|at|for)\b/i.test(userMessage);
}

function detectHotelQuery(userMessage) {
    return /\b(hotel|accommodation|place to stay|where to stay)\b/i.test(userMessage);
}

function detectCurrencyQuery(userMessage) {
    return /\b(currency|money|what do they use)\b.*\b(in|at|for)\b/i.test(userMessage);
}

function detectCurrencyConversion(userMessage) {
    return /\b(convert|exchange|change)\b.*\b(currency|money|usd|eur|gbp)\b/i.test(userMessage);
}

function detectBestTimeQuery(userMessage) {
    return /\b(when|best time|good time|ideal time)\b.*\b(visit|go to|travel to)\b/i.test(userMessage);
}

function detectThingsToDoQuery(userMessage) {
    return /\b(what to do|things to do|attractions|activities|places|see|visit)\b/i.test(userMessage);
}

// Extract travel details
function extractTravelDetails(message) {
    return {
        destination: message.match(/\b(?:to|in|at) ([a-zA-Z\s]+)(?:$|[,\?]|\s(?:for|with|on))/i)?.[1]?.trim() || "Unknown",
        budget: message.match(/\$?(\d{2,6})/i)?.[1] || "Not specified",
        travelers: message.match(/\b(?:for|with) (\d+) (?:people|persons|travelers|adults|kids)\b/i)?.[1] || "Not specified",
        activities: message.match(/\b(?:doing|with|for) ([\w\s,]+)(?:$|[,\?])/i)?.[1] || "Not specified"
    };
}

// Process travel plan
function processTravelPlan(userMessage) {
    const { destination, budget, travelers, activities } = extractTravelDetails(userMessage);
    
    if (destination === "Unknown") {
        addBotMessage("I'd love to help you plan your trip! Where are you thinking of going?");
        waitingForTravelDates = false;
        waitingForBudget = false;
        chatContext.currentStep = "waiting_destination";
        return;
    }
    
    chatContext.destination = destination.toLowerCase();
    
    // Check if we have data for this destination
    const destinationData = getCityData(chatContext.destination);
    
    if (!destinationData) {
        addBotMessage(`I don't have detailed information about ${destination}, but I can still help you plan your trip! When are you planning to travel? (e.g., "March 10 - March 20")`);
    } else {
        addBotMessage(`Great choice! ${capitalize(destination)} is an amazing destination! When are you planning to travel? (e.g., "March 10 - March 20")`);
    }
    
    waitingForTravelDates = true;
    chatContext.currentStep = "waiting_dates";
}

// Handle travel dates input
function handleTravelDates(userMessage) {
    const dateMatch = userMessage.match(/(\w+\s\d+)\s*-\s*(\w+\s\d+)/i);
    
    if (dateMatch) {
        const startDate = dateMatch[1];
        const endDate = dateMatch[2];
        waitingForTravelDates = false;
        waitingForBudget = true;
        
        chatContext.travelDates = `${startDate} - ${endDate}`;
        chatContext.currentStep = "waiting_budget";
        
        addBotMessage(`You're planning to travel from <b>${startDate}</b> to <b>${endDate}</b>. What's your budget for this trip?`);
    } else {
        addBotMessage("I couldn't understand the dates. Please provide them in the format 'March 10 - March 20'.");
    }
}

// Handle budget input
function handleBudgetInput(userMessage) {
    // Extract budget from user message
    const budgetMatch = userMessage.match(/\$?(\d{2,6})/i);
    
    if (budgetMatch) {
        chatContext.budget = budgetMatch[1];
        waitingForBudget = false;
        waitingForTravelers = true;
        chatContext.currentStep = "waiting_travelers";
        
        addBotMessage(`Got it! Your budget is $${chatContext.budget}. How many people are traveling?`);
    } else {
        // Try to interpret text budgets
        if (/low|budget|cheap/i.test(userMessage)) {
            chatContext.budget = "budget";
            waitingForBudget = false;
            waitingForTravelers = true;
            chatContext.currentStep = "waiting_travelers";
            
            addBotMessage("I understand you're looking for a budget-friendly trip. How many people are traveling?");
        } else if (/high|luxury|expensive/i.test(userMessage)) {
            chatContext.budget = "luxury";
            waitingForBudget = false;
            waitingForTravelers = true;
            chatContext.currentStep = "waiting_travelers";
            
            addBotMessage("I understand you're looking for a luxury experience. How many people are traveling?");
        } else if (/medium|moderate|mid/i.test(userMessage)) {
            chatContext.budget = "moderate";
            waitingForBudget = false;
            waitingForTravelers = true;
            chatContext.currentStep = "waiting_travelers";
            
            addBotMessage("I understand you're looking for a moderately priced trip. How many people are traveling?");
        } else {
            addBotMessage("I couldn't understand your budget. Please provide a number or tell me if you're looking for a budget, moderate, or luxury experience.");
        }
    }
}

// Handle travelers input
function handleTravelersInput(userMessage) {
    // Extract number of travelers
    const travelersMatch = userMessage.match(/(\d+)/);
    
    if (travelersMatch) {
        chatContext.travelers = travelersMatch[1];
        waitingForTravelers = false;
        waitingForActivities = true;
        chatContext.currentStep = "waiting_activities";
        
        addBotMessage(`Great! ${chatContext.travelers} ${chatContext.travelers === "1" ? "person" : "people"} traveling. What activities are you interested in during your trip?`);
    } else if (/alone|solo|just me|myself/i.test(userMessage)) {
        chatContext.travelers = "1";
        waitingForTravelers = false;
        waitingForActivities = true;
        chatContext.currentStep = "waiting_activities";
        
        addBotMessage("Solo travel can be amazing! What activities are you interested in during your trip?");
    } else if (/couple|two|2 of us/i.test(userMessage)) {
        chatContext.travelers = "2";
        waitingForTravelers = false;
        waitingForActivities = true;
        chatContext.currentStep = "waiting_activities";
        
        addBotMessage("A trip for two sounds wonderful! What activities are you interested in?");
    } else if (/family/i.test(userMessage)) {
        chatContext.travelers = "family";
        waitingForTravelers = false;
        waitingForActivities = true;
        chatContext.currentStep = "waiting_activities";
        
        addBotMessage("Family trips create the best memories! What activities are you interested in?");
    } else {
        addBotMessage("I couldn't understand how many people are traveling. Please provide a number or say something like 'solo', 'couple', or 'family'.");
    }
}

// Handle activities input
function handleActivitiesInput(userMessage) {
    chatContext.activities = userMessage;
    waitingForActivities = false;
    chatContext.currentStep = "complete";
    
    // Now generate the final travel plan
    generateTravelPlan();
}

// Generate comprehensive travel plan
function generateTravelPlan() {
    const destination = chatContext.destination;
    const destinationData = getCityData(destination);
    
    let weatherInfo, attractions, tips, food;
    
    if (destinationData) {
        const season = getCurrentSeason(chatContext.travelDates);
        weatherInfo = destinationData.weather[season] || "varies throughout the year";
        attractions = destinationData.attractions || ["local sites and culture"];
        tips = destinationData.localTips || "Check local guides for current information.";
        food = destinationData.foodSpecialties || ["local cuisine"];
    } else {
        weatherInfo = "varies depending on the season";
        attractions = ["local sites and culture"];
        tips = "Research local customs and transportation options before your trip.";
        food = ["local cuisine"];
    }
    
    // Generate budget recommendations
    let budgetRecommendation = "";
    if (chatContext.budget === "budget" || parseInt(chatContext.budget) < 1000) {
        budgetRecommendation = `
            <h4>Budget Tips:</h4>
            <ul>
                <li>Look for hostels or budget accommodations</li>
                <li>Use public transportation</li>
                <li>Cook some meals yourself or eat at local markets</li>
                <li>Take advantage of free attractions and walking tours</li>
            </ul>
        `;
    } else if (chatContext.budget === "luxury" || parseInt(chatContext.budget) > 5000) {
        budgetRecommendation = `
            <h4>Luxury Experiences:</h4>
            <ul>
                <li>5-star hotels and resorts</li>
                <li>Private tours and experiences</li>
                <li>Fine dining at renowned restaurants</li>
                <li>VIP access to attractions</li>
            </ul>
        `;
    } else {
        budgetRecommendation = `
            <h4>Value Recommendations:</h4>
            <ul>
                <li>Mid-range hotels or vacation rentals</li>
                <li>Mix of public transport and occasional taxis</li>
                <li>Combination of restaurants and casual dining</li>
                <li>Prioritize paid attractions that interest you most</li>
            </ul>
        `;
    }
    
    // Build activity recommendations based on interests
    let activityRecommendations = "";
    if (chatContext.activities) {
        const interests = chatContext.activities.toLowerCase();
        
        if (/history|museum|culture/i.test(interests)) {
            activityRecommendations += `<li>Visit museums and historical sites</li>`;
        }
        if (/food|cuisine|eat/i.test(interests)) {
            activityRecommendations += `<li>Take a food tour or cooking class</li>`;
        }
        if (/nature|hike|outdoor/i.test(interests)) {
            activityRecommendations += `<li>Explore nearby nature reserves or hiking trails</li>`;
        }
        if (/beach|sea|ocean|swim/i.test(interests)) {
            activityRecommendations += `<li>Spend time at the beach or take boat excursions</li>`;
        }
        if (/shop|shopping/i.test(interests)) {
            activityRecommendations += `<li>Visit local markets and shopping districts</li>`;
        }
        if (/nightlife|party|bar/i.test(interests)) {
            activityRecommendations += `<li>Check out the city's nightlife and entertainment</li>`;
        }
    }
    
    if (!activityRecommendations) {
        activityRecommendations = `
            <li>Visit top attractions: ${attractions.slice(0, 3).join(", ")}</li>
            <li>Try local food specialties</li>
            <li>Take a city tour to get oriented</li>
        `;
    }
    
    // Create the final travel plan
    const travelPlan = `
        <div class="travel-plan">
            <h3>🌍 Your Trip to ${capitalize(destination)}</h3>
            
            <div class="plan-details">
                <p><strong>🗓️ Dates:</strong> ${chatContext.travelDates}</p>
                <p><strong>👥 Travelers:</strong> ${chatContext.travelers}</p>
                <p><strong>💰 Budget:</strong> ${typeof chatContext.budget === "number" ? "$" + chatContext.budget : chatContext.budget}</p>
                <p><strong>🌤️ Weather:</strong> Expected to be around ${weatherInfo}</p>
            </div>
            
            <h4>🎯 Recommended Activities:</h4>
            <ul>
                ${activityRecommendations}
            </ul>
            
            <h4>🍽️ Must-Try Food:</h4>
            <ul>
                ${Array.isArray(food) ? food.map(item => `<li>${item}</li>`).join('') : '<li>Local cuisine</li>'}
            </ul>
            
            ${budgetRecommendation}
            
            <h4>💡 Local Tip:</h4>
            <p>${tips}</p>
            
            <p>Need specific recommendations for hotels, restaurants, or transportation? Just ask!</p>
        </div>
    `;
    
    addBotMessage(travelPlan);
    
    // Reset context for future queries
    resetChatContext();
}

// Process weather query
function processWeatherQuery(userMessage) {
    const cityMatch = userMessage.match(/\b(?:weather|temperature|climate)\b.*\b(?:in|at|for) ([a-zA-Z\s]+)(?:$|[,\?])/i);
    
    if (cityMatch && cityMatch[1]) {
        const city = cityMatch[1].trim().toLowerCase();
        const cityData = getCityData(city);
        
        if (cityData) {
            const season = getCurrentSeason();
            const weather = cityData.weather[season];
            
            addBotMessage(`The current weather in ${capitalize(city)} is typically around ${weather} during this time of year. The best time to visit is generally ${cityData.bestTime}.`);
        } else {
            addBotMessage(`I don't have current weather data for ${capitalize(city)}. Would you like me to help you plan a trip there anyway?`);
        }
    } else {
        addBotMessage("I couldn't identify which city you're asking about. Could you please specify the city name?");
    }
}

// Process hotel query
function processHotelQuery(userMessage) {
    const cityMatch = userMessage.match(/\b(?:hotel|accommodation|place to stay|where to stay)\b.*\b(?:in|at|for) ([a-zA-Z\s]+)(?:$|[,\?])/i);
    
    if (cityMatch && cityMatch[1]) {
        const city = cityMatch[1].trim().toLowerCase();
        const hotels = hotelRecommendations[city];
        
        if (hotels) {
            let hotelMessage = `<h4>Hotel Recommendations in ${capitalize(city)}:</h4><ul>`;
            
            hotels.forEach(hotel => {
                hotelMessage += `<li><strong>${hotel.name}</strong> - ${hotel.type} (${hotel.priceRange})</li>`;
            });
            
            hotelMessage += `</ul><p>Would you like more specific recommendations based on your preferences?</p>`;
            
            addBotMessage(hotelMessage);
        } else {
            addBotMessage(`I don't have specific hotel recommendations for ${capitalize(city)} in my database. Would you like some general accommodation tips instead?`);
        }
    } else {
        addBotMessage("I couldn't identify which city you're asking about. Could you please specify the city name?");
    }
}

// Process currency query
function processCurrencyQuery(userMessage) {
    const countryMatch = userMessage.match(/\b(?:currency|money|what do they use)\b.*\b(?:in|at|for) ([a-zA-Z\s]+)(?:$|[,\?])/i);
    
    if (countryMatch && countryMatch[1]) {
        const country = countryMatch[1].trim().toLowerCase();
        
        // Simple mapping of countries to currencies
        const countryCurrencies = {
            "usa": "US Dollar (USD)",
            "united states": "US Dollar (USD)",
            "france": "Euro (EUR)",
            "italy": "Euro (EUR)",
            "spain": "Euro (EUR)",
            "germany": "Euro (EUR)",
            "japan": "Japanese Yen (JPY)",
            "uk": "British Pound (GBP)",
            "united kingdom": "British Pound (GBP)",
            "england": "British Pound (GBP)",
            "australia": "Australian Dollar (AUD)",
            "canada": "Canadian Dollar (CAD)",
            "india": "Indian Rupee (INR)",
            "china": "Chinese Yuan (CNY)",
            "thailand": "Thai Baht (THB)",
            "mexico": "Mexican Peso (MXN)",
            "brazil": "Brazilian Real (BRL)",
            "switzerland": "Swiss Franc (CHF)"
        };
        
        const currency = countryCurrencies[country];
        
        if (currency) {
            addBotMessage(`The currency used in ${capitalize(country)} is the ${currency}. Would you like me to help with currency conversion?`);
        } else {
            addBotMessage(`I don't have currency information for ${capitalize(country)} in my database. Would you like me to help you plan a trip there?`);
        }
    } else {
        addBotMessage("I couldn't identify which country you're asking about. Could you please specify the country name?");
    }
}

// Process currency conversion
function processCurrencyConversion(userMessage) {
    const conversionMatch = userMessage.match(/\b(?:convert|exchange) (\d+) ([a-z]{3}) (?:to|into) ([a-z]{3})/i);
    
    if (conversionMatch) {
        const amount = parseInt(conversionMatch[1]);
        const fromCurrency = conversionMatch[2].toUpperCase();
        const toCurrency = conversionMatch[3].toUpperCase();
        
        if (currencyRates[fromCurrency] && currencyRates[toCurrency]) {
            const convertedAmount = (amount / currencyRates[fromCurrency]) * currencyRates[toCurrency];
            
            addBotMessage(`${amount} ${fromCurrency} is approximately ${convertedAmount.toFixed(2)} ${toCurrency} based on recent exchange rates. (Note: actual rates may vary)`);
        } else {
            addBotMessage("I don't have conversion rates for one or both of these currencies in my database. The major currencies I know are USD, EUR, GBP, JPY, AUD, CAD, INR, and CNY.");
        }
    } else {
        addBotMessage("I couldn't understand your currency conversion request. Please use a format like 'convert 100 USD to EUR'.");
    }
}

// Process best time to visit query
function processBestTimeQuery(userMessage) {
    const destinationMatch = userMessage.match(/\b(?:when|best time|good time|ideal time)\b.*\b(?:visit|go to|travel to) ([a-zA-Z\s]+)(?:$|[,\?])/i);
    
    if (destinationMatch && destinationMatch[1]) {
        const destination = destinationMatch[1].trim().toLowerCase();
        const destinationData = getCityData(destination);
        
        if (destinationData && destinationData.bestTime) {
            addBotMessage(`The best time to visit ${capitalize(destination)} is generally ${destinationData.bestTime}. This is when you can expect the most pleasant weather and manageable crowds.`);
        } else {
            // Fall back to general suggestions
            if (/beach|island|tropical/i.test(destination)) {
                addBotMessage(`For beach destinations like ${capitalize(destination)}, the best time to visit is typically during the dry season, which is often winter and spring. Would you like me to help you plan a trip there?`);
            } else if (/mountain|ski|snow/i.test(destination)) {
                addBotMessage(`For mountain destinations like ${capitalize(destination)}, it depends on what you want to do. Winter for skiing, summer for hiking. The shoulder seasons (spring/fall) often offer good value. Would you like me to help you plan a trip there?`);
            } else {
                addBotMessage(`I don't have specific information about the best time to visit ${capitalize(destination)}. Generally, spring and fall offer pleasant weather and fewer crowds in many destinations. Would you like me to help you plan a trip there?`);